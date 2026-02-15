'use client';

import { useState, useEffect } from 'react';
import UndergraduateTab from './UndergraduateTab';
import GraduateTab from './GraduateTab';
import type { UndergraduateContent, GraduateContent } from '@/lib/validation/curriculum';

interface CurriculumTabProps {
  undergraduateContent?: UndergraduateContent | null;
  graduateContent?: GraduateContent | null;
}

export default function CurriculumTab({
  undergraduateContent,
  graduateContent,
}: CurriculumTabProps) {
  const [activeTab, setActiveTab] = useState<'undergraduate' | 'graduate'>('undergraduate');
  const [activeSubTab, setActiveSubTab] = useState<'master' | 'doctor' | 'thesis'>('master');

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const [tab, subtab] = hash.split(':');

      if (tab === 'graduate' || tab === 'undergraduate') {
        setActiveTab(tab as 'undergraduate' | 'graduate');
      }

      if (tab === 'graduate' && (subtab === 'master' || subtab === 'doctor' || subtab === 'thesis')) {
        setActiveSubTab(subtab);
      }
    };

    // Call on initial mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Scroll to section when activeSubTab changes
  useEffect(() => {
    if (activeTab === 'graduate' && activeSubTab) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        const element = document.getElementById(`section-${activeSubTab}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab, activeSubTab]);

  // Update hash when tab changes
  const handleTabChange = (tab: 'undergraduate' | 'graduate', subtab?: 'master' | 'doctor' | 'thesis') => {
    setActiveTab(tab);
    if (subtab) {
      setActiveSubTab(subtab);
      window.location.hash = `${tab}:${subtab}`;
    } else {
      window.location.hash = tab;
    }
  };

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
            onClick={() => handleTabChange('undergraduate')}
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
            onClick={() => handleTabChange('graduate')}
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
              whiteSpace: 'nowrap',
            }}
          >
            Graduate School
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'undergraduate' && <UndergraduateTab content={undergraduateContent} />}
      {activeTab === 'graduate' && <GraduateTab content={graduateContent} />}
    </div>
  );
}
