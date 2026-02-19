import { TiptapContent, TiptapNode, isTiptapContent } from '@/components/admin/shared/BlockEditor/types';

/**
 * Detect the format of content: 'markdown' (string) or 'tiptap' (JSON object)
 * @param content - Content to check (string or TiptapContent object)
 * @returns Format type: 'markdown' | 'tiptap'
 */
export function detectContentFormat(content: unknown): 'markdown' | 'tiptap' {
  if (typeof content === 'string') {
    return 'markdown';
  }
  if (isTiptapContent(content)) {
    return 'tiptap';
  }
  // Fallback to markdown if uncertain
  return 'markdown';
}

/**
 * Convert markdown string to Tiptap JSON format
 * Supports: headings, bold, italic, links, code, lists
 * @param markdown - Markdown string
 * @returns TiptapContent object
 */
export function markdownToTiptapJSON(markdown: string): TiptapContent {
  if (!markdown || typeof markdown !== 'string') {
    return {
      type: 'doc',
      content: [{ type: 'paragraph', content: [] }],
    };
  }

  const lines = markdown.split('\n');
  const content: TiptapNode[] = [];
  let currentParagraphLines: string[] = [];

  // Helper to flush current paragraph
  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const text = currentParagraphLines.join('\n');
      const paragraphContent = parseInlineMarkdown(text);
      if (paragraphContent.length > 0) {
        content.push({
          type: 'paragraph',
          content: paragraphContent,
        });
      }
      currentParagraphLines = [];
    }
  };

  for (const line of lines) {
    // Check for headings (# ## ###)
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      const level = headingMatch[1].length as 1 | 2 | 3;
      const text = headingMatch[2];
      content.push({
        type: 'heading',
        attrs: { level },
        content: parseInlineMarkdown(text),
      });
      continue;
    }

    // Check for bullet lists (- or *)
    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      flushParagraph();
      const text = bulletMatch[1];
      content.push({
        type: 'bullet_list',
        content: [
          {
            type: 'list_item',
            content: [
              {
                type: 'paragraph',
                content: parseInlineMarkdown(text),
              },
            ],
          },
        ],
      });
      continue;
    }

    // Check for ordered lists (1. 2. etc)
    const orderedMatch = line.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph();
      const text = orderedMatch[1];
      content.push({
        type: 'ordered_list',
        content: [
          {
            type: 'list_item',
            content: [
              {
                type: 'paragraph',
                content: parseInlineMarkdown(text),
              },
            ],
          },
        ],
      });
      continue;
    }

    // Check for code blocks (``` or indent)
    if (line.startsWith('```')) {
      flushParagraph();
      continue;
    }

    // Check for horizontal rule (---, ***, ___)
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      flushParagraph();
      content.push({
        type: 'horizontal_rule',
      });
      continue;
    }

    // Check for blockquote (>)
    const blockquoteMatch = line.match(/^>\s+(.+)$/);
    if (blockquoteMatch) {
      flushParagraph();
      const text = blockquoteMatch[1];
      content.push({
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: parseInlineMarkdown(text),
          },
        ],
      });
      continue;
    }

    // Empty line: flush paragraph
    if (line.trim() === '') {
      flushParagraph();
      continue;
    }

    // Regular paragraph line
    currentParagraphLines.push(line);
  }

  // Flush any remaining paragraph
  flushParagraph();

  // Return at least a paragraph
  if (content.length === 0) {
    content.push({ type: 'paragraph', content: [] });
  }

  return { type: 'doc', content };
}

/**
 * Parse inline markdown (bold, italic, code, links) within a line
 * Returns array of TiptapNode objects with text and marks
 * @param text - Text with inline markdown
 * @returns Array of TiptapNode objects
 */
function parseInlineMarkdown(text: string): TiptapNode[] {
  if (!text) return [];

  const nodes: TiptapNode[] = [];
  const tokens = tokenizeInlineMarkdown(text);

  for (const token of tokens) {
    if (token.type === 'text') {
      nodes.push({
        type: 'text',
        text: token.content,
      });
    } else if (token.type === 'bold') {
      nodes.push({
        type: 'text',
        text: token.content,
        marks: [{ type: 'bold' }],
      });
    } else if (token.type === 'italic') {
      nodes.push({
        type: 'text',
        text: token.content,
        marks: [{ type: 'italic' }],
      });
    } else if (token.type === 'code') {
      nodes.push({
        type: 'text',
        text: token.content,
        marks: [{ type: 'code' }],
      });
    } else if (token.type === 'link') {
      const match = token.content.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        const [, linkText, url] = match;
        nodes.push({
          type: 'text',
          text: linkText,
          marks: [{ type: 'link', attrs: { href: url } }],
        });
      } else {
        nodes.push({
          type: 'text',
          text: token.content,
        });
      }
    }
  }

  return nodes;
}

interface Token {
  type: 'text' | 'bold' | 'italic' | 'code' | 'link';
  content: string;
}

/**
 * Tokenize inline markdown into text and formatted pieces
 * @param text - Input text
 * @returns Array of tokens
 */
function tokenizeInlineMarkdown(text: string): Token[] {
  const tokens: Token[] = [];
  let remaining = text;

  // Pattern: **bold**, *italic*, `code`, [text](url)
  const patterns = [
    { regex: /\*\*(.+?)\*\*/, type: 'bold' as const },
    { regex: /\*(.+?)\*/, type: 'italic' as const },
    { regex: /`(.+?)`/, type: 'code' as const },
    { regex: /\[([^\]]+)\]\(([^)]+)\)/, type: 'link' as const },
  ];

  while (remaining) {
    let matched = false;

    for (const pattern of patterns) {
      const match = remaining.match(pattern.regex);
      if (match && match.index !== undefined) {
        // Add text before match
        if (match.index > 0) {
          tokens.push({
            type: 'text',
            content: remaining.substring(0, match.index),
          });
        }

        // Add matched token
        tokens.push({
          type: pattern.type,
          content: match[0], // Full match including delimiters for links
        });

        // Continue with remaining text
        remaining = remaining.substring(match.index + match[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // No match found, add remaining as text
      if (remaining) {
        tokens.push({
          type: 'text',
          content: remaining,
        });
      }
      break;
    }
  }

  return tokens;
}

/**
 * Convert Tiptap JSON to plain text (for previews or export)
 * @param json - TiptapContent object
 * @returns Plain text string
 */
export function tiptapJSONToText(json: TiptapContent): string {
  if (!isTiptapContent(json)) return '';

  let text = '';
  for (const node of json.content) {
    text += nodeToText(node);
  }
  return text;
}

/**
 * Recursively extract text from a TiptapNode
 * @param node - TiptapNode to process
 * @returns Text content
 */
function nodeToText(node: TiptapNode): string {
  if (node.type === 'text' && node.text) {
    return node.text;
  }

  if (node.content && Array.isArray(node.content)) {
    return node.content.map(nodeToText).join('');
  }

  return '';
}

/**
 * Type guard to ensure content is valid for rendering
 * @param content - Content to validate
 * @returns True if content can be rendered
 */
export function isValidMarkdownContent(content: unknown): boolean {
  return typeof content === 'string' && content.length > 0;
}

/**
 * Type guard to ensure content is valid Tiptap JSON
 * @param content - Content to validate
 * @returns True if content is valid TiptapContent
 */
export function isValidTiptapContent(content: unknown): boolean {
  return isTiptapContent(content) && content.content.length > 0;
}
