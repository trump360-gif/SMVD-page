'use client';

import { useResponsive } from '@/lib/responsive';
import type { Semester } from './types';

interface SemesterGridProps {
  semesters: Semester[];
  checkedClassification: string;
}

export default function SemesterGrid({
  semesters,
  checkedClassification,
}: SemesterGridProps) {
  const { isMobile, isTablet } = useResponsive();

  // Responsive grid columns: 1 column on mobile, 2 on tablet, 4 on desktop
  const gridColumns = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)';

  // Responsive course item styles
  const courseHeight = isMobile ? 'auto' : '95px';
  const coursePadding = isMobile ? '16px 0' : '35px 0';
  const courseFontSize = isMobile ? '14px' : '18px';
  const semesterTitleFontSize = isMobile ? '14px' : '18px';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: gridColumns,
        gap: '10px',
        rowGap: '60px',
        width: '100%',
        gridAutoRows: '1fr',
      }}
    >
      {semesters.map((semester, index) => (
        <div
          key={index}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          {/* Semester Title */}
          <h3
            style={{
              fontSize: semesterTitleFontSize,
              fontWeight: '500',
              color: '#000000ff',
              fontFamily: 'Pretendard',
              margin: '0',
            }}
          >
            {semester.year}학년 {semester.term}학기
          </h3>

          {/* Courses List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {semester.courses.map((course, courseIndex) => {
              const isMatchedClassification =
                course.classification === checkedClassification;
              return (
                <div
                  key={courseIndex}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    height: courseHeight,
                    padding: coursePadding,
                    backgroundColor: isMatchedClassification
                      ? '#f0f0f0ff'
                      : '#ffffffff',
                    borderBottom: '1px solid #000000ff',
                    boxSizing: 'border-box',
                  }}
                >
                  {/* Color Tag */}
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      backgroundColor: course.color,
                      flexShrink: 0,
                      marginLeft: '10px',
                    }}
                  />

                  {/* Course Name */}
                  <p
                    style={{
                      fontSize: courseFontSize,
                      fontWeight: '500',
                      color: '#353030ff',
                      fontFamily: 'Pretendard',
                      margin: '0',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'keep-all',
                      lineHeight: 1.4,
                    }}
                  >
                    {course.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
