'use client';

import React, { memo, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Type,
  ImageIcon,
  Heading2,
  Grid3X3,
  ArrowDownFromLine,
  Minus,
  Maximize,
  Tag,
  User,
  Layers,
  FileText,
  Plus,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import type {
  Block,
  BlockType,
  RowConfig,
} from '@/components/admin/shared/BlockEditor/types';
import { groupBlocksByRows } from '@/components/admin/shared/BlockEditor/types';
import BlockToolbar from '@/components/admin/shared/BlockEditor/BlockToolbar';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface BlockLayoutVisualizerProps {
  blocks: Block[];
  rowConfig: RowConfig[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (sourceId: string, destinationIndex: number) => void;
  onRowLayoutChange: (rowIndex: number, layout: 1 | 2 | 3) => void;
  onAddRow: (layout?: 1 | 2 | 3) => void;
  onDeleteRow: (rowIndex: number) => void;
  onAddBlockToRow: (type: BlockType, rowIndex: number) => void;
  onDeleteBlock: (id: string) => void;
  onMoveBlockToRow: (
    blockId: string,
    targetRowIndex: number,
    positionInRow: number
  ) => void;
}

// ---------------------------------------------------------------------------
// Block metadata
// ---------------------------------------------------------------------------

const BLOCK_META: Record<
  string,
  { label: string; Icon: typeof Type; color: string }
> = {
  text: { label: 'Text', Icon: Type, color: 'text-gray-600' },
  heading: { label: 'Heading', Icon: Heading2, color: 'text-gray-700' },
  image: { label: 'Image', Icon: ImageIcon, color: 'text-blue-600' },
  gallery: { label: 'Gallery', Icon: Grid3X3, color: 'text-blue-500' },
  spacer: { label: 'Spacer', Icon: ArrowDownFromLine, color: 'text-gray-400' },
  divider: { label: 'Divider', Icon: Minus, color: 'text-gray-400' },
  'hero-image': {
    label: 'Hero Image',
    Icon: Maximize,
    color: 'text-purple-600',
  },
  'hero-section': {
    label: 'Hero Section',
    Icon: Maximize,
    color: 'text-purple-500',
  },
  'work-title': { label: 'Work Title', Icon: Tag, color: 'text-red-600' },
  'work-metadata': { label: 'Metadata', Icon: User, color: 'text-red-500' },
  'work-gallery': {
    label: 'Work Gallery',
    Icon: Layers,
    color: 'text-red-400',
  },
  'work-layout-config': {
    label: 'Layout',
    Icon: Grid3X3,
    color: 'text-green-600',
  },
  'layout-row': {
    label: 'Row Layout',
    Icon: Grid3X3,
    color: 'text-indigo-600',
  },
  'layout-grid': {
    label: 'Grid Layout',
    Icon: Grid3X3,
    color: 'text-indigo-500',
  },
};

/** Generate preview text for a block */
function getBlockPreviewText(block: Block): string {
  switch (block.type) {
    case 'text':
      return (block as any).content?.substring(0, 30) || '(Empty text)';
    case 'heading':
      return `H${(block as any).level}: ${(block as any).content || '(Empty)'}`;
    case 'image':
      return (block as any).url ? 'Image' : '(No image)';
    case 'gallery':
      return `Gallery (${(block as any).images?.length || 0})`;
    case 'spacer':
      return `Spacer (${(block as any).height})`;
    case 'divider':
      return 'Divider';
    case 'hero-image':
      return (block as any).url ? 'Hero Image' : '(No hero)';
    case 'hero-section':
      return `${(block as any).title || '(No title)'}`;
    case 'work-title':
      return `${(block as any).title || '(No title)'}`;
    case 'work-metadata':
      return `${(block as any).author || 'Author'}`;
    case 'work-gallery':
      return `Gallery (${(block as any).images?.length || 0})`;
    case 'work-layout-config':
      return `Layout (${(block as any).columnLayout || 2} cols)`;
    case 'layout-row':
      return `Row (${(block as any).columns || 2} cols)`;
    case 'layout-grid':
      return `Grid (${(block as any).template || 'auto'})`;
    default:
      return '(Unknown)';
  }
}

// ---------------------------------------------------------------------------
// BlockVisualCard (sortable)
// ---------------------------------------------------------------------------

const BlockVisualCard = memo(function BlockVisualCard({
  block,
  isSelected,
  onSelect,
  isDragging,
  attributes,
  listeners,
  setNodeRef,
  transform,
  transition,
  onDelete,
}: {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  isDragging: boolean;
  attributes: any;
  listeners: any;
  setNodeRef: any;
  transform: any;
  transition: any;
  onDelete?: () => void;
}) {
  const meta = BLOCK_META[block.type] || {
    label: block.type,
    Icon: Type,
    color: 'text-gray-600',
  };
  const BlockIcon = meta.Icon;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 10 : 1,
      }}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      role="listitem"
      tabIndex={0}
      aria-selected={isSelected}
      className={`
        group relative border rounded-md p-2 cursor-pointer transition-all duration-150
        ${
          isSelected
            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200 shadow-sm'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm hover:bg-gray-50'
        }
      `}
    >
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-0.5 cursor-grab active:cursor-grabbing hover:bg-gray-200 rounded transition-colors opacity-30 group-hover:opacity-100 shrink-0"
          title="Drag to reorder"
        >
          <GripVertical size={10} className="text-gray-400" />
        </button>
        <BlockIcon size={10} className={`${meta.color} shrink-0`} />
        <span className="text-[10px] font-medium text-gray-600 truncate flex-1 min-w-0">
          {meta.label}
        </span>
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-0.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100 shrink-0"
            title="Delete block"
          >
            <Trash2 size={10} />
          </button>
        )}
      </div>
      <p className="text-[9px] text-gray-400 truncate mt-0.5 pl-5 leading-tight">
        {getBlockPreviewText(block)}
      </p>
    </div>
  );
});

