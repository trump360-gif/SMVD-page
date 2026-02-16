'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import type { HeroSectionBlock } from '../types';

interface HeroSectionBlockRendererProps {
  block: HeroSectionBlock;
}

/**
 * Hero section block renderer for Work detail pages.
 * Displays a full-width image (860px) with text overlay.
 */
export default function HeroSectionBlockRenderer({ block }: HeroSectionBlockRendererProps) {
  const [imgError, setImgError] = useState(false);

  const titleFontSize = block.titleFontSize ?? 60;
  const authorFontSize = block.authorFontSize ?? 14;
  const gap = block.gap ?? 24;
  const titleFontWeight = block.titleFontWeight ?? '700';
  const authorFontWeight = block.authorFontWeight ?? '500';
  const emailFontWeight = block.emailFontWeight ?? '400';
  const titleColor = block.titleColor ?? '#1b1d1f';
  const authorColor = block.authorColor ?? '#1b1d1f';
  const emailColor = block.emailColor ?? '#7b828e';
  const overlayPosition = block.overlayPosition ?? 'bottom-left';
  const overlayOpacity = block.overlayOpacity ?? 0.8;
  const overlayBackground = block.overlayBackground ?? 'rgba(0, 0, 0, 0.3)';

  const getOverlayClasses = () => {
    const baseClasses = 'absolute text-white p-6 rounded';
    switch (overlayPosition) {
      case 'bottom-left':
        return `${baseClasses} bottom-0 left-0`;
      case 'bottom-right':
        return `${baseClasses} bottom-0 right-0`;
      case 'center':
        return `${baseClasses} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center`;
      case 'none':
        return '';
      default:
        return `${baseClasses} bottom-0 left-0`;
    }
  };

  if (overlayPosition === 'none' && imgError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-100 rounded text-gray-400">
        <AlertCircle size={32} className="text-red-400 mb-2" />
        <p className="text-sm text-red-500">Failed to load image</p>
      </div>
    );
  }

  if (!block.url) {
    return (
      <div className="flex items-center justify-center h-[860px] bg-gray-100 rounded text-gray-400 text-sm">
        No image URL
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg"
      style={{ height: '860px' }}
    >
      {/* Hero Image */}
      <img
        src={block.url}
        alt={block.alt || 'Hero image'}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />

      {/* Text Overlay */}
      {overlayPosition !== 'none' && !imgError && (
        <div
          className={getOverlayClasses()}
          style={{
            backgroundColor: overlayBackground,
            maxWidth: overlayPosition === 'center' ? '70%' : '80%',
          }}
        >
          {/* Title */}
          {block.title && (
            <h1
              style={{
                fontSize: `${titleFontSize}px`,
                fontWeight: titleFontWeight,
                color: titleColor,
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              {block.title}
            </h1>
          )}

          {/* Author and Email */}
          {(block.author || block.email) && (
            <div style={{ marginTop: `${gap}px` }}>
              {block.author && (
                <p
                  style={{
                    fontSize: `${authorFontSize}px`,
                    fontWeight: authorFontWeight,
                    color: authorColor,
                  }}
                >
                  {block.author}
                </p>
              )}
              {block.email && (
                <p
                  style={{
                    fontSize: `${authorFontSize}px`,
                    fontWeight: emailFontWeight,
                    color: emailColor,
                    marginTop: block.author ? '0.25rem' : '0',
                  }}
                >
                  {block.email}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Fallback text when no overlay */}
      {overlayPosition === 'none' && !imgError && (block.title || block.author) && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
          {block.title && (
            <h1
              style={{
                fontSize: `${titleFontSize}px`,
                fontWeight: titleFontWeight,
                color: titleColor,
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              {block.title}
            </h1>
          )}
          {(block.author || block.email) && (
            <div style={{ marginTop: `${gap}px` }}>
              {block.author && (
                <p
                  style={{
                    fontSize: `${authorFontSize}px`,
                    fontWeight: authorFontWeight,
                    color: authorColor,
                  }}
                >
                  {block.author}
                </p>
              )}
              {block.email && (
                <p
                  style={{
                    fontSize: `${authorFontSize}px`,
                    fontWeight: emailFontWeight,
                    color: emailColor,
                    marginTop: block.author ? '0.25rem' : '0',
                  }}
                >
                  {block.email}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
