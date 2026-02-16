'use client';

import React, { useState } from 'react';
import { ImageIcon, AlertCircle } from 'lucide-react';
import ImageUploadField from '../../ImageUploadField';
import type { ImageBlock } from '../types';

interface ImageBlockEditorProps {
  block: ImageBlock;
  onChange: (data: Partial<ImageBlock>) => void;
}

const SIZE_OPTIONS: { value: ImageBlock['size']; label: string }[] = [
  { value: 'small', label: 'Small (25%)' },
  { value: 'medium', label: 'Medium (50%)' },
  { value: 'large', label: 'Large (75%)' },
  { value: 'full', label: 'Full (100%)' },
];

const ALIGN_OPTIONS: { value: ImageBlock['align']; label: string }[] = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

/**
 * Image block editor with URL input, alt/caption fields,
 * size/alignment controls, and a thumbnail preview.
 */
export default function ImageBlockEditor({ block, onChange }: ImageBlockEditorProps) {
  const [imgError, setImgError] = useState(false);
  const [showUploadMode, setShowUploadMode] = useState(!block.url);

  const handleUrlChange = (url: string | null) => {
    setImgError(false);
    if (url) {
      onChange({ url });
      setShowUploadMode(false);
    }
  };

  const handleToggleUploadMode = () => {
    setShowUploadMode(!showUploadMode);
  };

  return (
    <div className="space-y-3">
      {/* Thumbnail preview */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
        {block.url && !imgError ? (
          <div className="flex justify-center p-2">
            <img
              src={block.url}
              alt={block.alt || 'Preview'}
              className="max-h-48 max-w-full rounded object-contain"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            {imgError ? (
              <>
                <AlertCircle size={28} className="text-red-400 mb-1" />
                <p className="text-xs text-red-500">Failed to load image</p>
              </>
            ) : (
              <>
                <ImageIcon size={28} className="mb-1" />
                <p className="text-xs">Enter an image URL below</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Image source: upload or URL */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-medium text-gray-600">
            Image Source
          </label>
          <button
            type="button"
            onClick={handleToggleUploadMode}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {showUploadMode ? 'Paste URL' : 'Upload'}
          </button>
        </div>

        {showUploadMode ? (
          <ImageUploadField
            imageUrl={null}
            onImageChange={handleUrlChange}
            label=""
          />
        ) : (
          <input
            type="text"
            value={block.url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="/images/blog/..."
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        )}
      </div>

      {/* Alt text */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Alt Text
        </label>
        <input
          type="text"
          value={block.alt}
          onChange={(e) => onChange({ alt: e.target.value })}
          placeholder="Describe the image for accessibility..."
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Caption */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Caption
        </label>
        <input
          type="text"
          value={block.caption}
          onChange={(e) => onChange({ caption: e.target.value })}
          placeholder="Optional caption text..."
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Size + Align row */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Size
          </label>
          <select
            value={block.size}
            onChange={(e) => onChange({ size: e.target.value as ImageBlock['size'] })}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          >
            {SIZE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Align
          </label>
          <select
            value={block.align}
            onChange={(e) => onChange({ align: e.target.value as ImageBlock['align'] })}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          >
            {ALIGN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
