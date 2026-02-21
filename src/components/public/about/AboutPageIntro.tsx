'use client';

import Image from 'next/image';
import { useResponsive } from '@/lib/responsive';
import { PADDING, FONT_SIZE } from '@/constants/responsive';

interface AboutPageIntroProps {
  title?: string;
  description?: string;
  imageSrc?: string;
}

export default function AboutPageIntro({
  title = 'About',
  description = '시각·영상디자인과에서는 커뮤니케이션 시대의 다양한 정보, 인간의 의사,\n사물의 이미지를 정확하고 합리적인 방법으로 전달하기 위한 창의적 사고와\n창조 행위를 배웁니다. 사람들의 마음을 움직일 수 있는 시각을 통해\n자신의 생각과 표현력을 효과적으로 전달하는 방법을 탐구하는 학문입니다.',
  imageSrc = '/images/about/image 32.png',
}: AboutPageIntroProps) {
  const { isMobile, isTablet } = useResponsive();

  const containerGap = isMobile ? '10px' : isTablet ? '32px' : '40px';
  const titleFontSize = isMobile ? '24px' : isTablet ? '32px' : '48px';
  const descriptionFontSize = isMobile ? '14px' : isTablet ? '16px' : '18px';
  const imageHeight = isMobile ? '196px' : isTablet ? '300px' : '500px';
  const containerWidth = '100%';
  const descriptionWidth = isMobile ? '353px' : isTablet ? '100%' : '848px';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isMobile ? 'center' : 'flex-start',
        gap: containerGap,
        width: '100%',
        paddingLeft: isMobile ? `${PADDING.mobile}px` : 0,
        paddingRight: isMobile ? `${PADDING.mobile}px` : 0,
      }}
    >
      {/* Top Section - Title & Description */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: containerWidth,
          paddingLeft: isMobile ? `${PADDING.mobile}px` : isTablet ? `${PADDING.tablet}px` : '0',
          paddingRight: isMobile ? `${PADDING.mobile}px` : isTablet ? `${PADDING.tablet}px` : '0',
        }}
      >
        <h1
          style={{
            fontSize: titleFontSize,
            fontWeight: '500',
            color: '#141414ff',
            fontFamily: 'Inter',
            margin: '0',
            letterSpacing: '-0.128px',
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>
        {/* Description Section */}
        <div
          style={{
            fontSize: descriptionFontSize,
            fontWeight: '500',
            color: '#141414ff',
            fontFamily: 'Inter',
            letterSpacing: '-0.619px',
            lineHeight: 1.5,
            width: descriptionWidth,
            wordBreak: 'keep-all',
            whiteSpace: 'pre-wrap',
          }}
        >
          {description}
        </div>
      </div>

      {/* Bottom Section - Image */}
      <div
        style={{
          position: 'relative',
          width: containerWidth,
          height: imageHeight,
          backgroundColor: '#e1e1e1ff',
          overflow: 'hidden',
          paddingLeft: isMobile ? `${PADDING.mobile}px` : isTablet ? `${PADDING.tablet}px` : '0',
          paddingRight: isMobile ? `${PADDING.mobile}px` : isTablet ? `${PADDING.tablet}px` : '0',
          boxSizing: 'border-box',
        }}
      >
        <Image
          src={imageSrc}
          alt="About SMVD Hero Image"
          width={1017}
          height={500}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1360px"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          priority
          quality={85}
        />
      </div>
    </div>
  );
}
