'use client';

import React, { type ReactNode } from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';
import BlockLayoutVisualizer from '@/components/admin/work/BlockLayoutVisualizer';
import BlockEditorPanel from '@/components/admin/work/BlockEditorPanel';
import type {
  Block,
  BlockType,
  RowConfig,
} from '@/components/admin/shared/BlockEditor/types';

interface ThreePanelLayoutProps {
  /** Block editor state */
  blocks: Block[];
  rowConfig: RowConfig[];
  selectedId: string | null;
  setSelectedId: (id: string) => void;

  /** Block operations */
  updateBlock: (id: string, data: Partial<Block>) => void;
  reorderBlocks: (sourceId: string, destinationIndex: number) => void;

  /** Row operations */
  handleRowLayoutChange: (rowIndex: number, layout: 1 | 2 | 3) => void;
  handleAddRow: (layout?: 1 | 2 | 3) => void;
  handleDeleteRow: (rowIndex: number) => void;
  handleReorderRows: (sourceRowIndex: number, destinationRowIndex: number) => void;
  handleAddBlockToRow: (type: BlockType, rowIndex: number) => void;
  handleDeleteBlock: (id: string) => void;
  handleMoveBlockToRow: (
    blockId: string,
    targetRowIndex: number,
    positionInRow: number
  ) => void;

  /** Undo/Redo */
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  /** Preview panel content (right side) */
  previewPanel: ReactNode;

  /** Preview panel header text */
  previewTitle?: string;
  previewSubtitle?: string;
}

/**
 * Shared 3-panel layout for blog/news/work content editors.
 * Left 25%: Block Layout Visualizer
 * Center 40%: Block Editor Panel
 * Right 35%: Live Preview (custom per modal)
 */
export default function ThreePanelLayout({
  blocks,
  rowConfig,
  selectedId,
  setSelectedId,
  updateBlock,
  reorderBlocks,
  handleRowLayoutChange,
  handleAddRow,
  handleDeleteRow,
  handleReorderRows,
  handleAddBlockToRow,
  handleDeleteBlock,
  handleMoveBlockToRow,
  undo,
  redo,
  canUndo,
  canRedo,
  previewPanel,
  previewTitle = 'Live Preview',
  previewSubtitle,
}: ThreePanelLayoutProps) {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Undo/Redo Controls */}
      <div className="border-b border-gray-200 px-4 py-2 bg-gray-50 flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <RotateCcw size={16} className="text-gray-600" />
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <RotateCw size={16} className="text-gray-600" />
        </button>
        <div className="text-xs text-gray-400 ml-2">
          Ctrl+Z / Ctrl+Y
        </div>
      </div>

      {/* 3-Panel Layout */}
      <div className="flex flex-1 overflow-hidden w-full">
        {/* Left 25%: Block Layout Visualizer */}
        <div className="w-[25%] border-r border-gray-200 bg-white overflow-hidden flex flex-col">
          <BlockLayoutVisualizer
            blocks={blocks}
            rowConfig={rowConfig}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onReorder={reorderBlocks}
            onRowLayoutChange={handleRowLayoutChange}
            onAddRow={handleAddRow}
            onDeleteRow={handleDeleteRow}
            onReorderRows={handleReorderRows}
            onAddBlockToRow={handleAddBlockToRow}
            onDeleteBlock={handleDeleteBlock}
            onMoveBlockToRow={handleMoveBlockToRow}
          />
        </div>

        {/* Center 40%: Block Editor Panel */}
        <div className="w-[40%] border-r border-gray-200 bg-white overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <BlockEditorPanel
              block={blocks.find((b) => b.id === selectedId) || null}
              onChange={updateBlock}
              onDelete={handleDeleteBlock}
              undo={undo}
              redo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
            />
          </div>
        </div>

        {/* Right 35%: Live Preview */}
        <div className="w-[35%] overflow-hidden bg-white flex flex-col h-full">
          <div className="shrink-0 px-4 py-3 border-b border-gray-200 bg-gray-50 sticky top-0">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {previewTitle}
            </h4>
            {previewSubtitle && (
              <p className="text-[10px] text-gray-400 mt-1">{previewSubtitle}</p>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            {previewPanel}
          </div>
        </div>
      </div>
    </div>
  );
}
