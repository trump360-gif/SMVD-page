'use client';

import React, { useCallback, useEffect, useRef, useMemo } from 'react';
import BlockList from './BlockList';
import BlockToolbar from './BlockToolbar';
import BlockRenderer from './renderers/BlockRenderer';
import WorkDetailPreviewRenderer from './renderers/WorkDetailPreviewRenderer';
import { useBlockEditor } from './useBlockEditor';
import type { Block, BlockType, BlogContent, WorkProjectContext } from './types';
import { BLOG_CONTENT_VERSION } from './types';

// ---------------------------------------------------------------------------
// Debounce utility (avoids lodash dependency)
// ---------------------------------------------------------------------------

/**
 * Simple debounce utility function.
 * Delays function execution, canceling previous calls if new ones arrive
 * within the delay window.
 *
 * @template Args - Function argument types
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function with a `.cancel()` method to flush pending calls
 *
 * @example
 * const debouncedSave = debounce((content: string) => api.save(content), 300);
 * debouncedSave('new content');
 * // Cancel any pending invocation:
 * debouncedSave.cancel();
 */
function debounce<Args extends any[]>(
  fn: (...args: Args) => void,
  delay: number
): ((...args: Args) => void) & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delay);
  };

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced;
}

// ---------------------------------------------------------------------------
// BlockEditor
// ---------------------------------------------------------------------------

interface BlockEditorProps {
  value: BlogContent;
  onChange: (content: BlogContent) => void;
  enablePreview?: boolean;
  /**
   * Preview mode: 'generic' uses the standard BlockRenderer,
   * 'work-detail' uses the WorkDetailPreviewRenderer that matches
   * the WorkDetailPage layout exactly.
   */
  previewMode?: 'generic' | 'work-detail';
  /**
   * Project context for work-detail preview mode.
   * Provides title, author, email, heroImage from the "Basic Info" tab.
   */
  projectContext?: WorkProjectContext;
  /** When true, shows Work-specific block types in the toolbar */
  showWorkBlocks?: boolean;
}

/**
 * Main BlockEditor component with split-view layout.
 * Left panel (60%): Block list with DnD + toolbar.
 * Right panel (40%): Real-time preview via BlockRenderer or WorkDetailPreviewRenderer.
 *
 * Performance optimizations:
 * - Debounced parent sync (300ms) to avoid excessive re-renders
 * - Memoized preview blocks to reduce re-render cost
 */
export default function BlockEditor({
  value,
  onChange,
  enablePreview = true,
  previewMode = 'generic',
  projectContext,
  showWorkBlocks = false,
}: BlockEditorProps) {
  const {
    blocks,
    selectedId,
    setSelectedId,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
  } = useBlockEditor(value.blocks);

  // Stable reference to onChange to avoid re-creating the debounced function
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Debounced sync to parent: avoids firing on every keystroke
  const debouncedSync = useMemo(
    () =>
      debounce((currentBlocks: Block[]) => {
        onChangeRef.current({
          blocks: currentBlocks,
          version: BLOG_CONTENT_VERSION,
        });
      }, 300),
    []
  );

  // Sync blocks to parent whenever they change (debounced)
  useEffect(() => {
    debouncedSync(blocks);
    return () => debouncedSync.cancel();
  }, [blocks, debouncedSync]);

  // Flush any pending sync on unmount
  useEffect(() => {
    return () => debouncedSync.cancel();
  }, [debouncedSync]);

  const handleAddBlock = useCallback(
    (type: BlockType) => {
      addBlock(type, selectedId ?? undefined);
    },
    [addBlock, selectedId]
  );

  const handleUpdate = useCallback(
    (id: string, data: Partial<Block>) => {
      updateBlock(id, data);
    },
    [updateBlock]
  );

  // Memoize the preview blocks array reference to avoid unnecessary
  // BlockRenderer re-renders when blocks content hasn't actually changed.
  const previewBlocks = useMemo(() => blocks, [blocks]);

  const isWorkDetail = previewMode === 'work-detail';

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2">
        <h3 className="text-sm font-semibold text-gray-700">
          Block Editor
          <span className="ml-2 text-xs font-normal text-gray-400">
            {blocks.length} block{blocks.length !== 1 ? 's' : ''}
          </span>
        </h3>
        {enablePreview && (
          <span className="text-xs text-gray-400">
            Editor | {isWorkDetail ? 'Work Preview' : 'Preview'}
          </span>
        )}
      </div>

      {/* Split view */}
      <div
        className={`flex ${enablePreview ? 'divide-x divide-gray-200' : ''}`}
        style={{ minHeight: '500px' }}
      >
        {/* Left panel: Editor */}
        <div
          className={`${enablePreview ? 'w-[60%]' : 'w-full'} flex flex-col overflow-y-auto`}
        >
          <div className="flex-1 p-4">
            <BlockList
              blocks={blocks}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onUpdate={handleUpdate}
              onDelete={deleteBlock}
              onReorder={reorderBlocks}
            />
          </div>
          <div className="border-t border-gray-200 px-4">
            <BlockToolbar onAddBlock={handleAddBlock} showWorkBlocks={showWorkBlocks} />
          </div>
        </div>

        {/* Right panel: Preview */}
        {enablePreview && (
          <div className="w-[40%] overflow-y-auto bg-gray-50">
            <div className="px-4 pt-4 mb-3">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                {isWorkDetail ? 'Work Detail Preview' : 'Live Preview'}
              </span>
            </div>
            <div className={isWorkDetail ? 'px-0 pb-4' : 'px-4 pb-4'}>
              {isWorkDetail ? (
                <div
                  style={{
                    transform: 'scale(0.3)',
                    transformOrigin: 'top left',
                    width: '333%',
                  }}
                >
                  <WorkDetailPreviewRenderer
                    blocks={previewBlocks}
                    projectContext={projectContext}
                  />
                </div>
              ) : (
                <BlockRenderer blocks={previewBlocks} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Re-export types and utilities for convenience
export { useBlockEditor } from './useBlockEditor';
export { default as BlockRenderer } from './renderers/BlockRenderer';
export { default as WorkDetailPreviewRenderer } from './renderers/WorkDetailPreviewRenderer';
export { default as HeadingBlockRenderer } from './renderers/HeadingBlockRenderer';
export { default as GalleryBlockRenderer } from './renderers/GalleryBlockRenderer';
export { default as SpacerBlockRenderer } from './renderers/SpacerBlockRenderer';
export { default as DividerBlockRenderer } from './renderers/DividerBlockRenderer';
export { default as HeroImageBlockRenderer } from './renderers/HeroImageBlockRenderer';
export { default as WorkTitleBlockRenderer } from './renderers/WorkTitleBlockRenderer';
export { default as WorkMetadataBlockRenderer } from './renderers/WorkMetadataBlockRenderer';
export { default as WorkGalleryBlockRenderer } from './renderers/WorkGalleryBlockRenderer';
export { default as BlockList } from './BlockList';
export { default as BlockToolbar } from './BlockToolbar';
export type {
  Block,
  BlockType,
  BlogContent,
  TextBlock,
  HeadingBlock,
  ImageBlock,
  GalleryBlock,
  SpacerBlock,
  DividerBlock,
  HeroImageBlock,
  WorkTitleBlock,
  WorkMetadataBlock,
  WorkGalleryBlock,
  WorkProjectContext,
  ContentBlock,
} from './types';
export {
  BLOG_CONTENT_VERSION,
  createEmptyBlogContent,
  createDefaultBlock,
  generateBlockId,
} from './types';
