import type { BlogContent, Block } from '@/components/admin/shared/BlockEditor/types';
import { generateBlockId } from '@/components/admin/shared/BlockEditor/types';

/**
 * Convert a legacy markdown string (stored in `description`) to BlogContent.
 * - If the string is already a JSON-serialized BlogContent, parse and return it.
 * - Otherwise wrap the raw markdown in a single TextBlock.
 */
export function parseContentFromDescription(
  description: string | null | undefined
): BlogContent {
  if (!description) {
    return { blocks: [], version: '1.0' };
  }

  // Try parsing as JSON first (new format)
  try {
    const parsed = JSON.parse(description);
    if (parsed.blocks && Array.isArray(parsed.blocks) && parsed.version) {
      return parsed as BlogContent;
    }
  } catch {
    // Not JSON -- treat as legacy markdown
  }

  // Legacy markdown -> single TextBlock
  return {
    blocks: [
      {
        id: generateBlockId(),
        type: 'text',
        content: description,
        order: 0,
      },
    ],
    version: '1.0',
  };
}

/**
 * Serialize BlogContent to a JSON string for DB storage.
 */
export function serializeContent(content: BlogContent): string {
  return JSON.stringify(content);
}

/**
 * Convert Work project's description (markdown) + galleryImages array to BlogContent.
 * - Combines heroImage + title/author/email into unified HeroSectionBlock
 * - Wraps description in TextBlock
 * - Converts galleryImages array to ImageGridBlock (grid layout)
 *
 * New format uses Work-specific block types:
 * - HeroSectionBlock for unified image + title/author/email (full-width, 860px, overlay styling)
 * - TextBlock for description (renders in right column)
 * - ImageGridBlock for gallery images (grid layout)
 */
export function parseWorkProjectContent(
  description: string | null | undefined,
  galleryImages: string[] | null | undefined,
  heroImage?: string | null,
  title?: string | null,
  author?: string | null,
  email?: string | null
): BlogContent {
  // First, try to parse description as existing JSON blocks
  if (description) {
    try {
      const parsed = JSON.parse(description);
      if (parsed.blocks && Array.isArray(parsed.blocks) && parsed.version) {
        // Already in block format - just return it
        return parsed as BlogContent;
      }
    } catch {
      // Not JSON - treat as legacy markdown
    }
  }

  const blocks: Block[] = [];

  // Add unified HeroSectionBlock if heroImage + title/author/email are available
  // Combines image + title in a single block (overlay styling applied)
  if (heroImage && (title || author || email)) {
    blocks.push({
      id: generateBlockId(),
      type: 'hero-section',
      url: heroImage,
      alt: '',
      title: title || '',
      author: author || '',
      email: email || '',
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
      order: blocks.length,
    });
  } else if (heroImage) {
    // Fallback: If only heroImage without title/author/email, use HeroImageBlock
    blocks.push({
      id: generateBlockId(),
      type: 'hero-image',
      url: heroImage,
      alt: '',
      order: blocks.length,
    });
  }

  // Add description as TextBlock (renders in right column of 2-Column layout)
  if (description) {
    blocks.push({
      id: generateBlockId(),
      type: 'text',
      content: description,
      order: blocks.length,
    });
  }

  // Add galleryImages as ImageGridBlock (row-based layout)
  const validImages = galleryImages?.filter(url => url && typeof url === 'string') || [];
  if (validImages.length > 0) {
    // Generate rows for image grid
    const rows = [];
    let imgIdx = 0;

    // Layout strategy: 1-col, 2-col, 3-col for remaining
    const layoutStrategy = [
      { columns: 1, count: 1 },
      { columns: 2, count: 2 },
      { columns: 3, count: 999 }, // Fill rest with 3 columns
    ];

    for (const layout of layoutStrategy) {
      if (imgIdx >= validImages.length) break;
      const count = Math.min(layout.count, validImages.length - imgIdx);
      rows.push({
        id: generateBlockId(),
        columns: layout.columns as 1 | 2 | 3,
        imageCount: count,
      });
      imgIdx += count;
    }

    blocks.push({
      id: generateBlockId(),
      type: 'image-grid',
      images: validImages.map(url => ({ id: generateBlockId(), url })),
      rows,
      gap: 0,
      aspectRatio: 2,
      order: blocks.length,
    });
  }

  return { blocks, version: '1.0' };
}

// ---- News-specific legacy conversion ----

export interface NewsLegacyGallery {
  main: string;
  centerLeft: string;
  centerRight: string;
  bottomLeft: string;
  bottomCenter: string;
  bottomRight: string;
  layout?: string;
}

export interface NewsContentShape {
  introTitle?: string;
  introText?: string;
  blocks?: Block[];
  gallery?: NewsLegacyGallery;
  version?: string;
}

/**
 * Convert a News article's legacy `content` JSON to BlogContent.
 *
 * Legacy format:
 *   { introTitle?, introText?, gallery?: { main, centerLeft, ... } }
 *
 * New format:
 *   { blocks: [...], version: '1.0' }
 */
export function parseNewsContent(
  content: NewsContentShape | null | undefined
): BlogContent {
  if (!content) {
    return { blocks: [], version: '1.0' };
  }

  // Already in new block format
  if (content.blocks && content.blocks.length > 0 && content.version) {
    return { blocks: content.blocks, version: content.version };
  }

  // Convert legacy fields to blocks
  const blocks: Block[] = [];

  if (content.introText) {
    blocks.push({
      id: generateBlockId(),
      type: 'text',
      content: content.introText,
      order: blocks.length,
    });
  }

  if (content.gallery) {
    const galleryUrls = [
      content.gallery.main,
      content.gallery.centerLeft,
      content.gallery.centerRight,
      content.gallery.bottomLeft,
      content.gallery.bottomCenter,
      content.gallery.bottomRight,
    ].filter((url): url is string => !!url);

    if (galleryUrls.length > 0) {
      blocks.push({
        id: generateBlockId(),
        type: 'gallery',
        images: galleryUrls.map((url) => ({
          id: generateBlockId(),
          url,
        })),
        layout: (content.gallery.layout as '1+2+3' | 'grid' | 'auto') || '1+2+3',
        order: blocks.length,
      });
    }
  }

  return { blocks, version: '1.0' };
}
