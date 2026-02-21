'use client';

import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/public/home';
import { useResponsive } from '@/lib/responsive';
import { PADDING } from '@/constants/responsive';
import type { Professor } from '@/components/public/people/types';
import ProfessorHeader from '@/components/public/people/ProfessorHeader';
import ProfessorInfo from '@/components/public/people/ProfessorInfo';
import ProfessorCourses from '@/components/public/people/ProfessorCourses';
import ProfessorBiography from '@/components/public/people/ProfessorBiography';

interface ProfessorDetailContentProps {
  professor: Professor;
}

export default function ProfessorDetailContent({ professor }: ProfessorDetailContentProps) {
  const router = useRouter();
  const { isMobile, isTablet } = useResponsive();

  const mainPaddingX = isMobile ? '16px' : isTablet ? '40px' : '95.5px';
  const mainPaddingBottom = isMobile ? '60px' : '100px';
  const contentDirection = isMobile ? 'column' : 'row' as const;
  const contentGap = isMobile ? '40px' : isTablet ? '40px' : '80px';
  const contentPaddingTop = isMobile ? '40px' : '100px';
  const detailGap = isMobile ? '20px' : '30px';

  return (
    <div>
      <Header />

      {/* Tab Header Section - About Major / Our People */}
      <div
        style={{
          width: '100%',
          paddingTop: isMobile ? '24px' : isTablet ? '32px' : '60px',
          paddingBottom: '0px',
          paddingLeft: `${isMobile ? PADDING.mobile : isTablet ? PADDING.tablet : PADDING.desktop}px`,
          paddingRight: `${isMobile ? PADDING.mobile : isTablet ? PADDING.tablet : PADDING.desktop}px`,
          backgroundColor: '#ffffffff',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Tab Buttons */}
          <div
            style={{
              display: 'flex',
              gap: isMobile ? '20px' : isTablet ? '30px' : '40px',
              borderBottom: '1px solid #141414ff',
              paddingBottom: '10px',
            }}
          >
            <button
              onClick={() => router.push('/about')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: isMobile ? '16px' : isTablet ? '18px' : '24px',
                fontWeight: '400',
                color: '#141414ff',
                fontFamily: 'Inter',
                cursor: 'pointer',
                padding: '0',
                transition: 'all 0.2s ease',
                paddingBottom: '10px',
                marginBottom: '-10px',
              }}
            >
              About Major
            </button>
            <button
              onClick={() => router.push('/about?tab=people')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: isMobile ? '16px' : isTablet ? '18px' : '24px',
                fontWeight: '700',
                color: '#141414ff',
                fontFamily: 'Inter',
                cursor: 'pointer',
                padding: '0',
                borderBottom: '2px solid #141414ff',
                paddingBottom: '10px',
                marginBottom: '-10px',
                transition: 'all 0.2s ease',
              }}
            >
              Our People
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          width: '100%',
          paddingTop: '0px',
          paddingBottom: mainPaddingBottom,
          paddingLeft: mainPaddingX,
          paddingRight: mainPaddingX,
          backgroundColor: '#ffffffff',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: contentDirection,
            gap: contentGap,
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          {/* Left Panel - Professor Image & Badge */}
          <ProfessorHeader professor={professor} />

          {/* Right Panel - Details */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: detailGap,
              flex: 1,
              paddingTop: isMobile ? '0px' : contentPaddingTop,
              width: isMobile ? '100%' : undefined,
            }}
          >
            <ProfessorInfo professor={professor} />
            <ProfessorCourses courses={professor.courses} />
            <ProfessorBiography biography={professor.biography} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
