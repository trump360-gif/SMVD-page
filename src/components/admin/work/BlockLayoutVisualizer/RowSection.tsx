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
import { Plus, Trash2 } from 'lucide-react';
import type { Block, BlockType } from '@/components/admin/shared/BlockEditor/types';
import BlockToolbar from '@/components/admin/shared/BlockEditor/BlockToolbar';
import { SortableBlockVisualCard } from './BlockVisualCard';

// ---------------------------------------------------------------------------
// RowSection props
// ---------------------------------------------------------------------------

export interface RowSectionProps {
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
  onPreview?: (blockId: string) => void;
  autoOpenToolbar?: boolean;
}

const LAYOUT_LABELS: Record<number, string> = {
  1: '1열',
  2: '2열',
  3: '3열',
};

// ---------------------------------------------------------------------------
// RowSection - renders a single row with its blocks and controls
// ---------------------------------------------------------------------------

export const RowSection = memo(function RowSection({
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
  onPreview,
  autoOpenToolbar = false,
}: RowSectionProps) {
  const [showToolbar, setShowToolbar] = React.useState(autoOpenToolbar);

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
    <div className="border border-gray-200 rounded-lg bg-gray-50/50">
      {/* Row header */}
      <div className="flex items-center justify-between px-2.5 py-1.5 bg-white border-b border-gray-100">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
          행 {rowIndex + 1}
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
              title={`${cols}열 레이아웃`}
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
              title="행 삭제"
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
              빈 행 - 아래에서 블록을 추가하세요
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
                    onPreview={onPreview ? () => onPreview(block.id) : undefined}
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
              initialOpen={true}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowToolbar(true)}
            className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] text-gray-400 hover:text-blue-500 hover:bg-blue-50/50 transition-colors"
          >
            <Plus size={10} />
            블록 추가
          </button>
        )}
      </div>
    </div>
  );
});

// ---------------------------------------------------------------------------
// SortableRowSection - wraps RowSection with drag-and-drop
// ---------------------------------------------------------------------------

export const SortableRowSection = memo(function SortableRowSection({
  rowIndex,
  ...props
}: RowSectionProps) {
  const rowId = `row-${rowIndex}`;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: rowId });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1,
      }}
    >
      <div
        className="group relative"
        {...attributes}
        {...listeners}
      >
        <RowSection rowIndex={rowIndex} {...props} />
        <div
          className="absolute left-0 top-0 w-1 h-full bg-blue-400 rounded-l opacity-0 group-hover:opacity-100 transition-opacity"
          title="Drag to reorder"
        />
      </div>
    </div>
  );
});
