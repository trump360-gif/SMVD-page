'use client';

import { useResponsive } from '@/lib/responsive';

export default function VideoHero() {
  const { isMobile, isTablet } = useResponsive();

  const heroHeight = isMobile ? '40vh' : isTablet ? '50vh' : '949px';
  const heroMarginBottom = isMobile ? '24px' : isTablet ? '32px' : '40px';

  return (
    <div
      style={{
        width: '100%',
        height: heroHeight,
        backgroundColor: '#000000ff',
        borderRadius: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: heroMarginBottom,
      }}
    >
      {/* 비디오 영역 - 나중에 추가 예정 */}
      <p
        style={{
          color: '#ffffff80',
          fontSize: '14px',
          fontFamily: 'Helvetica',
        }}
      >
        Video coming soon...
      </p>
    </div>
  );
}
