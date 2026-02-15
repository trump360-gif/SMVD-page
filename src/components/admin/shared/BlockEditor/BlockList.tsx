'use client';

import React, { useState, useCallback, memo } from 'react';
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
  Trash2,
  Type,
  ImageIcon,
  Heading2,
  Grid3X3,
  ArrowDownFromLine,
  Minus,
  FileText,
  Maximize,
  Tag,
  User,
  Layers,
  Columns3,
  LayoutGrid,
} from 'lucide-react';
import type {
  Block,
  TextBlock,
  ImageBlock,
  HeadingBlock,
  GalleryBlock,
  SpacerBlock,
  DividerBlock,
  HeroImageBlock,
  WorkTitleBlock,
  WorkMetadataBlock,
  WorkGalleryBlock,
  WorkLayoutConfigBlock,
  LayoutRowBlock,
  LayoutGridBlock,
} from './types';
import TextBlockEditor from './blocks/TextBlockEditor';
import ImageBlockEditor from './blocks/ImageBlockEditor';
import HeadingBlockEditor from './blocks/HeadingBlockEditor';
import GalleryBlockEditor from './blocks/GalleryBlockEditor';
import SpacerBlockEditor from './blocks/SpacerBlockEditor';
import DividerBlockEditor from './blocks/DividerBlockEditor';
import HeroImageBlockEditor from './blocks/HeroImageBlockEditor';
import WorkTitleBlockEditor from './blocks/WorkTitleBlockEditor';
import WorkMetadataBlockEditor from './blocks/WorkMetadataBlockEditor';
import WorkGalleryBlockEditor from './blocks/WorkGalleryBlockEditor';
import WorkLayoutConfigBlockEditor from './blocks/WorkLayoutConfigBlockEditor';
import LayoutRowBlockEditor from './blocks/LayoutRowBlockEditor';
import LayoutGridBlockEditor from './blocks/LayoutGridBlockEditor';

// ---------------------------------------------------------------------------
// Block metadata
// ---------------------------------------------------------------------------

const BLOCK_META: Record<string, { label: string; Icon: typeof Type }> = {
  text: { label: 'Text', Icon: Type },
  heading: { label: 'Heading', Icon: Heading2 },
  image: { label: 'Image', Icon: ImageIcon },
  gallery: { label: 'Gallery', Icon: Grid3X3 },
  spacer: { label: 'Spacer', Icon: ArrowDownFromLine },
  divider: { label: 'Divider', Icon: Minus },
  'hero-image': { label: 'Hero Image', Icon: Maximize },
  'work-title': { label: 'Work Title', Icon: Tag },
  'work-metadata': { label: 'Author/Email', Icon: User },
  'work-gallery': { label: 'Work Gallery', Icon: Layers },
  'work-layout-config': { label: 'Layout Config', Icon: Grid3X3 },
  'layout-row': { label: 'Row Layout', Icon: Columns3 },
  'layout-grid': { label: 'Grid Layout', Icon: LayoutGrid },
};

// ---------------------------------------------------------------------------
// SortableBlockItem - wrapper for each block with drag handle + delete
// ---------------------------------------------------------------------------

interface SortableBlockItemProps {
  block: Block;
  isSelected: boolean;
  blockIndex: number;
  totalBlocks: number;
  onSelect: (id: string) => void;
  onUpdate: (id: string, data: Partial<Block>) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onAnnounce: (message: string) => void;
}

