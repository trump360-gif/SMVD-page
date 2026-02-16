import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  try {
    const project = await prisma.workProject.findFirst({
      where: {
        OR: [
          { slug: 'studio-knot' },
          { title: { contains: 'studio knot', mode: 'insensitive' } },
        ],
      },
    });

    if (!project) {
      console.log('❌ Studio KNOT not found');
      return;
    }

    console.log(`\n📂 Project: ${project.title}`);
    console.log(`📝 Description length: ${project.description?.length || 0}`);

    let content = { blocks: [] };
    if (typeof project.content === 'string') {
      try {
        content = JSON.parse(project.content);
      } catch {
        console.log('❌ Failed to parse content as JSON');
      }
    } else if (project.content && typeof project.content === 'object') {
      content = project.content;
    }

    console.log(`\n📊 Blocks: ${content.blocks?.length || 0}`);

    if (content.blocks && Array.isArray(content.blocks)) {
      content.blocks.forEach((block, i) => {
        if (block.type === 'image-grid') {
          console.log(`\n  Block ${i}: image-grid`);
          console.log(`    - Images: ${block.images?.length || 0}`);
          console.log(`    - Rows: ${block.rows?.length || 0}`);
          if (block.rows) {
            block.rows.forEach((row, j) => {
              console.log(`      Row ${j + 1}: ${row.columns} cols, ${row.imageCount} imgs`);
            });
          }
        } else {
          console.log(`  Block ${i}: ${block.type}`);
        }
      });
    }

    console.log(`\n💾 Full content size: ${JSON.stringify(content).length} bytes`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
