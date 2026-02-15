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

  const titleFontSize = block.titleFontSize ?? 60;
  const authorFontSize = block.authorFontSize ?? 14;
  const gap = block.gap ?? 24;
  const titleFontWeight = block.titleFontWeight ?? '700';
  const authorFontWeight = block.authorFontWeight ?? '500';
  const emailFontWeight = block.emailFontWeight ?? '400';
  const titleColor = block.titleColor ?? '#1b1d1f';
  const authorColor = block.authorColor ?? '#1b1d1f';
  const emailColor = block.emailColor ?? '#7b828e';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${gap}px`,
        flex: '0 0 auto',
        minWidth: '400px',
      }}
    >
      <h1
        style={{
          fontSize: `${titleFontSize}px`,
          fontWeight: titleFontWeight,
          color: titleColor,
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
            fontSize: `${authorFontSize}px`,
            fontWeight: authorFontWeight,
            fontFamily: 'Pretendard, sans-serif',
            color: authorColor,
            margin: '0',
          }}
        >
          {block.author}
          {block.email && ' '}
          {block.email && (
            <span
              style={{
                fontWeight: emailFontWeight,
                color: emailColor,
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