const SortableBlockItem = memo(function SortableBlockItem({
  block,
  isSelected,
  blockIndex,
  totalBlocks,
  onSelect,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAnnounce,
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const meta = BLOCK_META[block.type] ?? { label: block.type, Icon: Type };
  const blockLabel = meta.label;
  const BlockIcon = meta.Icon;

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(block.id);
      setShowDeleteConfirm(false);
      onAnnounce(`${blockLabel} block deleted`);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isMeta = e.metaKey || e.ctrlKey;

    if (e.key === 'Delete' && isMeta) {
      e.preventDefault();
      onDelete(block.id);
      onAnnounce(`${blockLabel} block deleted`);
      return;
    }

    if (e.key === 'ArrowUp' && isMeta) {
      e.preventDefault();
      if (blockIndex > 0) {
        onMoveUp(block.id);
        onAnnounce(`${blockLabel} block moved up to position ${blockIndex}`);
      }
      return;
    }

    if (e.key === 'ArrowDown' && isMeta) {
      e.preventDefault();
      if (blockIndex < totalBlocks - 1) {
        onMoveDown(block.id);
        onAnnounce(`${blockLabel} block moved down to position ${blockIndex + 2}`);
      }
      return;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="listitem"
      aria-label={`${blockLabel} block, position ${blockIndex + 1} of ${totalBlocks}`}
      aria-describedby="block-shortcut-help"
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      onKeyDown={handleKeyDown}
      className={`group relative border rounded-lg bg-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        isSelected
          ? 'border-blue-400 ring-1 ring-blue-200'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={() => onSelect(block.id)}
    >
      {/* Block header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          {/* Drag handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Drag to reorder ${blockLabel} block`}
            className="p-0.5 cursor-grab active:cursor-grabbing hover:bg-gray-200 rounded transition-colors opacity-60 group-hover:opacity-100"
            title="Drag to reorder"
          >
            <GripVertical size={14} className="text-gray-400" />
          </button>
          {/* Block type label */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <BlockIcon size={12} />
            {blockLabel}
          </div>
        </div>

        {/* Delete button */}
        <div className="flex items-center gap-1">
          {showDeleteConfirm && (
            <span className="text-xs text-red-500 mr-1">Delete?</span>
          )}
          <button
            type="button"
            aria-label={
              showDeleteConfirm
                ? `Confirm delete ${blockLabel} block`
                : `Delete ${blockLabel} block`
            }
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            onBlur={() => setShowDeleteConfirm(false)}
            className={`p-1 rounded transition-all ${
              showDeleteConfirm
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-60 group-hover:opacity-100'
            }`}
            title={showDeleteConfirm ? 'Confirm delete' : 'Delete block'}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Block content editor */}
      <div className="p-3">
        {block.type === 'text' && (
          <TextBlockEditor
            block={block as TextBlock}
            onChange={(data) => onUpdate(block.id, data)}
          />
        )}
        {block.type === 'heading' && (
          <HeadingBlockEditor
            block={block as HeadingBlock}
            onChange={(data) => onUpdate(block.id, data)}
          />
        )}
        {block.type === 'image' && (
          <ImageBlockEditor
            block={block as ImageBlock}
            onChange={(data) => onUpdate(block.id, data)}
          />
        )}
        {block.type === 'gallery' && (
          <GalleryBlockEditor
            block={block as GalleryBlock}
            onChange={(data) => onUpdate(block.id, data)}
          />
        )}
        {block.type === 'spacer' && (
          <SpacerBlockEditor
            block={block as SpacerBlock}
            onChange={(data) => onUpdate(block.id, data)}
          />
        )}
        {block.type === 'divider' && (
          <DividerBlockEditor
            block={block as DividerBlock}
            onChange={(data) => onUpdate(block.id, data)}
          />
        )}
        {block.type === 'hero-image' && (
          <HeroImageBlockEditor
            block={block as HeroImageBlock}
            onChange={(data) => onUpdate(block.id, data)}
          />
        )}
        {block.type === 'work-title' && (
          <WorkTitleBlockEditor
            block={block as WorkTitleBlock}
            onChange={(data) => onUpdate(block.id, data)}
          />
        )}
        {block.type === 'work-metadata' && (
          <WorkMetadataBlockEditor
            block={block as WorkMetadataBlock}
            onChange={(data) => onUpdate(block.id, data)}
          />
        )}
        {block.type === 'work-gallery' && (
          <WorkGalleryBlockEditor
            block={block as WorkGalleryBlock}
            onChange={(data) => onUpdate(block.id, data)}
          />
        )}
        {block.type === 'work-layout-config' && (
          <WorkLayoutConfigBlockEditor
            block={block as WorkLayoutConfigBlock}
            onChange={(data) => onUpdate(block.id, data)}
          />
        )}
        {block.type === 'layout-row' && (
          <LayoutRowBlockEditor
            block={block as LayoutRowBlock}
            onChange={(data) => onUpdate(block.id, data)}
          />
        )}
        {block.type === 'layout-grid' && (
          <LayoutGridBlockEditor
            block={block as LayoutGridBlock}
            onChange={(data) => onUpdate(block.id, data)}
          />
        )}
      </div>
    </div>
  );
});

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

  // Stable callback wrappers - prevent unnecessary SortableBlockItem re-renders
  // when parent re-renders with new function references
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
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Hidden shortcut help for screen readers */}
      <div id="block-shortcut-help" className="sr-only">
        Keyboard shortcuts: Cmd or Ctrl plus Delete to delete block, Cmd or Ctrl plus Arrow Up to move block up, Cmd or Ctrl plus Arrow Down to move block down. Drag handle available for mouse reordering.
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            role="list"
            aria-label="Content blocks"
            aria-describedby="block-shortcut-help"
            className="space-y-3"
          >
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
