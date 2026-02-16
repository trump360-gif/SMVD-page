#!/usr/bin/env node

/**
 * PHASE 2: Studio Knot CMS Data Generation & DB Save
 *
 * Generates the complete BlogContent JSON structure for Studio Knot project
 * and saves it to the PostgreSQL database via Prisma.
 *
 * Structure:
 * - 4 blocks (hero-image, work-title, text, work-gallery)
 * - 3 rows (layout: 1, 2, 1)
 * - 9 gallery images
 */

import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

// BlogContent JSON - Complete Structure
const studioKnotBlogContent = {
  version: "1.0",

  blocks: [
    // Block 0: Hero Image
    {
      id: "block-hero-knot-1",
      type: "hero-image",
      order: 0,
      url: "/images/work/knot/hero.png",
      alt: "STUDIO KNOT Hero Image",
      height: 600,
      objectFit: "cover"
    },

    // Block 1: Work Title (좌측)
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

    // Block 2: Text Description (우측)
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

    // Block 3: Work Gallery (9개 이미지)
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
      imageLayout: 2,      // 2-column layout
      gap: 16,
      minImageHeight: 300
    }
  ],

  // Row Configuration - 3 rows total
  rowConfig: [
    { layout: 1, blockCount: 1 },  // Row 0: Hero Image
    { layout: 2, blockCount: 2 },  // Row 1: Work Title | Text
    { layout: 1, blockCount: 1 }   // Row 2: Work Gallery
  ]
};

async function main() {
  console.log('\n📋 Phase 2: Studio Knot CMS Data Generation\n');
  console.log('='.repeat(60));

  try {
    // Step 1: Find Studio Knot project
    console.log('\n[Step 1] 🔍 Finding Studio Knot project...');
    const studioKnot = await prisma.workBlog.findFirst({
      where: { title: "STUDIO KNOT" },
      include: { project: true }
    });

    if (!studioKnot) {
      console.log('❌ Studio Knot project not found in database');
      console.log('   Please ensure the project exists at /work/9');
      process.exit(1);
    }

    console.log('✅ Found Studio Knot project:');
    console.log(`   - ID: ${studioKnot.id}`);
    console.log(`   - Title: ${studioKnot.title}`);
    console.log(`   - Project ID: ${studioKnot.projectId}`);

    // Step 2: Prepare BlogContent data
    console.log('\n[Step 2] 📝 Preparing BlogContent JSON...');
    console.log(`   Blocks: ${studioKnotBlogContent.blocks.length}`);
    studioKnotBlogContent.blocks.forEach((block, idx) => {
      console.log(`   - Block ${idx}: ${block.type}`);
    });
    console.log(`   Row Config: ${studioKnotBlogContent.rowConfig.length} rows`);

    // Step 3: Update WorkBlog with BlogContent
    console.log('\n[Step 3] 💾 Updating database with BlogContent...');
    const updated = await prisma.workBlog.update({
      where: { id: studioKnot.id },
      data: {
        content: studioKnotBlogContent
      }
    });

    console.log('✅ Database updated successfully!');
    console.log(`   - Blog content saved`);
    console.log(`   - Blocks: ${updated.content.blocks.length}`);
    console.log(`   - Rows: ${updated.content.rowConfig.length}`);

    // Step 4: Verify data
    console.log('\n[Step 4] ✔️ Verification');
    const verified = await prisma.workBlog.findUnique({
      where: { id: studioKnot.id }
    });

    if (verified && verified.content) {
      console.log('✅ Data verified in database');
      console.log(`   - Content version: ${verified.content.version}`);
      console.log(`   - Blocks loaded: ${verified.content.blocks.length}`);
      console.log(`   - Gallery images: ${verified.content.blocks[3]?.images?.length || 0}`);
    } else {
      console.log('❌ Verification failed');
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✨ Phase 2 Complete!');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log('   ✅ BlogContent JSON created');
    console.log('   ✅ 4 blocks configured (Hero, Title, Text, Gallery)');
    console.log('   ✅ 3 rows layout applied');
    console.log('   ✅ 9 gallery images defined');
    console.log('   ✅ Data saved to database');
    console.log('\n🎯 Next Phase: Phase 3 - CMS Functionality Testing\n');

  } catch (error) {
    console.error('❌ Error during Phase 2:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
