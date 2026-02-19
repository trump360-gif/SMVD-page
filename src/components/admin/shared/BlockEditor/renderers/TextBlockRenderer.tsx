'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sanitizeContent } from '@/lib/sanitize';
import { isTiptapContent, type TextBlock } from '../types';
import { tiptapJSONToText } from '@/lib/tiptap/markdown-converter';

interface TextBlockRendererProps {
  block: TextBlock;
}

function hasMarkdownSyntax(text: string): boolean {
  if (!text) return false;
  return /[#*_~`\[\]!>-]/.test(text) && (
    /^#{1,6}\s/m.test(text) ||
    /\*\*.+?\*\*/m.test(text) ||
    /\[.+?\]\(.+?\)/m.test(text) ||
    /^[-*]\s/m.test(text) ||
    /^\d+\.\s/m.test(text) ||
    /^>/m.test(text)
  );
}

/**
 * Renders a text block with optional markdown support.
 * Applies font styling (size, weight, color, line height) if specified.
 * Supports both markdown (string) and Tiptap JSON formats.
 */
export default function TextBlockRenderer({ block }: TextBlockRendererProps) {
  if (!block.content) {
    return (
      <p style={{ color: '#999', fontSize: '14px', fontStyle: 'italic' }}>
        Empty text block
      </p>
    );
  }

  const fontSize = block.fontSize ?? 18;
  const fontWeight = block.fontWeight ?? '400';
  const color = block.color ?? '#1b1d1f';
  const lineHeight = block.lineHeight ?? 1.8;

  // Handle both markdown (string) and Tiptap JSON formats
  let markdownContent: string;
  if (typeof block.content === 'string') {
    markdownContent = block.content;
  } else if (isTiptapContent(block.content)) {
    // Convert Tiptap JSON to plain text for rendering
    markdownContent = tiptapJSONToText(block.content);
  } else {
    // Fallback: empty content
    return (
      <p style={{ color: '#999', fontSize: '14px', fontStyle: 'italic' }}>
        Invalid content format
      </p>
    );
  }

  return (
    <div
      style={{
        fontSize: `${fontSize}px`,
        fontWeight: fontWeight,
        color: color,
        lineHeight: `${lineHeight}`,
        fontFamily: 'Pretendard, sans-serif',
      }}
    >
      {hasMarkdownSyntax(markdownContent) ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => (
              <p
                {...props}
                style={{
                  margin: '1em 0',
                  fontSize: `${fontSize}px`,
                  fontWeight: fontWeight,
                  color: color,
                  lineHeight: `${lineHeight}`,
                }}
              />
            ),
            h1: ({ node, ...props }) => (
              <h1 {...props} style={{ fontSize: `${fontSize * 1.5}px`, marginBottom: '0.5em' }} />
            ),
            h2: ({ node, ...props }) => (
              <h2 {...props} style={{ fontSize: `${fontSize * 1.3}px`, marginBottom: '0.5em' }} />
            ),
            h3: ({ node, ...props }) => (
              <h3 {...props} style={{ fontSize: `${fontSize * 1.1}px`, marginBottom: '0.5em' }} />
            ),
            ul: ({ node, ...props }) => (
              <ul {...props} style={{ marginLeft: '1.5em', marginBottom: '1em' }} />
            ),
            ol: ({ node, ...props }) => (
              <ol {...props} style={{ marginLeft: '1.5em', marginBottom: '1em' }} />
            ),
            li: ({ node, ...props }) => (
              <li {...props} style={{ marginBottom: '0.5em' }} />
            ),
          }}
        >
          {sanitizeContent(markdownContent)}
        </ReactMarkdown>
      ) : (
        <p style={{
          margin: '0',
          whiteSpace: 'pre-wrap',
          fontSize: `${fontSize}px`,
          fontWeight: fontWeight,
          color: color,
          lineHeight: `${lineHeight}`,
        }}>
          {markdownContent}
        </p>
      )}
    </div>
  );
}
