'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useResponsive } from '@/lib/responsive';
import { PADDING } from '@/constants/responsive';

interface NewsItem {
  id: string;
  category: string;
  date: string;
  title: string;
  description: string;
  image: string;
}

// Hardcoded fallback data
const defaultNewsItems: NewsItem[] = [
  {
    id: '1',
    category: 'Notice',
    date: '2025-01-05',
    title: '미술대학 2024년도 학생경비 집행내역 공개',
    description: '',
    image: '/Group-27.svg',
  },
  {
    id: '2',
    category: 'Notice',
    date: '2025-01-05',
    title: '디자인학과(박사) 2024년도 학생경비 집행내역 공개',
    description: '',
    image: '/Group-27.svg',
  },
  {
    id: '3',
    category: 'Notice',
    date: '2025-01-05',
    title: '시각영상디자인학과(석사) 2024년도 학생경비 집행내역 공개',
    description: '',
    image: '/Group-27.svg',
  },
  {
    id: '4',
    category: 'Notice',
    date: '2025-01-05',
    title: '시각영상디자인학과 2024년도 학생경비 집행내역 공개',
    description: '',
    image: '/Group-27.svg',
  },
  {
    id: '5',
    category: 'Event',
    date: '2025-01-05',
    title: '2024 시각\u00b7영상디자인과 졸업전시회',
    description: '이번 전시 주제인 "Ready, Set, Go!" KICK OFF는 들을 제기 한전을 넘어 새로운 도약을 준비하는 결심을 담고 있습니다...',
    image: '/images/news/Image-1.png',
  },
  {
    id: '6',
    category: 'Event',
    date: '2025-01-05',
    title: '2024 시각\u00b7영상디자인과 동문의 밤',
    description: '2024년 10월 28일, 백주년기념관 한상은 라운지에서 2024 시각\u00b7영상디자인과 동문의 밤 행사를 진행했습니다. 1부에는 동문 특강을, 2부에는 황순선 교수님의 서프라이즈 퇴임식을 진행했습니다...',
    image: '/images/news/Image.png',
  },
  {
    id: '7',
    category: 'Notice',
    date: '2025-01-05',
    title: '학생경비 집행 내역',
    description: '',
    image: '/Group-27.svg',
  },
  {
    id: '8',
    category: 'Notice',
    date: '2025-01-05',
    title: '[ 시각영상디자인과(박사) 2023 학생경비 집행내역 공개 ]',
    description: '',
    image: '/Group-27.svg',
  },
  {
    id: '9',
    category: 'Notice',
    date: '2025-01-05',
    title: '[ 시각영상디자인과(석사) 2023 학생경비 집행내역 공개 ]',
    description: '',
    image: '/Group-27.svg',
  },
  {
    id: '10',
    category: 'Notice',
    date: '2025-01-05',
    title: '[졸업] 재학생 졸업학점 이수완환 확인 및 과목 정리 실시',
    description: '',
    image: '/Group-27.svg',
  },
];

const categories = ['ALL', 'Notice', 'Event', 'Awards', 'Recruiting'];

interface NewsEventArchiveProps {
  items?: NewsItem[] | null;
}

export default function NewsEventArchive({ items }: NewsEventArchiveProps) {
  const { isMobile, isTablet } = useResponsive();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const newsItems = items ?? defaultNewsItems;

  // Responsive variables
  const containerGap = isMobile ? '32px' : isTablet ? '36px' : '40px';
  const titleFontSize = isMobile ? '18px' : isTablet ? '20px' : '24px';
  const filterFontSize = isMobile ? '12px' : isTablet ? '14px' : '16px';
  const gridColumns = isMobile ? '1fr' : 'repeat(2, 1fr)';
  const gridGap = isMobile ? '24px' : isTablet ? '32px' : '40px';
  const imageThumbnailSize = isMobile ? '120px' : isTablet ? '140px' : '160px';
  const cardGap = isMobile ? '12px' : '20px';
  const titleFontSizeCard = isMobile ? '16px' : isTablet ? '18px' : '20px';
  const badgeFontSize = isMobile ? '12px' : isTablet ? '13px' : '14px';
  const containerPadding = isMobile ? PADDING.mobile : isTablet ? PADDING.tablet : 0;

  // Filter items based on selected category
  const displayedItems =
    selectedCategory === 'ALL'
      ? newsItems
      : newsItems.filter((item) => item.category === selectedCategory);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: containerGap,
        width: '100%',
        paddingLeft: `${containerPadding}px`,
        paddingRight: `${containerPadding}px`,
      }}
    >
      {/* Title and Filter Tabs */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          width: '100%',
          paddingBottom: isMobile ? '16px' : '20px',
          borderBottom: '2px solid #141414ff',
          gap: isMobile ? '12px' : '0px',
        }}
      >
        <h1
          style={{
            fontSize: titleFontSize,
            fontWeight: '700',
            fontFamily: 'Satoshi',
            color: '#1b1d1fff',
            margin: '0',
          }}
        >
          News&Event
        </h1>

        {/* Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: isMobile ? '8px' : '12px',
            flexWrap: 'wrap',
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              style={{
                fontSize: filterFontSize,
                fontWeight: selectedCategory === category ? '600' : '400',
                fontFamily: 'Satoshi',
                color:
                  selectedCategory === category ? '#141414ff' : '#7b828eff',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderBottom:
                  selectedCategory === category
                    ? '2px solid #141414ff'
                    : 'none',
                paddingBottom: '4px',
                whiteSpace: 'nowrap',
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: gridColumns,
          gap: gridGap,
          width: '100%',
        }}
      >
        {displayedItems.map((item) => (
          <Link key={item.id} href={`/news/${item.id}`}>
            <div
              style={{
                display: 'flex',
                gap: '20px',
                paddingBottom: '20px',
                borderBottom: '1px solid #d6d8dcff',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  'translateY(0)';
              }}
            >
            {/* Thumbnail Image */}
            <div
              style={{
                width: imageThumbnailSize,
                height: imageThumbnailSize,
                minWidth: imageThumbnailSize,
                backgroundColor: '#ebecf0ff',
                borderRadius: '4px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Content */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: cardGap,
                flex: 1,
              }}
            >
              {/* Category and Date */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '6px' : '8px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Category Badge */}
                <span
                  style={{
                    fontSize: badgeFontSize,
                    fontWeight: '500',
                    fontFamily: 'Satoshi',
                    color: '#141414ff',
                    backgroundColor: '#ebecf0ff',
                    padding: isMobile ? '2px 6px' : '4px 8px',
                    borderRadius: '4px',
                    minWidth: 'fit-content',
                  }}
                >
                  {item.category}
                </span>

                {/* Date */}
                <span
                  style={{
                    fontSize: badgeFontSize,
                    fontWeight: '500',
                    fontFamily: 'Pretendard',
                    color: '#626872ff',
                    letterSpacing: '-0.14px',
                  }}
                >
                  {item.date}
                </span>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: titleFontSizeCard,
                  fontWeight: '700',
                  fontFamily: 'Pretendard',
                  color: '#141414ff',
                  margin: '0',
                  lineHeight: '1.45',
                  letterSpacing: '-0.2px',
                }}
              >
                {item.title}
              </h3>

              {/* Description */}
              {item.description && (
                <p
                  style={{
                    fontSize: isMobile ? '14px' : isTablet ? '15px' : '16px',
                    fontWeight: '500',
                    fontFamily: 'Pretendard',
                    color: '#7b828eff',
                    margin: '0',
                    lineHeight: '1.45',
                    letterSpacing: '-0.16px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {item.description}
                </p>
              )}
            </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
