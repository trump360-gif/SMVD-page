'use client';

import React, { useState } from 'react';
import type { HeroImageBlock } from '../types';

interface HeroImageBlockRendererProps {
  block: HeroImageBlock;
}

/**
 * Renders a hero image block matching WorkDetailPage layout.
 * Full width, 860px fixed height, object-fit: cover.
 */
export default function HeroImageBlockRenderer({ block }: HeroImageBlockRendererProps) {
  const [error, setError] = useState(false);

  if (!block.url || error) {
    return (
      <div
        style={{
          width: '100%',
          height: '860px',
          backgroundColor: '#d9d9d9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: '#999', fontSize: '14px' }}>
          {error ? 'Image failed to load' : 'No hero image URL'}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '860px',
        backgroundColor: '#d9d9d9',
        borderRadius: '0px',
        overflow: 'hidden',
      }}
    >
      <img
        src={block.url}
        alt={block.alt || ''}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        onError={() => setError(true)}
      />
    </div>
  );
}
