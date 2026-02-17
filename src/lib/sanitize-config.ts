import type { Config } from 'dompurify';

/**
 * DOMPurify 화이트리스트 기반 sanitize 설정
 * 마크다운 렌더링에 필요한 태그와 속성만 허용
 */
export const SANITIZE_CONFIG: Config = {
  ALLOWED_TAGS: [
    // 텍스트
    'p', 'br', 'strong', 'em', 'u', 's', 'del', 'mark', 'sub', 'sup',
    // 제목
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    // 리스트
    'ul', 'ol', 'li',
    // 링크 및 미디어
    'a', 'img',
    // 인용 및 코드
    'blockquote', 'code', 'pre',
    // 기타 구조
    'div', 'span', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel'],
  KEEP_CONTENT: true,
  RETURN_DOM: false,
};