const SortableBlockVisualCard = memo(function SortableBlockVisualCard({
  block,
  isSelected,
  onSelect,
  onDelete,
}: {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  return (
    <BlockVisualCard
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      isDragging={isDragging}
      attributes={attributes}
      listeners={listeners}
      setNodeRef={setNodeRef}
      transform={transform}
      transition={transition}
      onDelete={onDelete}
    />
  );
});

// ---------------------------------------------------------------------------
// RowSection - renders a single row with its blocks and controls
// ---------------------------------------------------------------------------

interface RowSectionProps {
  rowIndex: number;
  layout: 1 | 2 | 3;
  rowBlocks: Block[];
  totalRows: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onLayoutChange: (layout: 1 | 2 | 3) => void;
  onDeleteRow: () => void;
  onAddBlock: (type: BlockType) => void;
  onReorder: (sourceId: string, destinationIndex: number) => void;
  onDeleteBlock: (id: string) => void;
}

const LAYOUT_LABELS: Record<number, string> = {
  1: '1 Col',
  2: '2 Col',
  3: '3 Col',
};

const RowSection = memo(function RowSection({
  rowIndex,
  layout,
  rowBlocks,
  totalRows,
  selectedId,
  onSelect,
  onLayoutChange,
  onDeleteRow,
  onAddBlock,
  onReorder,
  onDeleteBlock,
}: RowSectionProps) {
  const [showToolbar, setShowToolbar] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = rowBlocks.findIndex((b) => b.id === active.id);
        const newIndex = rowBlocks.findIndex((b) => b.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          onReorder(active.id as string, newIndex);
        }
      }
    },
    [rowBlocks, onReorder]
  );

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  }[layout];

  return (
    <div className="border border-gray-200 rounded-lg bg-gray-50/50 overflow-hidden">
      {/* Row header */}
      <div className="flex items-center justify-between px-2.5 py-1.5 bg-white border-b border-gray-100">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
          Row {rowIndex + 1}
        </span>

        <div className="flex items-center gap-1">
          {/* Layout toggle buttons */}
          {([1, 2, 3] as const).map((cols) => (
            <button
              key={cols}
              type="button"
              onClick={() => onLayoutChange(cols)}
              className={`
                px-1.5 py-0.5 text-[9px] font-medium rounded transition-all
                ${
                  layout === cols
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }
              `}
              title={`${cols} column layout`}
            >
              {LAYOUT_LABELS[cols]}
            </button>
          ))}

          {/* Delete row button */}
          {totalRows > 1 && (
            <button
              type="button"
              onClick={onDeleteRow}
              className="ml-1 p-0.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Delete row"
            >
              <Trash2 size={10} />
            </button>
          )}
        </div>
      </div>

      {/* Block grid within this row */}
      <div className="p-2">
        {rowBlocks.length === 0 ? (
          <div className="flex items-center justify-center py-4 text-center">
            <p className="text-[10px] text-gray-400">
              Empty row - add a block below
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={rowBlocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className={`grid gap-1.5 ${gridColsClass}`} role="list">
                {rowBlocks.map((block) => (
                  <SortableBlockVisualCard
                    key={block.id}
                    block={block}
                    isSelected={selectedId === block.id}
                    onSelect={() => onSelect(block.id)}
                    onDelete={() => onDeleteBlock(block.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Add block to this row */}
      <div className="border-t border-gray-100">
        {showToolbar ? (
          <div className="p-1">
            <BlockToolbar
              onAddBlock={(type) => {
                onAddBlock(type);
                setShowToolbar(false);
              }}
              showWorkBlocks={true}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowToolbar(true)}
            className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] text-gray-400 hover:text-blue-500 hover:bg-blue-50/50 transition-colors"
          >
            <Plus size={10} />
            Add Block
          </button>
        )}
      </div>
    </div>
  );
});

// ---------------------------------------------------------------------------
// BlockLayoutVisualizer (main component)
// ---------------------------------------------------------------------------

export default function BlockLayoutVisualizer({
  blocks,
  rowConfig,
  selectedId,
  onSelect,
  onReorder,
  onRowLayoutChange,
  onAddRow,
  onDeleteRow,
  onAddBlockToRow,
  onDeleteBlock,
  onMoveBlockToRow,
}: BlockLayoutVisualizerProps) {
  // Group blocks into rows based on rowConfig
  const groupedRows = groupBlocksByRows(blocks, rowConfig);

  // If no rowConfig exists and there are blocks, show them in a single implicit row
  const effectiveRowConfig: RowConfig[] =
    rowConfig.length > 0
      ? rowConfig
      : blocks.length > 0
        ? [{ layout: 1 as const, blockCount: blocks.length }]
        : [];

  const [showAddRowMenu, setShowAddRowMenu] = React.useState(false);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-white shrink-0">
        <span className="text-xs font-semibold text-gray-700">
          Layout
        </span>
        <span className="text-[10px] text-gray-400">
          {effectiveRowConfig.length} row{effectiveRowConfig.length !== 1 ? 's' : ''} / {blocks.length} block{blocks.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Rows list */}
      <div className="flex-1 overflow-y-auto min-h-0 p-2 space-y-2">
        {effectiveRowConfig.length === 0 && blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center h-full">
            <FileText size={40} className="text-gray-300 mb-3" />
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              No content yet
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Add a row to get started
            </p>
            <button
              type="button"
              onClick={() => onAddRow(1)}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus size={14} />
              Add First Row
            </button>
          </div>
        ) : (
          groupedRows.map((rowBlocks, idx) => {
            const config = effectiveRowConfig[idx] || {
              layout: 1 as const,
              blockCount: rowBlocks.length,
            };
            return (
              <RowSection
                key={`row-${idx}`}
                rowIndex={idx}
                layout={config.layout}
                rowBlocks={rowBlocks}
                totalRows={effectiveRowConfig.length}
                selectedId={selectedId}
                onSelect={onSelect}
                onLayoutChange={(layout) => onRowLayoutChange(idx, layout)}
                onDeleteRow={() => onDeleteRow(idx)}
                onAddBlock={(type) => onAddBlockToRow(type, idx)}
                onReorder={onReorder}
                onDeleteBlock={onDeleteBlock}
              />
            );
          })
        )}
      </div>

      {/* Add Row Footer */}
      <div className="border-t border-gray-200 bg-white shrink-0 p-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAddRowMenu(!showAddRowMenu)}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <Plus size={14} />
            Add Row
            <ChevronDown
              size={12}
              className={`transition-transform ${showAddRowMenu ? 'rotate-180' : ''}`}
            />
          </button>

          {showAddRowMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
              {([1, 2, 3] as const).map((cols) => (
                <button
                  key={cols}
                  type="button"
                  onClick={() => {
                    onAddRow(cols);
                    setShowAddRowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  {/* Visual representation of columns */}
                  <div className="flex gap-0.5 shrink-0">
                    {Array.from({ length: cols }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-gray-300 rounded-sm"
                        style={{
                          width: `${20 / cols}px`,
                          height: '12px',
                        }}
                      />
                    ))}
                  </div>
                  <span>{cols} Column{cols !== 1 ? 's' : ''}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
