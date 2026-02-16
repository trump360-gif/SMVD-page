'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type {
  Block,
  TextBlock,
  ImageBlock,
  HeadingBlock,
  GalleryBlock,
  SpacerBlock,
  DividerBlock,
  HeroImageBlock,
  HeroSectionBlock,
  WorkTitleBlock,
  WorkMetadataBlock,
  WorkGalleryBlock,
  WorkLayoutConfigBlock,
  LayoutRowBlock,
  LayoutGridBlock,
} from '../types';
import HeadingBlockRenderer from './HeadingBlockRenderer';
import GalleryBlockRenderer from './GalleryBlockRenderer';
import SpacerBlockRenderer from './SpacerBlockRenderer';
import DividerBlockRenderer from './DividerBlockRenderer';
import HeroImageBlockRenderer from './HeroImageBlockRenderer';
import HeroSectionBlockRenderer from './HeroSectionBlockRenderer';
import WorkTitleBlockRenderer from './WorkTitleBlockRenderer';
import WorkMetadataBlockRenderer from './WorkMetadataBlockRenderer';
import WorkGalleryBlockRenderer from './WorkGalleryBlockRenderer';

// ---------------------------------------------------------------------------
// Per-block renderers (Text + Image are inline, others are separate files)
// ---------------------------------------------------------------------------

function TextBlockRenderer({ block }: { block: TextBlock }) {
  if (!block.content) {
    return (
      <p className="text-gray-400 text-sm italic">Empty text block</p>
    );
  }

  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {block.content}
      </ReactMarkdown>
    </div>
  );
}

const IMAGE_SIZE_CLASSES: Record<ImageBlock['size'], string> = {
  small: 'max-w-[25%]',
  medium: 'max-w-[50%]',
  large: 'max-w-[75%]',
  full: 'max-w-full w-full',
};

const IMAGE_ALIGN_CLASSES: Record<ImageBlock['align'], string> = {
  left: 'mr-auto',
  center: 'mx-auto',
  right: 'ml-auto',
};

// Helper function to calculate row column widths
function calculateRowWidths(rowBlock: LayoutRowBlock): number[] {
  if (rowBlock.distribution === 'custom' && rowBlock.customWidths) {
    return rowBlock.customWidths;
  }

  const columns = rowBlock.columns;
  if (rowBlock.distribution === 'golden-left') {
    // Golden ratio: wider left column
    return columns === 2 ? [61.8, 38.2] : [50, 25, 25];
  }
  if (rowBlock.distribution === 'golden-right') {
    // Golden ratio: wider right column
    return columns === 2 ? [38.2, 61.8] : [25, 25, 50];
  }
  // Default: equal distribution
  return Array(columns).fill(100 / columns);
}

// Helper function to get grid template info
function getGridTemplateInfo(template: LayoutGridBlock['template']): { rows: number; cols: number } {
  const templates: Record<string, { rows: number; cols: number }> = {
    '2x2': { rows: 2, cols: 2 },
    '3x1': { rows: 3, cols: 1 },
    '1x3': { rows: 1, cols: 3 },
    '2x3': { rows: 2, cols: 3 },
    'auto': { rows: 2, cols: 2 }, // Default fallback
  };
  return templates[template] || templates['auto'];
}

function ImageBlockRenderer({ block }: { block: ImageBlock }) {
  if (!block.url) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-100 rounded text-gray-400 text-sm">
        No image URL
      </div>
    );
  }

  return (
    <figure
      className={`${IMAGE_SIZE_CLASSES[block.size]} ${IMAGE_ALIGN_CLASSES[block.align]}`}
    >
      <img
        src={block.url}
        alt={block.alt || ''}
        className="w-full rounded"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent && !parent.querySelector('.img-error-msg')) {
            const msg = document.createElement('div');
            msg.className = 'img-error-msg flex items-center justify-center h-32 bg-red-50 rounded text-red-400 text-sm';
            msg.textContent = 'Image failed to load';
            parent.prepend(msg);
          }
        }}
      />
      {block.caption && (
        <figcaption className="text-center text-xs text-gray-500 mt-2">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

// ---------------------------------------------------------------------------
// BlockRenderer - renders a list of blocks for preview
// ---------------------------------------------------------------------------

interface BlockRendererProps {
  blocks: Block[];
}

/**
 * Renders an array of blocks as preview content.
 * Supports all block types including Work-specific blocks.
 */
export default function BlockRenderer({ blocks }: BlockRendererProps) {
  if (blocks.length === 0) {
    return (
      <p className="text-gray-400 text-sm italic">
        Preview will appear here...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        switch (block.type) {
          case 'text':
            return <TextBlockRenderer key={block.id} block={block} />;
          case 'image':
            return <ImageBlockRenderer key={block.id} block={block} />;
          case 'heading':
            return <HeadingBlockRenderer key={block.id} block={block as HeadingBlock} />;
          case 'gallery':
            return <GalleryBlockRenderer key={block.id} block={block as GalleryBlock} />;
          case 'spacer':
            return <SpacerBlockRenderer key={block.id} block={block as SpacerBlock} />;
          case 'divider':
            return <DividerBlockRenderer key={block.id} block={block as DividerBlock} />;
          case 'hero-image':
            return <HeroImageBlockRenderer key={block.id} block={block as HeroImageBlock} />;
          case 'hero-section':
            return <HeroSectionBlockRenderer key={block.id} block={block as HeroSectionBlock} />;
          case 'work-title':
            return <WorkTitleBlockRenderer key={block.id} block={block as WorkTitleBlock} />;
          case 'work-metadata':
            return <WorkMetadataBlockRenderer key={block.id} block={block as WorkMetadataBlock} />;
          case 'work-gallery':
            return <WorkGalleryBlockRenderer key={block.id} block={block as WorkGalleryBlock} />;
          case 'work-layout-config':
            // Layout config block is metadata - doesn't render as visible content
            return null;
          case 'layout-row': {
            const rowBlock = block as LayoutRowBlock;
            const widths = calculateRowWidths(rowBlock);
            const gap = rowBlock.columnGap ?? 24;
            return (
              <div
                key={block.id}
                style={{ display: 'flex', gap: `${gap}px` }}
                className="layout-row-container"
              >
                {rowBlock.children.map((columnBlocks, idx) => (
                  <div
                    key={idx}
                    style={{ flex: `0 0 ${widths[idx]}%` }}
                    className="layout-row-column"
                  >
                    <BlockRenderer blocks={columnBlocks} />
                  </div>
                ))}
              </div>
            );
          }
          case 'layout-grid': {
            const gridBlock = block as LayoutGridBlock;
            const gap = gridBlock.gap ?? 16;
            const { cols } = getGridTemplateInfo(gridBlock.template);
            return (
              <div
                key={block.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  gap: `${gap}px`,
                }}
                className="layout-grid-container"
              >
                {gridBlock.children.map((cellBlocks, idx) => (
                  <div
                    key={idx}
                    style={{ minHeight: `${gridBlock.minCellHeight ?? 200}px` }}
                    className="layout-grid-cell"
                  >
                    <BlockRenderer blocks={cellBlocks} />
                  </div>
                ))}
              </div>
            );
          }
          default: {
            // Exhaustive check: if a new block type is added to BlockType
            // but not handled here, TypeScript will flag it.
            const _exhaustive: never = block;
            return (
              <div
                key={(_exhaustive as Block).id}
                className="p-3 bg-gray-100 rounded text-xs text-gray-500 text-center"
              >
                [Unknown block type]
              </div>
            );
          }
        }
      })}
    </div>
  );
}
