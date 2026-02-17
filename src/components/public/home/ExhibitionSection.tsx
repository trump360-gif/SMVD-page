'use client';

import Image from 'next/image';
import { useResponsive } from '@/lib/responsive';
import { GAP } from '@/constants/responsive';

interface ExhibitionItem {
  year: string;
  src: string;
  alt: string;
}

interface ExhibitionSectionProps {
  items?: ExhibitionItem[];
}

export default function ExhibitionSection({
  items = [
    {
      year: '2025',
      src: '/images/home/exhibition-2025.png',
      alt: 'SMVD Grad Exhibition 2025',
    },
    {
      year: '2024',
      src: '/images/home/exhibition-2024.png',
      alt: 'Visual Media Design Graduation Show 2024',
    },
    {
      year: '2023',
      src: '/images/home/exhibition-2023.png',
      alt: 'Kickoff 2023',
    },
  ],
}: ExhibitionSectionProps) {
  const { isMobile, isTablet } = useResponsive();

  const sectionGap = isMobile ? GAP.mobile : isTablet ? GAP.tablet : GAP.desktop;
  const sectionMarginBottom = isMobile ? '40px' : isTablet ? '60px' : '80px';
  const gridColumns = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';
  const gridGap = isMobile ? GAP.mobile : isTablet ? GAP.tablet : GAP.desktop;
  const titleFontSize = isMobile ? '20px' : isTablet ? '24px' : '32px';

  return (
    <section
      id="exhibition"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${sectionGap}px`,
        width: '100%',
        marginBottom: sectionMarginBottom,
      }}
    >
      {/* Exhibition Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #141414ff',
          paddingBottom: '20px',
        }}
      >
        <h2
          style={{
            fontSize: titleFontSize,
            fontWeight: '700',
            fontFamily: 'Helvetica',
            color: '#141414ff',
            margin: 0,
          }}
        >
          Exhibition
        </h2>
        <a
          href="#"
          style={{
            fontSize: '14px',
            fontWeight: '400',
            fontFamily: 'Helvetica',
            color: '#141414ff',
            textDecoration: 'none',
          }}
        >
          More →
        </a>
      </div>

      {/* Exhibition Items Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: gridColumns,
          gap: `${gridGap}px`,
          width: '100%',
        }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* Year Indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '400',
                  fontFamily: 'Helvetica',
                  color: '#141414ff',
                }}
              >
                {item.year}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 14L14 2M14 2H6M14 2V10"
                  stroke="#141414ff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Exhibition Image */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '9/13',
                backgroundColor: '#f5f5f5ff',
                overflow: 'hidden',
                borderRadius: '0',
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                priority={idx === 0}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
