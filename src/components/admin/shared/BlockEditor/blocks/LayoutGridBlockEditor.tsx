'use client';

import React, { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Settings } from 'lucide-react';
import type { LayoutGridBlock, Block, BlockType } from '../types';
import { createDefaultBlock } from '../types';
import BlockList from '../BlockList';
import BlockToolbar from '../BlockToolbar';

interface LayoutGridBlockEditorProps {
  block: LayoutGridBlock;
  onChange: (data: Partial<LayoutGridBlock>) => void;
}

// Grid template info
const GRID_TEMPLATES: Record<
  LayoutGridBlock['template'],
  { label: string; rows: number; cols: number }
> = {
  '2x2': { label: '2×2 (4개 셀)', rows: 2, cols: 2 },
  '3x1': { label: '3×1 (3개 셀)', rows: 3, cols: 1 },
  '1x3': { label: '1×3 (3개 셀)', rows: 1, cols: 3 },
  '2x3': { label: '2×3 (6개 셀)', rows: 2, cols: 3 },
  auto: { label: '자동 (flex)', rows: 2, cols: 2 },
};

/**
 * Editor for LayoutGridBlock: 2D grid container
 * Features:
 * - Multiple grid templates (2x2, 3x1, 1x3, 2x3, auto)
 * - Cell selection with visual buttons
 * - Nested block management per cell
 * - Configuration panel (gap, minCellHeight)
 * - Container nesting prevention
 */
