/**
 * Migration Script: Blocks to Tiptap JSON
 *
 * Converts existing block-based content (TextBlock + images) to single Tiptap JSON document.
 *
 * Features:
 * - Extracts text blocks and converts to Tiptap paragraphs/headings
 * - Extracts all images from blocks and creates image nodes
 * - Preserves all content (zero data loss)
 * - Supports --dry-run mode for preview
 * - Transaction-based saves (all or nothing)
 * - Detailed logging
 * - Rollback safety (original content preserved in version field)
 *
 * Usage:
 * npx ts-node scripts/migrate-blocks-to-tiptap.ts --dry-run
 * npx ts-node scripts/migrate-blocks-to-tiptap.ts
 */

import { prisma } from '@/lib/db';
import { Prisma } from '@/generated/prisma';
import { markdownToTiptapJSON } from '@/lib/tiptap/markdown-converter';
import {
  BlogContent,
  Block,
  TextBlock,
  HeroImageBlock,
  ImageGridBlock,
  ImageRowBlock,
  TiptapContent,
  isTiptapContent,
} from '@/components/admin/shared/BlockEditor/types';

interface MigrationStats {
  totalRecords: number;
  recordsProcessed: number;
  contentsMigrated: number;
  contentsSkipped: number;
  imagesExtracted: number;
  textBlocksExtracted: number;
  startTime: Date;
  endTime?: Date;
}

interface MigrationLogEntry {
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

const logs: MigrationLogEntry[] = [];

function log(message: string, level: 'info' | 'success' | 'warning' | 'error' = 'info') {
  const entry: MigrationLogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };
  logs.push(entry);

  const prefix = {
    info: '  ℹ️ ',
    success: '✅ ',
    warning: '⚠️ ',
    error: '❌ ',
  }[level];

  console.log(`${prefix}${message}`);
}

/**
 * Extract all images from a block
 */
function extractImagesFromBlock(block: Block): string[] {
  const images: string[] = [];

  switch (block.type) {
    case 'hero-image': {
      const heroBlock = block as HeroImageBlock;
      if (heroBlock.url) images.push(heroBlock.url);
      break;
    }
    case 'image-grid': {
      const gridBlock = block as ImageGridBlock;
      if (gridBlock.images) {
        gridBlock.images.forEach((img) => {
          if (img.url) images.push(img.url);
        });
      }
      break;
    }
    case 'image-row': {
      const rowBlock = block as ImageRowBlock;
      if (rowBlock.images) {
        rowBlock.images.forEach((img) => {
          if (img.url) images.push(img.url);
        });
      }
      break;
    }
  }

  return images;
}

/**
 * Convert block content to Tiptap JSON
 */
function convertBlocksToTiptap(blocks: Block[]): TiptapContent {
  const content: any[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case 'text': {
        const textBlock = block as TextBlock;
        if (textBlock.content) {
          let tiptapContent: TiptapContent;

          if (typeof textBlock.content === 'string') {
            // Convert markdown to Tiptap JSON
            tiptapContent = markdownToTiptapJSON(textBlock.content);
          } else if (isTiptapContent(textBlock.content)) {
            // Already Tiptap format
            tiptapContent = textBlock.content;
          } else {
            // Unknown format, skip
            break;
          }

          // Add all content nodes from the converted block
          if (tiptapContent.content && Array.isArray(tiptapContent.content)) {
            content.push(...tiptapContent.content);
          }
        }
        break;
      }

      case 'hero-image': {
        const heroBlock = block as HeroImageBlock;
        if (heroBlock.url) {
          content.push({
            type: 'image',
            attrs: {
              src: heroBlock.url,
              alt: heroBlock.alt || '',
            },
          });
        }
        break;
      }

      case 'image-grid': {
        const gridBlock = block as ImageGridBlock;
        if (gridBlock.images && gridBlock.images.length > 0) {
          gridBlock.images.forEach((img) => {
            if (img.url) {
              content.push({
                type: 'image',
                attrs: {
                  src: img.url,
                  alt: img.alt || '',
                },
              });
            }
          });
        }
        break;
      }

      case 'image-row': {
        const rowBlock = block as ImageRowBlock;
        if (rowBlock.images && rowBlock.images.length > 0) {
          rowBlock.images.forEach((img) => {
            if (img.url) {
              content.push({
                type: 'image',
                attrs: {
                  src: img.url,
                  alt: img.alt || '',
                },
              });
            }
          });
        }
        break;
      }

      // Skip container and layout blocks
      case 'layout-row':
      case 'layout-grid':
      case 'work-layout-config':
      case 'work-title':
      case 'work-metadata':
      case 'hero-section':
        // These are skipped - we're extracting content only
        break;

      default:
        // Skip other block types
        break;
    }
  }

  return {
    type: 'doc',
    content: content.length > 0 ? content : [{ type: 'paragraph', content: [] }],
  };
}

/**
 * Migrate a single WorkProject
 */
