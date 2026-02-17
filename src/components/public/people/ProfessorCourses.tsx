'use client';

import { useResponsive } from '@/lib/responsive';
import type { Professor } from './types';

interface ProfessorCoursesProps {
  courses: Professor['courses'];
}

export default function ProfessorCourses({ courses }: ProfessorCoursesProps) {
  const { isMobile } = useResponsive();

  const labelGap = isMobile ? '12px' : '30px';
  const detailFontSize = isMobile ? '15px' : '18px';
  const labelFontSize = isMobile ? '12px' : '14px';

  return (
    <div style={{ display: 'flex', gap: labelGap, alignItems: 'flex-start' }}>
      <div
        style={{
          backgroundColor: '#ebecf0ff',
          padding: '0 12px',
          borderRadius: '0px',
          width: isMobile ? '70px' : '90px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '28px',
        }}
      >
        <span
          style={{
            fontSize: labelFontSize,
            fontWeight: 'normal',
            color: '#141414ff',
            fontFamily: 'Helvetica',
            lineHeight: 1.5,
          }}
        >
          담당과목
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0px',
        }}
      >
        {/* Undergraduate */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
            marginBottom: '8px',
          }}
        >
          <p
            style={{
              fontSize: detailFontSize,
              fontWeight: 'normal',
              color: '#353030ff',
              fontFamily: 'Inter',
              margin: '0',
              letterSpacing: '-0.44px',
              lineHeight: 1.5,
              minWidth: '30px',
              flexShrink: 0,
            }}
          >
            학사
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0px',
            }}
          >
            {courses.undergraduate.map((course, idx) => (
              <p
                key={idx}
                style={{
                  fontSize: detailFontSize,
                  fontWeight: 'normal',
                  color: '#141414ff',
                  fontFamily: 'Inter',
                  margin: '0',
                  letterSpacing: '-0.44px',
                  lineHeight: 1.5,
                }}
              >
                {course}
              </p>
            ))}
          </div>
        </div>

        {/* Graduate */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
          }}
        >
          <p
            style={{
              fontSize: detailFontSize,
              fontWeight: 'normal',
              color: '#353030ff',
              fontFamily: 'Inter',
              margin: '0',
              letterSpacing: '-0.44px',
              lineHeight: 1.5,
              minWidth: '30px',
              flexShrink: 0,
            }}
          >
            석사
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0px',
            }}
          >
            {courses.graduate.map((course, idx) => (
              <p
                key={idx}
                style={{
                  fontSize: detailFontSize,
                  fontWeight: 'normal',
                  color: '#141414ff',
                  fontFamily: 'Inter',
                  margin: '0',
                  letterSpacing: '-0.44px',
                  lineHeight: 1.5,
                }}
              >
                {course}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
