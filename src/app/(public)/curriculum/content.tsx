'use client';

import { useResponsive } from '@/lib/responsive';
import { PADDING } from '@/constants/responsive';
import { CurriculumTab } from '@/components/public/curriculum';
import type { UndergraduateContent, GraduateContent } from '@/lib/validation/curriculum';

interface CurriculumContentProps {
  undergraduateContent?: UndergraduateContent | null;
  graduateContent?: GraduateContent | null;
}

export default function CurriculumContent({
  undergraduateContent,
  graduateContent,
}: CurriculumContentProps) {
  const { isMobile, isTablet } = useResponsive();

  // Responsive variables
  const containerPadding = isMobile ? PADDING.mobile : isTablet ? PADDING.tablet : PADDING.desktop;
  const containerPaddingVertical = isMobile ? '24px' : isTablet ? '32px' : '80px';
  const containerPaddingBottom = isMobile ? '24px' : isTablet ? '32px' : '61px';
  const sectionGap = isMobile ? '30px' : isTablet ? '60px' : '100px';

  return (
    <div
      style={{
        width: '100%',
        paddingTop: containerPaddingVertical,
        paddingBottom: containerPaddingBottom,
        paddingLeft: `${containerPadding}px`,
        paddingRight: `${containerPadding}px`,
        backgroundColor: '#ffffffff',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: sectionGap,
        }}
      >
        {/* Curriculum Tab Component */}
        <CurriculumTab
          undergraduateContent={undergraduateContent}
          graduateContent={graduateContent}
        />
      </div>
    </div>
  );
}
