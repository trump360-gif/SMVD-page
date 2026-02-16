/**
 * Fix Studio KNOT image grid layout
 */

import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  try {
    // Find Studio KNOT project
    const project = await prisma.workProject.findFirst({
      where: {
        OR: [
          { slug: 'studio-knot' },
          { title: { contains: 'studio knot', mode: 'insensitive' } },
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
      content = project.content;
    }

    console.log(`📊 Content blocks: ${content.blocks?.length || 0}`);

    // Find image-grid block
    const imageGridIdx = (content.blocks || []).findIndex((b) => b.type === 'image-grid');
    if (imageGridIdx === -1) {
      console.log('❌ No image-grid block found');
      return;
    }

    const imageGridBlock = (content.blocks || [])[imageGridIdx];
    console.log(`\n🖼️  Current image-grid block:`);
    console.log(`   - Images: ${imageGridBlock.images?.length || 0}`);
    console.log(`   - Rows: ${imageGridBlock.rows?.length || 0}`);
    if (imageGridBlock.rows) {
      imageGridBlock.rows.forEach((row, i) => {
        console.log(`     Row ${i + 1}: ${row.columns} cols, ${row.imageCount} imgs`);
      });
    }

    const imageCount = imageGridBlock.images?.length || 0;

    // Generate optimal rows layout
    const newRows = [];
    let imgIdx = 0;

    const layouts = [
      { columns: 1, count: 1 },
      { columns: 2, count: 2 },
      { columns: 3, count: 999 },
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
    console.log(`💡 Check: http://localhost:3000/work/studio-knot`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
