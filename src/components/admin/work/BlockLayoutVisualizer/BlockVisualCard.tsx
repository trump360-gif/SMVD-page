'use client';

import React, { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DraggableAttributes } from '@dnd-kit/core';
import type { DraggableSyntheticListeners } from '@dnd-kit/core/dist/hooks/useDraggable';
import { GripVertical, Eye, Type, Trash2 } from 'lucide-react';
import type { Block } from '@/components/admin/shared/BlockEditor/types';
import { BLOCK_META, getBlockPreviewText } from './block-meta';

// ---------------------------------------------------------------------------
// BlockVisualCard (base component with drag props)
// ---------------------------------------------------------------------------

export const BlockVisualCard = memo(function BlockVisualCard({
  block,
  isSelected,
  onSelect,
  isDragging,
  attributes,
  listeners,
  setNodeRef,
  transform,
  transition,
  onDelete,
  onPreview,
}: {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  isDragging: boolean;
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
  setNodeRef: (node: HTMLElement | null) => void;
  transform: { x: number; y: number; scaleX: number; scaleY: number } | null;
  transition: string | undefined;
  onDelete?: () => void;
  onPreview?: () => void;
}) {
  const meta = BLOCK_META[block.type] || {
    label: block.type,
    Icon: Type,
    color: 'text-gray-600',
  };
  const BlockIcon = meta.Icon;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 10 : 1,
      }}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      role="listitem"
      tabIndex={0}
      aria-selected={isSelected}
      className={`
        group relative border rounded-md p-2 cursor-pointer transition-all duration-150
        ${
          isSelected
            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200 shadow-sm'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm hover:bg-gray-50'
        }
      `}
    >
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-0.5 cursor-grab active:cursor-grabbing hover:bg-gray-200 rounded transition-colors opacity-30 group-hover:opacity-100 shrink-0"
          title="Drag to reorder"
        >
          <GripVertical size={10} className="text-gray-400" />
        </button>
        <BlockIcon size={10} className={`${meta.color} shrink-0`} />
        <span className="text-[10px] font-medium text-gray-600 truncate flex-1 min-w-0">
          {meta.label}
        </span>
        {onPreview && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
            className="p-0.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors opacity-0 group-hover:opacity-100 shrink-0"
            title="미리보기"
          >
            <Eye size={10} />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-0.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100 shrink-0"
            title="블록 삭제"
          >
            <Trash2 size={10} />
          </button>
        )}
      </div>
      <p className="text-[9px] text-gray-400 truncate mt-0.5 pl-5 leading-tight">
        {getBlockPreviewText(block)}
      </p>
    </div>
  );
});

// ---------------------------------------------------------------------------
// SortableBlockVisualCard (wraps BlockVisualCard with dnd-kit sortable)
// ---------------------------------------------------------------------------

export const SortableBlockVisualCard = memo(function SortableBlockVisualCard({
  block,
  isSelected,
  onSelect,
  onDelete,
  onPreview,
}: {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  return (
    <BlockVisualCard
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      isDragging={isDragging}
      attributes={attributes}
      listeners={listeners}
      setNodeRef={setNodeRef}
      transform={transform}
      transition={transition}
      onDelete={onDelete}
      onPreview={onPreview}
    />
  );
});