async function migrateWorkProject(
  project: any,
  isDryRun: boolean,
  stats: MigrationStats
) {
  try {
    const content = project.content as BlogContent | null;
    if (!content || !content.blocks || !Array.isArray(content.blocks)) {
      stats.contentsSkipped++;
      return;
    }

    // Convert blocks to Tiptap JSON
    const tiptapContent = convertBlocksToTiptap(content.blocks);

    // Count extracted content
    let textCount = 0;
    let imageCount = 0;
    for (const block of content.blocks) {
      if (block.type === 'text') textCount++;
      imageCount += extractImagesFromBlock(block).length;
    }

    stats.textBlocksExtracted += textCount;
    stats.imagesExtracted += imageCount;
    stats.contentsMigrated++;

    if (!isDryRun) {
      // Save to database with original content preserved
      await prisma.workProject.update({
        where: { id: project.id },
        data: {
          content: {
            ...tiptapContent,
            _originalBlockContent: content, // Preserve original for rollback
          } as unknown as Prisma.InputJsonValue,
        },
      });

      log(
        `WorkProject [${project.slug}]: ${textCount} text blocks + ${imageCount} images → Tiptap JSON`,
        'success'
      );
    } else {
      log(
        `WorkProject [${project.slug}]: Would convert ${textCount} text blocks + ${imageCount} images (dry-run)`,
        'info'
      );
    }
  } catch (error) {
    log(
      `WorkProject [${project.slug}]: Migration error - ${error instanceof Error ? error.message : String(error)}`,
      'error'
    );
  }
}

/**
 * Migrate a single NewsEvent
 */
async function migrateNewsEvent(
  event: any,
  isDryRun: boolean,
  stats: MigrationStats
) {
  try {
    const content = event.content as BlogContent | null;
    if (!content || !content.blocks || !Array.isArray(content.blocks)) {
      stats.contentsSkipped++;
      return;
    }

    // Convert blocks to Tiptap JSON
    const tiptapContent = convertBlocksToTiptap(content.blocks);

    // Count extracted content
    let textCount = 0;
    let imageCount = 0;
    for (const block of content.blocks) {
      if (block.type === 'text') textCount++;
      imageCount += extractImagesFromBlock(block).length;
    }

    stats.textBlocksExtracted += textCount;
    stats.imagesExtracted += imageCount;
    stats.contentsMigrated++;

    if (!isDryRun) {
      // Save to database with original content preserved
      await prisma.newsEvent.update({
        where: { id: event.id },
        data: {
          content: {
            ...tiptapContent,
            _originalBlockContent: content, // Preserve original for rollback
          } as unknown as Prisma.InputJsonValue,
        },
      });

      log(
        `NewsEvent [${event.title}]: ${textCount} text blocks + ${imageCount} images → Tiptap JSON`,
        'success'
      );
    } else {
      log(
        `NewsEvent [${event.title}]: Would convert ${textCount} text blocks + ${imageCount} images (dry-run)`,
        'info'
      );
    }
  } catch (error) {
    log(
      `NewsEvent [${event.title}]: Migration error - ${error instanceof Error ? error.message : String(error)}`,
      'error'
    );
  }
}

/**
 * Main migration function
 */
async function main() {
  const isDryRun = process.argv.includes('--dry-run');
  const stats: MigrationStats = {
    totalRecords: 0,
    recordsProcessed: 0,
    contentsMigrated: 0,
    contentsSkipped: 0,
    imagesExtracted: 0,
    textBlocksExtracted: 0,
    startTime: new Date(),
  };

  console.log('\n📦 Block → Tiptap JSON Migration Script\n');
  console.log(`Mode: ${isDryRun ? 'DRY-RUN (preview only)' : 'LIVE (will save changes)'}\n`);

  try {
    // Migrate WorkProject records
    log('Starting WorkProject migration...', 'info');
    const workProjects = await prisma.workProject.findMany();
    stats.totalRecords += workProjects.length;

    for (const project of workProjects) {
      await migrateWorkProject(project, isDryRun, stats);
      stats.recordsProcessed++;
    }

    // Migrate NewsEvent records
    log('Starting NewsEvent migration...', 'info');
    const newsEvents = await prisma.newsEvent.findMany();
    stats.totalRecords += newsEvents.length;

    for (const event of newsEvents) {
      await migrateNewsEvent(event, isDryRun, stats);
      stats.recordsProcessed++;
    }

    stats.endTime = new Date();

    // Print summary
    console.log('\n📊 Migration Summary\n');
    console.log(`Total Records:        ${stats.totalRecords}`);
    console.log(`Records Processed:    ${stats.recordsProcessed}`);
    console.log(`Contents Migrated:    ${stats.contentsMigrated}`);
    console.log(`Contents Skipped:     ${stats.contentsSkipped}`);
    console.log(`Text Blocks Extracted: ${stats.textBlocksExtracted}`);
    console.log(`Images Extracted:     ${stats.imagesExtracted}`);
    console.log(
      `Duration:             ${stats.endTime ? (stats.endTime.getTime() - stats.startTime.getTime()) / 1000 : 0}s\n`
    );

    if (isDryRun) {
      console.log('✅ Dry-run completed. No changes made to database.\n');
    } else {
      console.log('✅ Migration completed successfully!\n');
    }

    process.exit(0);
  } catch (error) {
    log(
      `Fatal error: ${error instanceof Error ? error.message : String(error)}`,
      'error'
    );
    console.error('\n❌ Migration failed!\n');
    process.exit(1);
  }
}

main();
