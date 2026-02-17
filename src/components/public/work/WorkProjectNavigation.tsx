'use client';

import Link from 'next/link';
import { useResponsive } from '@/lib/responsive';

interface ProjectNav {
  id: string | number;
  title: string;
}

interface WorkProjectNavigationProps {
  previousProject?: ProjectNav | null;
  nextProject?: ProjectNav | null;
}

export default function WorkProjectNavigation({ previousProject, nextProject }: WorkProjectNavigationProps) {
  const { isMobile } = useResponsive();

  const navPadding = isMobile ? '10px 12px' : '12px 16px';
  const navFontSize = isMobile ? '13px' : '14px';

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', width: '100%' }}>
      {/* Previous Project */}
      {previousProject ? (
        <Link href={`/work/${previousProject.id}`}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: navPadding, borderRadius: '4px', backgroundColor: '#f5f5f5ff', cursor: 'pointer', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#efefefff';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5ff';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: navFontSize, fontWeight: '500', fontFamily: 'Pretendard', color: '#1b1d1fff' }}>
              ← Previous
            </span>
          </div>
        </Link>
      ) : (
        <div></div>
      )}

      {/* Next Project */}
      {nextProject ? (
        <Link href={`/work/${nextProject.id}`}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: navPadding, borderRadius: '4px', backgroundColor: '#f5f5f5ff', cursor: 'pointer', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#efefefff';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5ff';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: navFontSize, fontWeight: '500', fontFamily: 'Pretendard', color: '#1b1d1fff' }}>
              Next →
            </span>
          </div>
        </Link>
      ) : (
        <div></div>
      )}
    </div>
  );
}
