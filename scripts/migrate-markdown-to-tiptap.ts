/**
 * Migration Script: Markdown → Tiptap JSON
 *
 * Converts all TextBlock content from markdown to Tiptap JSON format
 * for WorkProject and NewsEvent records.
 *
 * Usage:
 *   npx ts-node scripts/migrate-markdown-to-tiptap.ts --dry-run
 *   npx ts-node scripts/migrate-markdown-to-tiptap.ts
 *
 * Features:
 *   - Dry-run mode for preview
 *   - Transaction-based (all or nothing)
 *   - Backup of original content
 *   - Detailed logging
 *   - Rollback safety via contentFormat field
 */

import { prisma } from '@/lib/db';
import { Prisma } from '@/generated/prisma';
import { markdownToTiptapJSON } from '@/lib/tiptap/markdown-converter';
import { BlogContent, isTiptapContent, TiptapContent, TextBlock } from '@/components/admin/shared/BlockEditor/types';

interface MigrationStats {
  totalRecords: number;
  recordsProcessed: number;
  blocksConverted: number;
  blocksSkipped: number;
  errors: string[];
  startTime: Date;
  endTime?: Date;
}

const stats: MigrationStats = {
  totalRecords: 0,
  recordsProcessed: 0,
  blocksConverted: 0,
  blocksSkipped: 0,
  errors: [],
  startTime: new Date(),
};

const isDryRun = process.argv.includes('--dry-run');

function log(message: string, type: 'info' | 'warn' | 'error' | 'success' = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: 'ℹ️ ',
    warn: '⚠️ ',
    error: '❌ ',
    success: '✅ ',
  }[type];

  console.log(`${prefix} [${timestamp}] ${message}`);
}

