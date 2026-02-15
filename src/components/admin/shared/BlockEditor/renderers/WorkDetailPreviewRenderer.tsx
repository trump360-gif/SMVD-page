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
  galleryBlock?: WorkGalleryBlock | GalleryBlock;
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
      const content = (block as TextBlock).content;
      if (foundWorkTitle && !foundMainDescription) {
        // First TextBlock after WorkTitleBlock -> right-column description
        result.mainDescription = content;
        foundMainDescription = true;
      } else if (!foundWorkTitle) {
        // TextBlock before any WorkTitleBlock -> fallback description
        if (!result.mainDescription) {
          result.mainDescription = content;
        } else {
          result.mainDescription += '\n\n' + content;
        }
      }
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

        {/* 2. Two-Column Layout: Title+Author | Description */}
        <div
          style={{
            display: 'flex',
            gap: '90px',
            width: '100%',
          }}
        >
          {/* Left Column - Title and Author */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              flex: '0 0 auto',
              minWidth: '400px',
            }}
          >
            {/* Title */}
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
              {title || 'Project Title'}
            </h1>

            {/* Author and Email */}
            <p
              style={{
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'Pretendard, sans-serif',
                color: '#1b1d1f',
                margin: '0',
              }}
            >
              {author || 'Author'}
              {email && ' '}
              {email ? (
                <span
                  style={{
                    fontWeight: '400',
                    color: '#7b828e',
                  }}
                >
                  {email}
                </span>
              ) : (
                <span
                  style={{
                    fontWeight: '400',
                    color: '#7b828e',
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
              flex: '1',
            }}
          >
            {description ? (
              hasMarkdownSyntax(description) ? (
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: '400',
                    fontFamily: 'Pretendard, sans-serif',
                    color: '#1b1d1f',
                    lineHeight: '1.8',
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
                    fontSize: '18px',
                    fontWeight: '400',
                    fontFamily: 'Pretendard, sans-serif',
                    color: '#1b1d1f',
                    lineHeight: '1.8',
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
