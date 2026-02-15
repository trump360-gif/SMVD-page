'use client';

import React, { useState, useCallback, useRef } from 'react';
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
import {
  calculateLayout,
  distributeImages,
  LAYOUT_PRESETS,
  getLayoutFromPreset,
  type LayoutPreset,
  type LayoutConfig,
} from '@/lib/gallery-layout';

export interface GalleryImage {
  id: string;
  url: string;
}

interface GalleryLayoutEditorProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  layoutPreset?: LayoutPreset;
  onLayoutPresetChange?: (preset: LayoutPreset) => void;
}

// Sortable image item
function SortableImageItem({
  image,
  onRemove,
  onUrlChange,
}: {
  image: GalleryImage;
  onRemove: (id: string) => void;
  onUrlChange: (id: string, url: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

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
        {image.url ? (
          <img
            src={image.url}
            alt="Gallery"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
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
          title="Remove"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* URL input */}
      <div className="p-1.5">
        <input
          type="text"
          value={image.url}
          onChange={(e) => onUrlChange(image.id, e.target.value)}
          placeholder="/images/..."
          className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>
    </div>
  );
}

export default function GalleryLayoutEditor({
  images,
  onChange,
  layoutPreset = 'auto',
  onLayoutPresetChange,
}: GalleryLayoutEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Generate unique ID
  const generateId = useCallback(() => {
    return `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Add new image slot
  const handleAddImage = useCallback(() => {
    const newImage: GalleryImage = { id: generateId(), url: '' };
    onChange([...images, newImage]);
  }, [images, onChange, generateId]);

  // Add image by URL
  const handleAddImageUrl = useCallback(
    (url: string) => {
      const newImage: GalleryImage = { id: generateId(), url };
      onChange([...images, newImage]);
    },
    [images, onChange, generateId]
  );

  // Remove image
  const handleRemoveImage = useCallback(
    (id: string) => {
      onChange(images.filter((img) => img.id !== id));
    },
    [images, onChange]
  );

  // Update image URL
  const handleUrlChange = useCallback(
    (id: string, url: string) => {
      onChange(images.map((img) => (img.id === id ? { ...img, url } : img)));
    },
    [images, onChange]
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = images.findIndex((img) => img.id === active.id);
        const newIndex = images.findIndex((img) => img.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          onChange(arrayMove(images, oldIndex, newIndex));
        }
      }
    },
    [images, onChange]
  );

  // Bulk add from newline-separated text
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const handleBulkAdd = useCallback(() => {
    const urls = bulkText
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean);
    const newImages = urls.map((url) => ({ id: generateId(), url }));
    onChange([...images, ...newImages]);
    setBulkText('');
    setShowBulkAdd(false);
  }, [bulkText, images, onChange, generateId]);

  // Current layout
  const layout = getLayoutFromPreset(layoutPreset, images.length);
  const distributed = distributeImages(images.length, layout);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">
          Gallery Images ({images.length})
        </h4>
        <div className="flex items-center gap-2">
          {/* Layout preset selector */}
          <select
            value={layoutPreset}
            onChange={(e) =>
              onLayoutPresetChange?.(e.target.value as LayoutPreset)
            }
            className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
          >
            {LAYOUT_PRESETS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setShowBulkAdd(!showBulkAdd)}
            className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            Bulk Add
          </button>

          <button
            type="button"
            onClick={handleAddImage}
            className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Plus size={12} />
            Add
          </button>
        </div>
      </div>

      {/* Bulk add area */}
      {showBulkAdd && (
        <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
          <p className="text-xs text-blue-700 mb-2">
            Paste image paths (one per line):
          </p>
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={'/images/work/project/gallery-1.png\n/images/work/project/gallery-2.png'}
            rows={3}
            className="w-full px-2 py-1.5 text-xs border border-blue-200 rounded focus:ring-1 focus:ring-blue-500 outline-none font-mono"
          />
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={handleBulkAdd}
              className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add All
            </button>
            <button
              type="button"
              onClick={() => setShowBulkAdd(false)}
              className="text-xs px-3 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Layout preview */}
      {images.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
          <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider">
            Layout Preview
          </p>
          <div className="space-y-1">
            {distributed.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-1">
                {row.map((imgIdx) => {
                  const colWidth = layout[rowIdx]?.[row.indexOf(imgIdx)] || 100;
                  return (
                    <div
                      key={imgIdx}
                      className="bg-blue-100 rounded text-[10px] text-blue-600 flex items-center justify-center py-1"
                      style={{ width: `${colWidth}%` }}
                    >
                      {imgIdx + 1}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Draggable image grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((img) => img.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((image) => (
              <SortableImageItem
                key={image.id}
                image={image}
                onRemove={handleRemoveImage}
                onUrlChange={handleUrlChange}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Empty state */}
      {images.length === 0 && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
          onClick={handleAddImage}
        >
          <ImagePlus size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">Click to add gallery images</p>
          <p className="text-xs text-gray-400 mt-1">
            or use &quot;Bulk Add&quot; to add multiple at once
          </p>
        </div>
      )}
    </div>
  );
}
