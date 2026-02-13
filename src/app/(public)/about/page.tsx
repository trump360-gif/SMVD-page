'use client';

import { useState } from 'react';
import {
  Header,
  Footer,
} from '@/components/public/home';
import {
  AboutPageIntro,
  AboutPageVision,
  AboutPageHistory,
  OurPeopleTab,
} from '@/components/public/about';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<'major' | 'people'>('major');
  return (
    <div>
      {/* Header */}
      <Header />

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
            gap: '100px',
          }}
        >
          {/* About Major Tab */}
          {activeTab === 'major' && (
            <>
              <AboutPageIntro />
              <AboutPageVision />
              <AboutPageHistory />
            </>
          )}

          {/* Our People Tab */}
          {activeTab === 'people' && <OurPeopleTab />}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
