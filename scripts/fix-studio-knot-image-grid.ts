/**
 * Fix Studio KNOT image grid layout
 *
 * Current: All 9 images in separate rows (1 col each)
 * Target: Optimal grid layout (1 col + 2 cols + 3 cols)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Find Studio KNOT project
    const project = await prisma.workProject.findFirst({
      where: {
        OR: [
          { slug: 'studio-knot' },
          { title: { contains: 'studio knot', mode: 'insensitive' } },
          { title: { contains: 'KNOT', mode: 'insensitive' } },
        ],
      },
    });

    if (!project) {
      console.log('❌ Studio KNOT project not found');
      return;
    }

    console.log(`\n📂 Found project: ${project.title}`);

    // Parse content
    let content = { blocks: [], version: '1.0' };
    if (typeof project.content === 'string') {
      content = JSON.parse(project.content);
    } else if (project.content && typeof project.content === 'object') {
      content = project.content as any;
    }

    console.log(`📊 Content blocks: ${content.blocks?.length || 0}`);

    // Find image-grid block
    const imageGridIdx = (content.blocks || []).findIndex((b: any) => b.type === 'image-grid');
    if (imageGridIdx === -1) {
      console.log('❌ No image-grid block found');
      return;
    }

    const imageGridBlock = (content.blocks || [])[imageGridIdx] as any;
    console.log(`\n🖼️  Current image-grid block:`);
    console.log(`   - Images: ${imageGridBlock.images?.length || 0}`);
    console.log(`   - Rows: ${imageGridBlock.rows?.length || 0}`);
    if (imageGridBlock.rows) {
      imageGridBlock.rows.forEach((row: any, i: number) => {
        console.log(`     Row ${i + 1}: ${row.columns} cols, ${row.imageCount} imgs`);
      });
    }

    const imageCount = imageGridBlock.images?.length || 0;

    // Generate optimal rows layout
    // Strategy: 1 image (1 col) → 2 images (2 cols) → remaining (3 cols)
    const newRows = [];
    let imgIdx = 0;

    const layouts = [
      { columns: 1 as const, count: 1 },
      { columns: 2 as const, count: 2 },
      { columns: 3 as const, count: 999 }, // Fill rest
    ];

    for (const layout of layouts) {
      if (imgIdx >= imageCount) break;
      const count = Math.min(layout.count, imageCount - imgIdx);
      newRows.push({
        id: `row-${Date.now()}-${imgIdx}`,
        columns: layout.columns,
        imageCount: count,
      });
      console.log(`   ✓ New Row ${newRows.length}: ${layout.columns} cols, ${count} imgs`);
      imgIdx += count;
    }

    // Update block
    imageGridBlock.rows = newRows;

    // Save to database
    await prisma.workProject.update({
      where: { id: project.id },
      data: {
        content: JSON.stringify(content),
      },
    });

    console.log(`\n✅ Updated Studio KNOT image-grid layout!`);
    console.log(`\n📋 New layout summary:`);
    newRows.forEach((row, i) => {
      console.log(`   Row ${i + 1}: ${row.columns} column${row.columns > 1 ? 's' : ''}, ${row.imageCount} image${row.imageCount > 1 ? 's' : ''}`);
    });
    console.log(`\n🚀 Changes applied to database`);
    console.log(`💡 Next: Check the public page http://localhost:3000/work/studio-knot`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
