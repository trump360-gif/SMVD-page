'use client';

import React from 'react';
import type {
  Block,
  WorkTitleBlock,
  WorkProjectContext,
  RowConfig,
} from '../types';
import { groupBlocksByRows } from '../types';
import BlockRenderer from './BlockRenderer';
import { parseBlocks } from './work-detail-preview/helpers';
import GalleryPreview from './work-detail-preview/GalleryPreview';
import ColumnLayoutPreview from './work-detail-preview/ColumnLayoutPreview';

interface WorkDetailPreviewRendererProps {
  blocks: Block[];
  /** Project context from the "Basic Info" tab */
  projectContext?: WorkProjectContext;
  /** Optional row-based layout configuration. When present, blocks are rendered in rows. */
  rowConfig?: RowConfig[];
}

/**
 * Renders block content in the exact WorkDetailPage 2-column layout.
 *
 * Uses the same position-aware parsing as WorkDetailPage.tsx:
 * 1. Hero Image (full-width, 860px)
 * 2. 2-Column Layout:
 *    - Left: Title + Author + Email (from work-title block or projectContext)
 *    - Right: Description (first TextBlock after work-title)
 * 3. Gallery (vertical stack from image-grid or gallery block)
 *
 * Falls back to projectContext values when blocks don't provide data.
 */
export default function WorkDetailPreviewRenderer({
  blocks,
  projectContext,
  rowConfig,
}: WorkDetailPreviewRendererProps) {
  const hasRowConfig = rowConfig && rowConfig.length > 0;

  // Position-aware extraction (same logic as WorkDetailPage)
  const parsed = parseBlocks(blocks);

  // Resolve values: block data takes priority over projectContext
  const heroUrl = parsed.hero?.url || projectContext?.heroImage || '';
  const heroAlt = parsed.hero?.alt || projectContext?.title || '';
  const title = parsed.title?.title || projectContext?.title || '';
  const author = parsed.title?.author || projectContext?.author || '';
  const email = parsed.title?.email || projectContext?.email || '';
  const description = parsed.mainDescription || '';

  // Extract styling from work-title block if available
  const titleBlock = blocks.find((b) => b.type === 'work-title') as WorkTitleBlock | undefined;
  const titleFontSize = titleBlock?.titleFontSize ?? 60;
  const authorFontSize = titleBlock?.authorFontSize ?? 14;
  const gap = titleBlock?.gap ?? 24;
  const titleFontWeight = titleBlock?.titleFontWeight ?? '700';
  const authorFontWeight = titleBlock?.authorFontWeight ?? '500';
  const emailFontWeight = titleBlock?.emailFontWeight ?? '400';
  const titleColor = titleBlock?.titleColor ?? '#1b1d1f';
  const authorColor = titleBlock?.authorColor ?? '#1b1d1f';
  const emailColor = titleBlock?.emailColor ?? '#7b828e';

  // Extract layout configuration
  const columnLayout = parsed.layoutConfig?.columnLayout ?? 2;
  const columnGap = parsed.layoutConfig?.columnGap ?? 90;
  const textColumnWidth = parsed.layoutConfig?.textColumnWidth ?? 'auto';

  // Extract text styling from description block
  const descFontSize = parsed.mainDescriptionBlock?.fontSize ?? 18;
  const descFontWeight = parsed.mainDescriptionBlock?.fontWeight ?? '400';
  const descColor = parsed.mainDescriptionBlock?.color ?? '#1b1d1f';
  const descLineHeight = parsed.mainDescriptionBlock?.lineHeight ?? 1.8;

  // Row-based rendering: when rowConfig is present
  if (hasRowConfig) {
    const groupedRows = groupBlocksByRows(blocks, rowConfig);
    return (
      <div style={{ width: '100%', backgroundColor: '#ffffff', fontFamily: 'Pretendard, sans-serif' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', width: '100%' }}>
          {groupedRows.map((rowBlocks, rowIdx) => {
            const config = rowConfig![rowIdx] || { layout: 1 as const, blockCount: rowBlocks.length };
            if (rowBlocks.length === 0) return null;

            if (config.layout === 1) {
              return (
                <div key={`row-${rowIdx}`} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <BlockRenderer blocks={rowBlocks} />
                </div>
              );
            }

            const colCount = config.layout;
            const columns: Block[][] = Array.from({ length: colCount }, () => []);
            rowBlocks.forEach((block, blockIdx) => {
              columns[blockIdx % colCount].push(block);
            });

            return (
              <div
                key={`row-${rowIdx}`}
                style={{ display: 'grid', gridTemplateColumns: `repeat(${colCount}, 1fr)`, gap: '24px' }}
              >
                {columns.map((colBlocks, colIdx) => (
                  <div key={`row-${rowIdx}-col-${colIdx}`}>
                    <BlockRenderer blocks={colBlocks} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Legacy rendering: fixed hero + column layout + gallery (no rowConfig)
  return (
    <div style={{ width: '100%', backgroundColor: '#ffffff', fontFamily: 'Pretendard, sans-serif' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '100px', width: '100%' }}>
        {/* 1. Hero Image (860px) */}
        {heroUrl ? (
          <div style={{ width: '100%', height: '860px', backgroundColor: '#d9d9d9', borderRadius: '0px', overflow: 'hidden' }}>
            <img src={heroUrl} alt={heroAlt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ) : (
          <div style={{ width: '100%', height: '860px', backgroundColor: '#d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '14px' }}>
            Hero image will appear here
          </div>
        )}

        {/* 2. Column Layout */}
        <ColumnLayoutPreview
          columnLayout={columnLayout}
          columnGap={columnGap}
          textColumnWidth={textColumnWidth}
          title={title}
          author={author}
          email={email}
          description={description}
          titleFontSize={titleFontSize}
          titleFontWeight={titleFontWeight}
          titleColor={titleColor}
          authorFontSize={authorFontSize}
          authorFontWeight={authorFontWeight}
          authorColor={authorColor}
          emailFontWeight={emailFontWeight}
          emailColor={emailColor}
          gap={gap}
          descFontSize={descFontSize}
          descFontWeight={descFontWeight}
          descColor={descColor}
          descLineHeight={descLineHeight}
        />

        {/* 3. Gallery */}
        <GalleryPreview
          galleryImages={parsed.galleryImages}
          imageGridBlock={parsed.imageGridBlock}
        />
      </div>
    </div>
  );
}
