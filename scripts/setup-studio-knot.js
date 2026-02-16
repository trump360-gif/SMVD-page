/**
 * PHASE 2: Studio Knot CMS Setup
 * Simple Node script to update database
 */

const { PrismaClient } = require('../src/generated/prisma');

console.log('[Debug] PrismaClient type:', typeof PrismaClient);

let prisma;
try {
  prisma = new PrismaClient();
  console.log('[Debug] Prisma instantiated');
  console.log('[Debug] prisma.workBlog:', typeof prisma.workBlog);
  console.log('[Debug] prisma methods:', Object.keys(prisma).filter(k => typeof prisma[k] === 'function').slice(0, 5));
} catch (e) {
  console.error('[Debug] Failed to instantiate Prisma:', e.message);
  process.exit(1);
}

const studioKnotBlogContent = {
  version: "1.0",
  blocks: [
    {
      id: "block-hero-knot-1",
      type: "hero-image",
      order: 0,
      url: "/images/work/knot/hero.png",
      alt: "STUDIO KNOT Hero Image",
      height: 600,
      objectFit: "cover"
    },
    {
      id: "block-title-knot-1",
      type: "work-title",
      order: 1,
      title: "STUDIO KNOT",
      subtitle: "노하린, 2025",
      author: "노하린",
      email: "havein6@gmail.com",
      titleFontSize: 60,
      titleFontWeight: "700",
      titleColor: "#1b1d1f",
      subtitleFontSize: 14,
      subtitleFontWeight: "500",
      subtitleColor: "#7b828e",
      authorFontSize: 14,
      authorFontWeight: "500",
      authorColor: "#1b1d1f",
      emailFontSize: 12,
      emailFontWeight: "400",
      emailColor: "#7b828e",
      gap: 24
    },
    {
      id: "block-text-knot-1",
      type: "text",
      order: 2,
      content: "STUDIO KNOT는 입지 않는 옷에 새로운 쓰임을 더해 반려견 장난감으로 재탄생시키는 업사이클링 터그 토이 브랜드입니다. 쉽게 버려지는 의류와 빠르게 닳는 반려견 장난감의 순환 구조를 개선하며, 보호자의 체취가 남은 옷으로 만든 토이는 정서적 가치를 담은 지속가능한 대안을 제시합니다.",
      fontSize: 18,
      fontWeight: "400",
      fontFamily: "Pretendard",
      color: "#1b1d1f",
      lineHeight: 1.8,
      letterSpacing: 0.5
    },
    {
      id: "block-gallery-knot-1",
      type: "work-gallery",
      order: 3,
      images: [
        { id: "img-1", url: "/images/work/knot/gallery-1.png", alt: "Gallery 1" },
        { id: "img-2", url: "/images/work/knot/gallery-2.png", alt: "Gallery 2" },
        { id: "img-3", url: "/images/work/knot/gallery-3.png", alt: "Gallery 3" },
        { id: "img-4", url: "/images/work/knot/gallery-4.png", alt: "Gallery 4" },
        { id: "img-5", url: "/images/work/knot/gallery-5.png", alt: "Gallery 5" },
        { id: "img-6", url: "/images/work/knot/gallery-6.png", alt: "Gallery 6" },
        { id: "img-7", url: "/images/work/knot/gallery-7.png", alt: "Gallery 7" },
        { id: "img-8", url: "/images/work/knot/gallery-8.png", alt: "Gallery 8" },
        { id: "img-9", url: "/images/work/knot/gallery-9.png", alt: "Gallery 9" }
      ],
      imageLayout: 2,
      gap: 16,
      minImageHeight: 300
    }
  ],
  rowConfig: [
    { layout: 1, blockCount: 1 },
    { layout: 2, blockCount: 2 },
    { layout: 1, blockCount: 1 }
  ]
};

async function main() {
  console.log('\n📋 Phase 2: Studio Knot CMS Data Generation\n');
  console.log('='.repeat(60));

  try {
    console.log('\n[Step 1] 🔍 Finding Studio Knot project...');
    const studioKnot = await prisma.workProject.findFirst({
      where: { title: "STUDIO KNOT" }
    });

    if (!studioKnot) {
      console.log('❌ Studio Knot project not found');
      process.exit(1);
    }

    console.log('✅ Found Studio Knot project:');
    console.log(`   - ID: ${studioKnot.id}`);
    console.log(`   - Title: ${studioKnot.title}`);

    console.log('\n[Step 2] 📝 Preparing BlogContent JSON...');
    console.log(`   Blocks: ${studioKnotBlogContent.blocks.length}`);
    studioKnotBlogContent.blocks.forEach((block, idx) => {
      console.log(`   - Block ${idx}: ${block.type}`);
    });
    console.log(`   Row Config: ${studioKnotBlogContent.rowConfig.length} rows`);

    console.log('\n[Step 3] 💾 Updating database...');
    const updated = await prisma.workProject.update({
      where: { id: studioKnot.id },
      data: {
        content: studioKnotBlogContent
      }
    });

    console.log('✅ Database updated!');
    console.log(`   - Blocks: ${updated.content.blocks.length}`);
    console.log(`   - Rows: ${updated.content.rowConfig.length}`);

    console.log('\n' + '='.repeat(60));
    console.log('✨ Phase 2 Complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
