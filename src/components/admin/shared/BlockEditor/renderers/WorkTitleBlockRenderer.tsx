'use client';

import React from 'react';
import type { WorkTitleBlock } from '../types';

interface WorkTitleBlockRendererProps {
  block: WorkTitleBlock;
}

/**
 * Renders a work title block matching WorkDetailPage layout.
 * Left column: Title (60px Satoshi bold) + Author + Email (14px).
 */
export default function WorkTitleBlockRenderer({ block }: WorkTitleBlockRendererProps) {
  if (!block.title) {
    return (
      <p style={{ color: '#999', fontSize: '14px', fontStyle: 'italic' }}>
        Empty title block
      </p>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        flex: '0 0 auto',
        minWidth: '400px',
      }}
    >
      <h1
        style={{
          fontSize: '60px',
          fontWeight: '700',
          color: '#1b1d1f',
          fontFamily: 'Satoshi, sans-serif',
          margin: '0',
          letterSpacing: '-0.6px',
          lineHeight: '1.2',
        }}
      >
        {block.title}
      </h1>
      {(block.author || block.email) && (
        <p
          style={{
            fontSize: '14px',
            fontWeight: '500',
            fontFamily: 'Pretendard, sans-serif',
            color: '#1b1d1f',
            margin: '0',
          }}
        >
          {block.author}
          {block.email && ' '}
          {block.email && (
            <span
              style={{
                fontWeight: '400',
                color: '#7b828e',
              }}
            >
              {block.email}
            </span>
          )}
        </p>
      )}
    </div>
  );
}
