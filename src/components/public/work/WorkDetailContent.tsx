'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sanitizeContent } from '@/lib/sanitize';
import { useResponsive } from '@/lib/responsive';
import { hasMarkdownSyntax } from './WorkDetailTypes';

interface WorkDetailContentProps {
  displayHero: string;
  displayTitle: string;
  displayAuthor: string;
  displayEmail: string;
  displayDescription: string;
  displayGalleryImages: string[];
  columnLayout: number;
  columnGap: number;
  textColumnWidth: string;
  descFontSize: number;
  descFontWeight: string;
  descColor: string;
  descLineHeight: number;
}

export default function WorkDetailContent({
  displayHero,
  displayTitle,
  displayAuthor,
  displayEmail,
  displayDescription,
  displayGalleryImages,
  columnLayout,
  columnGap,
  textColumnWidth,
  descFontSize,
  descFontWeight,
  descColor,
  descLineHeight,
}: WorkDetailContentProps) {
  const { isMobile, isTablet } = useResponsive();

  const contentGap = isMobile ? '40px' : isTablet ? '60px' : '100px';
  const heroHeight = isMobile ? '300px' : isTablet ? '500px' : '860px';
  const titleFontSize = isMobile ? '32px' : isTablet ? '44px' : '60px';
  const textDirection = isMobile ? 'column' : 'row' as const;
  const responsiveColumnGap = isMobile ? '24px' : isTablet ? `${Math.min(columnGap, 40)}px` : `${columnGap}px`;
  const leftMinWidth = isMobile ? 'auto' : isTablet ? '280px' : '400px';
  const leftFlex = isMobile ? '1' : '0 0 auto';
  const responsiveDescFontSize = isMobile ? Math.min(descFontSize, 15) : descFontSize;

  const descriptionContent = hasMarkdownSyntax(displayDescription) ? (
    <div
      style={{ fontSize: `${responsiveDescFontSize}px`, fontWeight: descFontWeight, fontFamily: 'Pretendard', color: descColor, lineHeight: `${descLineHeight}`, letterSpacing: '-0.18px', margin: '0' }}
      className="prose prose-lg max-w-none"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {sanitizeContent(displayDescription)}
      </ReactMarkdown>
    </div>
  ) : (
    <p style={{ fontSize: `${responsiveDescFontSize}px`, fontWeight: descFontWeight, fontFamily: 'Pretendard', color: descColor, lineHeight: `${descLineHeight}`, letterSpacing: '-0.18px', margin: '0', whiteSpace: 'pre-wrap' }}>
      {displayDescription}
    </p>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: contentGap, width: '100%' }}>
      {/* Hero Image */}
      {displayHero && (
        <div style={{ width: '100%', height: heroHeight, backgroundColor: '#d9d9d9ff', borderRadius: '0px', overflow: 'hidden' }}>
          <img src={displayHero} alt={displayTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* Text Section */}
      <div
        style={{ display: 'flex', flexDirection: textDirection, gap: responsiveColumnGap, width: '100%' }}
      >
        {/* Left Column - Title and Author */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px', flex: leftFlex, minWidth: leftMinWidth }}>
          <h1 style={{ fontSize: titleFontSize, fontWeight: '700', color: '#1b1d1fff', fontFamily: 'Satoshi', margin: '0', letterSpacing: '-0.6px', lineHeight: '1.2', wordBreak: 'keep-all' }}>
            {displayTitle}
          </h1>
          <p style={{ fontSize: isMobile ? '13px' : '14px', fontFamily: 'Pretendard', color: '#1b1d1fff', margin: '0', whiteSpace: isMobile ? 'normal' : 'nowrap' }}>
            <span style={{ fontWeight: '500' }}>{displayAuthor}</span>
            {displayEmail && (
              <span style={{ fontWeight: '400', color: '#7b828eff' }}> {displayEmail}</span>
            )}
          </p>
        </div>

        {/* Right Column - Description */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '16px' : '24px',
            flex: isMobile ? '1' : textColumnWidth === 'narrow' ? '0 0 400px' : textColumnWidth === 'wide' ? '0 0 800px' : '1',
          }}
        >
          {descriptionContent}
        </div>
      </div>

      {/* Gallery */}
      {displayGalleryImages.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', width: '100%' }}>
          {displayGalleryImages.map((image, index) => (
            <div
              key={index}
              style={{ width: '100%', backgroundColor: '#f0f0f0ff', borderRadius: '0px', overflow: 'hidden', lineHeight: '0', margin: index > 0 ? '-1px 0 0 0' : '0', padding: '0', fontSize: '0' }}
            >
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                style={{ width: '100%', height: 'auto', display: 'block', margin: '0', padding: '0' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
