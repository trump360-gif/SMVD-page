'use client';

import React, { useState } from 'react';
import { ImageIcon, AlertCircle } from 'lucide-react';
import ImageUploadField from '../../ImageUploadField';
import type { HeroImageBlock } from '../types';

interface HeroImageBlockEditorProps {
  block: HeroImageBlock;
  onChange: (data: Partial<HeroImageBlock>) => void;
}

/**
 * Hero image block editor for Work detail pages.
 * Displays a full-width image with fixed 860px height.
 */
export default function HeroImageBlockEditor({ block, onChange }: HeroImageBlockEditorProps) {
  const [imgError, setImgError] = useState(false);
  const [showUploadMode, setShowUploadMode] = useState(!block.url);

  const handleImageUpload = (url: string | null) => {
    if (url) {
      setImgError(false);
      onChange({ url });
      setShowUploadMode(false);
    }
  };

  const handleToggleUploadMode = () => {
    setShowUploadMode(!showUploadMode);
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
        {block.url && !imgError ? (
          <div
            className="relative w-full overflow-hidden"
            style={{ height: '200px' }}
          >
            <img
              src={block.url}
              alt={block.alt || 'Hero image'}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">
              860px height (scaled)
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            {imgError ? (
              <>
                <AlertCircle size={28} className="text-red-400 mb-1" />
                <p className="text-xs text-red-500">Failed to load image</p>
              </>
            ) : (
              <>
                <ImageIcon size={28} className="mb-1" />
                <p className="text-xs">Full-width hero image (860px height)</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Image source: upload or URL */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-medium text-gray-600">
            Hero Image
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
            onImageChange={handleImageUpload}
            label=""
          />
        ) : (
          <input
            type="text"
            value={block.url}
            onChange={(e) => {
              setImgError(false);
              onChange({ url: e.target.value });
            }}
            placeholder="/images/work/project/hero.png"
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
          placeholder="Project hero image description..."
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>
    </div>
  );
}
