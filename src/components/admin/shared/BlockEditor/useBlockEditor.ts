'use client';

import { useState, useCallback } from 'react';
import {
  type Block,
  type BlockType,
  createDefaultBlock,
} from './types';

/**
 * Helper to set the order field on a Block without losing the
 * discriminated union type information.
 */
function withOrder(block: Block, order: number): Block {
  // Using Object.assign on a shallow copy preserves the runtime type
  // while satisfying TypeScript's discriminated union checks.
  const copy = { ...block } as Block;
  (copy as { order: number }).order = order;
  return copy;
}

/**
 * State management hook for the block editor.
 * Provides CRUD operations and reordering for blocks.
 */
export function useBlockEditor(initialBlocks: Block[] = []) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<Block[][]>([initialBlocks]);
  const [historyIndex, setHistoryIndex] = useState(0);

  /** Re-index order values for an array of blocks */
  const reindex = (arr: Block[]): Block[] =>
    arr.map((block, idx) => withOrder(block, idx));

  /** Save to history after state change */
  const saveToHistory = useCallback((newBlocks: Block[]) => {
    setHistory((prev) => {
      // Remove any future history if we're not at the end
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newBlocks);
      return newHistory;
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  /** Add a new block of the given type, optionally after a specific block */
  const addBlock = useCallback((type: BlockType, afterId?: string) => {
    setBlocks((prev) => {
      let insertIndex = prev.length;

      if (afterId) {
        const afterIndex = prev.findIndex((b) => b.id === afterId);
        if (afterIndex !== -1) {
          insertIndex = afterIndex + 1;
        }
      }

      const newBlock = createDefaultBlock(type, insertIndex);
      const updated = [...prev];
      updated.splice(insertIndex, 0, newBlock);

      const reindexed = reindex(updated);
      saveToHistory(reindexed);
      return reindexed;
    });
  }, [saveToHistory]);

  /** Update a block's data by ID (partial merge) */
  const updateBlock = useCallback((id: string, data: Partial<Block>) => {
    setBlocks((prev) => {
      const updated = prev.map((block) => {
        if (block.id !== id) return block;
        // Merge data into the block, preserving the discriminated union
        return { ...block, ...data } as Block;
      });
      saveToHistory(updated);
      return updated;
    });
  }, [saveToHistory]);

  /** Delete a block by ID */
  const deleteBlock = useCallback((id: string) => {
    setBlocks((prev) => {
      const filtered = prev.filter((b) => b.id !== id);
      const reindexed = reindex(filtered);
      saveToHistory(reindexed);
      return reindexed;
    });
    setSelectedId((prev) => (prev === id ? null : prev));
  }, [saveToHistory]);

  /** Move a block from its current position to a new index */
  const reorderBlocks = useCallback(
    (sourceId: string, destinationIndex: number) => {
      setBlocks((prev) => {
        const sourceIndex = prev.findIndex((b) => b.id === sourceId);
        if (sourceIndex === -1) return prev;

        const updated = [...prev];
        const [moved] = updated.splice(sourceIndex, 1);
        updated.splice(destinationIndex, 0, moved);

        const reindexed = reindex(updated);
        saveToHistory(reindexed);
        return reindexed;
      });
    },
    [saveToHistory]
  );

  /** Find a block by ID */
  const getBlockById = useCallback(
    (id: string): Block | undefined => {
      return blocks.find((b) => b.id === id);
    },
    [blocks]
  );

  /** ✅ 새로 추가: 외부에서 블록 배열을 강제로 재설정 (동기화용) */
  const resetBlocks = useCallback((newBlocks: Block[]) => {
    console.log('[useBlockEditor] resetBlocks called with', newBlocks.length, 'blocks');
    const reindexed = reindex(newBlocks);
    setBlocks(reindexed);
    setHistory([reindexed]); // History 초기화
    setHistoryIndex(0);      // 히스토리 인덱스 초기화
    setSelectedId(null);     // 선택 상태 초기화
  }, []);

  /** ✅ 새로 추가: 현재 블록 개수 반환 (디버깅용) */
  const getBlockCount = useCallback(() => blocks.length, [blocks]);

  /** ✅ 새로 추가: 이전 상태로 돌아가기 */
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setBlocks(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  /** ✅ 새로 추가: 다음 상태로 진행 */
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setBlocks(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  /** ✅ 새로 추가: Undo/Redo 가능 여부 반환 */
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    blocks,
    selectedId,
    setSelectedId,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    getBlockById,
    resetBlocks,        // ← 추가
    getBlockCount,      // ← 추가
    undo,               // ← 새로 추가
    redo,               // ← 새로 추가
    canUndo,            // ← 새로 추가
    canRedo,            // ← 새로 추가
  };
}
