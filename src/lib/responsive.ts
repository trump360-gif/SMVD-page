'use client';

import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '@/constants/responsive';

/**
 * 현재 화면 크기에 따른 반응형 플래그 제공
 * @returns { isMobile, isTablet, isDesktop }
 */
export const useResponsive = () => {
  const [width, setWidth] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setWidth(window.innerWidth);

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = width < BREAKPOINTS.mobile;
  const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop;
  const isDesktop = width >= BREAKPOINTS.desktop;

  // SSR 시 기본값: desktop (SSR에서는 width가 0이므로)
  if (!mounted) {
    return { isMobile: false, isTablet: false, isDesktop: true };
  }

  return { isMobile, isTablet, isDesktop };
};
