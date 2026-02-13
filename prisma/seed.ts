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
        slug: page.slug,
        title: page.title,
        description: page.description,
        order: page.order,
      },
    });
    console.log(`✅ Page created: ${createdPage.slug}`);
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
