'use client';

import React, { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { ChevronDown, ChevronUp, Plus, Settings, X } from 'lucide-react';
import type { LayoutRowBlock, Block, BlockType } from '../types';
import { createDefaultBlock, validateBlockTree } from '../types';
import BlockList from '../BlockList';
import BlockToolbar from '../BlockToolbar';

interface LayoutRowBlockEditorProps {
  block: LayoutRowBlock;
  onChange: (data: Partial<LayoutRowBlock>) => void;
}

/**
 * Editor for LayoutRowBlock: multi-column horizontal layout
 * Features:
 * - Toggle between 2-3 columns
 * - Tab-based column selection
 * - Nested block management per column
 * - Configuration panel (distribution, gap, custom widths)
 * - Container nesting prevention
 */
export default function LayoutRowBlockEditor({
  block,
  onChange,
}: LayoutRowBlockEditorProps) {
  const [selectedColumnIdx, setSelectedColumnIdx] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Handle column count change (2 ↔ 3)
  const handleChangeColumns = (newColumns: 2 | 3) => {
    if (newColumns === block.columns) return;

    let newChildren = [...block.children];
    if (newColumns === 3 && block.columns === 2) {
      // 2 → 3: add empty third column
      newChildren = [...newChildren, []];
      setSelectedColumnIdx(0);
    } else if (newColumns === 2 && block.columns === 3) {
      // 3 → 2: merge third column into second
      newChildren = [
        newChildren[0],
        [...(newChildren[1] || []), ...(newChildren[2] || [])],
      ];
      setSelectedColumnIdx(0);
    }

    onChange({
      columns: newColumns,
      children: newChildren,
    });
  };

  // Handle adding block to selected column
  const handleAddBlock = (type: BlockType) => {
    // Prevent nesting containers
    if (type === 'layout-row' || type === 'layout-grid') {
      alert('Cannot nest layout containers. Containers can only contain regular blocks.');
      return;
    }

    const newBlock = createDefaultBlock(type, block.children[selectedColumnIdx].length);
    const newChildren = [...block.children];
    newChildren[selectedColumnIdx] = [...newChildren[selectedColumnIdx], newBlock];

    onChange({ children: newChildren });
    setSelectedBlockId(newBlock.id);
  };

  // Handle updating block in selected column
  const handleUpdateBlock = (blockId: string, data: Partial<Block>) => {
    const newChildren = [...block.children];
    const colIdx = selectedColumnIdx;
    const blockIdx = newChildren[colIdx].findIndex((b) => b.id === blockId);

    if (blockIdx === -1) return;

    const updatedBlock = { ...newChildren[colIdx][blockIdx], ...data } as Block;
    newChildren[colIdx] = [
      ...newChildren[colIdx].slice(0, blockIdx),
      updatedBlock,
      ...newChildren[colIdx].slice(blockIdx + 1),
    ];

    onChange({ children: newChildren });
  };

  // Handle deleting block from selected column
  const handleDeleteBlock = (blockId: string) => {
    const newChildren = [...block.children];
    const colIdx = selectedColumnIdx;
    newChildren[colIdx] = newChildren[colIdx].filter((b) => b.id !== blockId);

    onChange({ children: newChildren });
  };

  // Handle reordering blocks within selected column
  const handleReorderBlock = (sourceId: string, destIdx: number) => {
    const newChildren = [...block.children];
    const colIdx = selectedColumnIdx;
    const sourceIdx = newChildren[colIdx].findIndex((b) => b.id === sourceId);

    if (sourceIdx === -1) return;

    const [movedBlock] = newChildren[colIdx].splice(sourceIdx, 1);
    newChildren[colIdx].splice(destIdx, 0, movedBlock);

    // Update order field
    newChildren[colIdx] = newChildren[colIdx].map((b, idx) => ({
      ...b,
      order: idx,
    }));

    onChange({ children: newChildren });
  };

  const handleMoveUp = (blockId: string) => {
    const newChildren = [...block.children];
    const colIdx = selectedColumnIdx;
    const idx = newChildren[colIdx].findIndex((b) => b.id === blockId);

    if (idx <= 0) return;

    [newChildren[colIdx][idx - 1], newChildren[colIdx][idx]] = [
      newChildren[colIdx][idx],
      newChildren[colIdx][idx - 1],
    ];

    newChildren[colIdx] = newChildren[colIdx].map((b, i) => ({
      ...b,
      order: i,
    }));

    onChange({ children: newChildren });
  };

  const handleMoveDown = (blockId: string) => {
    const newChildren = [...block.children];
    const colIdx = selectedColumnIdx;
    const idx = newChildren[colIdx].findIndex((b) => b.id === blockId);

    if (idx >= newChildren[colIdx].length - 1) return;

    [newChildren[colIdx][idx], newChildren[colIdx][idx + 1]] = [
      newChildren[colIdx][idx + 1],
      newChildren[colIdx][idx],
    ];

    newChildren[colIdx] = newChildren[colIdx].map((b, i) => ({
      ...b,
      order: i,
    }));

    onChange({ children: newChildren });
  };

  // Handle cross-column drag and drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Parse IDs: format is "row:{rowId}:col:{colIdx}:{blockId}"
    const activeMatch = (active.id as string).match(/col:(\d+):(.+)/);
    const overMatch = (over.id as string).match(/col:(\d+)/);

    if (!activeMatch || !overMatch) return;

    const fromColIdx = parseInt(activeMatch[1]);
    const blockId = activeMatch[2];
    const toColIdx = parseInt(overMatch[1]);

    // If moving within same column, ignore (handled by BlockList)
    if (fromColIdx === toColIdx) return;

    // Find block in source column
    const newChildren = [...block.children];
    const blockIdx = newChildren[fromColIdx].findIndex((b) => b.id === blockId);

    if (blockIdx === -1) return;

    // Move block from source to target column
    const [movedBlock] = newChildren[fromColIdx].splice(blockIdx, 1);
    newChildren[toColIdx] = [
      ...newChildren[toColIdx],
      { ...movedBlock, order: newChildren[toColIdx].length },
    ];

    // Update order in both columns
    newChildren[fromColIdx] = newChildren[fromColIdx].map((b, i) => ({
      ...b,
      order: i,
    }));
    newChildren[toColIdx] = newChildren[toColIdx].map((b, i) => ({
      ...b,
      order: i,
    }));

    onChange({ children: newChildren });

    // Switch to target column
    setSelectedColumnIdx(toColIdx);
    setSelectedBlockId(blockId);
  };

  const selectedColumnBlocks = block.children[selectedColumnIdx] || [];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-700">Columns:</span>
          <button
            type="button"
            onClick={() => handleChangeColumns(2)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              block.columns === 2
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            2 Cols
          </button>
          <button
            type="button"
            onClick={() => handleChangeColumns(3)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              block.columns === 3
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            3 Cols
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className={`p-1.5 rounded transition-colors ${
            showSettings
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
          title="Toggle settings"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Distribution
            </label>
            <select
              value={block.distribution || 'equal'}
              onChange={(e) =>
                onChange({
                  distribution: e.target.value as LayoutRowBlock['distribution'],
                })
              }
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded bg-white"
            >
              <option value="equal">Equal Width</option>
              <option value="golden-left">Golden Ratio (wider left)</option>
              <option value="golden-right">Golden Ratio (wider right)</option>
              <option value="custom">Custom Widths</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Column Gap (px)
            </label>
            <input
              type="number"
              value={block.columnGap ?? 24}
              onChange={(e) => onChange({ columnGap: parseInt(e.target.value) || 24 })}
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded"
              min="0"
              max="100"
              step="4"
            />
          </div>

          {block.distribution === 'custom' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Custom Widths (%)
              </label>
              <div className="space-y-1.5">
                {block.customWidths?.map((width, idx) => (
                  <input
                    key={idx}
                    type="number"
                    value={width}
                    onChange={(e) => {
                      const newWidths = [...(block.customWidths || [])];
                      newWidths[idx] = parseFloat(e.target.value) || 0;
                      onChange({ customWidths: newWidths });
                    }}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded"
                    placeholder={`Column ${idx + 1} width`}
                    min="0"
                    max="100"
                    step="1"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Column Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {block.children.map((colBlocks, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedColumnIdx(idx)}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              selectedColumnIdx === idx
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Column {idx + 1}
            <span className="ml-1 text-gray-400">({colBlocks.length})</span>
          </button>
        ))}
      </div>

      {/* Column Content */}
      <div className="space-y-2">
        <BlockToolbar onAddBlock={handleAddBlock} showWorkBlocks={false} />

        {selectedColumnBlocks.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-400 bg-gray-50 rounded-lg">
            No blocks in this column. Click "Add Block" above to start.
          </div>
        ) : (
          <BlockList
            blocks={selectedColumnBlocks}
            selectedId={selectedBlockId}
            onSelect={setSelectedBlockId}
            onUpdate={handleUpdateBlock}
            onDelete={handleDeleteBlock}
            onReorder={handleReorderBlock}
          />
        )}
      </div>

      {/* Move buttons */}
      {selectedBlockId && (
        <div className="flex gap-1 justify-end">
          <button
            type="button"
            onClick={() => handleMoveUp(selectedBlockId)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            title="Move block up"
          >
            <ChevronUp size={14} />
          </button>
          <button
            type="button"
            onClick={() => handleMoveDown(selectedBlockId)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            title="Move block down"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
