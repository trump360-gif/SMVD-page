'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type {
  Block,
  TextBlock,
  HeadingBlock,
  ImageBlock,
  GalleryBlock,
  ImageGridBlock,
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
 * Context passed from the "Basic Info" tab for news article preview.
 */
export interface NewsArticleContext {
  title: string;
  category: string;
  publishedAt: string;
}

/**
 * Position-aware block content extraction for news articles.
 * Extracts heading, text blocks, and gallery/image blocks for preview.
 */
interface ParsedNewsContent {
  /** First heading block (used as article intro title) */
  introTitle?: string;
  /** First text block (used as article intro text) */
  introText?: string;
  introTextBlock?: TextBlock;
  /** Gallery images from gallery or image-grid blocks */
  galleryImages: GalleryImageEntry[];
  imageGridBlock?: ImageGridBlock;
  /** Additional text blocks after the first */
  additionalTexts: string[];
}

function parseBlocks(blocks: Block[]): ParsedNewsContent {
  const result: ParsedNewsContent = {
    galleryImages: [],
    additionalTexts: [],
  };
  let foundIntroText = false;

  for (const block of blocks) {
    if (block.type === 'heading' && !result.introTitle) {
      const b = block as HeadingBlock;
      if (b.content) {
        result.introTitle = b.content;
      }
    } else if (block.type === 'text' && (block as TextBlock).content) {
      const textBlock = block as TextBlock;
      if (!foundIntroText) {
        result.introText = textBlock.content;
        result.introTextBlock = textBlock;
        foundIntroText = true;
      } else {
        result.additionalTexts.push(textBlock.content);
      }
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
// NewsDetailPreviewRenderer
// ---------------------------------------------------------------------------

interface NewsDetailPreviewRendererProps {
  blocks: Block[];
  /** Article context from the "Basic Info" tab */
  articleContext?: NewsArticleContext;
  /** Optional row-based layout configuration */
  rowConfig?: RowConfig[];
}

/**
 * Renders block content in the NewsEventDetailContent layout.
 *
 * Layout structure (matching public news detail page):
 * 1. Header: Category badge + Date
 * 2. Title (48px, bold)
 * 3. Description text (18px)
 * 4. Image gallery (1+2+3 layout or block-based)
 *
 * Falls back to articleContext values when blocks don't provide data.
 */
export default function NewsDetailPreviewRenderer({
  blocks,
  articleContext,
  rowConfig,
}: NewsDetailPreviewRendererProps) {
  // If rowConfig is present, use row-based rendering
  const hasRowConfig = rowConfig && rowConfig.length > 0;

  // Position-aware extraction
  const parsed = parseBlocks(blocks);

  // Resolve values: block data takes priority over articleContext
  const title = parsed.introTitle || articleContext?.title || '';
  const category = articleContext?.category || 'Notice';
  const publishedAt = articleContext?.publishedAt || '';
  const introText = parsed.introText || '';

  // Extract text styling from intro text block
  const textFontSize = parsed.introTextBlock?.fontSize ?? 18;
  const textFontWeight = parsed.introTextBlock?.fontWeight ?? '500';
  const textColor = parsed.introTextBlock?.color ?? '#1b1d1f';
  const textLineHeight = parsed.introTextBlock?.lineHeight ?? 1.5;

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
        {/* Article Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            paddingBottom: '20px',
            borderBottom: '2px solid #e5e7eb',
            marginBottom: '40px',
          }}
        >
          {/* Meta Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '500',
                fontFamily: 'Satoshi, sans-serif',
                color: '#141414',
                backgroundColor: '#ebecf0',
                padding: '3px 6px',
                borderRadius: '4px',
              }}
            >
              {category}
            </span>
            {publishedAt && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  fontFamily: 'Pretendard, sans-serif',
                  color: '#626872',
                }}
              >
                {publishedAt}
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '700',
              fontFamily: 'Pretendard, sans-serif',
              color: '#000000',
              margin: '0',
              lineHeight: '1.45',
              letterSpacing: '-0.48px',
            }}
          >
            {title || 'Article Title'}
          </h1>
        </div>

        {/* Row-based content */}
        <div
          style={{
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

  // Default rendering: News detail page layout (no rowConfig)
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
        {/* 1. Header Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            paddingBottom: '20px',
            borderBottom: '2px solid #e5e7eb',
          }}
        >
          {/* Meta Info: Category badge + Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '500',
                fontFamily: 'Satoshi, sans-serif',
                color: '#141414',
                backgroundColor: '#ebecf0',
                padding: '3px 6px',
                borderRadius: '4px',
              }}
            >
              {category}
            </span>
            {publishedAt && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  fontFamily: 'Pretendard, sans-serif',
                  color: '#626872',
                  letterSpacing: '-0.14px',
                }}
              >
                {publishedAt}
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '700',
              fontFamily: 'Pretendard, sans-serif',
              color: '#000000',
              margin: '0',
              lineHeight: '1.45',
              letterSpacing: '-0.48px',
            }}
          >
            {title || 'Article Title'}
          </h1>
        </div>

        {/* 2. Description Text */}
        {introText ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              width: '100%',
            }}
          >
            {hasMarkdownSyntax(introText) ? (
              <div
                style={{
                  fontSize: `${textFontSize}px`,
                  fontWeight: textFontWeight,
                  fontFamily: 'Pretendard, sans-serif',
                  color: textColor,
                  lineHeight: `${textLineHeight}`,
                  letterSpacing: '-0.18px',
                  wordBreak: 'keep-all',
                }}
                className="prose prose-lg max-w-none"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
                  {introText}
                </ReactMarkdown>
              </div>
            ) : (
              <p
                style={{
                  fontSize: `${textFontSize}px`,
                  fontWeight: textFontWeight,
                  fontFamily: 'Pretendard, sans-serif',
                  color: textColor,
                  margin: '0',
                  lineHeight: `${textLineHeight}`,
                  letterSpacing: '-0.18px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'keep-all',
                }}
              >
                {introText}
              </p>
            )}
          </div>
        ) : (
          <p
            style={{
              fontSize: '14px',
              color: '#999',
              fontStyle: 'italic',
              margin: '0',
            }}
          >
            Article content will appear here...
          </p>
        )}

        {/* Additional text blocks */}
        {parsed.additionalTexts.map((text, idx) => (
          <div key={`extra-text-${idx}`} style={{ width: '100%' }}>
            {hasMarkdownSyntax(text) ? (
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  fontFamily: 'Pretendard, sans-serif',
                  color: '#1b1d1f',
                  lineHeight: '1.5',
                  letterSpacing: '-0.18px',
                  wordBreak: 'keep-all',
                }}
                className="prose prose-lg max-w-none"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {text}
                </ReactMarkdown>
              </div>
            ) : (
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  fontFamily: 'Pretendard, sans-serif',
                  color: '#1b1d1f',
                  margin: '0',
                  lineHeight: '1.5',
                  letterSpacing: '-0.18px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'keep-all',
                }}
              >
                {text}
              </p>
            )}
          </div>
        ))}

        {/* 3. Image Gallery */}
        {parsed.galleryImages.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: parsed.imageGridBlock?.gap ?? 20,
              width: '100%',
            }}
          >
            {parsed.imageGridBlock?.rows && parsed.imageGridBlock.rows.length > 0 ? (
              // Render with row-based grid layout from image-grid block
              parsed.imageGridBlock.rows.map((row, rowIdx) => {
                const rowStartIdx = parsed.imageGridBlock!.rows
                  .slice(0, rowIdx)
                  .reduce((sum, r) => sum + r.imageCount, 0);
                const rowImages = parsed.galleryImages.slice(
                  rowStartIdx,
                  rowStartIdx + row.imageCount
                );

                return (
                  <div
                    key={row.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${row.columns}, 1fr)`,
                      gap: `${parsed.imageGridBlock?.gap ?? 20}px`,
                      width: '100%',
                    }}
                  >
                    {rowImages.map((img, imgIdx) => (
                      <div
                        key={img.id || `${rowIdx}-${imgIdx}`}
                        style={{
                          backgroundColor: '#f0f0f0',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          aspectRatio: `${parsed.imageGridBlock?.aspectRatio || 1}`,
                          lineHeight: '0',
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
                          }}
                        />
                      </div>
                    ))}
                  </div>
                );
              })
            ) : (
              // Fallback: 1+2+3 layout (matching NewsEventDetailContent)
              (() => {
                const imgs = parsed.galleryImages;
                return (
                  <>
                    {/* Main image (full width) */}
                    {imgs[0] && (
                      <div
                        style={{
                          width: '100%',
                          aspectRatio: '16 / 9',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={imgs[0].url}
                          alt={imgs[0].alt || 'Main image'}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      </div>
                    )}
                    {/* Center two images */}
                    {(imgs[1] || imgs[2]) && (
                      <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                        {imgs[1] && (
                          <div
                            style={{
                              flex: 1,
                              aspectRatio: '1',
                              backgroundColor: '#f0f0f0',
                              borderRadius: '4px',
                              overflow: 'hidden',
                            }}
                          >
                            <img
                              src={imgs[1].url}
                              alt={imgs[1].alt || 'Gallery image 2'}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                              }}
                            />
                          </div>
                        )}
                        {imgs[2] && (
                          <div
                            style={{
                              flex: 1,
                              aspectRatio: '1',
                              backgroundColor: '#f0f0f0',
                              borderRadius: '4px',
                              overflow: 'hidden',
                            }}
                          >
                            <img
                              src={imgs[2].url}
                              alt={imgs[2].alt || 'Gallery image 3'}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                    {/* Bottom three images */}
                    {(imgs[3] || imgs[4] || imgs[5]) && (
                      <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                        {[imgs[3], imgs[4], imgs[5]]
                          .filter(Boolean)
                          .map((img, idx) => (
                            <div
                              key={img!.id || `bottom-${idx}`}
                              style={{
                                flex: 1,
                                aspectRatio: '1',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '4px',
                                overflow: 'hidden',
                              }}
                            >
                              <img
                                src={img!.url}
                                alt={img!.alt || `Gallery image ${idx + 4}`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  display: 'block',
                                }}
                              />
                            </div>
                          ))}
                      </div>
                    )}
                  </>
                );
              })()
            )}
          </div>
        )}
      </div>
    </div>
  );
}