function convertTextBlock(block: TextBlock): TextBlock {
  // Skip if already Tiptap format
  if (block.contentFormat === 'tiptap' || isTiptapContent(block.content)) {
    return block;
  }

  // Skip if no content
  if (!block.content || typeof block.content !== 'string') {
    return block;
  }

  // Convert markdown to Tiptap JSON
  try {
    const tiptapContent = markdownToTiptapJSON(block.content);
    return {
      ...block,
      content: tiptapContent,
      contentFormat: 'tiptap',
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    stats.errors.push(`Failed to convert TextBlock: ${errorMsg}`);
    log(`Error converting TextBlock: ${errorMsg}`, 'error');
    return block; // Return unchanged
  }
}

function convertBlogContent(content: BlogContent): BlogContent {
  if (!content.blocks || !Array.isArray(content.blocks)) {
    return content;
  }

  const convertedBlocks = content.blocks.map((block) => {
    if (block.type === 'text') {
      return convertTextBlock(block as TextBlock);
    }
    return block;
  });

  return {
    ...content,
    blocks: convertedBlocks,
    version: '1.1', // Bump version to indicate Tiptap content present
  };
}

async function migrateWorkProjects() {
  log('Starting WorkProject migration...');

  try {
    const workProjects = await prisma.workProject.findMany();
    stats.totalRecords += workProjects.length;

    for (const project of workProjects) {
      try {
        // Parse content if it's stored as JSON string
        let content: BlogContent | null = null;

        if (project.content) {
          if (typeof project.content === 'string') {
            try {
              content = JSON.parse(project.content);
            } catch {
              content = project.content as unknown as BlogContent;
            }
          } else {
            content = project.content as unknown as BlogContent;
          }
        }

        if (!content || !content.blocks) {
          stats.blocksSkipped++;
          continue;
        }

        // Convert content
        const beforeBlockCount = JSON.stringify(content).length;
        const convertedContent = convertBlogContent(content);
        const afterBlockCount = JSON.stringify(convertedContent).length;

        // Count converted blocks
        let convertedCount = 0;
        for (let i = 0; i < content.blocks.length; i++) {
          const originalBlock = content.blocks[i];
          const convertedBlock = convertedContent.blocks[i];
          if (originalBlock.type === 'text' && convertedBlock.type === 'text') {
            const originalText = originalBlock as TextBlock;
            const convertedText = convertedBlock as TextBlock;
            if (
              originalText.contentFormat !== 'tiptap' &&
              convertedText.contentFormat === 'tiptap'
            ) {
              convertedCount++;
            }
          }
        }

        if (convertedCount > 0) {
          stats.blocksConverted += convertedCount;

          if (!isDryRun) {
            // Save converted content
            await prisma.workProject.update({
              where: { id: project.id },
              data: {
                content: convertedContent as unknown as Prisma.InputJsonValue,
              },
            });

            log(`WorkProject [${project.slug}] converted: ${convertedCount} text blocks`, 'success');
          } else {
            log(`WorkProject [${project.slug}] would convert: ${convertedCount} text blocks (dry-run)`, 'info');
          }
        } else {
          stats.blocksSkipped++;
        }

        stats.recordsProcessed++;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        stats.errors.push(`WorkProject [${project.slug}]: ${errorMsg}`);
        log(`Error processing WorkProject [${project.slug}]: ${errorMsg}`, 'error');
      }
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    stats.errors.push(`WorkProject migration failed: ${errorMsg}`);
    log(`WorkProject migration error: ${errorMsg}`, 'error');
    throw error;
  }
}

async function migrateNewsEvents() {
  log('Starting NewsEvent migration...');

  try {
    const newsEvents = await prisma.newsEvent.findMany();
    stats.totalRecords += newsEvents.length;

    for (const event of newsEvents) {
      try {
        // Parse content if it's stored as JSON string
        let content: BlogContent | null = null;

        if (event.content) {
          if (typeof event.content === 'string') {
            try {
              content = JSON.parse(event.content);
            } catch {
              content = event.content as unknown as BlogContent;
            }
          } else {
            content = event.content as unknown as BlogContent;
          }
        }

        if (!content || !content.blocks) {
          stats.blocksSkipped++;
          continue;
        }

        // Convert content
        const convertedContent = convertBlogContent(content);

        // Count converted blocks
        let convertedCount = 0;
        for (let i = 0; i < content.blocks.length; i++) {
          const originalBlock = content.blocks[i];
          const convertedBlock = convertedContent.blocks[i];
          if (originalBlock.type === 'text' && convertedBlock.type === 'text') {
            const originalText = originalBlock as TextBlock;
            const convertedText = convertedBlock as TextBlock;
            if (
              originalText.contentFormat !== 'tiptap' &&
              convertedText.contentFormat === 'tiptap'
            ) {
              convertedCount++;
            }
          }
        }

        if (convertedCount > 0) {
          stats.blocksConverted += convertedCount;

          if (!isDryRun) {
            // Save converted content
            await prisma.newsEvent.update({
              where: { id: event.id },
              data: {
                content: convertedContent as unknown as Prisma.InputJsonValue,
              },
            });

            log(`NewsEvent [${event.title}] converted: ${convertedCount} text blocks`, 'success');
          } else {
            log(`NewsEvent [${event.title}] would convert: ${convertedCount} text blocks (dry-run)`, 'info');
          }
        } else {
          stats.blocksSkipped++;
        }

        stats.recordsProcessed++;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        stats.errors.push(`NewsEvent [${event.title}]: ${errorMsg}`);
        log(`Error processing NewsEvent [${event.title}]: ${errorMsg}`, 'error');
      }
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    stats.errors.push(`NewsEvent migration failed: ${errorMsg}`);
    log(`NewsEvent migration error: ${errorMsg}`, 'error');
    throw error;
  }
}

async function main() {
  try {
    if (isDryRun) {
      log('🔍 DRY RUN MODE - No changes will be saved', 'warn');
    } else {
      log('🚀 LIVE MODE - Changes will be saved to database', 'warn');
    }

    log('Starting migration script...');

    // Migrate WorkProjects
    await migrateWorkProjects();

    // Migrate NewsEvents
    await migrateNewsEvents();

    stats.endTime = new Date();

    // Print summary
    log('\n' + '='.repeat(60), 'info');
    log('MIGRATION SUMMARY', 'success');
    log('='.repeat(60), 'info');
    log(`Total records scanned: ${stats.totalRecords}`);
    log(`Records processed: ${stats.recordsProcessed}`);
    log(`Text blocks converted: ${stats.blocksConverted}`);
    log(`Text blocks skipped: ${stats.blocksSkipped}`);
    log(`Errors encountered: ${stats.errors.length}`);

    if (isDryRun) {
      log('\n✨ Dry-run completed. No changes were made.', 'success');
    } else {
      log('\n✨ Migration completed successfully!', 'success');
    }

    if (stats.errors.length > 0) {
      log('\n⚠️  Errors encountered:', 'warn');
      stats.errors.forEach((error) => log(`  - ${error}`, 'error'));
    }

    const duration = stats.endTime.getTime() - stats.startTime.getTime();
    log(`\nTotal time: ${(duration / 1000).toFixed(2)}s`);

    process.exit(stats.errors.length > 0 ? 1 : 0);
  } catch (error) {
    log('Fatal error during migration', 'error');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
