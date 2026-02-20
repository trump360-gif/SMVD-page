'use client';

import { useResponsive } from '@/lib/responsive';
import WorkHeader from './WorkHeader';
import WorkProjectNavigation from './WorkProjectNavigation';
import TiptapContentRenderer from '../news/TiptapContentRenderer';

interface TiptapContent {
  type: 'doc';
  content: Array<Record<string, unknown>>;
}

interface ProjectNavigation {
  id: string;
  title: string;
}

interface TiptapWorkDetailViewProps {
  title: string;
  author: string;
  email?: string;
  category: string;
  heroImage: string;
  description?: string; // NEW - 2026-02-20: Description text for right column
  content: TiptapContent;
  previousProject?: ProjectNavigation;
  nextProject?: ProjectNavigation;
}

/**
 * Responsive Tiptap JSON content detail view for work projects.
 * Renders migrated Tiptap content for work portfolio items.
 */
export default function TiptapWorkDetailView({
  title,
  author,
  email,
  category,
  heroImage,
  description,
  content,
  previousProject,
  nextProject,
}: TiptapWorkDetailViewProps) {
  const { isMobile, isTablet } = useResponsive();

  const containerPaddingX = isMobile ? '16px' : isTablet ? '24px' : '40px';
  const containerPaddingBottom = isMobile ? '40px' : '61px';
  const sectionGap = isMobile ? '40px' : isTablet ? '60px' : '80px';

  const heroHeight = isMobile ? '300px' : isTablet ? '500px' : '860px';
  const titleFontSize = isMobile ? '32px' : isTablet ? '44px' : '60px';
  const authorFontSize = isMobile ? '13px' : '14px';

  return (
    <div
      style={{
        width: '100%',
        paddingTop: '0px',
        paddingBottom: containerPaddingBottom,
        paddingLeft: containerPaddingX,
        paddingRight: containerPaddingX,
        backgroundColor: '#ffffffff',
      }}
    >
      {/* Header Navigation */}
      <WorkHeader currentCategory={category} />

      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: sectionGap,
          paddingTop: '0px',
        }}
      >
        {/* Hero Image */}
        {heroImage && (
          <div
            style={{
              width: '100%',
              height: heroHeight,
              backgroundColor: '#d9d9d9ff',
              borderRadius: '0px',
              overflow: 'hidden',
            }}
          >
            <img
              src={heroImage}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}

        {/* Title and Author + Description */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '16px' : '24px',
            width: '100%',
          }}
        >
          {/* Left Column - Title and Author */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '16px' : '24px',
              flex: isMobile ? '1' : '0 0 auto',
              minWidth: isMobile ? 'auto' : '400px',
            }}
          >
            <h1
              style={{
                fontSize: titleFontSize,
                fontWeight: '700',
                color: '#1b1d1fff',
                fontFamily: 'Satoshi',
                margin: '0',
                letterSpacing: '-0.6px',
                lineHeight: '1.2',
                wordBreak: 'keep-all',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: authorFontSize,
                fontFamily: 'Pretendard',
                color: '#1b1d1fff',
                margin: '0',
                whiteSpace: isMobile ? 'normal' : 'nowrap',
              }}
            >
              <span style={{ fontWeight: '500' }}>{author}</span>
              {email && (
                <span style={{ fontWeight: '400', color: '#7b828eff' }}> {email}</span>
              )}
            </p>
          </div>

          {/* Right Column - Description */}
          {description && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '16px' : '24px',
                flex: isMobile ? '1' : '1',
              }}
            >
              <p
                style={{
                  fontSize: isMobile ? '15px' : '18px',
                  fontWeight: '400',
                  fontFamily: 'Pretendard',
                  color: '#1b1d1f',
                  margin: '0',
                  lineHeight: '1.8',
                  letterSpacing: '-0.18px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'keep-all',
                }}
              >
                {description}
              </p>
            </div>
          )}
        </div>

        {/* Tiptap Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            width: '100%',
          }}
        >
          <TiptapContentRenderer content={content as unknown as Record<string, unknown>} />
        </div>

        {/* Project Navigation */}
        <WorkProjectNavigation
          previousProject={previousProject}
          nextProject={nextProject}
        />
      </div>
    </div>
  );
}
