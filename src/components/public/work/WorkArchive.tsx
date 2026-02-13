'use client';

import { useState } from 'react';

interface PortfolioItem {
  id: string;
  category: string;
  title: string;
  date: string;
  image: string;
}

interface CategoryCount {
  [key: string]: number;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: '12',
    category: 'Game',
    title: 'Game Assets Design',
    date: '2024. 01',
    image: '/images/work/portfolio-1.png',
  },
  {
    id: '11',
    category: 'Motion',
    title: 'Social Media Animation',
    date: '2024. 02',
    image: '/images/work/portfolio-2.png',
  },
  {
    id: '9',
    category: 'Graphics',
    title: 'Magazine Layout Design',
    date: '2024. 04',
    image: '/images/work/portfolio-3.png',
  },
  {
    id: '8',
    category: 'Branding',
    title: 'Logo Design System',
    date: '2024. 05',
    image: '/images/work/portfolio-4.png',
  },
  {
    id: '7',
    category: 'Motion',
    title: 'Product Launch Video',
    date: '2024. 06',
    image: '/images/work/portfolio-5.png',
  },
  {
    id: '6',
    category: 'UX/UI',
    title: 'Mobile App Interface',
    date: '2024. 07',
    image: '/images/work/portfolio-6.png',
  },
  {
    id: '5',
    category: 'Graphics',
    title: 'Poster Design Series',
    date: '2024. 08',
    image: '/images/work/portfolio-7.png',
  },
  {
    id: '10',
    category: 'UX/UI',
    title: 'Dashboard Interface',
    date: '2024. 03',
    image: '/images/work/portfolio-8.png',
  },
  {
    id: '3',
    category: 'Branding',
    title: 'Corporate Identity Project',
    date: '2024. 10',
    image: '/images/work/portfolio-9.png',
  },
  {
    id: '2',
    category: 'Motion',
    title: 'Brand Animation Series',
    date: '2024. 11',
    image: '/images/work/portfolio-10.png',
  },
  {
    id: '4',
    category: 'Game',
    title: 'Mobile Game UI Design',
    date: '2024. 09',
    image: '/images/work/portfolio-11.png',
  },
  {
    id: '1',
    category: 'UX/UI',
    title: 'E-commerce Platform Redesign',
    date: '2024. 12',
    image: '/images/work/portfolio-12.png',
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
              {category} ({categoryCounts[category]})
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
          <div
            key={item.id}
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
                aspectRatio: '3 / 4',
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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {/* Category Badge */}
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#666666',
                    fontFamily: 'Satoshi',
                    backgroundColor: '#f5f5f5ff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.category}
                </span>

                {/* Date */}
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '400',
                    color: '#999999',
                    fontFamily: 'Satoshi',
                  }}
                >
                  {item.date}
                </span>
              </div>

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
            </div>
          </div>
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
