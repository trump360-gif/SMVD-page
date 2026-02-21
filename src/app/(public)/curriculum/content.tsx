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

  return (
    <div
      style={{
        width: '100%',
        paddingTop: '0px',
        paddingBottom: '61px',
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
          gap: '40px',
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
