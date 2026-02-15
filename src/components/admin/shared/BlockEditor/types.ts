// Block Editor Types
// Defines all block types for the content editor.
// Includes both generic blocks and Work-specific blocks.

export type BlockType =
  | 'text'
  | 'heading'
  | 'image'
  | 'gallery'
  | 'spacer'
  | 'divider'
  | 'hero-image'
  | 'work-title'
  | 'work-metadata'
  | 'work-gallery';

/** Base interface for all content blocks */
export interface ContentBlock {
  id: string;
  type: BlockType;
  order: number;
}

/** Markdown-based text block */
export interface TextBlock extends ContentBlock {
  type: 'text';
  content: string;
}

/** Heading block with configurable level */
export interface HeadingBlock extends ContentBlock {
  type: 'heading';
  level: 1 | 2 | 3;
  content: string;
}

/** Image block with sizing and alignment controls */
export interface ImageBlock extends ContentBlock {
  type: 'image';
  url: string;
  alt: string;
  caption: string;
  size: 'small' | 'medium' | 'large' | 'full';
  align: 'left' | 'center' | 'right';
}

/** Gallery image entry */
export interface GalleryImageEntry {
  id: string;
  url: string;
  alt?: string;
}

/** Gallery block with multiple images and layout options */
export interface GalleryBlock extends ContentBlock {
  type: 'gallery';
  images: GalleryImageEntry[];
  layout?: '1+2+3' | 'grid' | 'auto';
}

/** Spacer block for vertical spacing */
export interface SpacerBlock extends ContentBlock {
  type: 'spacer';
  height: 'small' | 'medium' | 'large';
}

/** Divider block for visual separation */
export interface DividerBlock extends ContentBlock {
  type: 'divider';
  style?: 'solid' | 'dashed' | 'dotted';
}

// ---------------------------------------------------------------------------
// Work-specific block types
// These match the WorkDetailPage layout exactly.
// ---------------------------------------------------------------------------

/** Hero image block - full width, 860px fixed height */
export interface HeroImageBlock extends ContentBlock {
  type: 'hero-image';
  url: string;
  alt: string;
}

/** Work title block - 60px Satoshi bold, matching WorkDetailPage h1 */
export interface WorkTitleBlock extends ContentBlock {
  type: 'work-title';
  title: string;
  /** Author name shown below the title */
  author: string;
  /** Email shown next to author */
  email: string;
}

/** Work metadata block - author + email in a single line (14px) */
export interface WorkMetadataBlock extends ContentBlock {
  type: 'work-metadata';
  author: string;
  email: string;
}

/** Work gallery block - vertical stack, images 100% width, -1px margin overlap */
export interface WorkGalleryBlock extends ContentBlock {
  type: 'work-gallery';
  images: GalleryImageEntry[];
}

/** Union of all block types */
export type Block =
  | TextBlock
  | HeadingBlock
  | ImageBlock
  | GalleryBlock
  | SpacerBlock
  | DividerBlock
  | HeroImageBlock
  | WorkTitleBlock
  | WorkMetadataBlock
  | WorkGalleryBlock;

/** Top-level blog content structure */
export interface BlogContent {
  blocks: Block[];
  version: string;
}

/**
 * Context passed to the BlockEditor for work-detail preview mode.
 * Contains the project metadata that surrounds the block content.
 */
export interface WorkProjectContext {
  title: string;
  author: string;
  email: string;
  heroImage: string;
  category?: string;
}

/** Current schema version */
export const BLOG_CONTENT_VERSION = '1.0';

/** Create an empty BlogContent object */
export function createEmptyBlogContent(): BlogContent {
  return {
    blocks: [],
    version: BLOG_CONTENT_VERSION,
  };
}

/** Generate a unique block ID */
export function generateBlockId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/** Create a default block by type */
export function createDefaultBlock(type: BlockType, order: number): Block {
  const base = { id: generateBlockId(), order };

  switch (type) {
    case 'text':
      return { ...base, type: 'text', content: '' };
    case 'heading':
      return { ...base, type: 'heading', level: 2, content: '' };
    case 'image':
      return {
        ...base,
        type: 'image',
        url: '',
        alt: '',
        caption: '',
        size: 'large',
        align: 'center',
      };
    case 'gallery':
      return { ...base, type: 'gallery', images: [], layout: 'auto' };
    case 'spacer':
      return { ...base, type: 'spacer', height: 'medium' };
    case 'divider':
      return { ...base, type: 'divider', style: 'solid' };
    case 'hero-image':
      return { ...base, type: 'hero-image', url: '', alt: '' };
    case 'work-title':
      return { ...base, type: 'work-title', title: '', author: '', email: '' };
    case 'work-metadata':
      return { ...base, type: 'work-metadata', author: '', email: '' };
    case 'work-gallery':
      return { ...base, type: 'work-gallery', images: [] };
  }
}
