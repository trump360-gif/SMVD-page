/**
 * Migration script: Convert legacy markdown/gallery content to block-based format.
 *
 * Handles two models:
 *   - WorkProject.description  (string -> JSON BlogContent)
 *   - NewsEvent.content        (legacy JSON -> BlogContent)
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/migrate-to-blocks.ts
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/migrate-to-blocks.ts --dry-run
 */

import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();
const isDryRun = process.argv.includes('--dry-run');

// ---------------------------------------------------------------------------
// Inline helpers (avoid import issues with path aliases in ts-node)
// ---------------------------------------------------------------------------

function generateBlockId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

interface BlogContent {
  blocks: Array<{
    id: string;
    type: string;
    order: number;
    content?: string;
    images?: Array<{ id: string; url: string; alt?: string }>;
    layout?: string;
    [key: string]: unknown;
  }>;
  version: string;
}

/**
 * Parse a WorkProject description string into BlogContent.
 * - If already valid BlogContent JSON, return as-is.
 * - Otherwise wrap raw text in a single text block.
 */
function parseDescription(description: string | null | undefined): BlogContent {
  if (!description) {
    return { blocks: [], version: '1.0' };
  }

  try {
    const parsed = JSON.parse(description);
    if (parsed.blocks && Array.isArray(parsed.blocks) && parsed.version) {
      return parsed as BlogContent;
    }
  } catch {
    // Not JSON - treat as legacy text
  }

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

interface LegacyGallery {
  main?: string;
  centerLeft?: string;
  centerRight?: string;
  bottomLeft?: string;
  bottomCenter?: string;
  bottomRight?: string;
  layout?: string;
}

interface LegacyNewsContent {
  introTitle?: string;
  introText?: string;
  blocks?: BlogContent['blocks'];
  gallery?: LegacyGallery;
  version?: string;
}

/**
 * Parse a NewsEvent content JSON into BlogContent.
 * - If already block-based, return as-is.
 * - Otherwise convert introText + gallery fields to blocks.
 */
function parseNewsContent(content: LegacyNewsContent | null | undefined): BlogContent {
  if (!content) {
    return { blocks: [], version: '1.0' };
  }

  if (content.blocks && content.blocks.length > 0 && content.version) {
    return { blocks: content.blocks, version: content.version };
  }

  const blocks: BlogContent['blocks'] = [];

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
        layout: content.gallery.layout || '1+2+3',
        order: blocks.length,
      });
    }
  }

  return { blocks, version: '1.0' };
}

// ---------------------------------------------------------------------------
// Migration functions
// ---------------------------------------------------------------------------

async function migrateWorkProjects(): Promise<{ migrated: number; skipped: number }> {
  console.log('--- Migrating Work Projects ---');
  const projects = await prisma.workProject.findMany();
  let migrated = 0;
  let skipped = 0;

  for (const project of projects) {
    // Check if already in block format
    try {
      const parsed = JSON.parse(project.description);
      if (parsed.blocks && parsed.version) {
        skipped++;
        continue;
      }
    } catch {
      // Not JSON - needs migration
    }

    const blogContent = parseDescription(project.description);

    if (isDryRun) {
      console.log(`  [DRY] ${project.title} (${project.id})`);
      console.log(`        blocks: ${blogContent.blocks.length}`);
      migrated++;
      continue;
    }

    await prisma.workProject.update({
      where: { id: project.id },
      data: {
        description: JSON.stringify(blogContent),
      },
    });

    migrated++;
    console.log(`  OK  ${project.title} (${project.id})`);
  }

  console.log(`  Result: ${migrated} migrated, ${skipped} already done\n`);
  return { migrated, skipped };
}

async function migrateNewsArticles(): Promise<{ migrated: number; skipped: number }> {
  console.log('--- Migrating News Articles ---');
  const articles = await prisma.newsEvent.findMany();
  let migrated = 0;
  let skipped = 0;

  for (const article of articles) {
    const content = article.content as LegacyNewsContent | null;

    // Check if already in block format
    if (content && content.blocks && content.version) {
      skipped++;
      continue;
    }

    const blogContent = parseNewsContent(content);

    if (isDryRun) {
      console.log(`  [DRY] ${article.title} (${article.id})`);
      console.log(`        blocks: ${blogContent.blocks.length}`);
      migrated++;
      continue;
    }

    await prisma.newsEvent.update({
      where: { id: article.id },
      data: {
        content: {
          blocks: blogContent.blocks,
          version: '1.0',
        },
      },
    });

    migrated++;
    console.log(`  OK  ${article.title} (${article.id})`);
  }

  console.log(`  Result: ${migrated} migrated, ${skipped} already done\n`);
  return { migrated, skipped };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Block Content Migration ===');
  if (isDryRun) {
    console.log('MODE: Dry Run (no changes will be written)\n');
  } else {
    console.log('MODE: Live (writing changes to DB)\n');
  }

  try {
    const workResult = await migrateWorkProjects();
    const newsResult = await migrateNewsArticles();

    const totalMigrated = workResult.migrated + newsResult.migrated;
    const totalSkipped = workResult.skipped + newsResult.skipped;

    console.log('=== Summary ===');
    console.log(`Total migrated: ${totalMigrated}`);
    console.log(`Total skipped:  ${totalSkipped}`);

    if (isDryRun && totalMigrated > 0) {
      console.log('\nRe-run without --dry-run to apply changes.');
    }

    console.log('\nDone.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
