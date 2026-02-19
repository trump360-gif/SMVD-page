import { isTiptapContent } from '../../types';
import { tiptapJSONToText } from '@/lib/tiptap/markdown-converter';
import type {
  Block,
  TextBlock,
  HeroImageBlock,
  HeroSectionBlock,
  WorkTitleBlock,
  GalleryBlock,
  ImageGridBlock,
  WorkLayoutConfigBlock,
  GalleryImageEntry,
} from '../../types';

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

export interface ParsedPreviewContent {
  hero?: { url: string; alt: string; id?: string };
  title?: { title: string; author: string; email: string };
  mainDescription?: string;
  mainDescriptionBlock?: TextBlock;
  galleryImages: GalleryImageEntry[];
  layoutConfig?: WorkLayoutConfigBlock;
  imageGridBlock?: ImageGridBlock;
}

export function parseBlocks(blocks: Block[]): ParsedPreviewContent {
  const result: ParsedPreviewContent = { galleryImages: [] };
  let foundWorkTitle = false;
  let foundMainDescription = false;

  for (const block of blocks) {
    if (block.type === 'hero-image') {
      const b = block as HeroImageBlock;
      if (b.url) {
        result.hero = { url: b.url, alt: b.alt || '', id: b.id };
      }
    } else if (block.type === 'hero-section') {
      const b = block as HeroSectionBlock;
      if (b.url) {
        result.hero = { url: b.url, alt: b.alt || '', id: b.id };
      }
      result.title = {
        title: b.title || '',
        author: b.author || '',
        email: b.email || '',
      };
      foundWorkTitle = true;
    } else if (block.type === 'work-title') {
      const b = block as WorkTitleBlock;
      result.title = {
        title: b.title || '',
        author: b.author || '',
        email: b.email || '',
      };
      foundWorkTitle = true;
    } else if (block.type === 'text' && (block as TextBlock).content) {
      const textBlock = block as TextBlock;
      // Convert content to string if it's Tiptap JSON
      let contentText: string;
      if (typeof textBlock.content === 'string') {
        contentText = textBlock.content;
      } else if (isTiptapContent(textBlock.content)) {
        contentText = tiptapJSONToText(textBlock.content);
      } else {
        contentText = '';
      }

      if (foundWorkTitle && !foundMainDescription) {
        result.mainDescription = contentText;
        result.mainDescriptionBlock = textBlock;
        foundMainDescription = true;
      } else if (!foundWorkTitle) {
        if (!result.mainDescription) {
          result.mainDescription = contentText;
          result.mainDescriptionBlock = textBlock;
        } else {
          result.mainDescription += '\n\n' + contentText;
        }
      }
    } else if (block.type === 'work-layout-config') {
      const b = block as WorkLayoutConfigBlock;
      result.layoutConfig = b;
    } else if (block.type === 'image-grid') {
      const b = block as ImageGridBlock;
      if (b.images.length > 0) {
        result.galleryImages = b.images;
        result.imageGridBlock = b;
      }
    } else if (block.type === 'gallery') {
      const b = block as GalleryBlock;
      if (b.images.length > 0 && result.galleryImages.length === 0) {
        result.galleryImages = b.images;
      }
    }
  }

  return result;
}
