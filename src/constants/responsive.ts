/**
 * 반응형 디자인 상수
 * 모바일(320px~640px) / 태블릿(640px~1024px) / 데스크톱(1024px+)
 */

export const BREAKPOINTS = {
  mobile: 640,    // 320px ~ 640px
  tablet: 768,    // 640px ~ 1024px
  desktop: 1024,  // 1024px+
  wide: 1440,     // 와이드 데스크톱
};

export const PADDING = {
  mobile: 16,
  tablet: 24,
  desktop: 40,
};

export const GAP = {
  mobile: 20,
  tablet: 24,
  desktop: 40,
};

export const FONT_SIZE = {
  mobile: { h1: 20, h2: 18, body: 14 },
  tablet: { h1: 28, h2: 24, body: 15 },
  desktop: { h1: 40, h2: 32, body: 16 },
};
