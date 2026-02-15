'use client';

import React, { useState } from 'react';
import type { GalleryBlock, GalleryImageEntry } from '../types';
import {
  calculateLayout,
  distributeImages,
  getLayoutFromPreset,
} from '@/lib/gallery-layout';

interface GalleryBlockRendererProps {
  block: GalleryBlock;
}

/**
 * Single gallery image with error handling.
 */
function GalleryImage({ image }: { image: GalleryImageEntry }) {
  const [error, setError] = useState(false);

  if (!image.url || error) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-100 rounded text-gray-400 text-sm">
        {error ? 'Image failed to load' : 'No URL'}
      </div>
    );
  }

  return (
    <img
      src={image.url}
      alt={image.alt || ''}
      className="w-full h-full object-cover rounded"
      onError={() => setError(true)}
    />
  );
}

/**
 * Renders a gallery block with layout options.
 * - '1+2+3': First row 1 image, second row 2, third row 3 (fixed layout)
 * - 'grid': CSS Grid auto-fill
 * - 'auto': Uses calculateLayout() algorithm from gallery-layout
 */
export default function GalleryBlockRenderer({ block }: GalleryBlockRendererProps) {
  if (block.images.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-100 rounded text-gray-400 text-sm">
        Empty gallery
      </div>
    );
  }

  const layout = block.layout ?? 'auto';

  // Grid layout - simple CSS grid
  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {block.images.map((image) => (
          <div key={image.id} className="aspect-video overflow-hidden rounded">
            <GalleryImage image={image} />
          </div>
        ))}
      </div>
    );
  }

  // 1+2+3 and auto layouts - use gallery-layout utility
  const presetKey = layout === '1+2+3' ? '1+2+3' : 'auto';
  const layoutConfig = getLayoutFromPreset(presetKey, block.images.length);
  const distributed = distributeImages(block.images.length, layoutConfig);

  return (
    <div className="space-y-4">
      {distributed.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-4">
          {row.map((imgIdx) => {
            const image = block.images[imgIdx];
            if (!image) return null;
            const colWidth = layoutConfig[rowIdx]?.[row.indexOf(imgIdx)] ?? 100;
            return (
              <div
                key={image.id}
                className="overflow-hidden rounded"
                style={{ width: `${colWidth}%`, aspectRatio: '16/9' }}
              >
                <GalleryImage image={image} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
