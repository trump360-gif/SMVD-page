'use client';

import React, { useState } from 'react';
import type { WorkGalleryBlock, GalleryImageEntry } from '../types';

interface WorkGalleryBlockRendererProps {
  block: WorkGalleryBlock;
}

function WorkGalleryImage({ image, index, title }: { image: GalleryImageEntry; index: number; title?: string }) {
  const [error, setError] = useState(false);

  if (!image.url || error) {
    return (
      <div
        style={{
          width: '100%',
          height: '200px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: index > 0 ? '-1px 0 0 0' : '0',
        }}
      >
        <span style={{ color: '#999', fontSize: '14px' }}>
          {error ? 'Image failed to load' : 'No URL'}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#f0f0f0',
        borderRadius: '0px',
        overflow: 'hidden',
        lineHeight: '0',
        margin: index > 0 ? '-1px 0 0 0' : '0',
        padding: '0',
        fontSize: '0',
      }}
    >
      <img
        src={image.url}
        alt={image.alt || `${title || 'Gallery'} ${index + 1}`}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          margin: '0',
          padding: '0',
        }}
        onError={() => setError(true)}
      />
    </div>
  );
}

/**
 * Renders a work gallery block matching WorkDetailPage layout.
 * Vertical stack, images 100% width, -1px margin overlap.
 */
export default function WorkGalleryBlockRenderer({ block }: WorkGalleryBlockRendererProps) {
  if (block.images.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '128px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          color: '#999',
          fontSize: '14px',
        }}
      >
        Empty gallery
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        width: '100%',
      }}
    >
      {block.images.map((image, index) => (
        <WorkGalleryImage
          key={image.id}
          image={image}
          index={index}
        />
      ))}
    </div>
  );
}
