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
 * - Wraps description in TextBlock
 * - Converts galleryImages array to WorkGalleryBlock (vertical stack layout)
 * - Optionally includes heroImage as HeroImageBlock
 *
 * New format uses Work-specific block types:
 * - HeroImageBlock for hero image (full-width, 860px)
 * - TextBlock for description (renders in right column)
 * - WorkGalleryBlock for gallery images (vertical stack, full-width, -1px overlap)
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

  // Add heroImage as HeroImageBlock (if available)
  if (heroImage) {
    blocks.push({
      id: generateBlockId(),
      type: 'hero-image',
      url: heroImage,
      alt: '',
      order: blocks.length,
    });
  }

  // Add WorkTitleBlock if title/author/email are available
  if (title || author || email) {
    blocks.push({
      id: generateBlockId(),
      type: 'work-title',
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

  // Add galleryImages as WorkGalleryBlock (matching WorkDetailPage layout)
  const validImages = galleryImages?.filter(url => url && typeof url === 'string') || [];
  if (validImages.length > 0) {
    blocks.push({
      id: generateBlockId(),
      type: 'work-gallery',
      images: validImages.map(url => ({ id: generateBlockId(), url })),
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
