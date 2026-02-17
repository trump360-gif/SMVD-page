'use client';

import { useResponsive } from '@/lib/responsive';
import { PADDING } from '@/constants/responsive';

export default function Footer() {
  const { isMobile, isTablet } = useResponsive();

  const footerPadding = isMobile ? '32px' : isTablet ? '48px' : '81px';
  const padding = isMobile ? PADDING.mobile : isTablet ? PADDING.tablet : PADDING.desktop;
  const footerGap = isMobile ? '24px' : '40px';
  const fontSize = isMobile ? '14px' : isTablet ? '15px' : '16px';
  const iconSize = isMobile ? '24px' : '31px';
  const iconHeight = isMobile ? '24px' : '32px';

  return (
    <footer
      style={{
        width: '100%',
        backgroundColor: '#ebeef4ff',
        borderTop: '1px solid #e5e7ebff',
        paddingTop: footerPadding,
        paddingBottom: footerPadding,
        paddingLeft: `${padding}px`,
        paddingRight: `${padding}px`,
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: footerGap,
          width: '100%',
        }}
      >
        {/* Left Section - Icon & Info */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            flex: 1,
          }}
        >
          {/* Icon */}
          <img
            src="/images/icon/Group-27-3.svg"
            alt="logo"
            width={isMobile ? 24 : 31}
            height={isMobile ? 24 : 32}
            style={{ display: 'block' }}
          />

          {/* Text */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0px',
            }}
          >
            <p
              style={{
                fontSize,
                fontWeight: '700',
                color: '#434850ff',
                fontFamily: 'Inter',
                margin: '0',
                lineHeight: 1.6,
                letterSpacing: '-0.3125px',
              }}
            >
              숙명여자대학교 미술대학 시각영상디자인학과
            </p>
            <p
              style={{
                fontSize,
                fontWeight: '400',
                color: '#434850ff',
                fontFamily: 'Inter',
                margin: '0',
                lineHeight: 1.6,
                letterSpacing: '-0.3125px',
              }}
            >
              University of Sookmyung Women, Visual Media Design
            </p>
          </div>
        </div>

        {/* Right Section - Contact */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flex: 1,
          }}
        >
          <p
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#434850ff',
              fontFamily: 'Inter',
              margin: '0',
              lineHeight: 1.6,
              letterSpacing: '-0.3125px',
            }}
          >
            Contact
          </p>
          <p
            style={{
              fontSize: '16px',
              fontWeight: '400',
              color: '#434850ff',
              fontFamily: 'Inter',
              margin: '0',
              lineHeight: 1.6,
              letterSpacing: '-0.3125px',
            }}
          >
            +82 (0)2 710 9958<br />
            서울 특별시 용산구 청파로 47길 100 숙명여자대학교<br />
            시각영상디자인과 (미술대학 201호)
          </p>
        </div>
      </div>
    </footer>
  );
}
