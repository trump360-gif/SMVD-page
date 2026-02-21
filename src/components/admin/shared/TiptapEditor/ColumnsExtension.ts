import { Node, mergeAttributes } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      insertColumns: (count?: number) => ReturnType;
    };
    column: {
      setColumnVerticalAlign: (align: string) => ReturnType;
    };
  }
}

// ============================================================
// Module-level state for drag-to-resize.
//
// WHY module-level? ProseMirror destroys and recreates NodeViews
// when a mousedown event changes the editor selection (e.g.,
// clicking on a contentEditable="false" handle creates a
// NodeSelection). This means:
//   1. The handle element we clicked on is REMOVED from the DOM
//   2. A NEW handle element is created (without our event listeners)
//   3. Any state stored on the old NodeView instance is lost
//
// By storing drag state at the module level, it survives
// NodeView recreation. During mousemove/mouseup, we dynamically
// find the CURRENT wrapper/handles in the DOM.
// ============================================================

interface ActiveDrag {
  startX: number;
  startWidths: number[];
  handleIndex: number;
  containerWidth: number;
  nodePos: number;
}

let activeDrag: ActiveDrag | null = null;

// WeakMap for initial mousedown: maps wrapper DOM → NodeView state
interface ColumnsViewState {
  getPos: () => number | null | undefined;
  getWidths: () => number[];
  getCurrentNode: () => any;
  contentDOM: HTMLDivElement;
}

const columnsViewMap = new WeakMap<HTMLElement, ColumnsViewState>();

/**
 * Column node - a single column container within a Columns layout.
 * Supports vertical alignment (top/center/bottom).
 */
export const Column = Node.create({
  name: 'column',
  group: 'column',
  content: 'block+',
  isolating: true,
  defining: true,

  addAttributes() {
    return {
      verticalAlign: {
        default: 'top',
        parseHTML: (el: HTMLElement) => el.getAttribute('data-vertical-align') || 'top',
        renderHTML: (attrs: Record<string, unknown>) => {
          if (attrs.verticalAlign === 'top') return {};
          return { 'data-vertical-align': attrs.verticalAlign };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="column"]' }];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'column',
        'data-vertical-align': node.attrs.verticalAlign || 'top',
        class: 'tiptap-column',
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setColumnVerticalAlign:
        (align: string) =>
        ({ state, dispatch }) => {
          const { $from } = state.selection;
          for (let d = $from.depth; d >= 0; d--) {
            const node = $from.node(d);
            if (node.type.name === 'column') {
              if (dispatch) {
                const pos = $from.before(d);
                dispatch(
                  state.tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    verticalAlign: align,
                  })
                );
              }
              return true;
            }
          }
          return false;
        },
    };
  },
});

/**
 * Columns node - container for 2 or 3 Column nodes.
 * Features: drag-to-resize column widths.
 *
 * Architecture:
 * - NodeView handles rendering (handles, CSS custom properties)
 * - ProseMirror Plugin handles mousedown via handleDOMEvents
 * - Module-level `activeDrag` stores drag state across NodeView recreations
 * - mousemove/mouseup handlers dynamically find current DOM elements
 */
