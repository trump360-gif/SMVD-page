'use client';

import Image from 'next/image';
import { useResponsive } from '@/lib/responsive';
import type { Professor } from './types';

interface ProfessorHeaderProps {
  professor: Professor;
}

export default function ProfessorHeader({ professor }: ProfessorHeaderProps) {
  const { isMobile, isTablet } = useResponsive();

  const imageWidth = isMobile ? '100%' : isTablet ? '200px' : '333px';
  const imageHeight = isMobile ? '350px' : isTablet ? '280px' : '468px';
  const imageFlexShrink = isMobile ? undefined : 0;
  const badgeFontSize = isMobile ? '14px' : '18px';
  const contentPaddingTop = isMobile ? '40px' : '100px';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: imageWidth,
        flexShrink: imageFlexShrink,
        paddingTop: contentPaddingTop,
        position: 'relative',
      }}
    >
      {/* Profile Image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: imageHeight,
          backgroundColor: '#f3f4f6ff',
          marginBottom: '0px',
        }}
      >
        <Image
          src={professor.profileImage}
          alt={professor.name}
          fill
          sizes={isMobile ? '100vw' : isTablet ? '200px' : '333px'}
          style={{
            objectFit: 'cover',
          }}
          priority
        />
      </div>

      {/* Badge - Overlay on image */}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          backgroundColor: '#141414ff',
          padding: isMobile ? '10px 0' : '12px 0',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <span
          style={{
            fontSize: badgeFontSize,
            fontWeight: 'normal',
            color: '#ffffffff',
            fontFamily: 'Helvetica',
            letterSpacing: '-0.27px',
          }}
        >
          {professor.badge}
        </span>
      </div>
    </div>
  );
}
