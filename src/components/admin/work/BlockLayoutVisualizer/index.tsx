'use client';

import React, { useCallback } from 'react';
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
import { FileText, Plus, ChevronDown } from 'lucide-react';
import type {
  Block,
  BlockType,
  RowConfig,
} from '@/components/admin/shared/BlockEditor/types';
import { groupBlocksByRows } from '@/components/admin/shared/BlockEditor/types';
import { SortableRowSection } from './RowSection';

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
  onReorderRows?: (sourceRowIndex: number, destinationRowIndex: number) => void;
  onAddBlockToRow: (type: BlockType, rowIndex: number) => void;
  onDeleteBlock: (id: string) => void;
  onMoveBlockToRow: (
    blockId: string,
    targetRowIndex: number,
    positionInRow: number
  ) => void;
}

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
  onReorderRows,
  onAddBlockToRow,
  onDeleteBlock,
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

  // Sensors for row drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleRowDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (process.env.DEBUG) console.log('[BlockLayoutVisualizer] Row drag end:', {
        activeId: active.id,
        overId: over?.id,
        effectiveRowConfigLength: effectiveRowConfig.length,
        rowConfigLength: rowConfig.length,
        hasOnReorderRows: !!onReorderRows,
      });

      if (over && active.id !== over.id && onReorderRows) {
        const activeMatch = String(active.id).match(/^row-(\d+)$/);
        const overMatch = String(over.id).match(/^row-(\d+)$/);

        if (process.env.DEBUG) console.log('[BlockLayoutVisualizer] Regex match:', {
          activeMatch: activeMatch ? [activeMatch[0], activeMatch[1]] : null,
          overMatch: overMatch ? [overMatch[0], overMatch[1]] : null,
        });

        if (activeMatch && overMatch) {
          const oldIndex = parseInt(activeMatch[1], 10);
          const newIndex = parseInt(overMatch[1], 10);
          if (!isNaN(oldIndex) && !isNaN(newIndex)) {
            if (process.env.DEBUG) console.log(`[BlockLayoutVisualizer] Reordering rows: ${oldIndex} -> ${newIndex}`);
            onReorderRows(oldIndex, newIndex);
          }
        }
      }
    },
    [onReorderRows, effectiveRowConfig, rowConfig]
  );

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
      <div className="flex-1 overflow-y-auto min-h-0 p-2">
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleRowDragEnd}
          >
            <SortableContext
              items={effectiveRowConfig.map((_, idx) => `row-${idx}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {groupedRows.map((rowBlocks, idx) => {
                  const config = effectiveRowConfig[idx] || {
                    layout: 1 as const,
                    blockCount: rowBlocks.length,
                  };
                  return (
                    <SortableRowSection
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
                })}
              </div>
            </SortableContext>
          </DndContext>
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
