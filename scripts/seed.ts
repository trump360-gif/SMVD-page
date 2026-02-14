import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // 1. Home 페이지 생성 (또는 기존 업데이트)
    const homePage = await prisma.page.upsert({
      where: { slug: 'home' },
      update: {},
      create: {
        slug: 'home',
        title: 'Home',
        description: 'SMVD Homepage',
        order: 1,
      },
    });

    console.log('✅ Home page created/updated:', homePage.id);

    // 2. VideoHero 섹션
    const videoHeroSection = await prisma.section.upsert({
      where: { id: 'home-hero-section' },
      update: {},
      create: {
        id: 'home-hero-section',
        pageId: homePage.id,
        type: 'HOME_HERO',
        title: 'Video Hero',
        content: {
          height: 949,
          videoUrl: null,
          placeholderText: 'Video coming soon...',
          bgColor: '#000000ff',
        },
        order: 0,
      },
    });

    console.log('✅ VideoHero section created:', videoHeroSection.id);

    // 3. ExhibitionSection - 먼저 미디어 확인/생성
    const exhibitionImages = [
      {
        year: '2025',
        path: '/images/home/exhibition-2025.png',
        filename: 'exhibition-2025.png',
      },
      {
        year: '2024',
        path: '/images/home/exhibition-2024.png',
        filename: 'exhibition-2024.png',
      },
      {
        year: '2023',
        path: '/images/home/exhibition-2023.png',
        filename: 'exhibition-2023.png',
      },
    ];

    const exhibitionMediaIds: string[] = [];

    for (const img of exhibitionImages) {
      let media = await prisma.media.findFirst({
        where: { filename: img.filename },
      });

      if (!media) {
        media = await prisma.media.create({
          data: {
            filename: img.filename,
            filepath: img.path,
            mimeType: 'image/png',
            size: 0,
            width: 300,
            height: 435,
            altText: `SMVD Exhibition ${img.year}`,
          },
        });
      }

      exhibitionMediaIds.push(media.id);
      console.log(`✅ Exhibition media: ${img.year} (${media.id})`);
    }

    // ExhibitionSection 생성
    const exhibitionSection = await prisma.section.upsert({
      where: { id: 'exhibition-section' },
      update: {},
      create: {
        id: 'exhibition-section',
        pageId: homePage.id,
        type: 'EXHIBITION_SECTION',
        title: 'Exhibition',
        content: {
          moreLink: '#',
        },
        mediaIds: exhibitionMediaIds,
        order: 1,
      },
    });

    console.log('✅ ExhibitionSection created:', exhibitionSection.id);

    // ExhibitionItem들 생성
    for (let i = 0; i < exhibitionImages.length; i++) {
      const exhibitionItem = await prisma.exhibitionItem.upsert({
        where: {
          sectionId_order: {
            sectionId: exhibitionSection.id,
            order: i,
          },
        },
        update: {},
        create: {
          sectionId: exhibitionSection.id,
          year: exhibitionImages[i].year,
          mediaId: exhibitionMediaIds[i],
          order: i,
        },
      });

      console.log(
        `✅ ExhibitionItem created: ${exhibitionImages[i].year} (${exhibitionItem.id})`
      );
    }

    // 4. AboutSection
    const aboutSection = await prisma.section.upsert({
      where: { id: 'about-section' },
      update: {},
      create: {
        id: 'about-section',
        pageId: homePage.id,
        type: 'HOME_ABOUT',
        title: 'About SMVD',
        content: {
          tagline: 'FROM VISUAL DELIVERY\nTO SYSTEMIC SOLUTIONS\nSOLVING PROBLEMS,\nSHAPING THE FUTURE OF VISUALS',
        },
        order: 2,
      },
    });

    console.log('✅ AboutSection created:', aboutSection.id);

    // 5. WorkSection - 포트폴리오 이미지 생성
    const workPortfolioData = [
      {
        title: 'Vora',
        category: 'UX/UI',
        filename: 'portfolio-12.png',
        path: '/images/work/portfolio-12.png',
      },
      {
        title: 'BICHAE',
        category: 'Branding',
        filename: 'portfolio-5.png',
        path: '/images/work/portfolio-5.png',
      },
      {
        title: 'StarNew Valley',
        category: 'Game',
        filename: 'portfolio-9.png',
        path: '/images/work/portfolio-9.png',
      },
      {
        title: 'Pave',
        category: 'UX/UI',
        filename: 'portfolio-11.png',
        path: '/images/work/portfolio-11.png',
      },
      {
        title: 'Bolio',
        category: 'UX/UI',
        filename: 'portfolio-7.png',
        path: '/images/work/portfolio-7.png',
      },
      {
        title: 'Morae',
        category: 'UX/UI',
        filename: 'portfolio-4.png',
        path: '/images/work/portfolio-4.png',
      },
      {
        title: 'MIST AWAY',
        category: 'UX/UI',
        filename: 'portfolio-6.png',
        path: '/images/work/portfolio-6.png',
      },
      {
        title: 'BLOME',
        category: 'Branding',
        filename: 'portfolio-8.png',
        path: '/images/work/portfolio-8.png',
      },
      {
        title: '고군분투',
        category: 'Motion',
        filename: 'portfolio-1.png',
        path: '/images/work/portfolio-1.png',
      },
      {
        title: 'alors',
        category: 'Motion',
        filename: 'portfolio-2.png',
        path: '/images/work/portfolio-2.png',
      },
    ];

    const workMediaIds: string[] = [];

    for (const work of workPortfolioData) {
      let media = await prisma.media.findFirst({
        where: { filename: work.filename },
      });

      if (!media) {
        media = await prisma.media.create({
          data: {
            filename: work.filename,
            filepath: work.path,
            mimeType: 'image/png',
            size: 0,
            width: 530,
            height: 286,
            altText: work.title,
          },
        });
      }

      workMediaIds.push(media.id);
      console.log(`✅ Work media: ${work.title} (${media.id})`);
    }

    // WorkSection 생성
    const workSection = await prisma.section.upsert({
      where: { id: 'work-section' },
      update: {},
      create: {
        id: 'work-section',
        pageId: homePage.id,
        type: 'WORK_PORTFOLIO',
        title: 'Work',
        content: {
          moreLink: '#',
          categories: ['All', 'UX/UI', 'Motion', 'Branding', 'Game design', 'Graphic'],
        },
        mediaIds: workMediaIds,
        order: 3,
      },
    });

    console.log('✅ WorkSection created:', workSection.id);

    // WorkPortfolio items 생성
    for (let i = 0; i < workPortfolioData.length; i++) {
      const workItem = await prisma.workPortfolio.upsert({
        where: {
          sectionId_order: {
            sectionId: workSection.id,
            order: i,
          },
        },
        update: {},
        create: {
          sectionId: workSection.id,
          title: workPortfolioData[i].title,
          category: workPortfolioData[i].category,
          mediaId: workMediaIds[i],
          order: i,
        },
      });

      console.log(
        `✅ WorkPortfolio item created: ${workPortfolioData[i].title} (${workItem.id})`
      );
    }

    console.log('');
    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log('  - Home page: 1');
    console.log('  - Sections: 4 (VideoHero, Exhibition, About, Work)');
    console.log('  - Exhibition items: 3');
    console.log('  - Work portfolio items: 10');
    console.log('  - Total media items: 13');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
