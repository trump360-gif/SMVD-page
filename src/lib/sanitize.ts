/**
 * Server-safe XSS sanitizer (no jsdom dependency)
 * - Strips <script>, event handlers, javascript: URIs
 * - Works in both server and client environments
 */

const SCRIPT_RE = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const EVENT_HANDLER_RE = /\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi;
const JS_URI_RE = /(?:href|src|action)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi;

export const sanitizeContent = (content: string | null | undefined): string => {
  if (!content) return '';
  return content
    .replace(SCRIPT_RE, '')
    .replace(EVENT_HANDLER_RE, '')
    .replace(JS_URI_RE, '');
};
