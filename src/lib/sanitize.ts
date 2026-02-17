'use client';

/**
 * Markdown 콘텐츠 기본 검증
 * 위험한 태그는 제거하지만 일반 마크다운은 허용
 */
export const sanitizeContent = (content: string | null | undefined): string => {
  if (!content) return '';

  // 기본 검증: script 태그 제거
  let sanitized = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  return sanitized;
};
