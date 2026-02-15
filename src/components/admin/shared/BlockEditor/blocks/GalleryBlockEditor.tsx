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
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus, ImagePlus } from 'lucide-react';
import type { GalleryBlock, GalleryImageEntry } from '../types';
import { generateBlockId } from '../types';

// ---------------------------------------------------------------------------
// SortableGalleryImage - individual draggable image card
// ---------------------------------------------------------------------------

interface SortableGalleryImageProps {
  image: GalleryImageEntry;
  onRemove: (id: string) => void;
  onUpdate: (id: string, data: Partial<GalleryImageEntry>) => void;
}

function SortableGalleryImage({ image, onRemove, onUpdate }: SortableGalleryImageProps) {
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
      className="group relative border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-blue-300 transition-colors"
    >
      {/* Image preview */}
      <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
        {image.url && !imgError ? (
          <img
            src={image.url}
            alt={image.alt || 'Gallery image'}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <ImagePlus size={24} className="text-gray-300" />
        )}
      </div>

      {/* Controls overlay */}
      <div className="absolute top-1 left-1 right-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-1 bg-white/90 rounded shadow-sm cursor-grab active:cursor-grabbing hover:bg-white"
          title="Drag to reorder"
        >
          <GripVertical size={14} className="text-gray-500" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(image.id)}
          className="p-1 bg-red-500/90 rounded shadow-sm hover:bg-red-600 text-white"
          title="Remove image"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Input fields */}
      <div className="p-1.5 space-y-1">
        <input
          type="text"
          value={image.url}
          onChange={(e) => {
            setImgError(false);
            onUpdate(image.id, { url: e.target.value });
          }}
          placeholder="Image URL (/images/...)"
          className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <input
          type="text"
          value={image.alt ?? ''}
          onChange={(e) => onUpdate(image.id, { alt: e.target.value })}
          placeholder="Alt text (optional)"
          className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// GalleryBlockEditor
// ---------------------------------------------------------------------------

interface GalleryBlockEditorProps {
  block: GalleryBlock;
  onChange: (data: Partial<GalleryBlock>) => void;
}

const LAYOUT_OPTIONS: { value: NonNullable<GalleryBlock['layout']>; label: string }[] = [
  { value: 'auto', label: 'Auto Layout' },
  { value: 'grid', label: 'Grid' },
  { value: '1+2+3', label: '1 + 2 + 3' },
];

/**
 * Gallery block editor with DnD-sortable images and layout selection.
 * Supports adding, removing, reordering, and editing gallery images.
 */
export default function GalleryBlockEditor({ block, onChange }: GalleryBlockEditorProps) {
  const [urlInput, setUrlInput] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const generateImageId = useCallback(() => {
    return `gimg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Add a new blank image slot
  const handleAddBlank = useCallback(() => {
    const newImage: GalleryImageEntry = { id: generateImageId(), url: '' };
    onChange({ images: [...block.images, newImage] });
  }, [block.images, onChange, generateImageId]);

  // Add image by URL
  const handleAddByUrl = useCallback(() => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    const newImage: GalleryImageEntry = { id: generateImageId(), url: trimmed };
    onChange({ images: [...block.images, newImage] });
    setUrlInput('');
  }, [urlInput, block.images, onChange, generateImageId]);

  // Remove an image
  const handleRemove = useCallback(
    (id: string) => {
      onChange({ images: block.images.filter((img) => img.id !== id) });
    },
    [block.images, onChange]
  );

  // Update an image's fields
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

  // Handle drag end
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
      {/* Layout selector + Add button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Layout
          </label>
          <select
            value={block.layout ?? 'auto'}
            onChange={(e) => onChange({ layout: e.target.value as GalleryBlock['layout'] })}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          >
            {LAYOUT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-1">
          <button
            type="button"
            onClick={handleAddBlank}
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mt-5"
          >
            <Plus size={12} />
            Add Image
          </button>
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

      {/* Image count */}
      <p className="text-xs text-gray-500">
        {block.images.length} image{block.images.length !== 1 ? 's' : ''}
      </p>

      {/* Draggable image grid */}
      {block.images.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={block.images.map((img) => img.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {block.images.map((image) => (
                <SortableGalleryImage
                  key={image.id}
                  image={image}
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
        </div>
      )}
    </div>
  );
}
