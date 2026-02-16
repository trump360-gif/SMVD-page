'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type {
  Block,
  TextBlock,
  HeroImageBlock,
  HeroSectionBlock,
  WorkTitleBlock,
  GalleryBlock,
  ImageGridBlock,
  WorkProjectContext,
  WorkLayoutConfigBlock,
  RowConfig,
  GalleryImageEntry,
} from '../types';
import { groupBlocksByRows } from '../types';
import BlockRenderer from './BlockRenderer';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hasMarkdownSyntax(text: string): boolean {
  if (!text) return false;
  return /[#*_~`\[\]!>-]/.test(text) && (
    /^#{1,6}\s/m.test(text) ||
    /\*\*.+?\*\*/m.test(text) ||
    /\[.+?\]\(.+?\)/m.test(text) ||
    /^[-*]\s/m.test(text) ||
    /^\d+\.\s/m.test(text) ||
    /^>/m.test(text)
  );
}

/**
 * Position-aware block content extraction.
 * Mirrors the parseBlockContent() logic in WorkDetailPage.tsx exactly:
 *
 * - hero-image block -> hero URL
 * - work-title block -> title, author, email (left column)
 * - First text block after work-title -> mainDescription (right column)
 * - image-grid / gallery blocks -> galleryImages
 */
interface ParsedPreviewContent {
  hero?: { url: string; alt: string; id?: string };
  title?: { title: string; author: string; email: string };
  mainDescription?: string;
  mainDescriptionBlock?: TextBlock;
  galleryImages: GalleryImageEntry[];
  layoutConfig?: WorkLayoutConfigBlock;
  imageGridBlock?: ImageGridBlock;
}

