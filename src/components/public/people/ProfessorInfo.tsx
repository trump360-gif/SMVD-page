'use client';

import { useResponsive } from '@/lib/responsive';
import type { Professor } from './types';

interface ProfessorInfoProps {
  professor: Professor;
}

export default function ProfessorInfo({ professor }: ProfessorInfoProps) {
  const { isMobile } = useResponsive();

  const nameFontSize = isMobile ? '36px' : '60px';
  const nameHeight = isMobile ? 'auto' : '66px';
  const labelGap = isMobile ? '12px' : '30px';
  const detailFontSize = isMobile ? '15px' : '18px';
  const labelFontSize = isMobile ? '12px' : '14px';

  return (
    <>
      {/* Name */}
      <div
        style={{
          height: nameHeight,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <h1
          style={{
            fontSize: nameFontSize,
            fontWeight: 'normal',
            color: '#0a0a0aff',
            fontFamily: 'Helvetica',
            margin: '0',
            letterSpacing: '-0.6px',
            lineHeight: 1.1,
          }}
        >
          {professor.name}
        </h1>
      </div>

      {/* Office */}
      <div style={{ display: 'flex', gap: labelGap, alignItems: 'center' }}>
        <div
          style={{
            backgroundColor: '#ebecf0ff',
            padding: '0 12px',
            borderRadius: '0px',
            width: isMobile ? '70px' : '80px',
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
            연구실
          </span>
        </div>
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
          {professor.office}
        </p>
      </div>

      {/* Email */}
      <div style={{ display: 'flex', gap: labelGap, alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row' }}>
        <div
          style={{
            backgroundColor: '#ebecf0ff',
            padding: '0 12px',
            borderRadius: '0px',
            width: isMobile ? '70px' : '80px',
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
            이메일
          </span>
        </div>
        <p
          style={{
            fontSize: isMobile ? '14px' : detailFontSize,
            fontWeight: 'normal',
            color: '#141414ff',
            fontFamily: 'Inter',
            margin: '0',
            letterSpacing: '-0.44px',
            lineHeight: 1.5,
            wordBreak: isMobile ? 'break-all' : undefined,
          }}
        >
          {professor.email.join(isMobile ? '\n' : ' ')}
        </p>
      </div>

      {/* Homepage */}
      {professor.homepage && (
        <div style={{ display: 'flex', gap: labelGap, alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row' }}>
          <div
            style={{
              backgroundColor: '#ebecf0ff',
              padding: '0 12px',
              borderRadius: '0px',
              width: isMobile ? '70px' : '80px',
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
              홈페이지
            </span>
          </div>
          <a
            href={professor.homepage}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: isMobile ? '14px' : detailFontSize,
              fontWeight: 'normal',
              color: '#141414ff',
              fontFamily: 'Inter',
              margin: '0',
              letterSpacing: '-0.44px',
              lineHeight: 1.5,
              textDecoration: 'underline',
              cursor: 'pointer',
              wordBreak: isMobile ? 'break-all' : undefined,
            }}
          >
            {professor.homepage}
          </a>
        </div>
      )}
    </>
  );
}
