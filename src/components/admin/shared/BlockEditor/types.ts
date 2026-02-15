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
  | 'hero-section'
  | 'work-title'
  | 'work-metadata'
  | 'work-gallery'
  | 'work-layout-config'
  | 'layout-row'
  | 'layout-grid';

/** Base interface for all content blocks */
export interface ContentBlock {
  id: string;
  type: BlockType;
  order: number;
}

/** Markdown-based text block with optional styling */
export interface TextBlock extends ContentBlock {
  type: 'text';
  content: string;
  /** Font size in pixels (default: 18) */
  fontSize?: number;
  /** Font weight (default: '400') */
  fontWeight?: '400' | '500' | '700';
  /** Text color (default: '#1b1d1f') */
  color?: string;
  /** Line height multiplier (default: 1.8) */
  lineHeight?: number;
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
  /** Number of columns for image layout (1, 2, or 3) */
  imageLayout?: 1 | 2 | 3;
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

/** Hero section block - unified image + title/author/email with overlay styling */
export interface HeroSectionBlock extends ContentBlock {
  type: 'hero-section';
  // Image properties
  url: string;
  alt: string;
  // Title properties
  title: string;
  author: string;
  email: string;
  // Title styling
  titleFontSize?: number;
  authorFontSize?: number;
  gap?: number;
  titleFontWeight?: '400' | '500' | '700';
  authorFontWeight?: '400' | '500' | '700';
  emailFontWeight?: '400' | '500' | '700';
  titleColor?: string;
  authorColor?: string;
  emailColor?: string;
  // Overlay styling
  overlayPosition?: 'bottom-left' | 'bottom-right' | 'center' | 'none';
  overlayOpacity?: number;
  overlayBackground?: string;
}

/** Work title block - 60px Satoshi bold, matching WorkDetailPage h1 */
export interface WorkTitleBlock extends ContentBlock {
  type: 'work-title';
  title: string;
  /** Author name shown below the title */
  author: string;
  /** Email shown next to author */
  email: string;
  /** Title font size in pixels (default: 60) */
  titleFontSize?: number;
  /** Author/email font size in pixels (default: 14) */
  authorFontSize?: number;
  /** Gap between title and author in pixels (default: 24) */
  gap?: number;
  /** Title font weight (default: '700') */
  titleFontWeight?: '400' | '500' | '700';
  /** Author font weight (default: '500') */
  authorFontWeight?: '400' | '500' | '700';
  /** Email font weight (default: '400') */
  emailFontWeight?: '400' | '500' | '700';
  /** Title color (default: '#1b1d1f') */
  titleColor?: string;
  /** Author color (default: '#1b1d1f') */
  authorColor?: string;
  /** Email color (default: '#7b828e') */
  emailColor?: string;
}

/** Work metadata block - author + email in a single line (14px) */
export interface WorkMetadataBlock extends ContentBlock {
  type: 'work-metadata';
  author: string;
  email: string;
}

/** Work layout configuration block - controls column layout and spacing */
export interface WorkLayoutConfigBlock extends ContentBlock {
  type: 'work-layout-config';
  /** Column layout: 1 (single), 2 (title left, text right), or 3 (three columns) */
  columnLayout: 1 | 2 | 3;
  /** Gap between columns in pixels (default: 90) */
  columnGap?: number;
  /** Width of text column: 'auto' | 'narrow' | 'wide' (default: 'auto') */
  textColumnWidth?: 'auto' | 'narrow' | 'wide';
}

/** Work gallery block - vertical stack, images 100% width, -1px margin overlap */
export interface WorkGalleryBlock extends ContentBlock {
  type: 'work-gallery';
  images: GalleryImageEntry[];
  /** Number of columns for image layout (1, 2, or 3) */
  imageLayout?: 1 | 2 | 3;
}

// ---------------------------------------------------------------------------
// Layout container block types (multi-column/grid layouts)
// These are specialized container blocks that hold other blocks in columns/grids
// ---------------------------------------------------------------------------

/** Layout row block - horizontal container for 2 or 3 columns */
export interface LayoutRowBlock extends ContentBlock {
  type: 'layout-row';
  /** Number of columns: 2 or 3 */
  columns: 2 | 3;
  /** Blocks for each column (array of column arrays) */
  children: Block[][];
  /** Gap between columns in pixels (default: 24) */
  columnGap?: number;
  /** Column width distribution mode */
  distribution?: 'equal' | 'golden-left' | 'golden-right' | 'custom';
  /** Custom column widths in percentages (required if distribution === 'custom') */
  customWidths?: number[];
}

/** Layout grid block - 2D grid container for blocks */
export interface LayoutGridBlock extends ContentBlock {
  type: 'layout-grid';
  /** Grid template: rows x columns or auto-layout */
  template: '2x2' | '3x1' | '1x3' | '2x3' | 'auto';
  /** Blocks for each grid cell (flat array, filled row by row) */
  children: Block[][];
  /** Gap between grid cells in pixels (default: 16) */
  gap?: number;
  /** Minimum cell height in pixels (default: 200) */
  minCellHeight?: number;
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
  | HeroSectionBlock
  | WorkTitleBlock
  | WorkMetadataBlock
  | WorkGalleryBlock
  | WorkLayoutConfigBlock
  | LayoutRowBlock
  | LayoutGridBlock;

// ---------------------------------------------------------------------------
// Row-based layout configuration
// ---------------------------------------------------------------------------

/**
 * Configuration for a single row in the row-based layout system.
 * Each row specifies how many columns it has and how many blocks it contains.
 *
 * The `layout` field determines the number of columns rendered for this row.
 * The `blockCount` field determines how many blocks from the flat `blocks[]`
 * array belong to this row (consumed sequentially).
 *
 * @example
 * // A row that renders 3 columns containing 3 blocks
 * { layout: 3, blockCount: 3 }
 *
 * // A full-width row containing 1 block
 * { layout: 1, blockCount: 1 }
 */
export interface RowConfig {
  /** Number of columns for this row (1 = full width, 2 = two columns, 3 = three columns) */
  layout: 1 | 2 | 3;
  /** Number of blocks consumed from the flat blocks array for this row */
  blockCount: number;
}

/** Top-level blog content structure */
export interface BlogContent {
  blocks: Block[];
  version: string;
  /**
   * Optional row-based layout configuration.
   * When present, blocks are split into rows according to this config.
   * When absent, all blocks are rendered in a single column (backward compatible).
   */
  rowConfig?: RowConfig[];
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
      return {
        ...base,
        type: 'text',
        content: '',
        fontSize: 18,
        fontWeight: '400',
        color: '#1b1d1f',
        lineHeight: 1.8,
      };
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
      return { ...base, type: 'gallery', images: [], layout: 'auto', imageLayout: 1 };
    case 'spacer':
      return { ...base, type: 'spacer', height: 'medium' };
    case 'divider':
      return { ...base, type: 'divider', style: 'solid' };
    case 'hero-image':
      return { ...base, type: 'hero-image', url: '', alt: '' };
    case 'hero-section':
      return {
        ...base,
        type: 'hero-section',
        url: '',
        alt: '',
        title: '',
        author: '',
        email: '',
        titleFontSize: 60,
        authorFontSize: 14,
        gap: 24,
        titleFontWeight: '700',
        authorFontWeight: '500',
        emailFontWeight: '400',
        titleColor: '#1b1d1f',
        authorColor: '#1b1d1f',
        emailColor: '#7b828e',
        overlayPosition: 'bottom-left',
        overlayOpacity: 0.8,
        overlayBackground: 'rgba(0, 0, 0, 0.3)',
      };
    case 'work-title':
      return { ...base, type: 'work-title', title: '', author: '', email: '' };
    case 'work-metadata':
      return { ...base, type: 'work-metadata', author: '', email: '' };
    case 'work-gallery':
      return { ...base, type: 'work-gallery', images: [], imageLayout: 1 };
    case 'work-layout-config':
      return {
        ...base,
        type: 'work-layout-config',
        columnLayout: 2,
        columnGap: 90,
        textColumnWidth: 'auto',
      };
    case 'layout-row':
      return {
        ...base,
        type: 'layout-row',
        columns: 2,
        children: [[], []],
        columnGap: 24,
        distribution: 'equal',
      };
    case 'layout-grid':
      return {
        ...base,
        type: 'layout-grid',
        template: '2x2',
        children: [[], [], [], []],
        gap: 16,
        minCellHeight: 200,
      };
  }
}

/**
 * Validates block tree structure to prevent infinite recursion and enforce constraints
 * @param blocks Root blocks to validate
 * @param maxDepth Maximum nesting depth allowed (default: 3)
 * @returns Validation result with error details if validation fails
 */
export interface BlockTreeValidationResult {
  valid: boolean;
  error?: string;
}

export function validateBlockTree(
  blocks: Block[],
  maxDepth: number = 3
): BlockTreeValidationResult {
  function checkBlock(block: Block, depth: number, path: string): BlockTreeValidationResult {
    // Check max depth
    if (depth > maxDepth) {
      return {
        valid: false,
        error: `Block tree exceeds maximum nesting depth of ${maxDepth} at ${path}`,
      };
    }

    // Check for container blocks at depth > 1 (no nested containers)
    if (depth > 1 && (block.type === 'layout-row' || block.type === 'layout-grid')) {
      return {
        valid: false,
        error: `Container block (${block.type}) cannot be nested inside another container at ${path}`,
      };
    }

    // Recursively check children if this is a container
    if (block.type === 'layout-row') {
      const rowBlock = block as LayoutRowBlock;
      for (let colIdx = 0; colIdx < rowBlock.children.length; colIdx++) {
        for (let blockIdx = 0; blockIdx < rowBlock.children[colIdx].length; blockIdx++) {
          const childBlock = rowBlock.children[colIdx][blockIdx];
          const childPath = `${path}/layout-row[col${colIdx}][${blockIdx}]`;
          const result = checkBlock(childBlock, depth + 1, childPath);
          if (!result.valid) return result;
        }
      }
    } else if (block.type === 'layout-grid') {
      const gridBlock = block as LayoutGridBlock;
      for (let cellIdx = 0; cellIdx < gridBlock.children.length; cellIdx++) {
        for (let blockIdx = 0; blockIdx < gridBlock.children[cellIdx].length; blockIdx++) {
          const childBlock = gridBlock.children[cellIdx][blockIdx];
          const childPath = `${path}/layout-grid[cell${cellIdx}][${blockIdx}]`;
          const result = checkBlock(childBlock, depth + 1, childPath);
          if (!result.valid) return result;
        }
      }
    }

    return { valid: true };
  }

  // Check all root blocks
  for (let i = 0; i < blocks.length; i++) {
    const result = checkBlock(blocks[i], 1, `root[${i}]`);
    if (!result.valid) return result;
  }

  return { valid: true };
}

// ---------------------------------------------------------------------------
// Row-based layout utility functions
// ---------------------------------------------------------------------------

/**
 * Split a flat block array into rows based on the provided RowConfig.
 *
 * Blocks are consumed sequentially: the first row takes the first
 * `rowConfig[0].blockCount` blocks, the second row takes the next
 * `rowConfig[1].blockCount` blocks, and so on.
 *
 * If `rowConfig` is missing or empty, returns all blocks in a single row
 * (backward compatible behavior).
 *
 * Any blocks remaining after all rowConfig entries are exhausted are
 * appended as an additional single-column row to prevent data loss.
 *
 * @param blocks - Flat array of all blocks
 * @param rowConfig - Optional row configuration array
 * @returns Array of block arrays, one per row
 *
 * @example
 * const blocks = [B1, B2, B3, B4, B5, B6];
 * const config = [
 *   { layout: 1, blockCount: 1 },
 *   { layout: 3, blockCount: 3 },
 *   { layout: 2, blockCount: 2 },
 * ];
 * groupBlocksByRows(blocks, config);
 * // => [[B1], [B2, B3, B4], [B5, B6]]
 */
export function groupBlocksByRows(
  blocks: Block[],
  rowConfig?: RowConfig[]
): Block[][] {
  if (!rowConfig || rowConfig.length === 0) {
    return [blocks];
  }

  const rows: Block[][] = [];
  let blockIndex = 0;

  for (const row of rowConfig) {
    const count = Math.max(0, row.blockCount);
    const rowBlocks = blocks.slice(blockIndex, blockIndex + count);
    rows.push(rowBlocks);
    blockIndex += count;
  }

  // Append any remaining blocks as a fallback row (prevents data loss)
  if (blockIndex < blocks.length) {
    rows.push(blocks.slice(blockIndex));
  }

  return rows;
}

/**
 * Generate a RowConfig array from a list of desired layouts.
 *
 * Each entry in `layouts` becomes a row whose `blockCount` equals its
 * `layout` value (i.e., a 3-column row consumes 3 blocks). If there are
 * fewer remaining blocks than the layout requests, the row's `blockCount`
 * is clamped to whatever is left.
 *
 * @param blockCount - Total number of blocks to distribute
 * @param layouts - Array of column counts for each row (1, 2, or 3)
 * @returns RowConfig array
 *
 * @example
 * generateRowConfig(6, [1, 3, 2]);
 * // => [
 * //   { layout: 1, blockCount: 1 },
 * //   { layout: 3, blockCount: 3 },
 * //   { layout: 2, blockCount: 2 },
 * // ]
 *
 * @example
 * // When blocks run out before layouts are exhausted:
 * generateRowConfig(2, [1, 3]);
 * // => [
 * //   { layout: 1, blockCount: 1 },
 * //   { layout: 3, blockCount: 1 },
 * // ]
 */
export function generateRowConfig(
  blockCount: number,
  layouts: (1 | 2 | 3)[]
): RowConfig[] {
  let remaining = blockCount;
  const result: RowConfig[] = [];

  for (const layout of layouts) {
    if (remaining <= 0) break;
    const count = Math.min(layout, remaining);
    result.push({ layout, blockCount: count });
    remaining -= count;
  }

  return result;
}
