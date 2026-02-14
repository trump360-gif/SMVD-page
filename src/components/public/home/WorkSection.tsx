'use client';

import { useState } from 'react';
import Image from 'next/image';

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

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(item => item.category === activeCategory || item.category === (activeCategory === 'Game design' ? 'Game' : activeCategory));

  return (
    <section
      style={{
        width: '100%',
        backgroundColor: '#ffffffff',
        borderTop: '1px solid #adadadff',
        paddingTop: '61px',
        paddingBottom: '61px',
      }}
    >
      {/* Header */}
      <div
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          paddingLeft: '40px',
          paddingRight: '40px',
          marginBottom: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '0',
          borderBottom: '1px solid #adadadff',
        }}
      >
        <h2
          style={{
            fontSize: '48px',
            fontWeight: '500',
            color: '#000000ff',
            fontFamily: 'Inter',
            margin: '0',
            letterSpacing: '-0.128px',
            lineHeight: 1.5,
            paddingBottom: '0',
          }}
        >
          {title}
        </h2>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span
            style={{
              fontSize: '18px',
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
      </div>

      {/* Main Container: Sidebar + Grid */}
      <div
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          paddingLeft: '40px',
          paddingRight: '40px',
          display: 'flex',
          gap: '60px',
        }}
      >
        {/* Sidebar Filter */}
        <div
          style={{
            width: '200px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
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
                padding: activeCategory === category ? '0 4px' : '0',
                minWidth: activeCategory === category ? '185px' : 'auto',
                height: '56px',
                fontSize: '32px',
                fontWeight: activeCategory === category ? 'normal' : 'normal',
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
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '60px',
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
                  marginBottom: '16px',
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Title + Category (Second) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '14px',
                  borderTop: '1px solid #e1e1e1ff',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
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
                    fontSize: '18px',
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
