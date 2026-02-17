'use client';

import { useResponsive } from '@/lib/responsive';
import type { Professor } from './types';

interface ProfessorBiographyProps {
  biography: Professor['biography'];
}

export default function ProfessorBiography({ biography }: ProfessorBiographyProps) {
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
          width: isMobile ? '60px' : '70px',
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
          약력
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* CV Download */}
        <a
          href="#"
          style={{
            fontSize: detailFontSize,
            fontWeight: 'normal',
            color: '#141414ff',
            fontFamily: 'Inter',
            margin: '0',
            letterSpacing: '-0.44px',
            lineHeight: 1.5,
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          {biography.cvText}
        </a>

        {/* Position */}
        <p
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
          {biography.position}
        </p>

        {/* Education */}
        <div>
          {biography.education.map((edu, idx) => (
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
              {edu}
            </p>
          ))}
        </div>

        {/* Experience */}
        <div>
          {biography.experience.map((exp, idx) => (
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
              {exp}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
