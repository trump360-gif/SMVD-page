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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus, ImagePlus } from 'lucide-react';
import type { WorkGalleryBlock, GalleryImageEntry } from '../types';
import { generateBlockId } from '../types';

// ---------------------------------------------------------------------------
// SortableWorkGalleryImage - individual draggable image row
// ---------------------------------------------------------------------------

interface SortableImageRowProps {
  image: GalleryImageEntry;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, data: Partial<GalleryImageEntry>) => void;
}

function SortableImageRow({ image, index, onRemove, onUpdate }: SortableImageRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const [imgError, setImgError] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center gap-3 border border-gray-200 rounded-lg p-2 bg-white hover:border-blue-300 transition-colors"
    >
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="p-1 cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded transition-colors shrink-0"
        title="Drag to reorder"
      >
        <GripVertical size={14} className="text-gray-400" />
      </button>

      {/* Thumbnail */}
      <div className="w-16 h-10 bg-gray-100 rounded overflow-hidden shrink-0 flex items-center justify-center">
        {image.url && !imgError ? (
          <img
            src={image.url}
            alt={image.alt || `Gallery ${index + 1}`}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <ImagePlus size={14} className="text-gray-300" />
        )}
      </div>

      {/* Index */}
      <span className="text-xs text-gray-400 shrink-0 w-6 text-center">{index + 1}</span>

      {/* URL input */}
      <input
        type="text"
        value={image.url}
        onChange={(e) => {
          setImgError(false);
          onUpdate(image.id, { url: e.target.value });
        }}
        placeholder="Image URL (/images/...)"
        className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
      />

      {/* Delete */}
      <button
        type="button"
        onClick={() => onRemove(image.id)}
        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors shrink-0 opacity-60 group-hover:opacity-100"
        title="Remove image"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WorkGalleryBlockEditor
// ---------------------------------------------------------------------------

interface WorkGalleryBlockEditorProps {
  block: WorkGalleryBlock;
  onChange: (data: Partial<WorkGalleryBlock>) => void;
}

/**
 * Work gallery block editor with vertical stacking layout.
 * Images are displayed full-width with -1px margin overlap, matching
 * the WorkDetailPage gallery section exactly.
 */
export default function WorkGalleryBlockEditor({ block, onChange }: WorkGalleryBlockEditorProps) {
  const [urlInput, setUrlInput] = useState('');
  const imageLayout = block.imageLayout ?? 1;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddBlank = useCallback(() => {
    const newImage: GalleryImageEntry = { id: generateBlockId(), url: '' };
    onChange({ images: [...block.images, newImage] });
  }, [block.images, onChange]);

  const handleAddByUrl = useCallback(() => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    const newImage: GalleryImageEntry = { id: generateBlockId(), url: trimmed };
    onChange({ images: [...block.images, newImage] });
    setUrlInput('');
  }, [urlInput, block.images, onChange]);

  const handleRemove = useCallback(
    (id: string) => {
      onChange({ images: block.images.filter((img) => img.id !== id) });
    },
    [block.images, onChange]
  );

  const handleUpdateImage = useCallback(
    (id: string, data: Partial<GalleryImageEntry>) => {
      onChange({
        images: block.images.map((img) =>
          img.id === id ? { ...img, ...data } : img
        ),
      });
    },
    [block.images, onChange]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = block.images.findIndex((img) => img.id === active.id);
        const newIndex = block.images.findIndex((img) => img.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          onChange({ images: arrayMove(block.images, oldIndex, newIndex) });
        }
      }
    },
    [block.images, onChange]
  );

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {block.images.length} image{block.images.length !== 1 ? 's' : ''} (vertical stack, full-width)
        </p>
        <button
          type="button"
          onClick={handleAddBlank}
          className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={12} />
          Add Image
        </button>
      </div>

      {/* Image layout selector */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Image Column Layout
        </label>
        <div className="flex gap-2">
          {[1, 2, 3].map((cols) => (
            <button
              key={cols}
              type="button"
              onClick={() => onChange({ imageLayout: cols as 1 | 2 | 3 })}
              className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                imageLayout === cols
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cols} Col{cols !== 1 ? 's' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* URL quick-add */}
      <div className="flex gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddByUrl();
            }
          }}
          placeholder="Paste image URL and press Enter..."
          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <button
          type="button"
          onClick={handleAddByUrl}
          disabled={!urlInput.trim()}
          className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Add
        </button>
      </div>

      {/* Sortable image list */}
      {block.images.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={block.images.map((img) => img.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {block.images.map((image, index) => (
                <SortableImageRow
                  key={image.id}
                  image={image}
                  index={index}
                  onRemove={handleRemove}
                  onUpdate={handleUpdateImage}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
          onClick={handleAddBlank}
        >
          <ImagePlus size={28} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">Click to add gallery images</p>
          <p className="text-xs text-gray-400 mt-1">Images are stacked vertically, full-width</p>
        </div>
      )}
    </div>
  );
}
