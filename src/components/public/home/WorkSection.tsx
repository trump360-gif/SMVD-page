'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useResponsive } from '@/lib/responsive';

interface WorkItem {
  src: string;
  alt: string;
  title: string;
  category: string;
}

interface WorkSectionProps {
  title?: string;
  items?: WorkItem[];
}

const workItems: WorkItem[] = [
  { src: '/images/mainpage-work/vora.png', alt: 'Vora', title: 'Vora', category: 'Motion' },
  { src: '/images/mainpage-work/bichae.png', alt: 'BICHAE', title: 'BICHAE', category: 'Branding' },
  { src: '/images/mainpage-work/starnew valley.png', alt: 'StarNew Valley', title: 'StarNew Valley', category: 'Game' },
  { src: '/images/mainpage-work/pave.png', alt: 'Pave', title: 'Pave', category: 'UX/UI' },
  { src: '/images/mainpage-work/bolio.png', alt: 'Bolio', title: 'Bolio', category: 'UX/UI' },
  { src: '/images/mainpage-work/morae.png', alt: 'Morae', title: 'Morae', category: 'UX/UI' },
  { src: '/images/mainpage-work/mist away.png', alt: 'MIST AWAY', title: 'MIST AWAY', category: 'Branding' },
  { src: '/images/mainpage-work/nightmare in neverland.png', alt: 'Nightmare in Neverland', title: 'Nightmare in Neverland', category: 'Motion' },
  { src: '/images/mainpage-work/고군분투.png', alt: '고군분쿠', title: '고군분쿠', category: 'Game' },
  { src: '/images/mainpage-work/시도.png', alt: '시도', title: '시도', category: 'Graphic' },
];

const categories = ['All', 'UX/UI', 'Motion', 'Branding', 'Game design', 'Graphic'];

export default function WorkSection({
  title = 'Work',
  items = workItems,
}: WorkSectionProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(item =>
        item.category === activeCategory ||
        (activeCategory === 'Game design' && item.category === 'Game')
      );

  const headerPadding = isMobile ? '16px' : isTablet ? '24px' : '40px';
  const headerFontSize = isMobile ? '28px' : isTablet ? '40px' : '48px';
  const moreTextFontSize = isMobile ? '14px' : isTablet ? '16px' : '18px';
  const cardGap = isMobile ? '24px' : isTablet ? '32px' : '40px';
  const totalRows = Math.ceil(filteredItems.length / 2);

  const filterButtons = (vertical: boolean) =>
    categories.map((category) => {
      const isActive = activeCategory === category;
      return (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: isActive ? '4px 10px' : '4px 0',
            fontSize: vertical ? '32px' : isMobile ? '18px' : '22px',
            fontWeight: 'normal',
            fontFamily: 'Inter',
            letterSpacing: '0.4px',
            lineHeight: 1.6,
            whiteSpace: 'nowrap',
            backgroundColor: isActive ? '#000000ff' : 'transparent',
            color: isActive ? '#ffffffff' : '#3b3b3bff',
            border: 'none',
            cursor: 'pointer',
            opacity: isActive ? 1 : 0.5,
            transition: 'all 0.2s ease',
          }}
        >
          {isActive && (
            <img
              src="/images/check.svg"
              alt="selected"
              width={vertical ? 14 : 10}
              height={vertical ? 16 : 12}
              style={{ flexShrink: 0 }}
            />
          )}
          {category}
        </button>
      );
    });

  return (
    <section
      id="work"
      style={{
        width: '100%',
        backgroundColor: '#ffffffff',
        borderTop: '1px solid #adadadff',
        paddingTop: isMobile ? '32px' : isTablet ? '48px' : '61px',
        paddingBottom: isMobile ? '32px' : isTablet ? '48px' : '61px',
        paddingLeft: headerPadding,
        paddingRight: headerPadding,
      }}
    >
      {/* Header */}
      <div
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          marginBottom: isMobile ? '32px' : '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #adadadff',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '12px' : '0',
        }}
      >
        <h2
          style={{
            fontSize: headerFontSize,
            fontWeight: '500',
            color: '#000000ff',
            fontFamily: 'Inter',
            margin: '0',
            letterSpacing: '-0.128px',
            lineHeight: 1.5,
            paddingBottom: isMobile ? '12px' : '0',
            width: isMobile ? '100%' : 'auto',
          }}
        >
          {title}
        </h2>
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                fontSize: moreTextFontSize,
                fontWeight: 'normal',
                color: '#000000ff',
                fontFamily: 'Inter',
                letterSpacing: '-0.439px',
                lineHeight: 1.5,
              }}
            >
              More
            </span>
            <img src="/images/icon/Right-3.svg" alt="more" width={14} height={14} />
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
        }}
      >
        {/* Mobile/Tablet filter (horizontal, on top) */}
        <div
          style={{
            display: isDesktop ? 'none' : 'flex',
            flexDirection: 'row',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '24px',
          }}
        >
          {filterButtons(false)}
        </div>

        {/* Grid: 3-col on desktop (col1=cards, col2=filter sticky, col3=cards), 2-col tablet, 1-col mobile */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? '1fr auto 1fr' : isTablet ? 'repeat(2, 1fr)' : '1fr',
            columnGap: isDesktop ? '50px' : isTablet ? '32px' : '0',
            rowGap: cardGap,
          }}
        >
          {/* Desktop: center filter in grid col 2, sticky */}
          <div
            style={{
              display: isDesktop ? 'flex' : 'none',
              flexDirection: 'column',
              gap: '2px',
              gridColumn: '2',
              gridRow: `1 / ${totalRows + 1}`,
              position: 'sticky',
              top: '100px',
              alignSelf: 'start',
              paddingTop: '4px',
            }}
          >
            {filterButtons(true)}
          </div>

          {/* Cards: explicit grid placement on desktop, auto-flow on mobile/tablet */}
          {filteredItems.map((item, idx) => (
            <div
              key={item.title}
              style={{
                display: 'flex',
                flexDirection: 'column',
                ...(isDesktop
                  ? {
                      gridColumn: idx % 2 === 0 ? '1' : '3',
                      gridRow: `${Math.floor(idx / 2) + 1}`,
                    }
                  : {}),
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4 / 3',
                  backgroundColor: '#e1e1e1ff',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  style={{ objectFit: 'cover' }}
                  quality={75}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '12px',
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? '16px' : isTablet ? '18px' : '20px',
                    fontWeight: '500',
                    color: '#000000ff',
                    fontFamily: 'Inter',
                    margin: '0',
                    letterSpacing: '-0.449px',
                    lineHeight: 1.5,
                  }}
                >
                  {item.title}
                </h3>
                <span
                  style={{
                    fontSize: isMobile ? '14px' : isTablet ? '15px' : '16px',
                    fontWeight: 'normal',
                    color: '#000000ff',
                    fontFamily: 'Inter',
                    opacity: 0.6,
                    lineHeight: 1.5,
                    flexShrink: 0,
                    marginLeft: '12px',
                  }}
                >
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
