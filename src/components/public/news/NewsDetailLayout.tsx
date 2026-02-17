'use client';

import { useResponsive } from '@/lib/responsive';

interface NewsDetailLayoutProps {
  children: React.ReactNode;
}

/**
 * Responsive layout wrapper for News detail pages.
 * Handles padding/gap responsive values as a client component,
 * since the News detail page itself is a server component.
 */
export default function NewsDetailLayout({ children }: NewsDetailLayoutProps) {
  const { isMobile, isTablet } = useResponsive();

  const paddingX = isMobile ? '16px' : isTablet ? '24px' : '40px';
  const contentGap = isMobile ? '40px' : isTablet ? '60px' : '100px';

  return (
    <div
      style={{
        width: '100%',
        paddingTop: '0px',
        paddingBottom: isMobile ? '40px' : '61px',
        paddingLeft: paddingX,
        paddingRight: paddingX,
        backgroundColor: '#ffffffff',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: contentGap,
        }}
      >
        {children}
      </div>
    </div>
  );
}
