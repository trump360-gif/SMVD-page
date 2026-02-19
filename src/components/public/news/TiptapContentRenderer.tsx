'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sanitizeContent } from '@/lib/sanitize';

/**
 * Renders Tiptap JSON content for public news detail pages.
 * Tiptap format: { type: "doc", content: [TiptapNode[]] }
 *
 * Supported node types:
 * - paragraph: Text paragraph with marks (bold, italic, etc.)
 * - heading: H1/H2/H3 headings
 * - image: Embedded images with src/alt
 * - bullet_list/ordered_list: Lists with list_item children
 * - blockquote: Quoted text
 * - hard_break: Line breaks
 */

interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

interface TiptapContent {
  type?: string;
  text?: string;
  marks?: TiptapMark[];
}

interface TiptapNode {
  type: string;
  content?: TiptapContent[];
  attrs?: Record<string, unknown>;
  children?: TiptapNode[];
}

interface TiptapDoc {
  type: 'doc';
  content: TiptapNode[];
}

/**
 * Extract plain text from Tiptap content nodes
 */
function extractTextFromNode(node: TiptapContent | TiptapNode): string {
  if ('text' in node && typeof node.text === 'string') {
    return node.text;
  }
  if ('content' in node && Array.isArray(node.content)) {
    return node.content.map(extractTextFromNode).join('');
  }
  return '';
}

/**
 * Render Tiptap text content with marks (bold, italic, etc.)
 */
function renderInlineContent(contents: TiptapContent[]): React.ReactNode {
  return contents.map((content, idx) => {
    const text = content.text || '';
    const marks = content.marks || [];

    let rendered: React.ReactNode = text;

    // Apply marks in reverse order to properly nest them
    for (const mark of marks) {
      switch (mark.type) {
        case 'bold':
          rendered = <strong key={`bold-${idx}`}>{rendered}</strong>;
          break;
        case 'italic':
          rendered = <em key={`italic-${idx}`}>{rendered}</em>;
          break;
        case 'underline':
          rendered = <u key={`underline-${idx}`}>{rendered}</u>;
          break;
        case 'code':
          rendered = (
            <code
              key={`code-${idx}`}
              style={{
                backgroundColor: '#f0f0f0',
                padding: '2px 6px',
                borderRadius: '4px',
                fontFamily: 'monospace',
              }}
            >
              {rendered}
            </code>
          );
          break;
        case 'link':
          rendered = (
            <a
              key={`link-${idx}`}
              href={(mark.attrs?.href as string) || '#'}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1A46E7', textDecoration: 'underline' }}
            >
              {rendered}
            </a>
          );
          break;
      }
    }

    return rendered;
  });
}

/**
 * Render a single Tiptap node
 */
function renderNode(node: TiptapNode, index: number): React.ReactNode {
  switch (node.type) {
    case 'paragraph': {
      const textContent = extractTextFromNode(node);
      const isEmpty = !textContent.trim();

      if (isEmpty) {
        return <div key={`para-${index}`} style={{ height: '12px' }} />;
      }

      return (
        <p
          key={`para-${index}`}
          style={{
            fontSize: '18px',
            fontWeight: '500',
            fontFamily: 'Pretendard, sans-serif',
            color: '#1b1d1f',
            margin: '0',
            lineHeight: '1.5',
            letterSpacing: '-0.18px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'keep-all',
          }}
        >
          {node.content ? renderInlineContent(node.content) : textContent}
        </p>
      );
    }

    case 'heading': {
      const level = (node.attrs?.level as number) || 1;
      const textContent = extractTextFromNode(node);
      const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      const sizes: Record<number, string> = { 1: '48px', 2: '36px', 3: '24px', 4: '20px', 5: '18px', 6: '16px' };

      return (
        <Tag
          key={`heading-${index}`}
          style={{
            fontSize: sizes[level] || '24px',
            fontWeight: '700',
            fontFamily: 'Pretendard, sans-serif',
            color: '#000',
            margin: '12px 0 0 0',
            lineHeight: '1.45',
            letterSpacing: '-0.48px',
          }}
        >
          {node.content ? renderInlineContent(node.content) : textContent}
        </Tag>
      );
    }

    case 'image': {
      const src = node.attrs?.src as string;
      const alt = (node.attrs?.alt as string) || 'Image';

      if (!src) return null;

      return (
        <div
          key={`img-${index}`}
          style={{
            width: '100%',
            height: '765px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      );
    }

    case 'bullet_list': {
      return (
        <ul
          key={`ul-${index}`}
          style={{
            margin: '0',
            paddingLeft: '20px',
            fontSize: '18px',
            fontWeight: '500',
            fontFamily: 'Pretendard, sans-serif',
            color: '#1b1d1f',
            lineHeight: '1.5',
            letterSpacing: '-0.18px',
          }}
        >
          {node.content?.map((item: any, idx) => {
            if (item.type) {
              return renderNode(item as TiptapNode, idx);
            }
            return null;
          })}
        </ul>
      );
    }

    case 'ordered_list': {
      return (
        <ol
          key={`ol-${index}`}
          style={{
            margin: '0',
            paddingLeft: '20px',
            fontSize: '18px',
            fontWeight: '500',
            fontFamily: 'Pretendard, sans-serif',
            color: '#1b1d1f',
            lineHeight: '1.5',
            letterSpacing: '-0.18px',
          }}
        >
          {node.content?.map((item: any, idx) => {
            if (item.type) {
              return renderNode(item as TiptapNode, idx);
            }
            return null;
          })}
        </ol>
      );
    }

    case 'list_item': {
      return (
        <li
          key={`li-${index}`}
          style={{
            margin: '8px 0',
          }}
        >
          {node.content?.map((item: any, idx) => {
            // For list items, render paragraph content directly without wrapper
            if (item.type === 'paragraph') {
              return renderInlineContent((item.content || []) as TiptapContent[]);
            }
            if (item.type) {
              return renderNode(item as TiptapNode, idx);
            }
            return null;
          })}
        </li>
      );
    }

    case 'blockquote': {
      return (
        <blockquote
          key={`blockquote-${index}`}
          style={{
            margin: '0',
            paddingLeft: '16px',
            borderLeft: '4px solid #e5e7eb',
            fontSize: '18px',
            fontWeight: '500',
            fontFamily: 'Pretendard, sans-serif',
            color: '#666',
            fontStyle: 'italic',
            lineHeight: '1.5',
            letterSpacing: '-0.18px',
          }}
        >
          {node.content?.map((item: any, idx) => {
            if (item.type) {
              return renderNode(item as TiptapNode, idx);
            }
            return null;
          })}
        </blockquote>
      );
    }

    case 'hard_break': {
      return <br key={`br-${index}`} />;
    }

    case 'doc': {
      // doc type should be handled at root level, but handle it just in case
      return (
        <div key={`doc-${index}`}>
          {(node.content || []).map((child: any, idx) => {
            if (child.type) {
              return renderNode(child as TiptapNode, idx);
            }
            return null;
          })}
        </div>
      );
    }

    default:
      // Skip unknown node types
      return null;
  }
}

interface TiptapContentRendererProps {
  content: TiptapDoc | Record<string, unknown>;
}

/**
 * Main renderer for Tiptap JSON content
 */
export default function TiptapContentRenderer({ content }: TiptapContentRendererProps) {
  if (!content || typeof content !== 'object') {
    return null;
  }

  const doc = content as TiptapDoc;

  if (doc.type !== 'doc' || !Array.isArray(doc.content) || doc.content.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
      }}
    >
      {doc.content.map((node, index) => renderNode(node, index))}
    </div>
  );
}
