'use client';

import { useState } from 'react';
import UndergraduateTab from './UndergraduateTab';
import GraduateTab from './GraduateTab';

export default function CurriculumTab() {
  const [activeTab, setActiveTab] = useState<'undergraduate' | 'graduate'>('undergraduate');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        width: '100%',
      }}
    >
      {/* Tab Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1125px',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          width: '100%',
          paddingBottom: '20px',
          borderBottom: '2.5px solid #000000ff',
        }}
      >
        {/* Curriculum Title */}
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1b1d1fff',
            fontFamily: 'Satoshi',
            margin: '0',
            letterSpacing: '-0.24px',
            flexShrink: 0,
          }}
        >
          Curriculum
        </h2>

        {/* Tab Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
          }}
        >
          <button
            onClick={() => setActiveTab('undergraduate')}
            style={{
              fontSize: '18px',
              fontWeight: '500',
              fontFamily: 'Satoshi',
              color: activeTab === 'undergraduate' ? '#141414ff' : '#7b828eff',
              backgroundColor: activeTab === 'undergraduate' ? '#ffffffff' : 'transparent',
              border: activeTab === 'undergraduate' ? 'none' : 'none',
              padding: '8px 0',
              cursor: 'pointer',
              margin: '0',
              transition: 'color 0.3s ease',
            }}
          >
            Undergraduate
          </button>
          <button
            onClick={() => setActiveTab('graduate')}
            style={{
              fontSize: '18px',
              fontWeight: '500',
              fontFamily: 'Satoshi',
              color: activeTab === 'graduate' ? '#141414ff' : '#7b828eff',
              backgroundColor: activeTab === 'graduate' ? '#ffffffff' : 'transparent',
              border: activeTab === 'graduate' ? 'none' : 'none',
              padding: '8px 0',
              cursor: 'pointer',
              margin: '0',
              transition: 'color 0.3s ease',
            }}
          >
            Graduate
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'undergraduate' && <UndergraduateTab />}
      {activeTab === 'graduate' && <GraduateTab />}
    </div>
  );
}