export default function LayoutGridBlockEditor({
  block,
  onChange,
}: LayoutGridBlockEditorProps) {
  const [selectedCellIdx, setSelectedCellIdx] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const templateInfo = GRID_TEMPLATES[block.template];
  const totalCells = block.children.length;

  // Handle template change
  const handleChangeTemplate = (newTemplate: LayoutGridBlock['template']) => {
    const newInfo = GRID_TEMPLATES[newTemplate];
    const newCellCount = newInfo.rows * newInfo.cols;

    let newChildren = [...block.children];

    // Adjust cell count
    if (newCellCount > totalCells) {
      // Add empty cells
      for (let i = totalCells; i < newCellCount; i++) {
        newChildren.push([]);
      }
    } else if (newCellCount < totalCells) {
      // Merge excess cells into last cell
      const lastCell = newChildren[newCellCount - 1] || [];
      for (let i = newCellCount; i < totalCells; i++) {
        lastCell.push(...newChildren[i]);
      }
      newChildren = newChildren.slice(0, newCellCount);
      newChildren[newCellCount - 1] = lastCell;
    }

    onChange({
      template: newTemplate,
      children: newChildren,
    });

    // Reset selected cell if out of range
    if (selectedCellIdx >= newChildren.length) {
      setSelectedCellIdx(0);
    }
  };

  // Handle adding block to selected cell
  const handleAddBlock = (type: BlockType) => {
    // Prevent nesting containers
    if (type === 'layout-row' || type === 'layout-grid') {
      alert('Cannot nest layout containers. Containers can only contain regular blocks.');
      return;
    }

    const newBlock = createDefaultBlock(type, block.children[selectedCellIdx].length);
    const newChildren = [...block.children];
    newChildren[selectedCellIdx] = [...newChildren[selectedCellIdx], newBlock];

    onChange({ children: newChildren });
    setSelectedBlockId(newBlock.id);
  };

  // Handle updating block in selected cell
  const handleUpdateBlock = (blockId: string, data: Partial<Block>) => {
    const newChildren = [...block.children];
    const cellIdx = selectedCellIdx;
    const blockIdx = newChildren[cellIdx].findIndex((b) => b.id === blockId);

    if (blockIdx === -1) return;

    const updatedBlock = { ...newChildren[cellIdx][blockIdx], ...data } as Block;
    newChildren[cellIdx] = [
      ...newChildren[cellIdx].slice(0, blockIdx),
      updatedBlock,
      ...newChildren[cellIdx].slice(blockIdx + 1),
    ];

    onChange({ children: newChildren });
  };

  // Handle deleting block from selected cell
  const handleDeleteBlock = (blockId: string) => {
    const newChildren = [...block.children];
    const cellIdx = selectedCellIdx;
    newChildren[cellIdx] = newChildren[cellIdx].filter((b) => b.id !== blockId);

    onChange({ children: newChildren });
  };

  // Handle reordering blocks within selected cell
  const handleReorderBlock = (sourceId: string, destIdx: number) => {
    const newChildren = [...block.children];
    const cellIdx = selectedCellIdx;
    const sourceIdx = newChildren[cellIdx].findIndex((b) => b.id === sourceId);

    if (sourceIdx === -1) return;

    const [movedBlock] = newChildren[cellIdx].splice(sourceIdx, 1);
    newChildren[cellIdx].splice(destIdx, 0, movedBlock);

    // Update order field
    newChildren[cellIdx] = newChildren[cellIdx].map((b, idx) => ({
      ...b,
      order: idx,
    }));

    onChange({ children: newChildren });
  };

  // Handle cross-cell drag and drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Parse IDs: format is "grid:{gridId}:cell:{cellIdx}:{blockId}"
    const activeMatch = (active.id as string).match(/cell:(\d+):(.+)/);
    const overMatch = (over.id as string).match(/cell:(\d+)/);

    if (!activeMatch || !overMatch) return;

    const fromCellIdx = parseInt(activeMatch[1]);
    const blockId = activeMatch[2];
    const toCellIdx = parseInt(overMatch[1]);

    // If moving within same cell, ignore (handled by BlockList)
    if (fromCellIdx === toCellIdx) return;

    // Find block in source cell
    const newChildren = [...block.children];
    const blockIdx = newChildren[fromCellIdx].findIndex((b) => b.id === blockId);

    if (blockIdx === -1) return;

    // Move block from source to target cell
    const [movedBlock] = newChildren[fromCellIdx].splice(blockIdx, 1);
    newChildren[toCellIdx] = [
      ...newChildren[toCellIdx],
      { ...movedBlock, order: newChildren[toCellIdx].length },
    ];

    // Update order in both cells
    newChildren[fromCellIdx] = newChildren[fromCellIdx].map((b, i) => ({
      ...b,
      order: i,
    }));
    newChildren[toCellIdx] = newChildren[toCellIdx].map((b, i) => ({
      ...b,
      order: i,
    }));

    onChange({ children: newChildren });

    // Switch to target cell
    setSelectedCellIdx(toCellIdx);
    setSelectedBlockId(blockId);
  };

  const selectedCellBlocks = block.children[selectedCellIdx] || [];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-700">템플릿:</span>
          <select
            value={block.template}
            onChange={(e) => handleChangeTemplate(e.target.value as LayoutGridBlock['template'])}
            className="px-2.5 py-1 text-xs border border-gray-300 rounded bg-white hover:border-gray-400"
          >
            {Object.entries(GRID_TEMPLATES).map(([key, info]) => (
              <option key={key} value={key}>
                {info.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className={`p-1.5 rounded transition-colors ${
            showSettings
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
          title="설정 열기/닫기"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              셀 간격 (px)
            </label>
            <input
              type="number"
              value={block.gap ?? 16}
              onChange={(e) => onChange({ gap: parseInt(e.target.value) || 16 })}
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded"
              min="0"
              max="100"
              step="4"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              최소 셀 높이 (px)
            </label>
            <input
              type="number"
              value={block.minCellHeight ?? 200}
              onChange={(e) =>
                onChange({ minCellHeight: parseInt(e.target.value) || 200 })
              }
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded"
              min="100"
              max="800"
              step="20"
            />
          </div>
        </div>
      )}

      {/* Cell Selector Grid */}
      <div>
        <div className="text-xs font-semibold text-gray-700 mb-2">셀 선택:</div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${templateInfo.cols}, 1fr)`,
            gap: '8px',
          }}
        >
          {block.children.map((cellBlocks, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedCellIdx(idx)}
              className={`py-2 px-3 text-xs font-medium rounded transition-colors ${
                selectedCellIdx === idx
                  ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div>셀 {idx + 1}</div>
              <div className="text-xs opacity-75">({cellBlocks.length})</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cell Content */}
      <div className="space-y-2 border-t border-gray-200 pt-3">
        <div className="text-xs font-semibold text-gray-700">
          편집 중: 셀 {selectedCellIdx + 1}
        </div>

        <BlockToolbar onAddBlock={handleAddBlock} showWorkBlocks={false} />

        {selectedCellBlocks.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-400 bg-gray-50 rounded-lg">
            이 셀에 블록이 없습니다. 위의 "블록 추가"를 클릭하여 시작하세요.
          </div>
        ) : (
          <BlockList
            blocks={selectedCellBlocks}
            selectedId={selectedBlockId}
            onSelect={setSelectedBlockId}
            onUpdate={handleUpdateBlock}
            onDelete={handleDeleteBlock}
            onReorder={handleReorderBlock}
          />
        )}
      </div>
    </div>
  );
}
