'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isMobile, isTablet } = useResponsive();
  const [activeTab, setActiveTab] = useState<'major' | 'people'>('major');

  // Responsive variables
  const containerPadding = isMobile ? PADDING.mobile : isTablet ? PADDING.tablet : PADDING.desktop;
  const tabButtonFontSize = isMobile ? '16px' : isTablet ? '18px' : '24px';
  const tabButtonGap = isMobile ? '20px' : isTablet ? '30px' : '40px';
  const sectionGap = isMobile ? '40px' : isTablet ? '40px' : '50px';

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'people') {
      setActiveTab('people');
    }
  }, [searchParams]);

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
          gap: sectionGap,
        }}
      >
        {/* Tab Buttons */}
        <div
          style={{
            display: 'flex',
            gap: tabButtonGap,
            borderBottom: '2px solid #141414ff',
            paddingBottom: isMobile ? '16px' : '20px',
          }}
        >
          <button
            onClick={() => {
              setActiveTab('major');
              router.push('/about');
            }}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: tabButtonFontSize,
              fontWeight: activeTab === 'major' ? '700' : '400',
              color: activeTab === 'major' ? '#141414ff' : '#7b828eff',
              fontFamily: 'Satoshi',
              cursor: 'pointer',
              padding: '8px 0',
              margin: '0',
              transition: 'all 0.2s ease',
            }}
          >
            About Major
          </button>
          <button
            onClick={() => {
              setActiveTab('people');
              router.push('/about?tab=people');
            }}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: tabButtonFontSize,
              fontWeight: activeTab === 'people' ? '700' : '400',
              color: activeTab === 'people' ? '#141414ff' : '#7b828eff',
              fontFamily: 'Satoshi',
              cursor: 'pointer',
              padding: '8px 0',
              margin: '0',
              transition: 'all 0.2s ease',
            }}
          >
            Our People
          </button>
        </div>

        {/* About Major Tab */}
        {activeTab === 'major' && (
          <div
            id="sections"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: sectionGap,
            }}
          >
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
          </div>
        )}

        {/* Our People Tab */}
        {activeTab === 'people' && (
          <div id="people">
            <OurPeopleTab
              professors={peopleData?.professors}
              instructors={peopleData?.instructors}
            />
          </div>
        )}
      </div>
    </div>
  );
}