function parseBlocks(blocks: Block[]): ParsedPreviewContent {
  const result: ParsedPreviewContent = { galleryImages: [] };
  let foundWorkTitle = false;
  let foundMainDescription = false;

  for (const block of blocks) {
    if (block.type === 'hero-image') {
      const b = block as HeroImageBlock;
      if (b.url) {
        result.hero = { url: b.url, alt: b.alt || '', id: b.id };
      }
    } else if (block.type === 'hero-section') {
      const b = block as HeroSectionBlock;
      if (b.url) {
        result.hero = { url: b.url, alt: b.alt || '', id: b.id };
      }
      result.title = {
        title: b.title || '',
        author: b.author || '',
        email: b.email || '',
      };
      foundWorkTitle = true;
    } else if (block.type === 'work-title') {
      const b = block as WorkTitleBlock;
      result.title = {
        title: b.title || '',
        author: b.author || '',
        email: b.email || '',
      };
      foundWorkTitle = true;
    } else if (block.type === 'text' && (block as TextBlock).content) {
      const textBlock = block as TextBlock;
      if (foundWorkTitle && !foundMainDescription) {
        // First TextBlock after WorkTitleBlock -> right-column description
        result.mainDescription = textBlock.content;
        result.mainDescriptionBlock = textBlock;
        foundMainDescription = true;
      } else if (!foundWorkTitle) {
        // TextBlock before any WorkTitleBlock -> fallback description
        if (!result.mainDescription) {
          result.mainDescription = textBlock.content;
          result.mainDescriptionBlock = textBlock;
        } else {
          result.mainDescription += '\n\n' + textBlock.content;
        }
      }
    } else if (block.type === 'work-layout-config') {
      const b = block as WorkLayoutConfigBlock;
      result.layoutConfig = b;
    } else if (block.type === 'image-grid') {
      const b = block as ImageGridBlock;
      if (b.images.length > 0) {
        result.galleryImages = b.images;
        result.imageGridBlock = b;
      }
    } else if (block.type === 'gallery') {
      const b = block as GalleryBlock;
      if (b.images.length > 0 && result.galleryImages.length === 0) {
        result.galleryImages = b.images;
      }
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// WorkDetailPreviewRenderer
// ---------------------------------------------------------------------------

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
  // If rowConfig is present, use row-based rendering
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
  const titleBlock = blocks.find((b) => b.type === 'work-title') as any;
  const titleFontSize = titleBlock?.titleFontSize ?? 60;
  const authorFontSize = titleBlock?.authorFontSize ?? 14;
  const gap = titleBlock?.gap ?? 24;
  const titleFontWeight = titleBlock?.titleFontWeight ?? '700';
  const authorFontWeight = titleBlock?.authorFontWeight ?? '500';
  const emailFontWeight = titleBlock?.emailFontWeight ?? '400';
  const titleColor = titleBlock?.titleColor ?? '#1b1d1f';
  const authorColor = titleBlock?.authorColor ?? '#1b1d1f';
  const emailColor = titleBlock?.emailColor ?? '#7b828e';

  // Extract layout configuration from work-layout-config block
  const columnLayout = parsed.layoutConfig?.columnLayout ?? 2;
  const columnGap = parsed.layoutConfig?.columnGap ?? 90;
  const textColumnWidth = parsed.layoutConfig?.textColumnWidth ?? 'auto';

  // Extract text styling from description block
  const descFontSize = parsed.mainDescriptionBlock?.fontSize ?? 18;
  const descFontWeight = parsed.mainDescriptionBlock?.fontWeight ?? '400';
  const descColor = parsed.mainDescriptionBlock?.color ?? '#1b1d1f';
  const descLineHeight = parsed.mainDescriptionBlock?.lineHeight ?? 1.8;

  // Row-based rendering: when rowConfig is present, render blocks in rows
  if (hasRowConfig) {
    const groupedRows = groupBlocksByRows(blocks, rowConfig);
    return (
      <div
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          fontFamily: 'Pretendard, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            width: '100%',
          }}
        >
          {groupedRows.map((rowBlocks, rowIdx) => {
            const config = rowConfig![rowIdx] || { layout: 1 as const, blockCount: rowBlocks.length };
            if (rowBlocks.length === 0) return null;

            if (config.layout === 1) {
              // Full-width row: render blocks vertically
              return (
                <div key={`row-${rowIdx}`} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <BlockRenderer blocks={rowBlocks} />
                </div>
              );
            }

            // Multi-column row: distribute blocks across columns
            const colCount = config.layout;
            const columns: Block[][] = Array.from({ length: colCount }, () => []);
            rowBlocks.forEach((block, blockIdx) => {
              columns[blockIdx % colCount].push(block);
            });

            return (
              <div
                key={`row-${rowIdx}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${colCount}, 1fr)`,
                  gap: '24px',
                }}
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

  // Legacy rendering: fixed hero + 2-column + gallery layout (no rowConfig)
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#ffffff',
        fontFamily: 'Pretendard, sans-serif',
      }}
    >
      {/* Main Content Container - matches WorkDetailPage exactly */}
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '100px',
          width: '100%',
        }}
      >
        {/* 1. Hero Image (860px) */}
        {heroUrl ? (
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
              src={heroUrl}
              alt={heroAlt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              height: '860px',
              backgroundColor: '#d9d9d9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              fontSize: '14px',
            }}
          >
            Hero image will appear here
          </div>
        )}

        {/* 2. Layout Section - Column Layout (1, 2, or 3 columns) */}
        {columnLayout === 1 ? (
          // Single-Column Layout: Title | Author | Description | Email (vertical stack)
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: `${gap}px`,
              width: '100%',
            }}
          >
            {/* Title */}
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
              {title || 'Project Title'}
            </h1>

            {/* Author */}
            <p
              style={{
                fontSize: `${authorFontSize}px`,
                fontWeight: authorFontWeight,
                fontFamily: 'Pretendard, sans-serif',
                color: authorColor,
                margin: '0',
              }}
            >
              {author || 'Author'}
            </p>

            {/* Description */}
            <div
              style={{
                fontSize: `${descFontSize}px`,
                fontWeight: descFontWeight,
                color: descColor,
                lineHeight: `${descLineHeight}`,
                fontFamily: 'Pretendard, sans-serif',
              }}
            >
              {description ? (
                hasMarkdownSyntax(description) ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {description}
                  </ReactMarkdown>
                ) : (
                  <p style={{ margin: '0', whiteSpace: 'pre-wrap' }}>
                    {description}
                  </p>
                )
              ) : (
                <p style={{ fontSize: '14px', color: '#999', fontStyle: 'italic', margin: '0' }}>
                  Description here...
                </p>
              )}
            </div>

            {/* Email */}
            <p
              style={{
                fontSize: `${authorFontSize}px`,
                fontWeight: emailFontWeight,
                fontFamily: 'Pretendard, sans-serif',
                color: emailColor,
                margin: '0',
              }}
            >
              {email || 'email@example.com'}
            </p>
          </div>
        ) : columnLayout === 2 ? (
          // Two-Column Layout: Title+Author | Description
          <div
            style={{
              display: 'flex',
              gap: `${columnGap}px`,
              width: '100%',
            }}
          >
            {/* Left Column - Title and Author */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: `${gap}px`,
                flex: '0 0 auto',
                minWidth: '400px',
              }}
            >
            {/* Title */}
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
              {title || 'Project Title'}
            </h1>

            {/* Author and Email */}
            <p
              style={{
                fontSize: `${authorFontSize}px`,
                fontWeight: authorFontWeight,
                fontFamily: 'Pretendard, sans-serif',
                color: authorColor,
                margin: '0',
              }}
            >
              {author || 'Author'}
              {email && ' '}
              {email ? (
                <span
                  style={{
                    fontWeight: emailFontWeight,
                    color: emailColor,
                  }}
                >
                  {email}
                </span>
              ) : (
                <span
                  style={{
                    fontWeight: emailFontWeight,
                    color: emailColor,
                  }}
                >
                  email@example.com
                </span>
              )}
            </p>
          </div>

            {/* Right Column - Description (first TextBlock after WorkTitleBlock) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                flex: textColumnWidth === 'narrow' ? '0 0 400px' : textColumnWidth === 'wide' ? '0 0 800px' : '1',
              }}
            >
              {description ? (
                hasMarkdownSyntax(description) ? (
                  <div
                    style={{
                      fontSize: `${descFontSize}px`,
                      fontWeight: descFontWeight,
                      fontFamily: 'Pretendard, sans-serif',
                      color: descColor,
                      lineHeight: `${descLineHeight}`,
                      letterSpacing: '-0.18px',
                      margin: '0',
                    }}
                    className="prose prose-lg max-w-none"
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {description}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p
                    style={{
                      fontSize: `${descFontSize}px`,
                      fontWeight: descFontWeight,
                      fontFamily: 'Pretendard, sans-serif',
                      color: descColor,
                      lineHeight: `${descLineHeight}`,
                      letterSpacing: '-0.18px',
                      margin: '0',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {description}
                  </p>
                )
              ) : (
                <p
                  style={{
                    fontSize: '18px',
                    color: '#999',
                    fontStyle: 'italic',
                    margin: '0',
                  }}
                >
                  Project description will appear here...
                </p>
              )}
            </div>
          </div>
        ) : (
          // Two-Column Layout (refactored from 3-column)
          <div
            style={{
              display: 'flex',
              gap: `${columnGap}px`,
              width: '100%',
            }}
          >
            {/* Left Column - Title and Author/Email */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: `${gap}px`,
                flex: '0 0 auto',
                minWidth: '400px',
              }}
            >
              {/* Title */}
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
                {title || 'Project Title'}
              </h1>

              {/* Author and Email - Single Line */}
              <p
                style={{
                  fontSize: `${authorFontSize}px`,
                  fontFamily: 'Pretendard, sans-serif',
                  color: authorColor,
                  margin: '0',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontWeight: authorFontWeight }}>
                  {author || 'Author'}
                </span>
                {email && (
                  <span style={{ fontWeight: emailFontWeight, color: emailColor }}>
                    {' '}
                    {email}
                  </span>
                )}
              </p>
            </div>

            {/* Right Column - Description */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                flex: textColumnWidth === 'narrow' ? '0 0 400px' : textColumnWidth === 'wide' ? '0 0 800px' : '1',
              }}
            >
              {description ? (
                hasMarkdownSyntax(description) ? (
                  <div
                    style={{
                      fontSize: `${descFontSize}px`,
                      fontWeight: descFontWeight,
                      color: descColor,
                      lineHeight: `${descLineHeight}`,
                      fontFamily: 'Pretendard, sans-serif',
                      letterSpacing: '-0.18px',
                      margin: '0',
                    }}
                    className="prose prose-lg max-w-none"
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {description}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p
                    style={{
                      fontSize: `${descFontSize}px`,
                      fontWeight: descFontWeight,
                      color: descColor,
                      lineHeight: `${descLineHeight}`,
                      fontFamily: 'Pretendard, sans-serif',
                      letterSpacing: '-0.18px',
                      margin: '0',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {description}
                  </p>
                )
              ) : (
                <p style={{ fontSize: '18px', color: '#999', fontStyle: 'italic', margin: '0' }}>
                  Project description will appear here...
                </p>
              )}
            </div>
          </div>
        )}

        {/* 3. Gallery (with row-based grid layout if image-grid block exists) */}
        {parsed.galleryImages.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: parsed.imageGridBlock?.gap || 0, width: '100%' }}>
            {parsed.imageGridBlock?.rows && parsed.imageGridBlock.rows.length > 0 ? (
              // Render with row-based grid layout from image-grid block
              parsed.imageGridBlock.rows.map((row, rowIdx) => {
                const rowStartIdx = parsed.imageGridBlock!.rows.slice(0, rowIdx).reduce((sum, r) => sum + r.imageCount, 0);
                const rowImages = parsed.galleryImages.slice(rowStartIdx, rowStartIdx + row.imageCount);

                return (
                  <div
                    key={row.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${row.columns}, 1fr)`,
                      gap: `${parsed.imageGridBlock?.gap || 16}px`,
                      width: '100%',
                    }}
                  >
                    {rowImages.map((img, imgIdx) => (
                      <div
                        key={img.id || `${rowIdx}-${imgIdx}`}
                        style={{
                          backgroundColor: '#f0f0f0',
                          overflow: 'hidden',
                          aspectRatio: `${parsed.imageGridBlock?.aspectRatio || 1}`,
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
              // Fallback: vertical stack if no row config
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0', width: '100%' }}>
                {parsed.galleryImages.map((img, index) => (
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
        )}
      </div>
    </div>
  );
}
