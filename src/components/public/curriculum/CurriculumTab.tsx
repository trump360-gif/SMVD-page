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
    <div className="flex flex-col gap-5 sm:gap-[30px] lg:gap-10 w-full box-border">
      {/* Tab Header */}
      <div className="flex gap-5 sm:gap-[30px] lg:gap-10 border-b-2 border-neutral-1450 pb-4 sm:pb-5">
        <button
          onClick={() => handleTabChange('undergraduate')}
          className={`bg-transparent border-none text-[18px] sm:text-[20px] lg:text-[24px] font-satoshi cursor-pointer py-2 m-0 transition-all duration-200 ease-in ${
            activeTab === 'undergraduate' ? 'font-bold text-neutral-1450' : 'font-normal text-[#7b828eff]'
          }`}
        >
          Undergraduate
        </button>
        <button
          onClick={() => handleTabChange('graduate')}
          className={`bg-transparent border-none text-[18px] sm:text-[20px] lg:text-[24px] font-satoshi cursor-pointer py-2 m-0 transition-all duration-200 ease-in ${
            activeTab === 'graduate' ? 'font-bold text-neutral-1450' : 'font-normal text-[#7b828eff]'
          }`}
        >
          Graduate School
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'undergraduate' && <UndergraduateTab content={undergraduateContent} />}
      {activeTab === 'graduate' && <GraduateTab content={graduateContent} />}
    </div>
  );
}
