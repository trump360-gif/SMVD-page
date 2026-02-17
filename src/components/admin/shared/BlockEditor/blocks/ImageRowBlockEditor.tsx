'use client';

import React, { useState } from 'react';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import type { ImageRowBlock, ImageData } from '../types';

interface ImageRowBlockEditorProps {
  block: ImageRowBlock;
  onChange: (block: ImageRowBlock) => void;
  onRemove: () => void;
}

export default function ImageRowBlockEditor({
  block,
  onChange,
  onRemove,
}: ImageRowBlockEditorProps) {
  const [localBlock, setLocalBlock] = useState(block);

  const handleAddImage = () => {
    if (localBlock.images.length >= 3) return; // Max 3 images
    const newImage: ImageData = {
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: '',
      alt: '',
    };
    const updated = { ...localBlock, images: [...localBlock.images, newImage] };
    setLocalBlock(updated);
    onChange(updated);
  };

  const handleRemoveImage = (imageId: string) => {
    const updated = {
      ...localBlock,
      images: localBlock.images.filter((img) => img.id !== imageId),
    };
    setLocalBlock(updated);
    onChange(updated);
  };

  const handleUpdateImage = (imageId: string, field: keyof ImageData, value: string) => {
    const updated = {
      ...localBlock,
      images: localBlock.images.map((img) =>
        img.id === imageId ? { ...img, [field]: value } : img
      ),
    };
    setLocalBlock(updated);
    onChange(updated);
  };

  const handleDistributionChange = (distribution: 'equal' | 'golden-left' | 'golden-center' | 'golden-right') => {
    const updated = { ...localBlock, distribution };
    setLocalBlock(updated);
    onChange(updated);
  };

  const handleHeightChange = (height: number) => {
    const updated = { ...localBlock, imageHeight: height };
    setLocalBlock(updated);
    onChange(updated);
  };

  const handleGapChange = (gap: number) => {
    const updated = { ...localBlock, gap };
    setLocalBlock(updated);
    onChange(updated);
  };

  return (
    <div className="p-3 bg-gray-50 rounded border border-gray-200 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">
          Image Row ({localBlock.images.length}/3)
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
          title="Remove block"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Settings Panel */}
      <div className="bg-white p-2 rounded border border-gray-200 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Distribution */}
          <div>
            <label className="text-xs font-medium text-gray-600">Distribution</label>
            <select
              value={localBlock.distribution ?? 'equal'}
              onChange={(e) => handleDistributionChange(e.target.value as 'equal' | 'golden-left' | 'golden-center' | 'golden-right')}
              className="w-full text-xs px-2 py-1 border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:border-blue-400"
            >
              <option value="equal">Equal (1:1:1)</option>
              <option value="golden-left">Golden Left (1.618:1:1)</option>
              <option value="golden-center">Golden Center (1:1.618:1)</option>
              <option value="golden-right">Golden Right (1:1:1.618)</option>
            </select>
          </div>

          {/* Height */}
          <div>
            <label className="text-xs font-medium text-gray-600">Height (px)</label>
            <input
              type="number"
              min="100"
              max="600"
              value={localBlock.imageHeight ?? 300}
              onChange={(e) => handleHeightChange(parseInt(e.target.value))}
              className="w-full text-xs px-2 py-1 border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Gap */}
          <div>
            <label className="text-xs font-medium text-gray-600">Gap (px)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={localBlock.gap ?? 24}
              onChange={(e) => handleGapChange(parseInt(e.target.value))}
              className="w-full text-xs px-2 py-1 border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Images List */}
      <div className="space-y-2">
        {localBlock.images.map((img, idx) => (
          <div key={img.id} className="bg-white p-2 rounded border border-gray-200">
            {/* Image Header */}
            <div className="flex items-center gap-1 mb-2">
              <GripVertical size={14} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-600">Image {idx + 1}</span>
              <button
                type="button"
                onClick={() => handleRemoveImage(img.id)}
                className="ml-auto p-1 text-gray-400 hover:text-red-600 rounded"
              >
                <Trash2 size={12} />
              </button>
            </div>

            {/* URL Input */}
            <input
              type="text"
              placeholder="Image URL"
              value={img.url}
              onChange={(e) => handleUpdateImage(img.id, 'url', e.target.value)}
              className="w-full text-xs px-2 py-1 mb-1 border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:border-blue-400"
            />

            {/* Alt Text Input */}
            <input
              type="text"
              placeholder="Alt text (optional)"
              value={img.alt || ''}
              onChange={(e) => handleUpdateImage(img.id, 'alt', e.target.value)}
              className="w-full text-xs px-2 py-1 border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:border-blue-400"
            />

            {/* Image Preview */}
            {img.url && (
              <div className="mt-1 h-16 bg-gray-100 rounded overflow-hidden">
                <img
                  src={img.url}
                  alt={img.alt || 'Preview'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Image Button */}
      {localBlock.images.length < 3 && (
        <button
          type="button"
          onClick={handleAddImage}
          className="w-full flex items-center justify-center gap-1 px-2 py-1 text-xs text-gray-600 border border-dashed border-gray-300 rounded hover:bg-gray-100 hover:border-gray-400 transition-colors"
        >
          <Plus size={14} />
          Add Image
        </button>
      )}
    </div>
  );
}
