'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type {
  Block,
  TextBlock,
  HeroImageBlock,
  WorkTitleBlock,
  WorkGalleryBlock,
  GalleryBlock,
  WorkProjectContext,
  WorkLayoutConfigBlock,
} from '../types';
import WorkGalleryBlockRenderer from './WorkGalleryBlockRenderer';

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
 * - work-gallery / gallery blocks -> galleryImages
 */
interface ParsedPreviewContent {
  hero?: { url: string; alt: string; id?: string };
  title?: { title: string; author: string; email: string };
  mainDescription?: string;
  mainDescriptionBlock?: TextBlock;
  galleryBlock?: WorkGalleryBlock | GalleryBlock;
  layoutConfig?: WorkLayoutConfigBlock;
}

function parseBlocks(blocks: Block[]): ParsedPreviewContent {
  const result: ParsedPreviewContent = {};
  let foundWorkTitle = false;
  let foundMainDescription = false;

  for (const block of blocks) {
    if (block.type === 'hero-image') {
      const b = block as HeroImageBlock;
      if (b.url) {
        result.hero = { url: b.url, alt: b.alt || '', id: b.id };
      }
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
    } else if (block.type === 'work-gallery') {
      const b = block as WorkGalleryBlock;
      if (b.images.length > 0) {
        result.galleryBlock = b;
      }
    } else if (block.type === 'gallery') {
      const b = block as GalleryBlock;
      if (b.images.length > 0 && !result.galleryBlock) {
        result.galleryBlock = b;
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
}

/**
 * Renders block content in the exact WorkDetailPage 2-column layout.
 *
 * Uses the same position-aware parsing as WorkDetailPage.tsx:
 * 1. Hero Image (full-width, 860px)
 * 2. 2-Column Layout:
 *    - Left: Title + Author + Email (from work-title block or projectContext)
 *    - Right: Description (first TextBlock after work-title)
 * 3. Gallery (vertical stack from work-gallery block)
 *
 * Falls back to projectContext values when blocks don't provide data.
 */
export default function WorkDetailPreviewRenderer({
  blocks,
  projectContext,
}: WorkDetailPreviewRendererProps) {
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

  // Extract layout configuration (force 2-column layout)
  const columnLayout = 2;
  const columnGap = parsed.layoutConfig?.columnGap ?? 90;
  const textColumnWidth = parsed.layoutConfig?.textColumnWidth ?? 'auto';

  // Extract text styling from description block
  const descFontSize = parsed.mainDescriptionBlock?.fontSize ?? 18;
  const descFontWeight = parsed.mainDescriptionBlock?.fontWeight ?? '400';
  const descColor = parsed.mainDescriptionBlock?.color ?? '#1b1d1f';
  const descLineHeight = parsed.mainDescriptionBlock?.lineHeight ?? 1.8;

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

        {/* 2. Layout Section - 2-Column Layout (columnLayout is always 2) */}
        {columnLayout === 2 ? (
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
          // Three-Column Layout
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: `${columnGap}px`,
              width: '100%',
            }}
          >
            {/* Column 1 - Title */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: `${gap}px`,
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
                {title || 'Project Title'}
              </h1>
            </div>

            {/* Column 2 - Author + Description */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: `${gap}px`,
              }}
            >
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
            </div>

            {/* Column 3 - Email */}
            <div>
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
          </div>
        )}

        {/* 3. Gallery (vertical stack) */}
        {parsed.galleryBlock && (
          <WorkGalleryBlockRenderer
            block={{
              id: parsed.galleryBlock.id,
              type: 'work-gallery',
              order: parsed.galleryBlock.order,
              images: parsed.galleryBlock.images,
            }}
          />
        )}
      </div>
    </div>
  );
}
