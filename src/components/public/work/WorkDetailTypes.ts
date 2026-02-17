export interface ParsedBlockContent {
  /** Hero image URL from HeroImageBlock */
  hero?: string;
  /** Title/Author/Email from WorkTitleBlock */
  title?: {
    title: string;
    author: string;
    email: string;
  };
  /** The first TextBlock after WorkTitleBlock (right column description) */
  mainDescription?: string;
  /** The TextBlock object with styling properties */
  mainDescriptionBlock?: {
    content: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    lineHeight?: number;
  };
  /** Layout configuration block */
  layoutConfig?: {
    columnLayout: number;
    columnGap?: number;
    textColumnWidth?: string;
  };
  /** Gallery image URLs from ImageGridBlock, GalleryBlock, or legacy WorkGalleryBlock */
  galleryImages: string[];
}

/**
 * Parse description as JSON block content with position-aware extraction.
 *
 * Block extraction rules:
 * - hero-image block -> hero URL
 * - work-title block -> title, author, email (left column)
 * - First text block after work-title -> mainDescription (right column)
 * - image-grid / gallery / legacy work-gallery blocks -> galleryImages
 *
 * Returns null if not valid block JSON (i.e. legacy plain text description).
 */
export function parseBlockContent(description: string): ParsedBlockContent | null {
  try {
    const parsed = JSON.parse(description);
    if (!parsed.blocks || !Array.isArray(parsed.blocks) || !parsed.version) {
      return null;
    }

    const result: ParsedBlockContent = { galleryImages: [] };
    let foundWorkTitle = false;
    let foundMainDescription = false;

    for (const block of parsed.blocks) {
      if (block.type === 'hero-image' && block.url) {
        result.hero = block.url;
      } else if (block.type === 'work-title') {
        result.title = {
          title: block.title || '',
          author: block.author || '',
          email: block.email || '',
        };
        foundWorkTitle = true;
      } else if (block.type === 'text' && block.content && foundWorkTitle && !foundMainDescription) {
        result.mainDescription = block.content;
        result.mainDescriptionBlock = {
          content: block.content,
          fontSize: block.fontSize,
          fontWeight: block.fontWeight,
          color: block.color,
          lineHeight: block.lineHeight,
        };
        foundMainDescription = true;
      } else if (block.type === 'text' && block.content && !foundWorkTitle) {
        if (!result.mainDescription) {
          result.mainDescription = block.content;
          result.mainDescriptionBlock = {
            content: block.content,
            fontSize: block.fontSize,
            fontWeight: block.fontWeight,
            color: block.color,
            lineHeight: block.lineHeight,
          };
        } else {
          result.mainDescription += '\n\n' + block.content;
        }
      } else if (block.type === 'work-layout-config') {
        result.layoutConfig = {
          columnLayout: block.columnLayout || 2,
          columnGap: block.columnGap,
          textColumnWidth: block.textColumnWidth,
        };
      } else if (block.type === 'image-grid' && Array.isArray(block.images)) {
        for (const img of block.images) {
          if (img.url) result.galleryImages.push(img.url);
        }
      } else if ((block.type === 'work-gallery' || block.type === 'gallery') && Array.isArray(block.images)) {
        for (const img of block.images) {
          if (img.url) result.galleryImages.push(img.url);
        }
      }
    }

    return result;
  } catch {
    return null;
  }
}

/**
 * Check if text contains markdown syntax.
 */
export function hasMarkdownSyntax(text: string): boolean {
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
