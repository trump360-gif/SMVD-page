/**
 * SEED_TEMPLATE: Work & News CMS 초기 데이터
 *
 * 실행 방법:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-work-news.ts
 *
 * 주의:
 *   - 이 파일은 기존 하드코딩 데이터를 100% 보존합니다
 *   - 실행 전 prisma db push로 스키마를 먼저 적용해야 합니다
 *   - upsert를 사용하여 중복 실행해도 안전합니다
 */

import { Prisma, PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

// ============================================================
// 1. WorkProject 데이터 (12개 프로젝트)
// 출처: src/constants/work-details.ts + src/components/public/work/WorkArchive.tsx
// ============================================================

const workProjects = [
  {
    slug: '1',
    title: 'Vora',
    subtitle: '권나연 외 3명, 2025',
    category: 'UX/UI',
    tags: ['UX/UI'],
    author: '권나연',
    email: 'contact@vora.com',
    description: 'Vora UX/UI Design Project.\n\n',
    year: '2025',
    heroImage: '/images/work/vora/hero.png',
    thumbnailImage: '/images/work/portfolio-12.png',
    galleryImages: [
      '/images/work/vora/gallery-1.png',
      '/images/work/vora/gallery-2.png',
      '/images/work/vora/gallery-3.png',
    ],
    order: 1,
  },
  {
    slug: '2',
    title: 'Mindit',
    subtitle: '도인영 외 3명, 2025',
    category: 'UX/UI',
    tags: ['UX/UI'],
    author: '도인영',
    email: 'contact@mindit.com',
    description: 'Mindit UX/UI Design Project.\n\n',
    year: '2025',
    heroImage: '/images/work/mindit/hero.png',
    thumbnailImage: '/images/work/portfolio-10.png',
    galleryImages: [
      '/images/work/mindit/gallery-1.png',
      '/images/work/mindit/gallery-2.png',
      '/images/work/mindit/gallery-3.png',
    ],
    order: 2,
  },
  {
    slug: '3',
    title: 'StarNew Valley',
    subtitle: '안시현 외 3명, 2025',
    category: 'Game',
    tags: ['Game'],
    author: '안시현',
    email: 'contact@starnewvalley.com',
    description: 'StarNew Valley Game Design Project.\n\n',
    year: '2025',
    heroImage: '/images/work/starnewvalley/hero.png',
    thumbnailImage: '/images/work/portfolio-9.png',
    galleryImages: [
      '/images/work/starnewvalley/gallery-1.png',
      '/images/work/starnewvalley/gallery-2.png',
      '/images/work/starnewvalley/gallery-3.png',
    ],
    order: 3,
  },
  {
    slug: '4',
    title: 'Pave',
    subtitle: '박지우 외 2명, 2025',
    category: 'UX/UI',
    tags: ['UX/UI'],
    author: '박지우',
    email: 'contact@pave.com',
    description: 'Pave UX/UI Design Project.\n\n',
    year: '2025',
    heroImage: '/images/work/pave/hero.png',
    thumbnailImage: '/images/work/portfolio-11.png',
    galleryImages: [
      '/images/work/pave/gallery-1.png',
      '/images/work/pave/gallery-2.png',
      '/images/work/pave/gallery-3.png',
    ],
    order: 4,
  },
  {
    slug: '5',
    title: 'Bolio',
    subtitle: '박근영, 2025',
    category: 'UX/UI',
    tags: ['UX/UI'],
    author: '박근영',
    email: 'contact@bolio.com',
    description: 'Bolio UX/UI Design Project.\n\n',
    year: '2025',
    heroImage: '/images/work/bolio/hero.png',
    thumbnailImage: '/images/work/portfolio-7.png',
    galleryImages: [
      '/images/work/bolio/gallery-1.png',
      '/images/work/bolio/gallery-2.png',
      '/images/work/bolio/gallery-3.png',
    ],
    order: 5,
  },
  {
    slug: '6',
    title: 'MIST AWAY',
    subtitle: '신예지, 2025',
    category: 'UX/UI',
    tags: ['UX/UI'],
    author: '신예지',
    email: 'contact@mistaway.com',
    description: 'MIST AWAY UX/UI Design Project.\n\n',
    year: '2025',
    heroImage: '/images/work/mistaway/hero.png',
    thumbnailImage: '/images/work/portfolio-6.png',
    galleryImages: [
      '/images/work/mistaway/gallery-1.png',
      '/images/work/mistaway/gallery-2.png',
      '/images/work/mistaway/gallery-3.png',
    ],
    order: 6,
  },
  {
    slug: '7',
    title: 'BICHAE',
    subtitle: '최은정, 2025',
    category: 'Branding',
    tags: ['Branding'],
    author: '최은정',
    email: 'contact@bichae.com',
    description: 'BICHAE Branding Design Project.\n\n',
    year: '2025',
    heroImage: '/images/work/bichae/hero.png',
    thumbnailImage: '/images/work/portfolio-5.png',
    galleryImages: [
      '/images/work/bichae/gallery-1.png',
      '/images/work/bichae/gallery-2.png',
      '/images/work/bichae/gallery-3.png',
    ],
    order: 7,
  },
  {
    slug: '8',
    title: 'Morae',
    subtitle: '고은서, 2023',
    category: 'UX/UI',
    tags: ['UX/UI'],
    author: '고은서',
    email: 'contact@morae.com',
    description: 'Morae UX/UI Design Project.\n\n',
    year: '2023',
    heroImage: '/images/work/morae/hero.png',
    thumbnailImage: '/images/work/portfolio-4.png',
    galleryImages: [
      '/images/work/morae/gallery-1.png',
      '/images/work/morae/gallery-2.png',
      '/images/work/morae/gallery-3.png',
    ],
    order: 8,
  },
  {
    slug: '9',
    title: 'STUDIO KNOT',
    subtitle: '노하린, 2025',
    category: 'Branding',
    tags: ['UX/UI', 'Graphic', 'Editorial', 'Illustration', 'Branding', 'CM/CF', 'Game'],
    author: '노하린',
    email: 'havein6@gmail.com',
    description: `STUDIO KNOT는 입지 않는 옷에 새로운 쓰임을 더해 반려견 장난감으로 재탄생시키는 업사이클링 터그 토이 브랜드입니다.\n쉽게 버려지는 의류와 빠르게 닳는 반려견 장난감의 순환 구조를 개선하며, 보호자의 체취가 남은 옷으로 만든 토이는\n정서적 가치를 담은 지속가능한 대안을 제시합니다.`,
    year: '2025',
    heroImage: '/images/work/knot/hero.png',
    thumbnailImage: '/images/work/portfolio-3.png',
    galleryImages: [
      '/images/work/knot/text-below.png',
      '/images/work/knot/gallery-1.png',
      '/images/work/knot/gallery-2.png',
      '/images/work/knot/gallery-3.png',
      '/images/work/knot/gallery-4.png',
      '/images/work/knot/gallery-5.png',
      '/images/work/knot/gallery-6.png',
      '/images/work/knot/gallery-7.png',
      '/images/work/knot/gallery-8.png',
    ],
    order: 9,
  },
  {
    slug: '10',
    title: 'BLOM\u00C9',
    subtitle: '김진아 외 1명, 2025',
    category: 'Branding',
    tags: ['Branding'],
    author: '김진아',
    email: 'contact@blome.com',
    description: 'BLOM\u00C9 Branding Design Project.\n\n',
    year: '2025',
    heroImage: '/images/work/blome/hero.png',
    thumbnailImage: '/images/work/portfolio-8.png',
    galleryImages: [
      '/images/work/blome/gallery-1.png',
      '/images/work/blome/gallery-2.png',
      '/images/work/blome/gallery-3.png',
    ],
    order: 10,
  },
  {
    slug: '11',
    title: 'alors: romanticize your life, every...',
    subtitle: '정유진, 2025',
    category: 'Motion',
    tags: ['Motion'],
    author: '정유진',
    email: 'contact@alors.com',
    description: 'alors: romanticize your life, every... Motion Design Project.\n\n',
    year: '2025',
    heroImage: '/images/work/alors/hero.png',
    thumbnailImage: '/images/work/portfolio-2.png',
    galleryImages: [
      '/images/work/alors/gallery-1.png',
      '/images/work/alors/gallery-2.png',
      '/images/work/alors/gallery-3.png',
    ],
    order: 11,
  },
  {
    slug: '12',
    title: '고군분투',
    subtitle: '한다인, 2025',
    category: 'Motion',
    tags: ['Motion'],
    author: '한다인',
    email: 'contact@gogoonbunstu.com',
    description: '고군분투 Motion Design Project.\n\n',
    year: '2025',
    heroImage: '/images/work/gogoonbunstu/hero.png',
    thumbnailImage: '/images/work/portfolio-1.png',
    galleryImages: [
      '/images/work/gogoonbunstu/gallery-1.png',
      '/images/work/gogoonbunstu/gallery-2.png',
      '/images/work/gogoonbunstu/gallery-3.png',
    ],
    order: 12,
  },
];

// ============================================================
// 2. WorkExhibition 데이터 (6개 전시 아이템)
// 출처: src/components/public/work/WorkArchive.tsx exhibitionItems
// ============================================================

const workExhibitions = [
  {
    title: 'Vora',
    subtitle: '권나연 외 3명, 2025',
    artist: 'Voice Out Recovery Assistant',
    image: '/images/exhibition/Rectangle 45-5.png',
    year: '2025',
    order: 1,
  },
  {
    title: 'Mindit',
    subtitle: '도인영 외 3명, 2025',
    artist: '도민앱 외 3명',
    image: '/images/exhibition/Rectangle 45-4.png',
    year: '2025',
    order: 2,
  },
  {
    title: 'MIST AWAY',
    subtitle: '신예지, 2025',
    artist: '신예지',
    image: '/images/exhibition/Rectangle 45-3.png',
    year: '2025',
    order: 3,
  },
  {
    title: 'GALJIDO (갈지도)',
    subtitle: '조혜원, 2025',
    artist: '조혜원',
    image: '/images/exhibition/Rectangle 45-2.png',
    year: '2025',
    order: 4,
  },
  {
    title: 'Callmate',
    subtitle: '고은빈, 2025',
    artist: '고은빈',
    image: '/images/exhibition/Rectangle 45-1.png',
    year: '2025',
    order: 5,
  },
  {
    title: 'MOA',
    subtitle: '강세정 외 2명, 2025',
    artist: '강세정',
    image: '/images/exhibition/Rectangle 45.png',
    year: '2025',
    order: 6,
  },
];

// ============================================================
// 3. NewsEvent 데이터 (10개 뉴스 아이템)
// 출처: src/components/public/news/NewsEventArchive.tsx
//       src/components/public/news/NewsEventDetailContent.tsx
// ============================================================

const newsEvents = [
  {
    slug: '1',
    title: '미술대학 2024년도 학생경비 집행내역 공개',
    category: 'Notice',
    excerpt: null,
    thumbnailImage: '/Group-27.svg',
    content: null,
    publishedAt: new Date('2025-01-05'),
    order: 1,
  },
  {
    slug: '2',
    title: '디자인학과(박사) 2024년도 학생경비 집행내역 공개',
    category: 'Notice',
    excerpt: null,
    thumbnailImage: '/Group-27.svg',
    content: null,
    publishedAt: new Date('2025-01-05'),
    order: 2,
  },
  {
    slug: '3',
    title: '시각영상디자인학과(석사) 2024년도 학생경비 집행내역 공개',
    category: 'Notice',
    excerpt: null,
    thumbnailImage: '/Group-27.svg',
    content: null,
    publishedAt: new Date('2025-01-05'),
    order: 3,
  },
  {
    slug: '4',
    title: '시각영상디자인학과 2024년도 학생경비 집행내역 공개',
    category: 'Notice',
    excerpt: null,
    thumbnailImage: '/Group-27.svg',
    content: null,
    publishedAt: new Date('2025-01-05'),
    order: 4,
  },
  {
    slug: '5',
    title: '2024 시각\u00B7영상디자인과 졸업전시회',
    category: 'Event',
    excerpt: '이번 전시 주제인 "Ready, Set, Go!" KICK OFF는 들을 제기 한전을 넘어 새로운 도약을 준비하는 결심을 담고 있습니다...',
    thumbnailImage: '/images/news/Image-1.png',
    content: {
      introTitle: '2024 시각영상디자인과 졸업전시회',
      introText: `이번 전시 주제인 'Ready, Set, Go!' KICK OFF는 틀을 깨고 한계를 넘어 새로운 도약을 준비하는 결심을 담아 진행되었습니다.\n필드를 넘어서 더 넓은 세계로 나아가는 여정을 함께해주신 교수님들과 관객 분들께 감사 인사를 전합니다.`,
      gallery: {
        layout: 'standard',
        main: '/images/work-detail/Rectangle 240652481.png',
        centerLeft: '/images/work-detail/Rectangle 240652482.png',
        centerRight: '/images/work-detail/Rectangle 240652483.png',
        bottomLeft: '/images/work-detail/Rectangle 240652486.png',
        bottomCenter: '/images/work-detail/Rectangle 240652485.png',
        bottomRight: '/images/work-detail/Rectangle 240652484.png',
      },
    },
    publishedAt: new Date('2025-01-05'),
    order: 5,
  },
  {
    slug: '6',
    title: '2024 시각\u00B7영상디자인과 동문의 밤',
    category: 'Event',
    excerpt: '2024년 10월 28일, 백주년기념관 한상은 라운지에서 2024 시각\u00B7영상디자인과 동문의 밤 행사를 진행했습니다. 1부에는 동문 특강을, 2부에는 황순선 교수님의 서프라이즈 퇴임식을 진행했습니다...',
    thumbnailImage: '/images/news/Image.png',
    content: null,
    publishedAt: new Date('2025-01-05'),
    order: 6,
  },
  {
    slug: '7',
    title: '학생경비 집행 내역',
    category: 'Notice',
    excerpt: null,
    thumbnailImage: '/Group-27.svg',
    content: null,
    publishedAt: new Date('2025-01-05'),
    order: 7,
  },
  {
    slug: '8',
    title: '[ 시각영상디자인과(박사) 2023 학생경비 집행내역 공개 ]',
    category: 'Notice',
    excerpt: null,
    thumbnailImage: '/Group-27.svg',
    content: null,
    publishedAt: new Date('2025-01-05'),
    order: 8,
  },
  {
    slug: '9',
    title: '[ 시각영상디자인과(석사) 2023 학생경비 집행내역 공개 ]',
    category: 'Notice',
    excerpt: null,
    thumbnailImage: '/Group-27.svg',
    content: null,
    publishedAt: new Date('2025-01-05'),
    order: 9,
  },
  {
    slug: '10',
    title: '[졸업] 재학생 졸업학점 이수완환 확인 및 과목 정리 실시',
    category: 'Notice',
    excerpt: null,
    thumbnailImage: '/Group-27.svg',
    content: null,
    publishedAt: new Date('2025-01-05'),
    order: 10,
  },
];

// ============================================================
// 4. Section 데이터 (페이지 레벨 설정)
// ============================================================

import { SectionType } from '../src/generated/prisma';

const workPageSections = [
  {
    type: SectionType.WORK_ARCHIVE,
    title: 'Achieve',
    content: {
      categories: ['All', 'UX/UI', 'Motion', 'Branding', 'Game', 'Graphics'],
      itemsPerPage: 12,
    },
    order: 0,
  },
  {
    type: SectionType.WORK_EXHIBITION,
    title: 'Exhibition',
    content: {},
    order: 1,
  },
];

const newsPageSections = [
  {
    type: SectionType.NEWS_ARCHIVE,
    title: 'News&Event',
    content: {
      categories: ['ALL', 'Notice', 'Event', 'Awards', 'Recruiting'],
    },
    order: 0,
  },
];

// ============================================================
// Main seed function
// ============================================================

async function main() {
  console.log('Starting Work & News CMS seed...');

  // --- Work Projects (12개) ---
  console.log('\n--- Seeding WorkProject (12 records) ---');
  for (const project of workProjects) {
    const result = await prisma.workProject.upsert({
      where: { slug: project.slug },
      update: {
        title: project.title,
        subtitle: project.subtitle,
        category: project.category,
        tags: project.tags,
        author: project.author,
        email: project.email,
        description: project.description,
        year: project.year,
        heroImage: project.heroImage,
        thumbnailImage: project.thumbnailImage,
        galleryImages: project.galleryImages,
        order: project.order,
      },
      create: {
        slug: project.slug,
        title: project.title,
        subtitle: project.subtitle,
        category: project.category,
        tags: project.tags,
        author: project.author,
        email: project.email,
        description: project.description,
        year: project.year,
        heroImage: project.heroImage,
        thumbnailImage: project.thumbnailImage,
        galleryImages: project.galleryImages,
        order: project.order,
      },
    });
    console.log(`  [${project.order}] ${project.title} -> ${result.id}`);
  }

  // --- Work Exhibitions (6개) ---
  console.log('\n--- Seeding WorkExhibition (6 records) ---');
  // WorkExhibition에는 unique 필드가 없으므로 deleteMany + createMany
  await prisma.workExhibition.deleteMany({});
  for (const exhibition of workExhibitions) {
    const result = await prisma.workExhibition.create({
      data: exhibition,
    });
    console.log(`  [${exhibition.order}] ${exhibition.title} -> ${result.id}`);
  }

  // --- News Events (10개) ---
  console.log('\n--- Seeding NewsEvent (10 records) ---');
  for (const news of newsEvents) {
    // Prisma Json? 필드에 null 전달 시 Prisma.DbNull 사용 필수
    const contentValue = news.content === null ? Prisma.DbNull : news.content;
    const result = await prisma.newsEvent.upsert({
      where: { slug: news.slug },
      update: {
        title: news.title,
        category: news.category,
        excerpt: news.excerpt,
        thumbnailImage: news.thumbnailImage,
        content: contentValue,
        publishedAt: news.publishedAt,
        order: news.order,
      },
      create: {
        slug: news.slug,
        title: news.title,
        category: news.category,
        excerpt: news.excerpt,
        thumbnailImage: news.thumbnailImage,
        content: contentValue,
        publishedAt: news.publishedAt,
        order: news.order,
      },
    });
    console.log(`  [${news.order}] ${news.title.substring(0, 40)}... -> ${result.id}`);
  }

  // --- Page & Section setup ---
  console.log('\n--- Setting up Pages & Sections ---');

  // Work page (이미 존재하면 업데이트 스킵)
  const workPage = await prisma.page.upsert({
    where: { slug: 'work' },
    update: {},
    create: {
      slug: 'work',
      title: 'Work',
      description: 'Portfolio and Exhibition',
      order: 5,
    },
  });
  console.log(`  Work page: ${workPage.id}`);

  // 기존 Work 섹션 확인 후 없는 것만 생성
  const existingWorkSections = await prisma.section.findMany({
    where: { pageId: workPage.id },
    select: { type: true },
  });
  const existingWorkTypes = new Set(existingWorkSections.map((s) => s.type));

  for (const section of workPageSections) {
    if (existingWorkTypes.has(section.type)) {
      console.log(`  Section: ${section.type} (${section.title}) - already exists, skipping`);
      continue;
    }
    await prisma.section.create({
      data: {
        pageId: workPage.id,
        type: section.type,
        title: section.title,
        content: section.content,
        order: section.order,
      },
    });
    console.log(`  Section: ${section.type} (${section.title}) - created`);
  }

  // News page (이미 존재하면 업데이트 스킵)
  const newsPage = await prisma.page.upsert({
    where: { slug: 'news' },
    update: {},
    create: {
      slug: 'news',
      title: 'News & Event',
      description: 'News and Events',
      order: 6,
    },
  });
  console.log(`  News page: ${newsPage.id}`);

  // 기존 News 섹션 확인 후 없는 것만 생성
  const existingNewsSections = await prisma.section.findMany({
    where: { pageId: newsPage.id },
    select: { type: true },
  });
  const existingNewsTypes = new Set(existingNewsSections.map((s) => s.type));

  for (const section of newsPageSections) {
    if (existingNewsTypes.has(section.type)) {
      console.log(`  Section: ${section.type} (${section.title}) - already exists, skipping`);
      continue;
    }
    await prisma.section.create({
      data: {
        pageId: newsPage.id,
        type: section.type,
        title: section.title,
        content: section.content,
        order: section.order,
      },
    });
    console.log(`  Section: ${section.type} (${section.title}) - created`);
  }

  // --- Summary ---
  const projectCount = await prisma.workProject.count();
  const exhibitionCount = await prisma.workExhibition.count();
  const newsCount = await prisma.newsEvent.count();

  console.log('\n=== Seed Complete ===');
  console.log(`  WorkProject:    ${projectCount} records`);
  console.log(`  WorkExhibition: ${exhibitionCount} records`);
  console.log(`  NewsEvent:      ${newsCount} records`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
