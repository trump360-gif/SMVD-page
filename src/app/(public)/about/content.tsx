'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  AboutPageIntro,
  AboutPageVision,
  AboutPageHistory,
  OurPeopleTab,
} from '@/components/public/about';

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
  };
}

export default function AboutContent({
  introData,
  visionData,
  historyData,
}: AboutContentProps) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'major' | 'people'>('major');

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
          paddingTop: '60px',
          paddingBottom: '0px',
          paddingLeft: '40px',
          paddingRight: '40px',
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
              gap: '40px',
              borderBottom: '1px solid #141414ff',
              paddingBottom: '10px',
            }}
          >
            <button
              onClick={() => setActiveTab('major')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
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
              About Major
            </button>
            <button
              onClick={() => setActiveTab('people')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
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
              Our People
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div
        style={{
          width: '100%',
          paddingTop: '80px',
          paddingBottom: '61px',
          paddingLeft: '40px',
          paddingRight: '40px',
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
              gap: '50px',
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
                />
              </>
            )}
          </div>

          {/* Our People Tab */}
          <div id="people">
            {activeTab === 'people' && <OurPeopleTab />}
          </div>
        </div>
      </div>
    </>
  );
}
