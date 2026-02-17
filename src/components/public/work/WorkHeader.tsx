'use client';

import { useResponsive } from '@/lib/responsive';

interface WorkHeaderProps {
  currentCategory?: string;
  onCategoryChange?: (category: string) => void;
  categories?: string[];
}

const defaultCategories = ['All', 'UX/UI', 'Motion', 'Branding', 'Game', 'Graphics'];

export default function WorkHeader({
  currentCategory,
  onCategoryChange,
  categories = defaultCategories,
}: WorkHeaderProps) {
  const { isMobile, isTablet } = useResponsive();

  const titleFontSize = isMobile ? '18px' : isTablet ? '20px' : '24px';
  const categoryFontSize = isMobile ? '14px' : isTablet ? '15px' : '16px';
  const categoryGap = isMobile ? '12px' : '16px';

  return (
    <div
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0px',
        width: '100%',
        paddingTop: '0px',
        paddingBottom: '0px',
      }}
    >
      <h1
        style={{
          fontSize: titleFontSize,
          fontWeight: '700',
          color: '#1b1d1fff',
          fontFamily: 'Satoshi',
          margin: '0',
          letterSpacing: '-0.24px',
        }}
      >
        Achieve
      </h1>

      {/* Category Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: categoryGap,
          flexWrap: 'wrap',
          width: '100%',
          paddingBottom: '0px',
          borderBottom: 'none',
        }}
      >
        {categories.map((category) => (
          <span
            key={category}
            onClick={() => onCategoryChange?.(category)}
            style={{
              fontSize: categoryFontSize,
              fontWeight: '500',
              fontFamily: 'Satoshi',
              color:
                currentCategory === category ? '#141414ff' : '#7b828eff',
              cursor: onCategoryChange ? 'pointer' : 'default',
              transition: 'color 0.3s ease',
            }}
          >
            {category}
          </span>
        ))}
      </div>
    </div>
  );
}
