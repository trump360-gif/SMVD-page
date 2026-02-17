'use client';

import React, { useState, useCallback } from 'react';
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
import { FileText } from 'lucide-react';
import type { Block } from './types';
import { BLOCK_META } from './BlockMeta';
import SortableBlockItem from './SortableBlockItem';

// ---------------------------------------------------------------------------
// BlockList - DnD-powered sortable list of blocks
// ---------------------------------------------------------------------------

interface BlockListProps {
  blocks: Block[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpdate: (id: string, data: Partial<Block>) => void;
  onDelete: (id: string) => void;
  onReorder: (sourceId: string, destinationIndex: number) => void;
}

export default function BlockList({
  blocks,
  selectedId,
  onSelect,
  onUpdate,
  onDelete,
  onReorder,
}: BlockListProps) {
  const [announcement, setAnnouncement] = useState('');

  const handleUpdate = useCallback(
    (id: string, data: Partial<Block>) => onUpdate(id, data),
    [onUpdate]
  );

  const handleDelete = useCallback(
    (id: string) => onDelete(id),
    [onDelete]
  );

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
        const oldIndex = blocks.findIndex((b) => b.id === active.id);
        const newIndex = blocks.findIndex((b) => b.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          onReorder(active.id as string, newIndex);
          const meta = BLOCK_META[blocks[oldIndex].type];
          setAnnouncement(
            `${meta?.label ?? 'Block'} moved from position ${oldIndex + 1} to ${newIndex + 1}`
          );
        }
      }
    },
    [blocks, onReorder]
  );

  const handleMoveUp = useCallback(
    (id: string) => {
      const index = blocks.findIndex((b) => b.id === id);
      if (index > 0) {
        onReorder(id, index - 1);
      }
    },
    [blocks, onReorder]
  );

  const handleMoveDown = useCallback(
    (id: string) => {
      const index = blocks.findIndex((b) => b.id === id);
      if (index < blocks.length - 1) {
        onReorder(id, index + 1);
      }
    },
    [blocks, onReorder]
  );

  const handleAnnounce = useCallback((message: string) => {
    setAnnouncement(message);
  }, []);

  // Empty state
  if (blocks.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <FileText size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No blocks yet</h3>
        <p className="text-sm text-gray-400">
          Click &quot;+ Add Block&quot; below to start creating your content
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Live region for screen reader announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* Hidden shortcut help for screen readers */}
      <div id="block-shortcut-help" className="sr-only">
        Keyboard shortcuts: Cmd or Ctrl plus Delete to delete block, Cmd or Ctrl plus Arrow Up to move block up, Cmd or Ctrl plus Arrow Down to move block down. Drag handle available for mouse reordering.
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div role="list" aria-label="Content blocks" aria-describedby="block-shortcut-help" className="space-y-3">
            {blocks.map((block, index) => (
              <SortableBlockItem
                key={block.id}
                block={block}
                isSelected={selectedId === block.id}
                blockIndex={index}
                totalBlocks={blocks.length}
                onSelect={onSelect}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onAnnounce={handleAnnounce}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}
