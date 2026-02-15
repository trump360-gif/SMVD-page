'use client';

import React from 'react';
import type { WorkMetadataBlock } from '../types';

interface WorkMetadataBlockRendererProps {
  block: WorkMetadataBlock;
}

/**
 * Renders a work metadata block (author + email) matching WorkDetailPage.
 */
export default function WorkMetadataBlockRenderer({ block }: WorkMetadataBlockRendererProps) {
  if (!block.author && !block.email) {
    return (
      <p style={{ color: '#999', fontSize: '14px', fontStyle: 'italic' }}>
        Empty metadata block
      </p>
    );
  }

  return (
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
      {block.email && (
        <span
          style={{
            fontWeight: '400',
            color: '#7b828e',
            marginLeft: '16px',
          }}
        >
          {block.email}
        </span>
      )}
    </p>
  );
}
