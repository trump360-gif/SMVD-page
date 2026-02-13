/**
 * Spacing Tokens - Based on Figma Design System
 * 8px 기반 spacing scale
 */

export const spacing = {
  // Base spacing scale (8px)
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
  40: '160px',
  48: '192px',
  56: '224px',
  64: '256px',
} as const;

// Gap values for flex/grid layouts
export const gaps = {
  xs: '4px',      // 1
  sm: '8px',      // 2
  md: '12px',     // 3
  lg: '16px',     // 4
  xl: '24px',     // 6
  '2xl': '32px',  // 8
  '3xl': '48px',  // 12
  '4xl': '64px',  // 16
  '5xl': '80px',  // 20
  // Special gaps from Figma design
  hero: '320px',  // Home page vision section gap
  section: '160px', // Other pages section gap
} as const;

// Padding values (same as spacing)
export const padding = spacing;

// Margins (same as spacing)
export const margin = spacing;

// Border radius values
export const borderRadius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '9999px',
  // Component-specific radius
  button: '8px',
  card: '12px',
  input: '8px',
  avatar: '50%',
} as const;

// Shadow values
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
} as const;

export type SpacingToken = typeof spacing;
export type GapToken = typeof gaps;
export type BorderRadiusToken = typeof borderRadius;
export type ShadowToken = typeof shadows;
