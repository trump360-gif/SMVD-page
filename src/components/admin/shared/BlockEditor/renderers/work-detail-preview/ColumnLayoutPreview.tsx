'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sanitizeContent } from '@/lib/sanitize';
import { hasMarkdownSyntax } from './helpers';

interface ColumnLayoutPreviewProps {
  columnLayout: number;
  columnGap: number;
  textColumnWidth: string;
  title: string;
  author: string;
  email: string;
  description: string;
  titleFontSize: number;
  titleFontWeight: string;
  titleColor: string;
  authorFontSize: number;
  authorFontWeight: string;
  authorColor: string;
  emailFontWeight: string;
  emailColor: string;
  gap: number;
  descFontSize: number;
  descFontWeight: string;
  descColor: string;
  descLineHeight: number;
}

export default function ColumnLayoutPreview({
  columnLayout,
  columnGap,
  textColumnWidth,
  title,
  author,
  email,
  description,
  titleFontSize,
  titleFontWeight,
  titleColor,
  authorFontSize,
  authorFontWeight,
  authorColor,
  emailFontWeight,
  emailColor,
  gap,
  descFontSize,
  descFontWeight,
  descColor,
  descLineHeight,
}: ColumnLayoutPreviewProps) {
  const descriptionContent = description ? (
    hasMarkdownSyntax(description) ? (
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
        {sanitizeContent(description)}
      </ReactMarkdown>
    ) : (
      <p style={{ margin: '0', whiteSpace: 'pre-wrap' }}>{description}</p>
    )
  ) : (
    <p style={{ fontSize: '14px', color: '#999', fontStyle: 'italic', margin: '0' }}>
      Description here...
    </p>
  );

  if (columnLayout === 1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px`, width: '100%' }}>
        <h1 style={{ fontSize: `${titleFontSize}px`, fontWeight: titleFontWeight, color: titleColor, fontFamily: 'Satoshi, sans-serif', margin: '0', letterSpacing: '-0.6px', lineHeight: '1.2' }}>
          {title || 'Project Title'}
        </h1>
        <p style={{ fontSize: `${authorFontSize}px`, fontWeight: authorFontWeight, fontFamily: 'Pretendard, sans-serif', color: authorColor, margin: '0' }}>
          {author || 'Author'}
        </p>
        <div style={{ fontSize: `${descFontSize}px`, fontWeight: descFontWeight, color: descColor, lineHeight: `${descLineHeight}`, fontFamily: 'Pretendard, sans-serif' }}>
          {descriptionContent}
        </div>
        <p style={{ fontSize: `${authorFontSize}px`, fontWeight: emailFontWeight, fontFamily: 'Pretendard, sans-serif', color: emailColor, margin: '0' }}>
          {email || 'email@example.com'}
        </p>
      </div>
    );
  }

  // Two-Column Layout (columnLayout === 2 or fallback)
  const rightFlex = textColumnWidth === 'narrow' ? '0 0 400px' : textColumnWidth === 'wide' ? '0 0 800px' : '1';

  const descriptionBlock = description ? (
    hasMarkdownSyntax(description) ? (
      <div
        style={{ fontSize: `${descFontSize}px`, fontWeight: descFontWeight, fontFamily: 'Pretendard, sans-serif', color: descColor, lineHeight: `${descLineHeight}`, letterSpacing: '-0.18px', margin: '0' }}
        className="prose prose-lg max-w-none"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
          {sanitizeContent(description)}
        </ReactMarkdown>
      </div>
    ) : (
      <p style={{ fontSize: `${descFontSize}px`, fontWeight: descFontWeight, fontFamily: 'Pretendard, sans-serif', color: descColor, lineHeight: `${descLineHeight}`, letterSpacing: '-0.18px', margin: '0', whiteSpace: 'pre-wrap' }}>
        {description}
      </p>
    )
  ) : (
    <p style={{ fontSize: '18px', color: '#999', fontStyle: 'italic', margin: '0' }}>
      Project description will appear here...
    </p>
  );

  return (
    <div style={{ display: 'flex', gap: `${columnGap}px`, width: '100%' }}>
      {/* Left Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px`, flex: '0 0 auto', minWidth: '400px' }}>
        <h1 style={{ fontSize: `${titleFontSize}px`, fontWeight: titleFontWeight, color: titleColor, fontFamily: 'Satoshi, sans-serif', margin: '0', letterSpacing: '-0.6px', lineHeight: '1.2' }}>
          {title || 'Project Title'}
        </h1>
        <p style={{ fontSize: `${authorFontSize}px`, fontFamily: 'Pretendard, sans-serif', color: authorColor, margin: '0', whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: authorFontWeight }}>{author || 'Author'}</span>
          {email && (
            <span style={{ fontWeight: emailFontWeight, color: emailColor }}> {email}</span>
          )}
          {!email && (
            <span style={{ fontWeight: emailFontWeight, color: emailColor }}> email@example.com</span>
          )}
        </p>
      </div>

      {/* Right Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: rightFlex }}>
        {descriptionBlock}
      </div>
    </div>
  );
}
