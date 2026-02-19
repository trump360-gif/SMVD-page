import {
  Type,
  ImageIcon,
  Heading2,
  Grid3X3,
  ArrowDownFromLine,
  Minus,
  Maximize,
  Tag,
  User,
} from 'lucide-react';
import type {
  Block,
  TextBlock,
  HeadingBlock,
  ImageBlock,
  GalleryBlock,
  SpacerBlock,
  HeroImageBlock,
  HeroSectionBlock,
  WorkTitleBlock,
  WorkMetadataBlock,
  WorkLayoutConfigBlock,
  LayoutRowBlock,
  LayoutGridBlock,
  ImageRowBlock,
  ImageGridBlock,
} from '@/components/admin/shared/BlockEditor/types';

// ---------------------------------------------------------------------------
// Block metadata (icon, label, color per block type)
// ---------------------------------------------------------------------------

export const BLOCK_META: Record<
  string,
  { label: string; Icon: typeof Type; color: string }
> = {
  text: { label: 'Text', Icon: Type, color: 'text-gray-600' },
  heading: { label: 'Heading', Icon: Heading2, color: 'text-gray-700' },
  image: { label: 'Image', Icon: ImageIcon, color: 'text-blue-600' },
  gallery: { label: 'Gallery', Icon: Grid3X3, color: 'text-blue-500' },
  spacer: { label: 'Spacer', Icon: ArrowDownFromLine, color: 'text-gray-400' },
  divider: { label: 'Divider', Icon: Minus, color: 'text-gray-400' },
  'hero-image': {
    label: 'Hero Image',
    Icon: Maximize,
    color: 'text-purple-600',
  },
  'hero-section': {
    label: 'Hero Section',
    Icon: Maximize,
    color: 'text-purple-500',
  },
  'work-title': { label: 'Work Title', Icon: Tag, color: 'text-red-600' },
  'work-metadata': { label: 'Metadata', Icon: User, color: 'text-red-500' },
  'work-layout-config': {
    label: 'Layout',
    Icon: Grid3X3,
    color: 'text-green-600',
  },
  'layout-row': {
    label: 'Row Layout',
    Icon: Grid3X3,
    color: 'text-indigo-600',
  },
  'layout-grid': {
    label: 'Grid Layout',
    Icon: Grid3X3,
    color: 'text-indigo-500',
  },
};

/** Generate preview text for a block using discriminated union */
export function getBlockPreviewText(block: Block): string {
  switch (block.type) {
    case 'text': {
      const b = block as TextBlock;
      // Handle both markdown string and Tiptap JSON
      let text: string;
      if (typeof b.content === 'string') {
        text = b.content;
      } else if (b.content && typeof b.content === 'object' && (b.content as any).type === 'doc') {
        // Tiptap JSON - extract plain text
        const { tiptapJSONToText } = require('@/lib/tiptap/markdown-converter');
        text = tiptapJSONToText(b.content);
      } else {
        text = '';
      }
      return text?.substring(0, 30) || '(Empty text)';
    }
    case 'heading': {
      const b = block as HeadingBlock;
      return `H${b.level}: ${b.content || '(Empty)'}`;
    }
    case 'image': {
      const b = block as ImageBlock;
      return b.url ? 'Image' : '(No image)';
    }
    case 'gallery': {
      const b = block as GalleryBlock;
      return `Gallery (${b.images?.length || 0})`;
    }
    case 'spacer': {
      const b = block as SpacerBlock;
      return `Spacer (${b.height})`;
    }
    case 'divider':
      return 'Divider';
    case 'hero-image': {
      const b = block as HeroImageBlock;
      return b.url ? 'Hero Image' : '(No hero)';
    }
    case 'hero-section': {
      const b = block as HeroSectionBlock;
      return b.title || '(No title)';
    }
    case 'work-title': {
      const b = block as WorkTitleBlock;
      return b.title || '(No title)';
    }
    case 'work-metadata': {
      const b = block as WorkMetadataBlock;
      return b.author || 'Author';
    }
    case 'work-layout-config': {
      const b = block as WorkLayoutConfigBlock;
      return `Layout (${b.columnLayout || 2} cols)`;
    }
    case 'layout-row': {
      const b = block as LayoutRowBlock;
      return `Row (${b.columns || 2} cols)`;
    }
    case 'layout-grid': {
      const b = block as LayoutGridBlock;
      return `Grid (${b.template || 'auto'})`;
    }
    case 'image-row': {
      const b = block as ImageRowBlock;
      return `Images (${b.images?.length || 0})`;
    }
    case 'image-grid': {
      const b = block as ImageGridBlock;
      return `Grid (${b.images?.length || 0} imgs)`;
    }
    default: {
      const _exhaustive: never = block;
      return `(Unknown: ${(_exhaustive as Block).type})`;
    }
  }
}
