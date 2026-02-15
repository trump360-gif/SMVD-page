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

  /** Re-index order values for an array of blocks */
  const reindex = (arr: Block[]): Block[] =>
    arr.map((block, idx) => withOrder(block, idx));

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

      return reindex(updated);
    });
  }, []);

  /** Update a block's data by ID (partial merge) */
  const updateBlock = useCallback((id: string, data: Partial<Block>) => {
    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id !== id) return block;
        // Merge data into the block, preserving the discriminated union
        return { ...block, ...data } as Block;
      })
    );
  }, []);

  /** Delete a block by ID */
  const deleteBlock = useCallback((id: string) => {
    setBlocks((prev) => {
      const filtered = prev.filter((b) => b.id !== id);
      return reindex(filtered);
    });
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  /** Move a block from its current position to a new index */
  const reorderBlocks = useCallback(
    (sourceId: string, destinationIndex: number) => {
      setBlocks((prev) => {
        const sourceIndex = prev.findIndex((b) => b.id === sourceId);
        if (sourceIndex === -1) return prev;

        const updated = [...prev];
        const [moved] = updated.splice(sourceIndex, 1);
        updated.splice(destinationIndex, 0, moved);

        return reindex(updated);
      });
    },
    []
  );

  /** Find a block by ID */
  const getBlockById = useCallback(
    (id: string): Block | undefined => {
      return blocks.find((b) => b.id === id);
    },
    [blocks]
  );

  return {
    blocks,
    selectedId,
    setSelectedId,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    getBlockById,
  };
}
