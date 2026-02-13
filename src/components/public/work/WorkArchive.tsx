'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PortfolioItem {
  id: string;
  category: string;
  title: string;
  date: string;
  image: string;
  subtitle: string;
}

interface CategoryCount {
  [key: string]: number;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    category: 'UX/UI',
    title: 'Vora',
    date: '2025',
    subtitle: '권나연 외 3명, 2025',
    image: '/images/work/portfolio-12.png',
  },
  {
    id: '2',
    category: 'UX/UI',
    title: 'Mindit',
    date: '2025',
    subtitle: '도인영 외 3명, 2025',
    image: '/images/work/portfolio-10.png',
  },
  {
    id: '3',
    category: 'Game',
    title: 'StarNew Valley',
    date: '2025',
    subtitle: '안시현 외 3명, 2025',
    image: '/images/work/portfolio-9.png',
  },
  {
    id: '4',
    category: 'UX/UI',
    title: 'Pave',
    date: '2025',
    subtitle: '박지우 외 2명, 2025',
    image: '/images/work/portfolio-11.png',
  },
  {
    id: '5',
    category: 'UX/UI',
    title: 'Bolio',
    date: '2025',
    subtitle: '박근영, 2025',
    image: '/images/work/portfolio-7.png',
  },
  {
    id: '6',
    category: 'UX/UI',
    title: 'MIST AWAY',
    date: '2025',
    subtitle: '신예지, 2025',
    image: '/images/work/portfolio-6.png',
  },
  {
    id: '7',
    category: 'Branding',
    title: 'BICHAE',
    date: '2025',
    subtitle: '최은정, 2025',
    image: '/images/work/portfolio-5.png',
  },
  {
    id: '8',
    category: 'UX/UI',
    title: 'Morae',
    date: '2023',
    subtitle: '고은서, 2023',
    image: '/images/work/portfolio-4.png',
  },
  {
    id: '9',
    category: 'Branding',
    title: 'STUDIO KNOT',
    date: '2025',
    subtitle: '노하린, 2025',
    image: '/images/work/portfolio-3.png',
  },
  {
    id: '10',
    category: 'Branding',
    title: 'BLOMÉ',
    date: '2025',
    subtitle: '김진아 외 1명, 2025',
    image: '/images/work/portfolio-8.png',
  },
  {
    id: '11',
    category: 'Motion',
    title: 'alors: romanticize your life, every...',
    date: '2025',
    subtitle: '정유진, 2025',
    image: '/images/work/portfolio-2.png',
  },
  {
    id: '12',
    category: 'Motion',
    title: '고군분투',
    date: '2025',
    subtitle: '한다인, 2025',
    image: '/images/work/portfolio-1.png',
  },
];

const ITEMS_PER_PAGE = 12;
const categories = ['All', 'UX/UI', 'Motion', 'Branding', 'Game', 'Graphics'];

export default function WorkArchive() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter items based on selected category
  const filteredItems =
    selectedCategory === 'All'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === selectedCategory);

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedItems = filteredItems.slice(
    startIdx,
    startIdx + ITEMS_PER_PAGE
  );

  // Get category counts
  const categoryCounts: CategoryCount = {
    All: portfolioItems.length,
  };
  categories.slice(1).forEach((cat) => {
    categoryCounts[cat] = portfolioItems.filter(
      (item) => item.category === cat
    ).length;
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '60px',
        width: '100%',
      }}
    >
      {/* Archive Section Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          width: '100%',
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1b1d1fff',
            fontFamily: 'Satoshi',
            margin: '0',
            letterSpacing: '-0.24px',
          }}
        >
          Archive
        </h1>

        {/* Category Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            width: '100%',
            paddingBottom: '20px',
            borderBottom: '1px solid #e5e5e5ff',
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              style={{
                fontSize: '16px',
                fontWeight: '500',
                fontFamily: 'Satoshi',
                color:
                  selectedCategory === category ? '#141414ff' : '#7b828eff',
                backgroundColor: 'transparent',
                border: 'none',
                padding: '8px 0',
                cursor: 'pointer',
                margin: '0',
                transition: 'color 0.3s ease',
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          width: '100%',
        }}
      >
        {displayedItems.map((item) => (
          <Link key={item.id} href={`/work/${item.id}`}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
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
            {/* Portfolio Item Image */}
            <div
              style={{
                width: '100%',
                aspectRatio: '4 / 3',
                backgroundColor: '#f0f0f0ff',
                borderRadius: '4px',
                overflow: 'hidden',
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

            {/* Portfolio Item Info */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {/* Title */}
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#141414ff',
                  fontFamily: 'Pretendard',
                  margin: '0',
                  lineHeight: '1.4',
                }}
              >
                {item.title}
              </h3>

              {/* Subtitle */}
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '400',
                  color: '#000000',
                  fontFamily: 'Satoshi',
                }}
              >
                {item.subtitle}
              </span>
            </div>
          </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
          }}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                fontSize: '14px',
                fontWeight: currentPage === page ? '600' : '500',
                fontFamily: 'Satoshi',
                color:
                  currentPage === page ? '#141414ff' : '#7b828eff',
                backgroundColor:
                  currentPage === page ? '#f0f0f0ff' : 'transparent',
                border: 'none',
                padding: '8px 12px',
                cursor: 'pointer',
                borderRadius: '4px',
                transition: 'all 0.3s ease',
              }}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
