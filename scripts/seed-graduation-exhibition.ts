/**
 * Seed script: 2024 시각영상디자인과 졸업전시회 News Article
 *
 * Creates a new NewsEvent record with block-based content (BlogContent format)
 * containing: HeroImageBlock + TextBlock + ImageGridBlock
 *
 * Usage:
 *   npx tsx scripts/seed-graduation-exhibition.ts
 */

import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding: 2024 졸업전시회 News Article ---\n');

  // Check if already exists (by title match)
  const existing = await prisma.newsEvent.findFirst({
    where: {
      title: '2024 시각영상디자인과 졸업전시회',
    },
  });

  if (existing) {
    console.log(`Already exists (id: ${existing.id}, slug: ${existing.slug})`);
    console.log('Updating content with block-based format...\n');

    const updated = await prisma.newsEvent.update({
      where: { id: existing.id },
      data: {
        category: 'Event',
        excerpt: "Ready, Set, Go! KICK OFF 전시회",
        thumbnailImage: '/images/work-detail/Rectangle 240652481.png',
        content: buildBlockContent(),
        publishedAt: new Date('2025-01-05'),
        published: true,
      },
    });

    console.log(`Updated: ${updated.id} (slug: ${updated.slug})`);
    console.log('Done!\n');
    return;
  }

  // Get next order
  const lastArticle = await prisma.newsEvent.findFirst({
    orderBy: { order: 'desc' },
  });
  const nextOrder = lastArticle ? lastArticle.order + 1 : 0;

  // Generate slug
  const slug = '2024-graduation-exhibition';
  const slugExists = await prisma.newsEvent.findUnique({ where: { slug } });
  const finalSlug = slugExists ? `${slug}-${Date.now()}` : slug;

  const article = await prisma.newsEvent.create({
    data: {
      slug: finalSlug,
      title: '2024 시각영상디자인과 졸업전시회',
      category: 'Event',
      excerpt: "Ready, Set, Go! KICK OFF 전시회",
      thumbnailImage: '/images/work-detail/Rectangle 240652481.png',
      content: buildBlockContent(),
      publishedAt: new Date('2025-01-05'),
      published: true,
      order: nextOrder,
    },
  });

  console.log(`Created: ${article.id} (slug: ${article.slug}, order: ${article.order})`);
  console.log('Done!\n');
}

function buildBlockContent() {
  const now = Date.now();

  return {
    blocks: [
      // 1. HeroImageBlock: Main exhibition image
      {
        id: `block-${now}-hero`,
        type: 'hero-image',
        url: '/images/work-detail/Rectangle 240652481.png',
        alt: '2024 시각영상디자인과 졸업전시회 개막식',
        order: 0,
      },
      // 2. TextBlock: Exhibition description
      {
        id: `block-${now}-text`,
        type: 'text',
        content: "이번 전시 주제인 'Ready, Set, Go!' KICK OFF는 틀을 깨고 한계를 넘어 새로운 도약을 준비하는 결심을 담아 진행되었습니다.\n필드를 넘어서 더 넓은 세계로 나아가는 여정을 함께해주신 교수님들과 관객 분들께 감사 인사를 전합니다.",
        fontSize: 18,
        fontWeight: '500',
        color: '#1b1d1f',
        lineHeight: 1.5,
        order: 1,
      },
      // 3. ImageGridBlock: 6 exhibition images in 1+2+3 layout
      {
        id: `block-${now}-grid`,
        type: 'image-grid',
        images: [
          { id: `img-${now}-1`, url: '/images/work-detail/Rectangle 240652481.png', alt: '개막식 - 메인' },
          { id: `img-${now}-2`, url: '/images/work-detail/Rectangle 240652482.png', alt: '관객 참석' },
          { id: `img-${now}-3`, url: '/images/work-detail/Rectangle 240652483.png', alt: '전시 공간 1' },
          { id: `img-${now}-4`, url: '/images/work-detail/Rectangle 240652484.png', alt: '굿즈' },
          { id: `img-${now}-5`, url: '/images/work-detail/Rectangle 240652485.png', alt: '전시 부스' },
          { id: `img-${now}-6`, url: '/images/work-detail/Rectangle 240652486.png', alt: '전시 공간 2' },
        ],
        rows: [
          { id: `row-${now}-1`, columns: 1, imageCount: 1 },  // 1 image full width
          { id: `row-${now}-2`, columns: 2, imageCount: 2 },  // 2 images side by side
          { id: `row-${now}-3`, columns: 3, imageCount: 3 },  // 3 images in a row
        ],
        gap: 20,
        aspectRatio: 1,
        order: 2,
      },
    ],
    version: '1.0',
  };
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Error:', e);
    prisma.$disconnect();
    process.exit(1);
  });
