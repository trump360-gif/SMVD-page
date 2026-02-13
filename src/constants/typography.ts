/**
 * Typography Tokens - Based on Figma Design System
 * SMVD 웹사이트 타이포그래피 시스템
 */

export const typography = {
  // Font Families
  fontFamily: {
    primary: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
    secondary: ['Satoshi', 'system-ui', 'sans-serif'],
    mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
  },

  // Font Sizes (in rem, based on 16px root)
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2rem',    // 32px
    '5xl': '2.25rem', // 36px
    '6xl': '3rem',    // 48px
    '7xl': '3.75rem', // 60px
  },

  // Heading Hierarchy
  heading: {
    h1: {
      fontSize: '3rem',        // 48px
      fontWeight: '700',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',        // 32px
      fontWeight: '700',
      lineHeight: 1.3,
      letterSpacing: '-0.015em',
    },
    h3: {
      fontSize: '1.5rem',      // 24px
      fontWeight: '600',
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.25rem',     // 20px
      fontWeight: '600',
      lineHeight: 1.5,
    },
    h5: {
      fontSize: '1.125rem',    // 18px
      fontWeight: '600',
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',        // 16px
      fontWeight: '600',
      lineHeight: 1.5,
    },
  },

  // Body Text
  body: {
    default: {
      fontSize: '1rem',        // 16px
      fontWeight: '400',
      lineHeight: 1.6,
      letterSpacing: '0',
    },
    large: {
      fontSize: '1.125rem',    // 18px
      fontWeight: '400',
      lineHeight: 1.6,
    },
    small: {
      fontSize: '0.875rem',    // 14px
      fontWeight: '400',
      lineHeight: 1.5,
    },
  },

  // Label & Button Text
  label: {
    default: {
      fontSize: '0.875rem',    // 14px
      fontWeight: '500',
      lineHeight: 1.4,
      letterSpacing: '0.02em',
    },
    small: {
      fontSize: '0.75rem',     // 12px
      fontWeight: '500',
      lineHeight: 1.3,
      letterSpacing: '0.05em',
    },
  },

  // Font Weights
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.05em',
  },
} as const;

export type TypographyToken = typeof typography;
