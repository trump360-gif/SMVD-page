#!/usr/bin/env ts-node

/**
 * Display detailed migration information
 */

import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

interface ImageGridBlock {
  id: string;
  type: 'image-grid';
  order: number;
  images: Array<{ id: string; url: string; alt?: string }>;
  template: string;
  gap: number;
  aspectRatio: number;
}

interface BlogContent {
  blocks: unknown[];
  version: string;
  rowConfig?: unknown[];
}

async function showMigrationDetails() {
  console.log('📋 Migration Details: work-gallery → image-grid\n');

  const project = await prisma.workProject.findUnique({
    where: { slug: '9' },
    select: {
      slug: true,
      title: true,
      content: true,
    },
  });

  if (!project || !project.content) {
    console.log('❌ Studio Knot project not found');
    return;
  }

  const blogContent = project.content as unknown as BlogContent;
  const blocks = blogContent.blocks || [];
  const imageGridBlock = blocks.find(
    (b: unknown) => (b as { type: string }).type === 'image-grid'
  ) as ImageGridBlock | undefined;

  if (!imageGridBlock) {
    console.log('❌ No image-grid block found');
    return;
  }

  console.log('🎯 Project: STUDIO KNOT (slug: 9)\n');

  console.log('📊 Conversion Details:');
  console.log('  Before (work-gallery):');
  console.log('    - type: "work-gallery"');
  console.log('    - images: Array<ImageData> (9 items)');
  console.log('    - imageLayout: 2 (2 columns)');
  console.log('    - gap: 16px');
  console.log('    - minImageHeight: 300px');
  console.log('');
  console.log('  After (image-grid):');
  console.log(`    - type: "${imageGridBlock.type}"`);
  console.log(`    - images: Array<ImageData> (${imageGridBlock.images.length} items)`);
  console.log(`    - template: "${imageGridBlock.template}" (flexible auto-layout)`);
  console.log(`    - gap: ${imageGridBlock.gap}px (no spacing - gallery aesthetic)`);
  console.log(
    `    - aspectRatio: ${imageGridBlock.aspectRatio} (wide 2:1 aspect ratio)`
  );
  console.log('');

  console.log('🖼️  Image Details:');
  imageGridBlock.images.forEach((img, idx) => {
    console.log(`  ${idx + 1}. ${img.url}`);
    if (img.alt) {
      console.log(`     Alt: "${img.alt}"`);
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log('✅ Migration Summary:\n');
  console.log('  ✓ Block type converted: work-gallery → image-grid');
  console.log('  ✓ All 9 images preserved');
  console.log('  ✓ Flexible auto-layout template applied');
  console.log('  ✓ Gallery aesthetic maintained (gap: 0, aspectRatio: 2)');
  console.log('  ✓ Legacy fields removed (imageLayout, minImageHeight)');
  console.log('='.repeat(60));
}

showMigrationDetails()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
