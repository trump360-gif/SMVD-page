'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { WorkDetail } from '@/constants/work-details';
import WorkHeader from './WorkHeader';

// ---------------------------------------------------------------------------
// Block content parsing helpers
// ---------------------------------------------------------------------------

interface ParsedBlockContent {
  /** Hero image URL from HeroImageBlock */
  hero?: string;
  /** Title/Author/Email from WorkTitleBlock */
  title?: {
    title: string;
    author: string;
    email: string;
  };
  /** The first TextBlock after WorkTitleBlock (right column description) */
  mainDescription?: string;
  /** Gallery image URLs from WorkGalleryBlock or GalleryBlock */
  galleryImages: string[];
}

/**
 * Parse description as JSON block content with position-aware extraction.
 *
 * Block extraction rules:
 * - hero-image block -> hero URL
 * - work-title block -> title, author, email (left column)
 * - First text block after work-title -> mainDescription (right column)
 * - work-gallery / gallery blocks -> galleryImages
 *
 * Returns null if not valid block JSON (i.e. legacy plain text description).
 */
function parseBlockContent(description: string): ParsedBlockContent | null {
  try {
    const parsed = JSON.parse(description);
    if (!parsed.blocks || !Array.isArray(parsed.blocks) || !parsed.version) {
      return null;
    }

    const result: ParsedBlockContent = { galleryImages: [] };
    let foundWorkTitle = false;
    let foundMainDescription = false;

    for (const block of parsed.blocks) {
      if (block.type === 'hero-image' && block.url) {
        result.hero = block.url;
      } else if (block.type === 'work-title') {
        result.title = {
          title: block.title || '',
          author: block.author || '',
          email: block.email || '',
        };
        foundWorkTitle = true;
      } else if (block.type === 'text' && block.content && foundWorkTitle && !foundMainDescription) {
        // First TextBlock after WorkTitleBlock becomes the right-column description
        result.mainDescription = block.content;
        foundMainDescription = true;
      } else if (block.type === 'text' && block.content && !foundWorkTitle) {
        // TextBlock before any WorkTitleBlock -- treat as mainDescription fallback
        if (!result.mainDescription) {
          result.mainDescription = block.content;
        } else {
          result.mainDescription += '\n\n' + block.content;
        }
      } else if (block.type === 'work-gallery' && Array.isArray(block.images)) {
        for (const img of block.images) {
          if (img.url) result.galleryImages.push(img.url);
        }
      } else if (block.type === 'gallery' && Array.isArray(block.images)) {
        // Legacy gallery block support
        for (const img of block.images) {
          if (img.url) result.galleryImages.push(img.url);
        }
      }
    }

    return result;
  } catch {
    return null;
  }
}

/**
 * Check if text contains markdown syntax.
 * Used to decide between plain text and markdown rendering.
 */
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

// ---------------------------------------------------------------------------
// WorkDetailPage
// ---------------------------------------------------------------------------

interface WorkDetailPageProps {
  project: WorkDetail;
}

export default function WorkDetailPage({ project }: WorkDetailPageProps) {
  // Try to parse block-based content from description
  const blockContent = parseBlockContent(project.description);

  // Resolve display values with fallbacks to legacy hardcoded data
  const displayHero = blockContent?.hero || project.heroImage;
  const displayTitle = blockContent?.title?.title || project.title;
  const displayAuthor = blockContent?.title?.author || project.author;
  const displayEmail = blockContent?.title?.email || project.email;
  const displayDescription = blockContent?.mainDescription || project.description;
  const displayGalleryImages =
    blockContent?.galleryImages && blockContent.galleryImages.length > 0
      ? blockContent.galleryImages
      : project.galleryImages;

  return (
    <div
      style={{
        width: '100%',
        paddingTop: '0px',
        paddingBottom: '61px',
        paddingLeft: '40px',
        paddingRight: '40px',
        backgroundColor: '#ffffffff',
      }}
    >
      {/* Header Navigation */}
      <WorkHeader currentCategory={project.category} />

      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '80px',
          paddingTop: '0px',
        }}
      >
        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '100px',
            width: '100%',
          }}
        >
          {/* Hero Image */}
          {displayHero && (
            <div
              style={{
                width: '100%',
                height: '860px',
                backgroundColor: '#d9d9d9ff',
                borderRadius: '0px',
                overflow: 'hidden',
              }}
            >
              <img
                src={displayHero}
                alt={displayTitle}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}

          {/* Text Section - 2 Column Layout */}
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
                  color: '#1b1d1fff',
                  fontFamily: 'Satoshi',
                  margin: '0',
                  letterSpacing: '-0.6px',
                  lineHeight: '1.2',
                }}
              >
                {displayTitle}
              </h1>

              {/* Author and Email - Single Line */}
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  fontFamily: 'Pretendard',
                  color: '#1b1d1fff',
                  margin: '0',
                }}
              >
                {displayAuthor}
                {displayEmail && ' '}
                {displayEmail && (
                  <span
                    style={{
                      fontWeight: '400',
                      color: '#7b828eff',
                    }}
                  >
                    {displayEmail}
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
                flex: '1',
              }}
            >
              {/* Description - Markdown or plain text */}
              {hasMarkdownSyntax(displayDescription) ? (
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: '400',
                    fontFamily: 'Pretendard',
                    color: '#1b1d1fff',
                    lineHeight: '1.8',
                    letterSpacing: '-0.18px',
                    margin: '0',
                  }}
                  className="prose prose-lg max-w-none"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {displayDescription}
                  </ReactMarkdown>
                </div>
              ) : (
                <p
                  style={{
                    fontSize: '18px',
                    fontWeight: '400',
                    fontFamily: 'Pretendard',
                    color: '#1b1d1fff',
                    lineHeight: '1.8',
                    letterSpacing: '-0.18px',
                    margin: '0',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {displayDescription}
                </p>
              )}
            </div>
          </div>

          {/* Gallery */}
          {displayGalleryImages.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
                width: '100%',
              }}
            >
              {displayGalleryImages.map((image, index) => (
                <div
                  key={index}
                  style={{
                    width: '100%',
                    backgroundColor: '#f0f0f0ff',
                    borderRadius: '0px',
                    overflow: 'hidden',
                    lineHeight: '0',
                    margin: index > 0 ? '-1px 0 0 0' : '0',
                    padding: '0',
                    fontSize: '0',
                  }}
                >
                  <img
                    src={image}
                    alt={`${project.title} gallery ${index + 1}`}
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

        {/* Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
          }}
        >
          {/* Previous Project */}
          {project.previousProject ? (
            <Link href={`/work/${project.previousProject.id}`}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  borderRadius: '4px',
                  backgroundColor: '#f5f5f5ff',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    '#efefefff';
                  (e.currentTarget as HTMLElement).style.transform =
                    'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    '#f5f5f5ff';
                  (e.currentTarget as HTMLElement).style.transform =
                    'translateY(0)';
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'Pretendard',
                    color: '#1b1d1fff',
                  }}
                >
                  ← Previous
                </span>
              </div>
            </Link>
          ) : (
            <div></div>
          )}

          {/* Next Project */}
          {project.nextProject ? (
            <Link href={`/work/${project.nextProject.id}`}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  borderRadius: '4px',
                  backgroundColor: '#f5f5f5ff',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    '#efefefff';
                  (e.currentTarget as HTMLElement).style.transform =
                    'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    '#f5f5f5ff';
                  (e.currentTarget as HTMLElement).style.transform =
                    'translateY(0)';
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'Pretendard',
                    color: '#1b1d1fff',
                  }}
                >
                  Next →
                </span>
              </div>
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
