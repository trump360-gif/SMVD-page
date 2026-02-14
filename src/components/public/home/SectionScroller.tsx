'use client';

import { useEffect, useState } from 'react';

export default function SectionScroller() {
  const [section, setSection] = useState<string | null>(null);

  useEffect(() => {
    // 1️⃣ sessionStorage에서 섹션 읽기 (관리자가 설정한 섹션)
    const storedSection = sessionStorage.getItem('previewSection');
    setSection(storedSection || 'work');

    // 2️⃣ sessionStorage 변경 감지
    const handleStorageChange = () => {
      const updated = sessionStorage.getItem('previewSection');
      if (updated) {
        setSection(updated);
        console.log('🔔 sessionStorage 변경 감지:', updated);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!section) return;

    // Wait a bit for DOM to be fully rendered
    setTimeout(() => {
      const element = document.getElementById(`section-${section}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        console.log('📍 섹션으로 스크롤:', section);
      }
    }, 100);
  }, [section]);

  return null;
}
