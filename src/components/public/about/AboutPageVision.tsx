'use client';

import { useResponsive } from '@/lib/responsive';
import { PADDING } from '@/constants/responsive';

interface AboutPageVisionProps {
  title?: string;
  content?: string;
  chips?: string[];
}

export default function AboutPageVision({
  title = 'Vision',
  content = '시각정보의 전달 및 상품과 서비스의 유통과정에서 직면하는 각종\n커뮤니케이션 문제를 분석하고 이를 대처해 나갈 수 있도록 다양한 분야에\n적용되고 있습니다. 시각영상디자인과는 현대산업사회에서 보다 다양하고\n광범위한 양상으로 변모되고 있습니다. 이러한 시대와 사회적 요구에 부응하기\n위해 건실한 예술적 기량과 개성적이며 창의적인 조형감각을 지닌 디자이너를\n양성하는 것에 교육 목표를 두고 있습니다.',
  chips = ['UX/UI', 'Graghic', 'Editorial', 'Illustration', 'Branding', 'CM/CF', 'Game'],
}: AboutPageVisionProps) {
  const { isMobile, isTablet } = useResponsive();

  const titleFontSize = isMobile ? '24px' : isTablet ? '32px' : '48px';
  const titleMinWidth = isMobile ? 'auto' : isTablet ? '200px' : '333px';
  const contentFontSize = isMobile ? '14px' : isTablet ? '16px' : '18px';
  const chipFontSize = isMobile ? '12px' : isTablet ? '13px' : '14px';
  const chipGap = isMobile ? '6px' : isTablet ? '20px' : '24px';
  const containerFlexDirection = isMobile ? 'column' : 'row';
  const containerGap = isMobile ? '10px' : isTablet ? '16px' : '10px';
  const containerPaddingHorizontal = isMobile ? PADDING.mobile : isTablet ? PADDING.tablet : 0;
  const contentWidth = isMobile ? '353px' : '100%';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: containerFlexDirection,
        gap: containerGap,
        width: '100%',
        alignItems: isMobile ? 'center' : 'flex-start',
        justifyContent: isMobile ? 'center' : 'flex-start',
        paddingLeft: `${containerPaddingHorizontal}px`,
        paddingRight: `${containerPaddingHorizontal}px`,
      }}
    >
      {/* Title */}
      <h2
        style={{
          fontSize: titleFontSize,
          fontWeight: '500',
          color: '#141414ff',
          fontFamily: 'Inter',
          margin: '0',
          letterSpacing: '-0.128px',
          lineHeight: 1.1,
          minWidth: titleMinWidth,
          flex: isMobile ? '1' : '0 0 333px',
        }}
      >
        {title}
      </h2>

      {/* Content Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1,
          width: isMobile ? contentWidth : 'auto',
          alignItems: isMobile ? 'center' : 'auto',
        }}
      >
        {/* Chips/Tags Container */}
        <div
          style={{
            display: 'flex',
            gap: chipGap,
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-start',
          }}
        >
          {chips.map((chip) => (
            <div
              key={chip}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: isMobile ? '24px' : '28px',
                padding: '0 8px',
                backgroundColor: '#ebecf0ff',
                borderRadius: '0px',
              }}
            >
              <span
                style={{
                  fontSize: chipFontSize,
                  fontWeight: '500',
                  color: '#141414ff',
                  fontFamily: 'Inter',
                  letterSpacing: '-0.29px',
                  lineHeight: 1.5,
                  whiteSpace: 'nowrap',
                }}
              >
                {chip}
              </span>
            </div>
          ))}
        </div>

        {/* Text Content */}
        <p
          style={{
            fontSize: contentFontSize,
            fontWeight: '500',
            color: '#141414ff',
            fontFamily: 'Inter',
            margin: '0',
            letterSpacing: '-0.619px',
            lineHeight: 1.5,
            wordBreak: 'keep-all',
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          {content}
        </p>
      </div>
    </div>
  );
}
