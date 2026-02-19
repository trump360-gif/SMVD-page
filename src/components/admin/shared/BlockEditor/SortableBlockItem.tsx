'use client';

import React, { useState, memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Type } from 'lucide-react';
import type {
  Block,
  TextBlock,
  ImageBlock,
  HeadingBlock,
  GalleryBlock,
  SpacerBlock,
  DividerBlock,
  HeroImageBlock,
  HeroSectionBlock,
  WorkTitleBlock,
  WorkMetadataBlock,
  WorkLayoutConfigBlock,
  LayoutRowBlock,
  LayoutGridBlock,
  ImageRowBlock,
  ImageGridBlock,
} from './types';
import { BLOCK_META } from './BlockMeta';
import TextBlockEditor from './blocks/TextBlockEditor';
import ImageBlockEditor from './blocks/ImageBlockEditor';
import HeadingBlockEditor from './blocks/HeadingBlockEditor';
import GalleryBlockEditor from './blocks/GalleryBlockEditor';
import SpacerBlockEditor from './blocks/SpacerBlockEditor';
import DividerBlockEditor from './blocks/DividerBlockEditor';
import HeroImageBlockEditor from './blocks/HeroImageBlockEditor';
import HeroSectionBlockEditor from './blocks/HeroSectionBlockEditor';
import WorkTitleBlockEditor from './blocks/WorkTitleBlockEditor';
import WorkMetadataBlockEditor from './blocks/WorkMetadataBlockEditor';
import WorkLayoutConfigBlockEditor from './blocks/WorkLayoutConfigBlockEditor';
import LayoutRowBlockEditor from './blocks/LayoutRowBlockEditor';
import LayoutGridBlockEditor from './blocks/LayoutGridBlockEditor';
import ImageRowBlockEditor from './blocks/ImageRowBlockEditor';
import ImageGridBlockEditor from './blocks/ImageGridBlockEditor';

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
            aria-label={`${blockLabel} 블록 순서 변경을 위해 드래그하세요`}
            className="p-0.5 cursor-grab active:cursor-grabbing hover:bg-gray-200 rounded transition-colors opacity-60 group-hover:opacity-100"
            title="드래그하여 순서 변경"
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
            <span className="text-xs text-red-500 mr-1">삭제할까요?</span>
          )}
          <button
            type="button"
            aria-label={
              showDeleteConfirm
                ? `${blockLabel} 블록 삭제 확인`
                : `${blockLabel} 블록 삭제`
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
            title={showDeleteConfirm ? '삭제 확인' : '블록 삭제'}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Block content editor */}
      <div className="p-3">
        {block.type === 'text' && (
          <TextBlockEditor block={block as TextBlock} onChange={(data) => onUpdate(block.id, data)} />
        )}
        {block.type === 'heading' && (
          <HeadingBlockEditor block={block as HeadingBlock} onChange={(data) => onUpdate(block.id, data)} />
        )}
        {block.type === 'image' && (
          <ImageBlockEditor block={block as ImageBlock} onChange={(data) => onUpdate(block.id, data)} />
        )}
        {block.type === 'gallery' && (
          <GalleryBlockEditor block={block as GalleryBlock} onChange={(data) => onUpdate(block.id, data)} />
        )}
        {block.type === 'spacer' && (
          <SpacerBlockEditor block={block as SpacerBlock} onChange={(data) => onUpdate(block.id, data)} />
        )}
        {block.type === 'divider' && (
          <DividerBlockEditor block={block as DividerBlock} onChange={(data) => onUpdate(block.id, data)} />
        )}
        {block.type === 'hero-image' && (
          <HeroImageBlockEditor block={block as HeroImageBlock} onChange={(data) => onUpdate(block.id, data)} />
        )}
        {block.type === 'hero-section' && (
          <HeroSectionBlockEditor block={block as HeroSectionBlock} onChange={(data) => onUpdate(block.id, data)} />
        )}
        {block.type === 'work-title' && (
          <WorkTitleBlockEditor block={block as WorkTitleBlock} onChange={(data) => onUpdate(block.id, data)} />
        )}
        {block.type === 'work-metadata' && (
          <WorkMetadataBlockEditor block={block as WorkMetadataBlock} onChange={(data) => onUpdate(block.id, data)} />
        )}
        {block.type === 'work-layout-config' && (
          <WorkLayoutConfigBlockEditor block={block as WorkLayoutConfigBlock} onChange={(data) => onUpdate(block.id, data)} />
        )}
        {block.type === 'layout-row' && (
          <LayoutRowBlockEditor block={block as LayoutRowBlock} onChange={(data) => onUpdate(block.id, data)} />
        )}
        {block.type === 'layout-grid' && (
          <LayoutGridBlockEditor block={block as LayoutGridBlock} onChange={(data) => onUpdate(block.id, data)} />
        )}
        {block.type === 'image-row' && (
          <ImageRowBlockEditor block={block as ImageRowBlock} onChange={(data) => onUpdate(block.id, data)} onRemove={() => onDelete(block.id)} />
        )}
        {block.type === 'image-grid' && (
          <ImageGridBlockEditor block={block as ImageGridBlock} onChange={(data) => onUpdate(block.id, data)} onRemove={() => onDelete(block.id)} />
        )}
      </div>
    </div>
  );
});

export default SortableBlockItem;
