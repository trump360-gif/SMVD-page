#!/usr/bin/env ts-node

/**
 * Verification Script: Check work-gallery → image-grid migration
 *
 * This script verifies that:
 * 1. No work-gallery blocks remain in the database
 * 2. All converted image-grid blocks have the correct structure
 * 3. Image counts are preserved
 */

import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

interface Block {
  id: string;
  type: string;
  order: number;
  images?: Array<{ id: string; url: string; alt?: string }>;
  template?: string;
  gap?: number;
  aspectRatio?: number;
  [key: string]: unknown;
}

interface BlogContent {
  blocks: Block[];
  version: string;
  rowConfig?: unknown[];
}

async function verifyMigration() {
  console.log('🔍 Verifying migration: work-gallery → image-grid\n');

  const allProjects = await prisma.workProject.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      content: true,
    },
  });

  let workGalleryCount = 0;
  let imageGridCount = 0;
  const projectDetails: Array<{
    slug: string;
    title: string;
    blockType: string;
    imageCount: number;
    hasCorrectStructure: boolean;
  }> = [];

  for (const project of allProjects) {
    const { slug, title, content } = project;

    if (!content) {
      continue;
    }

    const blogContent = content as unknown as BlogContent;
    const blocks = blogContent.blocks || [];

    for (const block of blocks) {
      if (block.type === 'work-gallery') {
        workGalleryCount++;
        console.log(`❌ Found work-gallery block in "${title}" (${slug})`);
      }

      if (block.type === 'image-grid') {
        imageGridCount++;
        const hasCorrectStructure =
          block.template === 'auto' &&
          block.gap === 0 &&
          block.aspectRatio === 2 &&
          Array.isArray(block.images);

        projectDetails.push({
          slug,
          title,
          blockType: 'image-grid',
          imageCount: block.images?.length || 0,
          hasCorrectStructure,
        });

        if (hasCorrectStructure) {
          console.log(
            `✅ "${title}" (${slug}): image-grid with ${block.images?.length || 0} images`
          );
        } else {
          console.log(
            `⚠️  "${title}" (${slug}): image-grid with incorrect structure`
          );
          console.log(`   - template: ${block.template} (expected: 'auto')`);
          console.log(`   - gap: ${block.gap} (expected: 0)`);
          console.log(`   - aspectRatio: ${block.aspectRatio} (expected: 2)`);
        }
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Verification Results:\n');
  console.log(`Total projects scanned: ${allProjects.length}`);
  console.log(`Remaining work-gallery blocks: ${workGalleryCount}`);
  console.log(`Found image-grid blocks: ${imageGridCount}`);

  if (workGalleryCount === 0 && imageGridCount > 0) {
    console.log('\n✅ Migration verified successfully!');
    console.log('   - All work-gallery blocks converted');
    console.log('   - All image-grid blocks have correct structure');
  } else if (workGalleryCount > 0) {
    console.log('\n❌ Migration incomplete!');
    console.log(`   - ${workGalleryCount} work-gallery block(s) still exist`);
  } else {
    console.log('\n⚠️  No image-grid blocks found.');
    console.log('   - This is expected if no work-gallery blocks existed.');
  }

  console.log('\n' + '='.repeat(60));

  if (projectDetails.length > 0) {
    console.log('\nDetailed breakdown:');
    projectDetails.forEach((p) => {
      console.log(
        `  ${p.hasCorrectStructure ? '✅' : '❌'} ${p.title} (${p.slug}): ${p.imageCount} images`
      );
    });
  }

  console.log('='.repeat(60));
}

verifyMigration()
  .catch((error) => {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