export const Columns = Node.create({
  name: 'columns',
  group: 'block',
  content: 'column{2,3}',
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      count: {
        default: 2,
        parseHTML: (el: HTMLElement) =>
          parseInt(el.getAttribute('data-columns') || '2', 10),
        renderHTML: (attrs: Record<string, unknown>) => ({
          'data-columns': attrs.count,
        }),
      },
      widths: {
        default: null,
        parseHTML: (el: HTMLElement) => {
          const w = el.getAttribute('data-widths');
          return w ? JSON.parse(w) : null;
        },
        renderHTML: (attrs: Record<string, unknown>) => {
          if (!attrs.widths) return {};
          return { 'data-widths': JSON.stringify(attrs.widths) };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="columns"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const count = HTMLAttributes['data-columns'] || 2;
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'columns',
        class: `tiptap-columns tiptap-columns-${count}`,
      }),
      0,
    ];
  },

  addNodeView() {
    return ({ node, getPos }) => {
      const dom = document.createElement('div');
      dom.classList.add('tiptap-columns-wrapper');

      const contentDOM = document.createElement('div');
      contentDOM.classList.add('tiptap-columns-inner');
      dom.appendChild(contentDOM);

      let currentNode = node;
      const handles: HTMLDivElement[] = [];

      const getDefaultWidths = (count: number): number[] => {
        if (count === 2) return [40, 60];
        if (count === 3) return [33, 34, 33];
        return Array(count).fill(Math.floor(100 / count));
      };

      const getWidths = (): number[] =>
        currentNode.attrs.widths || getDefaultWidths(currentNode.attrs.count);

      const applyCSSWidths = () => {
        const widths = getWidths();
        const count = currentNode.attrs.count as number;
        dom.setAttribute('data-col-count', String(count));

        // Detect nearly-equal widths (within 2%) → use flex: 1 for uniform sizing
        const isEqual = Math.max(...widths) - Math.min(...widths) <= 2;
        dom.setAttribute('data-equal-widths', String(isEqual));

        widths.forEach((w, i) => {
          dom.style.setProperty(`--col-${i}-width`, `${w}%`);
        });
      };

      const positionHandles = () => {
        const widths = getWidths();
        let cumulative = 0;
        handles.forEach((handle, i) => {
          cumulative += widths[i];
          handle.style.left = `${cumulative}%`;
        });
      };

      const createHandles = () => {
        handles.forEach((h) => h.remove());
        handles.length = 0;

        const count = currentNode.attrs.count;
        for (let i = 0; i < count - 1; i++) {
          const handle = document.createElement('div');
          handle.classList.add('column-resize-handle');
          handle.contentEditable = 'false';
          handle.setAttribute('draggable', 'false');
          handle.setAttribute('data-column-handle', 'true');
          handle.setAttribute('data-handle-index', String(i));

          const grip = document.createElement('div');
          grip.classList.add('column-resize-grip');
          grip.contentEditable = 'false';
          handle.appendChild(grip);

          dom.appendChild(handle);
          handles.push(handle);
        }
      };

      applyCSSWidths();
      createHandles();
      positionHandles();

      // Register for plugin's handleDOMEvents.mousedown
      columnsViewMap.set(dom, {
        getPos: () => (typeof getPos === 'function' ? getPos() : null),
        getWidths,
        getCurrentNode: () => currentNode,
        contentDOM,
      });

      return {
        dom,
        contentDOM,
        update(updatedNode) {
          if (updatedNode.type.name !== 'columns') return false;
          currentNode = updatedNode;

          if (handles.length !== updatedNode.attrs.count - 1) {
            createHandles();
          }

          applyCSSWidths();
          positionHandles();

          return true;
        },
        destroy() {
          handles.forEach((h) => h.remove());
          columnsViewMap.delete(dom);
        },
      };
    };
  },

  addProseMirrorPlugins() {
    const extensionEditor = this.editor;

    return [
      new Plugin({
        key: new PluginKey('columnsDragResize'),
        props: {
          handleDOMEvents: {
            dblclick(_view, event) {
              const target = event.target as HTMLElement;
              const handleEl = target.closest('[data-column-handle]') as HTMLDivElement | null;
              if (!handleEl) return false;

              const wrapper = handleEl.closest('.tiptap-columns-wrapper') as HTMLDivElement | null;
              if (!wrapper) return false;

              const instance = columnsViewMap.get(wrapper);
              if (!instance) return false;

              (event as MouseEvent).preventDefault();

              const pos = instance.getPos();
              if (pos === null || pos === undefined) return false;

              const node = instance.getCurrentNode();
              const count = node.attrs.count as number;
              const equalWidth = Math.round(100 / count);
              const equalWidths = Array.from({ length: count }, (_, i) =>
                i < count - 1 ? equalWidth : 100 - equalWidth * (count - 1)
              );

              const { state, dispatch } = extensionEditor.view;
              const currentNode = state.doc.nodeAt(pos as number);
              if (currentNode && currentNode.type.name === 'columns') {
                dispatch(
                  state.tr.setNodeMarkup(pos as number, undefined, {
                    ...currentNode.attrs,
                    widths: equalWidths,
                  })
                );
              }

              return true;
            },
            mousedown(_view, event) {
              const target = event.target as HTMLElement;
              const handleEl = target.closest('[data-column-handle]') as HTMLDivElement | null;
              if (!handleEl) return false;

              const wrapper = handleEl.closest('.tiptap-columns-wrapper') as HTMLDivElement | null;
              if (!wrapper) return false;

              const instance = columnsViewMap.get(wrapper);
              if (!instance) return false;

              const mouseEvent = event as MouseEvent;
              mouseEvent.preventDefault();

              const handleIndex = parseInt(handleEl.getAttribute('data-handle-index') || '0', 10);
              const containerWidth = instance.contentDOM.getBoundingClientRect().width;
              if (containerWidth <= 0) return false;

              const pos = instance.getPos();
              if (pos === null || pos === undefined) return false;

              // Store drag state at module level (survives NodeView recreation)
              activeDrag = {
                startX: mouseEvent.clientX,
                startWidths: [...instance.getWidths()],
                handleIndex,
                containerWidth,
                nodePos: pos as number,
              };

              document.body.style.cursor = 'col-resize';
              document.body.style.userSelect = 'none';

              const onMouseMove = (moveEvent: MouseEvent) => {
                if (!activeDrag) return;

                // Find CURRENT wrapper - may be a new element after NodeView recreation
                const currentWrapper = extensionEditor.view.nodeDOM(activeDrag.nodePos) as HTMLElement | null;
                if (!currentWrapper) return;

                const dx = moveEvent.clientX - activeDrag.startX;
                const dPercent = (dx / activeDrag.containerWidth) * 100;

                const newWidths = [...activeDrag.startWidths];
                newWidths[activeDrag.handleIndex] = Math.max(15, Math.min(85, activeDrag.startWidths[activeDrag.handleIndex] + dPercent));
                newWidths[activeDrag.handleIndex + 1] = Math.max(15, Math.min(85, activeDrag.startWidths[activeDrag.handleIndex + 1] - dPercent));

                // Apply CSS custom properties to CURRENT wrapper
                newWidths.forEach((w, idx) => {
                  currentWrapper.style.setProperty(`--col-${idx}-width`, `${w}%`);
                });

                // Add visual feedback classes
                currentWrapper.classList.add('resizing');

                // Show percentage tooltip
                let tooltip = currentWrapper.querySelector('.column-resize-tooltip') as HTMLDivElement | null;
                if (!tooltip) {
                  tooltip = document.createElement('div');
                  tooltip.classList.add('column-resize-tooltip');
                  tooltip.contentEditable = 'false';
                  currentWrapper.appendChild(tooltip);
                }
                tooltip.style.display = 'block';
                const leftPct = Math.round(newWidths[activeDrag.handleIndex]);
                const rightPct = Math.round(newWidths[activeDrag.handleIndex + 1]);
                tooltip.textContent = `${leftPct}% | ${rightPct}%`;

                // Reposition handles in CURRENT wrapper
                const currentHandles = currentWrapper.querySelectorAll('[data-column-handle]');
                let cum = 0;
                for (let i = 0; i < currentHandles.length; i++) {
                  cum += newWidths[i];
                  (currentHandles[i] as HTMLElement).style.left = `${cum}%`;
                  // Mark the active handle
                  if (i === activeDrag.handleIndex) {
                    (currentHandles[i] as HTMLElement).classList.add('dragging');
                  }
                }

                // Position tooltip near the active handle
                if (tooltip && currentHandles[activeDrag.handleIndex]) {
                  const handleRect = currentHandles[activeDrag.handleIndex].getBoundingClientRect();
                  const wrapperRect = currentWrapper.getBoundingClientRect();
                  tooltip.style.left = `${handleRect.left - wrapperRect.left}px`;
                }
              };

              const onMouseUp = (upEvent: MouseEvent) => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                document.body.style.cursor = '';
                document.body.style.userSelect = '';

                if (!activeDrag) return;

                // Clean up visual feedback on CURRENT wrapper
                const currentWrapper = extensionEditor.view.nodeDOM(activeDrag.nodePos) as HTMLElement | null;
                if (currentWrapper) {
                  currentWrapper.classList.remove('resizing');
                  const tooltip = currentWrapper.querySelector('.column-resize-tooltip') as HTMLDivElement | null;
                  if (tooltip) tooltip.style.display = 'none';
                  const currentHandles = currentWrapper.querySelectorAll('[data-column-handle]');
                  currentHandles.forEach((h) => (h as HTMLElement).classList.remove('dragging'));
                }

                const dx = upEvent.clientX - activeDrag.startX;
                const dPercent = (dx / activeDrag.containerWidth) * 100;

                const finalWidths = [...activeDrag.startWidths];
                finalWidths[activeDrag.handleIndex] = Math.round(
                  Math.max(15, Math.min(85, activeDrag.startWidths[activeDrag.handleIndex] + dPercent))
                );
                finalWidths[activeDrag.handleIndex + 1] = Math.round(
                  Math.max(15, Math.min(85, activeDrag.startWidths[activeDrag.handleIndex + 1] - dPercent))
                );

                // Persist widths to ProseMirror - read current node from document
                const savedPos = activeDrag.nodePos;
                activeDrag = null;

                // Dispatch transaction directly without .focus() to avoid scroll jump
                const { state, dispatch } = extensionEditor.view;
                const node = state.doc.nodeAt(savedPos);
                if (node && node.type.name === 'columns') {
                  dispatch(
                    state.tr.setNodeMarkup(savedPos, undefined, {
                      ...node.attrs,
                      widths: finalWidths,
                    })
                  );
                }
              };

              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);

              return true;
            },
          },
        },
      }),
    ];
  },

  addCommands() {
    return {
      insertColumns:
        (count: number = 2) =>
        ({ commands }) => {
          const defaultWidths = count === 2 ? [40, 60] : [33, 34, 33];
          const columnContent = Array.from({ length: count }, () => ({
            type: 'column' as const,
            content: [{ type: 'paragraph' as const }],
          }));

          return commands.insertContent({
            type: 'columns',
            attrs: { count, widths: defaultWidths },
            content: columnContent,
          });
        },
    };
  },
});
