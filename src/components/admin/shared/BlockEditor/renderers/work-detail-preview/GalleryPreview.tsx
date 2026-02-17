'use client';

import React from 'react';
import type { GalleryImageEntry, ImageGridBlock } from '../../types';

interface GalleryPreviewProps {
  galleryImages: GalleryImageEntry[];
  imageGridBlock?: ImageGridBlock;
}

export default function GalleryPreview({ galleryImages, imageGridBlock }: GalleryPreviewProps) {
  if (galleryImages.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: imageGridBlock?.gap || 0, width: '100%' }}>
      {imageGridBlock?.rows && imageGridBlock.rows.length > 0 ? (
        imageGridBlock.rows.map((row, rowIdx) => {
          const rowStartIdx = imageGridBlock.rows.slice(0, rowIdx).reduce((sum, r) => sum + r.imageCount, 0);
          const rowImages = galleryImages.slice(rowStartIdx, rowStartIdx + row.imageCount);

          return (
            <div
              key={row.id}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${row.columns}, 1fr)`,
                gap: `${imageGridBlock?.gap || 16}px`,
                width: '100%',
              }}
            >
              {rowImages.map((img, imgIdx) => (
                <div
                  key={img.id || `${rowIdx}-${imgIdx}`}
                  style={{
                    backgroundColor: '#f0f0f0',
                    overflow: 'hidden',
                    aspectRatio: `${imageGridBlock?.aspectRatio || 1}`,
                    lineHeight: '0',
                    padding: '0',
                    fontSize: '0',
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.alt || `Gallery image ${rowStartIdx + imgIdx + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      margin: '0',
                      padding: '0',
                    }}
                  />
                </div>
              ))}
            </div>
          );
        })
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', width: '100%' }}>
          {galleryImages.map((img, index) => (
            <div
              key={img.id || index}
              style={{
                width: '100%',
                backgroundColor: '#f0f0f0',
                overflow: 'hidden',
                lineHeight: '0',
                margin: index > 0 ? '-1px 0 0 0' : '0',
                padding: '0',
                fontSize: '0',
              }}
            >
              <img
                src={img.url}
                alt={img.alt || `Gallery image ${index + 1}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  margin: '0',
                  padding: '0',
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
