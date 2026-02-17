'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useResponsive } from '@/lib/responsive';
import { PADDING } from '@/constants/responsive';
import {
  AboutPageIntro,
  AboutPageVision,
  AboutPageHistory,
  OurPeopleTab,
} from '@/components/public/about';

interface Professor {
  id: string;
  name: string;
  title: string;
  office?: string;
  email: string[];
  phone?: string;
  badge?: string;
  courses?: {
    undergraduate: string[];
    graduate: string[];
  };
}

interface Instructor {
  name: string;
  specialty: string;
}

interface AboutContentProps {
  introData?: {
    title?: string;
    description?: string;
    imageSrc?: string;
  };
  visionData?: {
    title?: string;
    content?: string;
    chips?: string[];
  };
  historyData?: {
    title?: string;
    introText?: string;
    timelineItems?: Array<{ year: string; description: string }>;
  };
  peopleData?: {
    professors?: Professor[];
    instructors?: Instructor[];
  };
}

export default function AboutContent({
  introData,
  visionData,
  historyData,
  peopleData,
}: AboutContentProps) {
  const searchParams = useSearchParams();
  const { isMobile, isTablet } = useResponsive();
  const [activeTab, setActiveTab] = useState<'major' | 'people'>('major');

  // Responsive variables
  const containerPadding = isMobile ? PADDING.mobile : isTablet ? PADDING.tablet : PADDING.desktop;
  const containerPaddingTop = isMobile ? '24px' : isTablet ? '32px' : '60px';
  const containerPaddingVertical = isMobile ? '24px' : isTablet ? '32px' : '80px';
  const containerPaddingBottom = isMobile ? '24px' : isTablet ? '32px' : '61px';
  const tabButtonFontSize = isMobile ? '16px' : isTablet ? '18px' : '24px';
  const tabButtonGap = isMobile ? '20px' : isTablet ? '30px' : '40px';
  const sectionGap = isMobile ? '32px' : isTablet ? '40px' : '50px';

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'people') {
      setActiveTab('people');
    }
  }, [searchParams]);

  return (
    <>
      {/* Tab Header Section */}
      <div
        style={{
          width: '100%',
          paddingTop: containerPaddingTop,
          paddingBottom: '0px',
          paddingLeft: `${containerPadding}px`,
          paddingRight: `${containerPadding}px`,
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
              gap: tabButtonGap,
              borderBottom: '1px solid #141414ff',
              paddingBottom: '10px',
            }}
          >
            <button
              onClick={() => setActiveTab('major')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: tabButtonFontSize,
                fontWeight: activeTab === 'major' ? '700' : '400',
                color: '#141414ff',
                fontFamily: 'Inter',
                cursor: 'pointer',
                padding: '0',
                transition: 'all 0.2s ease',
                borderBottom: activeTab === 'major' ? '2px solid #141414ff' : 'none',
                paddingBottom: '10px',
                marginBottom: '-10px',
              }}
            >
              {isMobile ? 'Major' : 'About Major'}
            </button>
            <button
              onClick={() => setActiveTab('people')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: tabButtonFontSize,
                fontWeight: activeTab === 'people' ? '700' : '400',
                color: '#141414ff',
                fontFamily: 'Inter',
                cursor: 'pointer',
                padding: '0',
                transition: 'all 0.2s ease',
                borderBottom: activeTab === 'people' ? '2px solid #141414ff' : 'none',
                paddingBottom: '10px',
                marginBottom: '-10px',
              }}
            >
              {isMobile ? 'People' : 'Our People'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
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
          }}
        >
          {/* About Major Tab */}
          <div
            id="sections"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: sectionGap,
            }}
          >
            {activeTab === 'major' && (
              <>
                <AboutPageIntro
                  title={introData?.title}
                  description={introData?.description}
                  imageSrc={introData?.imageSrc}
                />
                <AboutPageVision
                  title={visionData?.title}
                  content={visionData?.content}
                  chips={visionData?.chips}
                />
                <AboutPageHistory
                  title={historyData?.title}
                  introText={historyData?.introText}
                  timelineItems={historyData?.timelineItems}
                />
              </>
            )}
          </div>

          {/* Our People Tab */}
          <div id="people">
            {activeTab === 'people' && (
              <OurPeopleTab
                professors={peopleData?.professors}
                instructors={peopleData?.instructors}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
