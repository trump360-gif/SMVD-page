'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useResponsive } from '@/lib/responsive';
import { PADDING } from '@/constants/responsive';
import WorkHeader from './WorkHeader';

interface PortfolioItem {
  id: string;
  category: string;
  title: string;
  date: string;
  image: string;
  subtitle: string;
}

interface ExhibitionItem {
  id: string;
  title: string;
  date: string;
  image: string;
  artist: string;
}

interface CategoryCount {
  [key: string]: number;
}

// Default hardcoded data (fallback when DB is empty)
const defaultPortfolioItems: PortfolioItem[] = [
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
    title: 'BLOME',
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

const defaultExhibitionItems: ExhibitionItem[] = [
  {
    id: '1',
    title: 'Vora',
    date: '권나연 외 3명, 2025',
    image: '/images/exhibition/Rectangle 45-5.png',
    artist: 'Voice Out Recovery Assistant',
  },
  {
    id: '2',
    title: 'Mindit',
    date: '도인영 외 3명, 2025',
    image: '/images/exhibition/Rectangle 45-4.png',
    artist: '도민앱 외 3명',
  },
  {
    id: '3',
    title: 'MIST AWAY',
    date: '신예지, 2025',
    image: '/images/exhibition/Rectangle 45-3.png',
    artist: '신예지',
  },
  {
    id: '4',
    title: 'GALJIDO (갈지도)',
    date: '조혜원, 2025',
    image: '/images/exhibition/Rectangle 45-2.png',
    artist: '조혜원',
  },
  {
    id: '5',
    title: 'Callmate',
    date: '고은빈, 2025',
    image: '/images/exhibition/Rectangle 45-1.png',
    artist: '고은빈',
  },
  {
    id: '6',
    title: 'MOA',
    date: '강세정 외 2명, 2025',
    image: '/images/exhibition/Rectangle 45.png',
    artist: '강세정',
  },
];

const ITEMS_PER_PAGE = 12;

interface WorkArchiveProps {
  portfolioItemsFromDB?: PortfolioItem[];
  exhibitionItemsFromDB?: ExhibitionItem[];
}

export default function WorkArchive({
  portfolioItemsFromDB,
  exhibitionItemsFromDB,
}: WorkArchiveProps = {}) {
  const { isMobile, isTablet } = useResponsive();
  const portfolioItems = portfolioItemsFromDB ?? defaultPortfolioItems;
  const exhibitionItems = exhibitionItemsFromDB ?? defaultExhibitionItems;
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<'achieve' | 'exhibition'>('achieve');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Responsive variables
  const gridColumns = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)';
  const gridGap = isMobile ? '16px' : isTablet ? '20px' : '20px';
  const exhibitionGap = isMobile ? '24px' : isTablet ? '32px' : '40px';
  const tabFontSize = isMobile ? '18px' : isTablet ? '20px' : '24px';
  const itemTitleFontSize = isMobile ? '12px' : isTablet ? '13px' : '14px';
  const exhibitionTitleFontSize = isMobile ? '14px' : isTablet ? '15px' : '16px';
  const containerPadding = isMobile ? PADDING.mobile : isTablet ? PADDING.tablet : 0;

  // 쿼리 파라미터에 따라 activeTab 설정
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'achieve' || tabParam === 'exhibition') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Dynamic categories from actual data
  const dynamicCategories = ['All', ...Array.from(new Set(portfolioItems.map((item) => item.category)))];

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
  dynamicCategories.slice(1).forEach((cat) => {
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
        gap: '5px',
        width: '100%',
        paddingLeft: `${containerPadding}px`,
        paddingRight: `${containerPadding}px`,
      }}
    >
      {/* Achieve / Exhibition Tabs */}
      <div
        style={{
          display: 'flex',
          gap: isMobile ? '16px' : '20px',
          width: '100%',
          paddingBottom: isMobile ? '16px' : '20px',
          borderBottom: '2px solid #141414ff',
        }}
      >
        <button
          onClick={() => {
            setActiveTab('achieve');
            setCurrentPage(1);
          }}
          style={{
            fontSize: tabFontSize,
            fontWeight: '700',
            fontFamily: 'Satoshi',
            color: activeTab === 'achieve' ? '#1b1d1fff' : '#7b828eff',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 0',
            margin: '0',
            transition: 'all 0.3s ease',
          }}
        >
          Achieve
        </button>
        <button
          onClick={() => {
            setActiveTab('exhibition');
            setCurrentPage(1);
          }}
          style={{
            fontSize: tabFontSize,
            fontWeight: '700',
            fontFamily: 'Satoshi',
            color: activeTab === 'exhibition' ? '#1b1d1fff' : '#7b828eff',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 0',
            margin: '0',
            transition: 'all 0.3s ease',
          }}
        >
          Exhibition
        </button>
      </div>

      {/* Archive Section Header - Only show for Achieve tab */}
      {activeTab === 'achieve' && (
        <WorkHeader
          currentCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categories={dynamicCategories}
        />
      )}

      {/* Achieve Tab Grid */}
      {activeTab === 'achieve' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: gridColumns,
            gap: gridGap,
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
                {/* Category Badge */}
                <span
                  style={{
                    fontSize: isMobile ? '11px' : isTablet ? '12px' : '12px',
                    fontWeight: '500',
                    color: '#7b828eff',
                    fontFamily: 'Satoshi',
                  }}
                >
                  {item.category}
                </span>

                {/* Title */}
                <h3
                  style={{
                    fontSize: itemTitleFontSize,
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
                    fontSize: isMobile ? '11px' : isTablet ? '11px' : '12px',
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
      )}

      {/* Exhibition Tab Grid */}
      {activeTab === 'exhibition' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: gridColumns,
            gap: exhibitionGap,
            width: '100%',
            paddingTop: isMobile ? '16px' : '20px',
          }}
        >
          {exhibitionItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
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
              {/* Exhibition Item Image */}
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

              {/* Exhibition Item Info */}
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
                    fontSize: exhibitionTitleFontSize,
                    fontWeight: '600',
                    color: '#141414ff',
                    fontFamily: 'Pretendard',
                    margin: '0',
                    lineHeight: '1.4',
                  }}
                >
                  {item.title}
                </h3>

                {/* Date/Artist */}
                <span
                  style={{
                    fontSize: isMobile ? '12px' : isTablet ? '13px' : '14px',
                    fontWeight: '400',
                    color: '#000000',
                    fontFamily: 'Satoshi',
                  }}
                >
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination - Only show for Achieve tab */}
      {activeTab === 'achieve' && totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            marginTop: isMobile ? '32px' : isTablet ? '36px' : '40px',
          }}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: currentPage === page ? '600' : '500',
                fontFamily: 'Satoshi',
                color:
                  currentPage === page ? '#141414ff' : '#7b828eff',
                backgroundColor:
                  currentPage === page ? '#f0f0f0ff' : 'transparent',
                border: 'none',
                padding: isMobile ? '6px 10px' : '8px 12px',
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
