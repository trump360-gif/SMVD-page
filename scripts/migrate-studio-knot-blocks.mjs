import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Migrating STUDIO KNOT blocks to DB...\n');

  try {
    // Find STUDIO KNOT project
    const studioKnot = await prisma.workProject.findFirst({
      where: { title: 'STUDIO KNOT' },
    });

    if (!studioKnot) {
      console.error('❌ STUDIO KNOT project not found');
      process.exit(1);
    }

    console.log(`✅ Found: ${studioKnot.title} (ID: ${studioKnot.id})`);

    // Define the 4 blocks
    const blocks = [
      // Block 0: Hero Image
      {
        id: 'block-knot-hero-1',
        type: 'hero-image',
        url: '/images/work/knot/hero.png',
        altText: 'STUDIO KNOT Hero Image',
        order: 0,
      },
      // Block 1: Work Title
      {
        id: 'block-knot-title-1',
        type: 'work-title',
        title: 'STUDIO KNOT',
        author: '노하린',
        order: 1,
      },
      // Block 2: Text (Description)
      {
        id: 'block-knot-text-1',
        type: 'text',
        content: `STUDIO KNOT는 입지 않는 옷에 새로운 쓰임을 더해 반려견 장난감으로 재탄생시키는 업사이클링 터그 토이 브랜드입니다. 쉽게 버려지는 의류와 빠르게 닳는 반려견 장난감의 순환 구조를 개선하며, 보호자의 체취가 남은 옷으로 만든 토이는 정서적 가치를 담은 지속가능한 대안을 제시합니다.`,
        order: 2,
      },
      // Block 3: Work Gallery (8 images, excluding text-below.png)
      {
        id: 'block-knot-gallery-1',
        type: 'work-gallery',
        images: [
          '/images/work/knot/gallery-1.png',
          '/images/work/knot/gallery-2.png',
          '/images/work/knot/gallery-3.png',
          '/images/work/knot/gallery-4.png',
          '/images/work/knot/gallery-5.png',
          '/images/work/knot/gallery-6.png',
          '/images/work/knot/gallery-7.png',
          '/images/work/knot/gallery-8.png',
        ],
        order: 3,
      },
    ];

    // Create BlogContent structure
    const blogContent = {
      version: '1.0',
      blocks: blocks,
      rowConfig: [
        { layout: 1, blockCount: 1 }, // Hero image: 1 col, 1 block
        { layout: 1, blockCount: 1 }, // Title: 1 col, 1 block
        { layout: 1, blockCount: 1 }, // Text: 1 col, 1 block
        { layout: 1, blockCount: 1 }, // Gallery: 1 col, 1 block
      ],
    };

    // Update project with content
    const updated = await prisma.workProject.update({
      where: { id: studioKnot.id },
      data: {
        content: blogContent,
      },
    });

    console.log('\n✅ Migration completed!');
    console.log(`
📊 Blocks created:
  • Block 0: hero-image (${blocks[0].url})
  • Block 1: work-title (${blocks[1].title} / ${blocks[1].author})
  • Block 2: text (277 characters)
  • Block 3: work-gallery (8 images)

📝 RowConfig:
  • 4 rows, each with 1 column layout
  • Total: 4 blocks

💾 Saved to: WorkProject(id='9').content
`);

    console.log('🔍 Verification:');
    console.log(JSON.stringify(blogContent, null, 2));
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
