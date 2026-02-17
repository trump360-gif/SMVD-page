import DOMPurify from 'isomorphic-dompurify';
import { SANITIZE_CONFIG } from './sanitize-config';

/**
 * DOMPurify 기반 XSS 방지 sanitize 함수
 * - 화이트리스트 기반 태그/속성 필터링
 * - SVG, 이벤트 핸들러, script 태그 등 모든 XSS 벡터 차단
 * - 마크다운 렌더링에 필요한 태그는 그대로 허용
 */
export const sanitizeContent = (content: string | null | undefined): string => {
  if (!content) return '';
  return DOMPurify.sanitize(content, SANITIZE_CONFIG);
};
