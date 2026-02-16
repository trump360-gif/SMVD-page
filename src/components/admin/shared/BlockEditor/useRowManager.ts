'use client';

import { useCallback } from 'react';
import type { RowConfig, BlockType, Block } from './types';

/**
 * Shared Row Management Hook for Block Editors
 *
 * Extracts common row configuration logic used in both Work and News modals.
 * Manages layout rows, block distribution, and drag-drop operations.
 */
export function useRowManager(
  rowConfig: RowConfig[],
  setRowConfig: (updater: (prev: RowConfig[]) => RowConfig[]) => void,
  blocks: Block[],
  addBlock: (type: BlockType, afterId?: string) => void,
  deleteBlock: (id: string) => void,
  reorderBlocks: (id: string, toIndex: number) => void,
  modalName: string = 'BlockEditor' // For logging purposes
) {
  // ---- Handle row layout change (1/2/3 columns) ----
  const handleRowLayoutChange = useCallback(
    (rowIndex: number, newLayout: 1 | 2 | 3) => {
      setRowConfig((prev) => {
        const updated = [...prev];
        if (rowIndex < updated.length) {
          updated[rowIndex] = { ...updated[rowIndex], layout: newLayout };
        }
        return updated;
      });
    },
    [setRowConfig]
  );

  // ---- Add a new row ----
  const handleAddRow = useCallback((layout: 1 | 2 | 3 = 1) => {
    setRowConfig((prev) => [...prev, { layout, blockCount: 0 }]);
  }, [setRowConfig]);

  // ---- Delete a row (blocks get merged into adjacent rows) ----
  const handleDeleteRow = useCallback((rowIndex: number) => {
    setRowConfig((prev) => {
      if (prev.length <= 1) return prev; // Don't delete last row
      const updated = [...prev];
      const removedBlockCount = updated[rowIndex].blockCount;
      updated.splice(rowIndex, 1);

      // Merge removed row's blocks into previous or next row
      if (removedBlockCount > 0) {
        const mergeTarget = rowIndex > 0 ? rowIndex - 1 : 0;
        if (updated[mergeTarget]) {
          updated[mergeTarget] = {
            ...updated[mergeTarget],
            blockCount: updated[mergeTarget].blockCount + removedBlockCount,
          };
        }
      }
      return updated;
    });
  }, [setRowConfig]);

  // ---- Add a block to a specific row ----
  const handleAddBlockToRow = useCallback(
    (type: BlockType, rowIndex: number) => {
      // Update rowConfig to increment block count
      setRowConfig((prev) => {
        const updated = [...prev];
        if (rowIndex < updated.length) {
          updated[rowIndex] = {
            ...updated[rowIndex],
            blockCount: updated[rowIndex].blockCount + 1,
          };
        } else {
          // Row doesn't exist, create it
          updated.push({ layout: 1, blockCount: 1 });
        }
        return updated;
      });

      // Calculate position in flat blocks array
      let blockOffset = 0;
      for (let i = 0; i < rowIndex; i++) {
        blockOffset += rowConfig[i]?.blockCount ?? 0;
      }
      blockOffset += rowConfig[rowIndex]?.blockCount ?? 0;

      // Insert block at calculated position
      if (blockOffset > 0 && blockOffset <= blocks.length) {
        const afterBlock = blocks[blockOffset - 1];
        addBlock(type, afterBlock.id);
      } else {
        addBlock(type);
      }
    },
    [addBlock, blocks, rowConfig, setRowConfig]
  );

  // ---- Delete a block with rowConfig sync ----
  const handleDeleteBlock = useCallback(
    (id: string) => {
      // Find which row this block belongs to
      const blockIndex = blocks.findIndex((b) => b.id === id);
      if (blockIndex === -1) {
        deleteBlock(id);
        return;
      }

      // Determine target row
      let accum = 0;
      let targetRow = -1;
      for (let i = 0; i < rowConfig.length; i++) {
        accum += rowConfig[i].blockCount;
        if (blockIndex < accum) {
          targetRow = i;
          break;
        }
      }

      deleteBlock(id);

      // Decrement block count in target row
      if (targetRow >= 0) {
        setRowConfig((prev) => {
          const updated = [...prev];
          if (targetRow < updated.length && updated[targetRow].blockCount > 0) {
            updated[targetRow] = {
              ...updated[targetRow],
              blockCount: updated[targetRow].blockCount - 1,
            };
            // Remove empty row if not the only row
            if (updated[targetRow].blockCount === 0 && updated.length > 1) {
              updated.splice(targetRow, 1);
            }
          }
          return updated;
        });
      }
    },
    [blocks, deleteBlock, rowConfig, setRowConfig]
  );

  // ---- Move a block between rows via drag and drop ----
  const handleMoveBlockToRow = useCallback(
    (blockId: string, targetRowIndex: number, positionInRow: number) => {
      const blockIndex = blocks.findIndex((b) => b.id === blockId);
      if (blockIndex === -1) return;

      // Find source row
      let accum = 0;
      let sourceRow = -1;
      for (let i = 0; i < rowConfig.length; i++) {
        accum += rowConfig[i].blockCount;
        if (blockIndex < accum) {
          sourceRow = i;
          break;
        }
      }

      // Calculate destination index in flat array
      let destIndex = 0;
      for (let i = 0; i < targetRowIndex; i++) {
        destIndex += rowConfig[i]?.blockCount ?? 0;
      }
      destIndex += positionInRow;

      // Move block
      reorderBlocks(blockId, destIndex);

      // Update rowConfig: decrement source, increment destination
      if (sourceRow >= 0 && sourceRow !== targetRowIndex) {
        setRowConfig((prev) => {
          const updated = [...prev];

          // Decrement source row
          if (sourceRow < updated.length && updated[sourceRow].blockCount > 0) {
            updated[sourceRow] = {
              ...updated[sourceRow],
              blockCount: updated[sourceRow].blockCount - 1,
            };
          }

          // Increment destination row
          if (targetRowIndex < updated.length) {
            updated[targetRowIndex] = {
              ...updated[targetRowIndex],
              blockCount: updated[targetRowIndex].blockCount + 1,
            };
          }

          // Clean up empty source rows
          if (
            sourceRow < updated.length &&
            updated[sourceRow].blockCount === 0 &&
            updated.length > 1
          ) {
            updated.splice(sourceRow, 1);
          }

          return updated;
        });
      }
    },
    [blocks, reorderBlocks, rowConfig, setRowConfig]
  );

  // ---- Reorder rows themselves ----
  const handleReorderRows = useCallback(
    (sourceRowIndex: number, destinationRowIndex: number) => {
      console.log(`[${modalName}] handleReorderRows called:`, {
        sourceRowIndex,
        destinationRowIndex,
        rowConfigLength: rowConfig.length,
      });

      setRowConfig((prev) => {
        console.log(`[${modalName}] setRowConfig callback:`, {
          prev_length: prev.length,
          sourceRowIndex,
          destinationRowIndex,
          prev_data: JSON.stringify(prev),
        });

        // Validate indices
        if (
          sourceRowIndex < 0 || sourceRowIndex >= prev.length ||
          destinationRowIndex < 0 || destinationRowIndex >= prev.length ||
          sourceRowIndex === destinationRowIndex
        ) {
          console.log(`[${modalName}] ❌ Validation failed:`, {
            check_sourceRowIndex_negative: sourceRowIndex < 0,
            check_sourceRowIndex_outOfBounds: sourceRowIndex >= prev.length,
            check_destinationRowIndex_negative: destinationRowIndex < 0,
            check_destinationRowIndex_outOfBounds: destinationRowIndex >= prev.length,
            check_sameIndex: sourceRowIndex === destinationRowIndex,
          });
          return prev;
        }

        const updated = [...prev];
        const [movedRow] = updated.splice(sourceRowIndex, 1);
        updated.splice(destinationRowIndex, 0, movedRow);
        console.log(`[${modalName}] ✅ Reordered rowConfig:`, {
          oldIndex: sourceRowIndex,
          newIndex: destinationRowIndex,
          newLength: updated.length,
        });
        return updated;
      });
    },
    [modalName, rowConfig.length, setRowConfig]
  );

  return {
    handleRowLayoutChange,
    handleAddRow,
    handleDeleteRow,
    handleAddBlockToRow,
    handleDeleteBlock,
    handleMoveBlockToRow,
    handleReorderRows,
  };
}
