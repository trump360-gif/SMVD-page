import { PrismaClient } from "../src/generated/prisma/index.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminEmail = "admin@smvd.ac.kr";
  const adminPassword = "admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashedPassword,
      role: "admin",
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Create main pages
  const pages = [
    {
      slug: "home",
      title: "홈",
      description: "숙명여자대학교 시각영상디자인과 홈페이지",
      order: 0,
    },
    {
      slug: "about",
      title: "학과소개",
      description: "시각영상디자인과 소개",
      order: 1,
    },
    {
      slug: "curriculum",
      title: "교과과정",
      description: "시각영상디자인과 교과과정",
      order: 2,
    },
    {
      slug: "people",
      title: "교수진",
      description: "시각영상디자인과 교수진",
      order: 3,
    },
    {
      slug: "work",
      title: "포트폴리오",
      description: "시각영상디자인과 작품 포트폴리오",
      order: 4,
    },
    {
      slug: "news",
      title: "뉴스&이벤트",
      description: "시각영상디자인과 뉴스 및 이벤트",
      order: 5,
    },
  ];

  for (const page of pages) {
    const createdPage = await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: {
        id: page.slug === 'home' ? 'page-001' : undefined,
        slug: page.slug,
        title: page.title,
        description: page.description,
        order: page.order,
      },
    });
    console.log(`✅ Page created: ${createdPage.slug} (id: ${createdPage.id})`);
  }

  // Create navigation items
  const navItems = [
    { label: "홈", href: "/", order: 0 },
    { label: "학과소개", href: "/about", order: 1 },
    { label: "교과과정", href: "/curriculum", order: 2 },
    { label: "교수진", href: "/people", order: 3 },
    { label: "포트폴리오", href: "/work", order: 4 },
    { label: "뉴스&이벤트", href: "/news", order: 5 },
  ];

  for (const item of navItems) {
    const nav = await prisma.navigation.upsert({
      where: { id: `nav_${item.label}` },
      update: {},
      create: { id: `nav_${item.label}`, ...item },
    });
    console.log(`✅ Navigation item created: ${nav.label}`);
  }

  // Create footer
  const footer = await prisma.footer.upsert({
    where: { id: "footer-default" },
    update: {},
    create: {
      id: "footer-default",
      title: "숙명여자대학교 시각영상디자인과",
      description: "디지털 시대의 창의적 시각 표현을 주도하는 학과",
      address: "서울특별시 용산구 청파로 47길 100 숙명여자대학교",
      phone: "+82-2-710-9191",
      email: "smvd@sookmyung.ac.kr",
      socialLinks: {
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
        youtube: "https://youtube.com",
      },
      copyright: "© 2026 Sookmyung Women's University. All rights reserved.",
    },
  });
  console.log(`✅ Footer created`);

  // Create initial sections for home page
  const homePage = await prisma.page.findUnique({
    where: { slug: "home" },
  });

  if (homePage) {
    const sections = [
      {
        type: "HOME_HERO",
        title: "홈 페이지 히어로",
        content: {
          mainTitle: "Sookmyung Visual & Media Design",
          subtitle: "창의적 시각 표현의 미래",
          backgroundImage: "/images/home/hero-bg.webp",
        },
        order: 0,
      },
      {
        type: "EXHIBITION_SECTION",
        title: "졸업전시회",
        content: {
          description: "졸업생들의 창의적 작품 전시",
        },
        order: 1,
      },
      {
        type: "HOME_ABOUT",
        title: "학과 소개",
        content: {
          description: "시각영상디자인과는 창의적인 시각 표현을 통해 미래를 열어가는 학과입니다.",
          imageFilename: "about-intro.webp",
        },
        order: 2,
      },
      {
        type: "WORK_PORTFOLIO",
        title: "포트폴리오",
        content: {
          description: "학생들의 뛰어난 작품들을 감상해보세요",
        },
        order: 3,
      },
    ];

    for (const section of sections) {
      await prisma.section.upsert({
        where: {
          id: `home-section-${section.type.toLowerCase()}`,
        },
        update: {},
        create: {
          id: `home-section-${section.type.toLowerCase()}`,
          pageId: homePage.id,
          type: section.type as any,
          title: section.title,
          content: section.content,
          order: section.order,
        },
      });
      console.log(`✅ Section created: ${section.type}`);
    }

    // Create Media records for Exhibition
    const exhibitionMediaFiles = [
      { filename: "exhibition-2025.png", year: "2025" },
      { filename: "exhibition-2024.png", year: "2024" },
      { filename: "exhibition-2023.png", year: "2023" },
    ];
    const exhibitionMediaIds: string[] = [];

    for (const { filename, year } of exhibitionMediaFiles) {
      const media = await prisma.media.upsert({
        where: { id: `media-exhibition-${year}` },
        update: {},
        create: {
          id: `media-exhibition-${year}`,
          filename,
          filepath: `/images/home/${filename}`,
          mimeType: "image/png",
          size: 0,
          altText: `졸업전시회 ${year}`,
        },
      });
      exhibitionMediaIds.push(media.id);
      console.log(`✅ Media created: ${filename}`);
    }

    // Create ExhibitionItems
    const exhibitionSection = await prisma.section.findUnique({
      where: { id: "home-section-exhibition_section" },
    });

    if (exhibitionSection && exhibitionMediaIds.length > 0) {
      const exhibitionYears = ["2025", "2024", "2023"];
      for (let i = 0; i < exhibitionYears.length && i < exhibitionMediaIds.length; i++) {
        await prisma.exhibitionItem.upsert({
          where: {
            id: `exhibition-item-${exhibitionYears[i]}`,
          },
          update: {},
          create: {
            id: `exhibition-item-${exhibitionYears[i]}`,
            sectionId: exhibitionSection.id,
            year: exhibitionYears[i],
            mediaId: exhibitionMediaIds[i],
            order: i,
          },
        });
        console.log(`✅ ExhibitionItem created: ${exhibitionYears[i]}`);
      }
    }

    // Create Media records for Work Portfolio
    // 파일명과 이미지 제목 매핑
    const fileToTitleMap: { [key: string]: string } = {
      "portfolio-1.png": "고군분투",
      "portfolio-2.png": "Nightmare in Neverland",
      "portfolio-3.png": "StarNew Valley",
      "portfolio-4.png": "Pave",
      "portfolio-5.png": "Bolio",
      "portfolio-6.png": "Morae",
      "portfolio-7.png": "MIST AWAY",
      "portfolio-8.png": "Vora",
      "portfolio-9.png": "BICHAE",
      "portfolio-10.png": "신도",
    };

    const portfolioItems = [
      { title: "Vora", filename: "portfolio-8.png" },
      { title: "BICHAE", filename: "portfolio-9.png" },
      { title: "StarNew Valley", filename: "portfolio-3.png" },
      { title: "Pave", filename: "portfolio-4.png" },
      { title: "Bolio", filename: "portfolio-5.png" },
      { title: "Morae", filename: "portfolio-6.png" },
      { title: "MIST AWAY", filename: "portfolio-7.png" },
      { title: "Nightmare in Neverland", filename: "portfolio-2.png" },
      { title: "고군분투", filename: "portfolio-1.png" },
      { title: "신도", filename: "portfolio-10.png" },
    ];
    const portfolioMediaIds: string[] = [];

    for (const { title, filename } of portfolioItems) {
      const fileTitle = fileToTitleMap[filename] || title;
      const media = await prisma.media.upsert({
        where: { id: `media-portfolio-${title}` },
        update: {
          filename,
          filepath: `/images/work/${filename}`,
          altText: `포트폴리오 - ${fileTitle}`,
        },
        create: {
          id: `media-portfolio-${title}`,
          filename,
          filepath: `/images/work/${filename}`,
          mimeType: "image/png",
          size: 0,
          altText: `포트폴리오 - ${fileTitle}`,
        },
      });
      portfolioMediaIds.push(media.id);
      console.log(`✅ Portfolio Media created: ${title} (${filename})`);
    }

    // Create WorkPortfolios
    const workSection = await prisma.section.findUnique({
      where: { id: "home-section-work_portfolio" },
    });

    if (workSection && portfolioMediaIds.length > 0) {
      for (let i = 0; i < portfolioItems.length && i < portfolioMediaIds.length; i++) {
        await prisma.workPortfolio.upsert({
          where: {
            id: `work-portfolio-${i}`,
          },
          update: {
            title: portfolioItems[i].title,
            mediaId: portfolioMediaIds[i],
            category: "학생 작품",
            order: i,
          },
          create: {
            id: `work-portfolio-${i}`,
            sectionId: workSection.id,
            title: portfolioItems[i].title,
            category: "학생 작품",
            mediaId: portfolioMediaIds[i],
            order: i,
          },
        });
        console.log(`✅ WorkPortfolio created: ${portfolioItems[i].title}`);
      }
    }
  }

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
