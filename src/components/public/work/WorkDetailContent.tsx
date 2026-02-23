'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sanitizeContent } from '@/lib/sanitize';
import { hasMarkdownSyntax } from './WorkDetailTypes';

interface WorkDetailContentProps {
  displayHero: string;
  displayTitle: string;
  displayAuthor: string;
  displayEmail: string;
  displayDescription: string;
  displayGalleryImages: string[];
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
  columnGap,
  textColumnWidth,
  descFontSize,
  descFontWeight,
  descColor,
  descLineHeight,
}: WorkDetailContentProps) {
  const responsiveDescFontSizeMobile = Math.min(descFontSize, 15);
  const responsiveColumnGapTablet = Math.min(columnGap, 40);

  const cssVariables = {
    '--desc-font-size': `${descFontSize}px`,
    '--desc-font-size-mobile': `${responsiveDescFontSizeMobile}px`,
    '--column-gap': `${columnGap}px`,
    '--column-gap-tablet': `${responsiveColumnGapTablet}px`,
    '--desc-font-weight': descFontWeight,
    '--desc-color': descColor,
    '--desc-line-height': descLineHeight,
  } as React.CSSProperties;

  const descriptionContent = hasMarkdownSyntax(displayDescription) ? (
    <div
      className="prose prose-lg max-w-none font-pretendard m-0 tracking-[-0.18px] text-(--desc-font-size-mobile) sm:text-(--desc-font-size) font-(--desc-font-weight) text-(--desc-color) leading-(--desc-line-height)"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {sanitizeContent(displayDescription)}
      </ReactMarkdown>
    </div>
  ) : (
    <p className="font-pretendard m-0 whitespace-pre-wrap tracking-[-0.18px] text-(--desc-font-size-mobile) sm:text-(--desc-font-size) font-(--desc-font-weight) text-(--desc-color) leading-(--desc-line-height)">
      {displayDescription}
    </p>
  );

  return (
    <div className="flex flex-col gap-10 sm:gap-[60px] lg:gap-[100px] w-full" style={cssVariables}>
      {/* Hero Image */}
      {displayHero && (
        <div className="w-full h-[300px] sm:h-[500px] lg:h-[860px] bg-[#d9d9d9] rounded-none overflow-hidden">
          <img src={displayHero} alt={displayTitle} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Text Section */}
      <div className="flex flex-col sm:flex-row w-full gap-[24px] sm:gap-[var(--column-gap-tablet)] lg:gap-[var(--column-gap)]">
        {/* Left Column - Title and Author */}
        <div className="flex flex-col gap-4 sm:gap-6 flex-1 sm:flex-none sm:min-w-[280px] lg:min-w-[400px]">
          <h1 className="text-[32px] sm:text-[44px] lg:text-[60px] font-bold text-[#1b1d1f] font-satoshi m-0 tracking-[-0.6px] leading-[1.2] break-keep">
            {displayTitle}
          </h1>
          <p className="text-[13px] sm:text-[14px] font-pretendard text-[#1b1d1f] m-0 whitespace-normal sm:whitespace-nowrap">
            <span className="font-medium">{displayAuthor}</span>
            {displayEmail && (
              <span className="font-normal text-[#7b828e]"> {displayEmail}</span>
            )}
          </p>
        </div>

        {/* Right Column - Description */}
        <div
          className={`flex flex-col gap-4 sm:gap-6 flex-1 ${
            textColumnWidth === 'narrow' ? 'sm:flex-none sm:w-[400px]' : textColumnWidth === 'wide' ? 'sm:flex-none sm:w-[800px]' : ''
          }`}
        >
          {descriptionContent}
        </div>
      </div>

      {/* Gallery */}
      {displayGalleryImages.length > 0 && (
        <div className="flex flex-col gap-0 w-full">
          {displayGalleryImages.map((image, index) => (
            <div
              key={index}
              className={`w-full bg-[#f0f0f0] rounded-none overflow-hidden leading-none p-0 text-[0px] ${index > 0 ? '-mt-px' : 'mt-0'}`}
            >
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-auto block m-0 p-0"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
