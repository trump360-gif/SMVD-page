#!/usr/bin/env ts-node

/**
 * Migration Script: work-gallery → image-grid
 *
 * This script converts all existing 'work-gallery' blocks in WorkProject.content
 * to 'image-grid' blocks with appropriate configuration.
 *
 * Migration mappings:
 * - type: 'work-gallery' → 'image-grid'
 * - images: preserved as-is (ImageData format compatible)
 * - template: 'auto' (flexible grid layout)
 * - gap: 0 (no gap between images - matches work-gallery style)
 * - aspectRatio: 2 (wide aspect ratio - gallery aesthetic)
 * - Remove: imageLayout, minImageHeight (work-gallery specific)
 *
 * Usage:
 *   npx ts-node scripts/migrate-work-gallery-to-image-grid.ts
 */

import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

interface WorkGalleryBlock {
  id: string;
  type: 'work-gallery';
  order: number;
  images: Array<{ id: string; url: string; alt?: string }>;
  imageLayout?: 1 | 2 | 3;
  [key: string]: unknown;
}

interface ImageGridBlock {
  id: string;
  type: 'image-grid';
  order: number;
  images: Array<{ id: string; url: string; alt?: string }>;
  template: 'auto';
  gap: number;
  aspectRatio: 2;
}

interface BlogContent {
  blocks: unknown[];
  version: string;
  rowConfig?: unknown[];
}

async function migrateWorkGalleryBlocks() {
  console.log('✅ Starting migration: work-gallery → image-grid\n');

  // Fetch all WorkProject records
  const allProjects = await prisma.workProject.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      content: true,
    },
  });

  console.log(`Found ${allProjects.length} total projects in database.`);

  let totalConverted = 0;
  const projectsWithConversions: Array<{
    slug: string;
    title: string;
    blockCount: number;
    imageCount: number;
  }> = [];

  for (const project of allProjects) {
    const { id, slug, title, content } = project;

    if (!content) {
      continue;
    }

    const blogContent = content as unknown as BlogContent;
    const blocks = blogContent.blocks || [];

    let projectBlocksConverted = 0;
    let projectImageCount = 0;
    const updatedBlocks: unknown[] = [];

    for (const block of blocks) {
      const typedBlock = block as Record<string, unknown>;

      if (typedBlock.type === 'work-gallery') {
        const galleryBlock = typedBlock as WorkGalleryBlock;

        // Convert to image-grid
        const imageGridBlock: ImageGridBlock = {
          id: galleryBlock.id,
          type: 'image-grid',
          order: galleryBlock.order,
          images: galleryBlock.images || [],
          template: 'auto',
          gap: 0,
          aspectRatio: 2,
        };

        updatedBlocks.push(imageGridBlock);
        projectBlocksConverted++;
        projectImageCount += imageGridBlock.images.length;
      } else {
        updatedBlocks.push(block);
      }
    }

    if (projectBlocksConverted > 0) {
      // Update the project with converted blocks
      const updatedContent: BlogContent = {
        ...blogContent,
        blocks: updatedBlocks,
      };

      await prisma.workProject.update({
        where: { id },
        data: { content: updatedContent as never },
      });

      projectsWithConversions.push({
        slug,
        title,
        blockCount: projectBlocksConverted,
        imageCount: projectImageCount,
      });

      totalConverted += projectBlocksConverted;
      console.log(
        `✅ Project "${title}" (${slug}): ${projectBlocksConverted} block(s) converted (${projectImageCount} images)`
      );
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Migration Complete!\n');
  console.log(`Total projects processed: ${allProjects.length}`);
  console.log(`Projects with conversions: ${projectsWithConversions.length}`);
  console.log(`Total work-gallery blocks converted: ${totalConverted}\n`);

  if (projectsWithConversions.length > 0) {
    console.log('Converted projects:');
    projectsWithConversions.forEach((p) => {
      console.log(
        `  - ${p.title} (${p.slug}): ${p.blockCount} block(s), ${p.imageCount} image(s)`
      );
    });
  } else {
    console.log('No work-gallery blocks found. Nothing to convert.');
  }

  console.log('='.repeat(60));
}

// Execute migration
migrateWorkGalleryBlocks()
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
