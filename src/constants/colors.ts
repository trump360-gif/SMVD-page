/**
 * Color Tokens - Based on Figma Design System
 * SMVD 웹사이트 색상 시스템
 */

export const colors = {
  // Primary Brand Colors
  primary: {
    deepBlue: '#0845A7',    // 주 브랜드 컬러
    blue: '#1A46E7',        // CTA, 활성 상태
    lightBlue: '#489AFF',   // Hover, Focus 상태
    teal: '#1ABC9C',        // 강조 색상
  },

  // Accent Colors
  accent: {
    purple: '#9747FF',      // 특수 강조, 이벤트
    lightPurple: '#A14AFF', // Hover 상태
  },

  // Semantic Colors
  semantic: {
    error: '#FF0000',       // 에러, 경고
    errorLight: '#FF5F59',  // 에러 배경
    warning: '#FFCB53',     // 주의, 강조
    success: '#4CAF50',     // 성공 상태
  },

  // Neutral - Greyscale (16단계)
  neutral: {
    // 어두운색 (background-dark)
    0: '#FFFFFF',           // 가장 밝은색/흰색
    100: '#F5F5F5',         // 매우 밝음
    200: '#F2F3F4',
    300: '#EBEEF4',
    400: '#EAECF0',
    500: '#E9EBF8',
    600: '#E8E8E8',
    700: '#E0E0E0',         // 경계선 기본
    800: '#DBDBDC',
    900: '#D9D9D9',
    1000: '#D6D8DC',

    // 중간 (gray text)
    1100: '#B7BEC5',
    1200: '#8E98A8',
    1300: '#8B8B8B',
    1400: '#848990',
    1500: '#7B828E',

    // 밝은 회색
    1600: '#7A828E',
    1700: '#6F7580',
    1800: '#626872',
    1900: '#5C626B',
    2000: '#575A60',

    // 어두운 회색
    2100: '#4E525A',
    2200: '#4A4E55',
    2300: '#434850',
    2400: '#43474F',
    2500: '#3E3E3E',
    2600: '#3A3A3A',
    2700: '#373A40',
    2800: '#342F2F',
    2900: '#2B2E32',
    3000: '#1D1F21',
    3100: '#1D1D1D',
    3200: '#1B1D1F',
    3300: '#141414',
    3400: '#000000', // 검정 (가장 어두운색)
  },
} as const;

// Color Usage Guide
export const colorUsage = {
  'primary.deepBlue': 'Main brand color for headers, primary buttons',
  'primary.blue': 'CTA buttons, active states, links',
  'primary.lightBlue': 'Hover states, focus indicators',
  'primary.teal': 'Accent elements, highlights',
  'semantic.error': 'Error messages, validation',
  'semantic.warning': 'Warnings, alerts',
  'semantic.success': 'Success messages, confirmations',
  'neutral.700': 'Default border color',
  'neutral.1200': 'Secondary text, hints',
  'neutral.3400': 'Primary text, headings',
};

export type ColorToken = typeof colors;
export type ColorKey = keyof typeof colors;
