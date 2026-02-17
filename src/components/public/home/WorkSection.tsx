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
    : items.filter(item => item.category === activeCategory || item.category === (activeCategory === 'Game design' ? 'Game' : activeCategory));

  // 반응형 값 계산
  const sectionPaddingTop = isMobile ? '32px' : isTablet ? '48px' : '61px';
  const sectionPaddingBottom = isMobile ? '32px' : isTablet ? '48px' : '61px';
  const headerPadding = isMobile ? '16px' : isTablet ? '24px' : '40px';
  const mainGap = isMobile ? '24px' : isTablet ? '40px' : '60px';
  const sidebarWidth = isMobile ? '100%' : isTablet ? '100%' : '100%';
  const sidebarFlexDirection = 'row';
  const sidebarGap = isMobile ? '8px' : isTablet ? '8px' : '16px';
  const buttonFontSize = isMobile ? '18px' : isTablet ? '24px' : '32px';
  const buttonHeight = isMobile ? '44px' : isTablet ? '50px' : '56px';
  const gridColumns = isMobile ? '1fr' : isTablet ? '1fr' : 'repeat(2, 1fr)';
  const gridGap = isMobile ? 24 : isTablet ? 40 : 50;
  const headerFontSize = isMobile ? '28px' : isTablet ? '40px' : '48px';
  const moreTextFontSize = isMobile ? '14px' : isTablet ? '16px' : '18px';
  const itemTitleFontSize = isMobile ? '18px' : isTablet ? '19px' : '20px';
  const itemCategoryFontSize = isMobile ? '14px' : isTablet ? '16px' : '18px';

  return (
    <section
      id="work"
      style={{
        width: '100%',
        backgroundColor: '#ffffffff',
        borderTop: '1px solid #adadadff',
        paddingTop: sectionPaddingTop,
        paddingBottom: sectionPaddingBottom,
      }}
    >
      {/* Header */}
      <div
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          paddingLeft: headerPadding,
          paddingRight: headerPadding,
          marginBottom: isMobile ? '32px' : '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '0',
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
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
            <img
              src="/images/icon/Right-3.svg"
              alt="more"
              width={14}
              height={14}
            />
          </div>
        )}
      </div>

      {/* Main Container: Sidebar + Grid */}
      <div
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          paddingLeft: headerPadding,
          paddingRight: headerPadding,
          display: 'flex',
          flexDirection: isMobile || isTablet ? 'column' : 'row',
          gap: mainGap,
        }}
      >
        {/* Sidebar Filter */}
        <div
          style={{
            width: sidebarWidth,
            flexShrink: 0,
            display: 'flex',
            flexDirection: sidebarFlexDirection,
            gap: sidebarGap,
            overflowX: isMobile || isTablet ? 'auto' : 'visible',
            paddingBottom: isMobile || isTablet ? '8px' : '0',
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: activeCategory === category ? '0 8px' : '0',
                minWidth: activeCategory === category ? 'auto' : 'auto',
                height: buttonHeight,
                fontSize: buttonFontSize,
                fontWeight: 'normal',
                fontFamily: 'Inter',
                letterSpacing: '0.406px',
                lineHeight: 1.5,
                whiteSpace: 'nowrap',
                backgroundColor: activeCategory === category ? '#000000ff' : 'transparent',
                color: activeCategory === category ? '#ffffffff' : '#3b3b3bff',
                border: 'none',
                cursor: 'pointer',
                opacity: activeCategory === category ? 1 : 0.5,
                transition: 'all 0.2s ease',
              }}
            >
              {activeCategory === category && (
                <img
                  src="/images/check.svg"
                  alt="selected"
                  width={12}
                  height={14}
                  style={{ flexShrink: 0 }}
                />
              )}
              {category}
            </button>
          ))}
        </div>

        {/* Grid Container */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: gridColumns,
            columnGap: `${gridGap}px`,
            rowGap: '32px',
          }}
        >
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image (First) */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '530 / 286',
                  backgroundColor: '#e1e1e1ff',
                  overflow: 'hidden',
                  marginBottom: '0px',
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 50vw"
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Title + Category (Second) */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '14px',
                  borderTop: '1px solid #e1e1e1ff',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? '8px' : '0',
                  alignItems: isMobile ? 'flex-start' : 'center',
                }}
              >
                <h3
                  style={{
                    fontSize: itemTitleFontSize,
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
                    fontSize: itemCategoryFontSize,
                    fontWeight: 'normal',
                    color: '#000000ff',
                    fontFamily: 'Inter',
                    opacity: 0.6,
                    letterSpacing: '-0.439px',
                    lineHeight: 1.5,
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
