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

  // ========================================
  // About Page CMS Data (NEW - 2026-02-15)
  // ========================================

  console.log("\n📚 Seeding About page data...");

  // Get About page (already created above)
  const aboutPage = await prisma.page.findUnique({
    where: { slug: "about" },
  });

  if (!aboutPage) {
    throw new Error("About page not found!");
  }

  // 1. ABOUT_INTRO Section
  await prisma.section.upsert({
    where: { id: "section-about-intro" },
    update: {},
    create: {
      id: "section-about-intro",
      pageId: aboutPage.id,
      type: "ABOUT_INTRO",
      title: "About SMVD",
      content: {
        title: "About SMVD",
        description:
          "시각·영상디자인과에서는 커뮤니케이션 시대의 다양한 매체를 통해 전달되는 시각정보의 효율성과\n심미성을 극대화 하는 것을 학습합니다.\n시각디자인의 이론과 실무를 연계하여 학습함으로서 문제 해결 능력과 창의적 표현력을\n고취하고 활용할 수 있는 인재를 배출합니다.",
        imageSrc: "/images/about/image 32.png",
      },
      order: 0,
    },
  });
  console.log("✅ ABOUT_INTRO section created");

  // 2. ABOUT_VISION Section
  await prisma.section.upsert({
    where: { id: "section-about-vision" },
    update: {},
    create: {
      id: "section-about-vision",
      pageId: aboutPage.id,
      type: "ABOUT_VISION",
      title: "Vision",
      content: {
        title: "Vision",
        content:
          "시각정보의 전달 및 상품과 서비스의 마케팅 전략에서 디자인의 역할이 강조되면서\n사회의 여러 분야에 걸쳐 디자인 전문인력에 대한 수요가 증가하고 있습니다.\n이에 발맞추어 학과에서는 디자인 기초 교육, 전공 교육, 응용 실습 및 프로젝트를 통해 종합적이고\n창의적인 사고를 지닌 시각디자이너를 양성하기 위해 노력하고 있습니다.\n특히 컴퓨터와 인터넷을 이용한 뉴미디어 디자인과 영상디자인 분야에서\n활동할 수 있는 진취적인 인재를 키워내고 있습니다.",
        chips: [
          "UX/UI",
          "Graghic",
          "Editorial",
          "Illustration",
          "Branding",
          "CM/CF",
          "Game",
        ],
      },
      order: 1,
    },
  });
  console.log("✅ ABOUT_VISION section created");

  // 3. ABOUT_HISTORY Section
  const timelineItems = [
    {
      year: "2021",
      description:
        "디자인학부로 통합되었던 학과가 시각영상디자인전공, 산업디자인전공,\n환경디자인학과로 나누어져 1학년 때부터 전공을 심화하여 학습할 수 있도록 개편",
    },
    {
      year: "2006",
      description:
        "3개 전공 (시각영상디자인전공, 산업디자인전공, 환경디자인전공)\n영역으로 통합 개편",
    },
    {
      year: "2002",
      description:
        "디자인학부내 6개 전공(시각정보디자인전공, 영상애니메이션전공,\n산업디자인전공, 실내디자인전공, 도시조경 건축 디자인전공, 건축디자인전공)으로\n세분화하여 전공제로 개편\n\n실시된 전국 디자인계열 대학 종합 평가에서 최우수 대학으로\n선정되는 성과를 거둠",
    },
    {
      year: "2000",
      description:
        "학과제를 학부제로 통합하면서 산업디자인전공, 영상애니메이션전공,\n환경디자인전공의 3개 세부전공으로 운영",
    },
    {
      year: "1997",
      description:
        "야간에 신설된 환경디자인학과가 미술대학으로 편입되면서\n산업디자인과, 환경디자인과 구조로 확대 운영",
    },
    {
      year: "1993",
      description:
        "9월 미술대학의 산업미술과에서 산업디자인과로 학과 명칭을 변경,\n시각디자인 분야와 제품디자인 분야로 세부전공을 운영",
    },
    {
      year: "1980",
      description: "12월 산업미술대학을 미술대학으로 명칭을 변경",
    },
    {
      year: "1973",
      description:
        "12월 응용미술과를 산업미술과 산업공예과로 분과하여\n산업미술대학을 신설",
    },
    { year: "1968", description: "응용 미술과로 변경" },
    { year: "1962", description: "문리과대학 생활미술과로 구체화" },
    { year: "1948", description: "문학부 미술학과가 설립" },
  ];

  await prisma.section.upsert({
    where: { id: "section-about-history" },
    update: {},
    create: {
      id: "section-about-history",
      pageId: aboutPage.id,
      type: "ABOUT_HISTORY",
      title: "History",
      content: {
        title: "History",
        introText:
          "숙명여자대학교 시각영상디자인과는 설립 이래 디지털 시대가 요구하는 창의적 시각 커뮤니케이션의 중심에서 인재를 배출해 왔습니다.\n축적된 전통과 혁신을 바탕으로 미래 디자인 교육을 선도하고 있습니다.",
        timelineItems,
      },
      order: 2,
    },
  });
  console.log("✅ ABOUT_HISTORY section created");

  // 4. Professor Data (4명)
  const professorsData = [
    {
      id: "prof-yun",
      name: "윤여종",
      title: "정교수",
      role: "professor",
      office: "미술대학 711호",
      email: ["zoneidea@sookmyung.ac.kr", "h7023@hanmail.net"],
      phone: "02-710-9688",
      major: "시각영상디자인",
      specialty: "브랜드 & 광고 디자인",
      badge: "Brand & Advertising",
      courses: {
        undergraduate: ["브랜드디자인", "광고디자인", "졸업프로젝트스튜디오"],
        graduate: ["시각영상디자인"],
      },
      biography: {
        cvText: "CV 다운로드",
        position: "숙명여자대학교 시각영상디자인학과 교수",
        education: [
          "• 홍익대학교 시각디자인과 및 동대학원 졸업",
          "• 대한민국 디자인전람회 초대디자이너",
        ],
        experience: [
          "• 평창동계올림픽/패럴림픽 예술포스터 수상",
          "• 대한민국 관광포스터 공모전 대통령상 수상",
          "• 한국방송 광고공사 광고공모전 대상 수상",
          "• 대한민국 디자인 전람회 산업자원부 장관상 수상",
          "• Asia Graphic Poster Triennale Best Designer",
          "• VIDAK 한국시각정보디자인협회 수석부회장 역임",
          "• KSBDA 한국기초조형학회 부회장 역임",
        ],
      },
      order: 0,
    },
    {
      id: "prof-kim",
      name: "김기영",
      title: "정교수",
      role: "professor",
      office: "미술대학 702호",
      email: ["juice@sookmyung.ac.kr"],
      phone: "02-710-9683",
      homepage: "https://smvd.sookmyung.ac.kr/?page_id=1033",
      major: "시각영상디자인",
      specialty: "영상 & 마케팅",
      badge: "Video & Marketing",
      courses: {
        undergraduate: [
          "영상콘텐츠디자인",
          "유튜브영상디자인",
          "졸업프로젝트스튜디오",
        ],
        graduate: ["시각영상디자인"],
      },
      biography: {
        cvText: "CV 다운로드",
        position: "숙명여자대학교 시각·영상디자인학과 교수",
        education: [
          "• 일본 무사시노미술대학 시각영상디자인학과 졸업",
          "• 일본 다마미술대학 대학원 미술연구과 영상 졸업",
        ],
        experience: [
          "• (주)제일기획 19기 공채입사",
          "• 삼성전자, 풀무원, 맥심커피 업무수행",
          "• (주) 하쿠호도제일 입사",
          "• SPC그룹 파리바게트 디자인고문",
          "• 국가브랜드 위원회, 정부통합디자인 GI(Government Identity) 전문위원",
          "• 신세계그룹 브랜드전략실 고문",
        ],
      },
      order: 1,
    },
    {
      id: "prof-lee",
      name: "이지선",
      title: "정교수",
      role: "professor",
      office: "미술대학 724호",
      email: ["jisunlee@sookmyung.ac.kr"],
      phone: "02-710-9684",
      homepage: "https://smvd.sookmyung.ac.kr/?page_id=1029",
      major: "시각영상디자인",
      specialty: "사용자 경험",
      badge: "User Experience",
      courses: {
        undergraduate: [
          "데이터시각화와정보디자인",
          "사용자경험디자인",
          "졸업프로젝트스튜디오",
        ],
        graduate: ["졸업프로젝트스튜디오"],
      },
      biography: {
        cvText: "CV 다운로드",
        position: "숙명여자대학교 시각·영상디자인학과 교수",
        education: [
          "• 서울대학교 디자인학 박사",
          "• New York University, Interactive Telecommunications Program, MPS 석사",
          "• Parsons School of Design, Design & Technology, 석사과정 이수",
          "• 숙명여자대학교 산업디자인과 학사",
        ],
        experience: [
          "• 숙명여자대학교 창의융합디자인연구소 소장",
          "• 카카오임팩트재단 이사",
          "• 디자인학회 상임이사",
          "• 빅데이터학회 이사",
        ],
      },
      order: 2,
    },
    {
      id: "prof-na",
      name: "나유미",
      title: "정교수",
      role: "professor",
      office: "미술대학 724호",
      email: ["yumina@sookmyung.ac.kr"],
      phone: "02-710-9685",
      homepage: "https://www.yumina.ai/",
      major: "시각영상디자인",
      specialty: "디지털 미디어",
      badge: "User Experience",
      courses: {
        undergraduate: [
          "데이터시각화와정보디자인",
          "사용자경험디자인",
          "졸업프로젝트스튜디오",
        ],
        graduate: ["시각영상디자인"],
      },
      biography: {
        cvText: "CV 다운로드",
        position: "숙명여자대학교 시각·영상디자인학과 교수",
        education: [
          "• 숙명여자대학교 시각영상디자인과 졸업",
          "• USC Roski School of Art and Design, MFA Design 졸업",
        ],
        experience: [
          "• LG전자 디자인경영센터 선행디자인 연구소 선임 연구원",
          "• 2025년 서울시청자미디어센터 캠퍼스온에어 ESG 영상 공모전 심사위원회",
          "• 25 강화 융합 프로젝트",
          "• 엔다이어트: AI기반 다이어트 관리 어플리케이션 컨셉 개발 프로젝트",
          "• Glub Next: Z세대를 위한 그룹 소셜미디어 어플리케이션 AI 융합 리뉴얼 프로젝트",
          "• 산한투자증권 산학 프로젝트. MZ세대를 위한 신한투자증권 서비스 UX/UI 디자인 가이드 (지도 책임자)",
          "• USC Roski X 3rd LA Project: AR 포스트카드 경험 디자인",
        ],
      },
      order: 3,
    },
  ];

  console.log("👨‍🏫 Creating professor data...");
  for (const profData of professorsData) {
    const professor = await prisma.people.upsert({
      where: { id: profData.id },
      update: profData,
      create: profData,
    });
    console.log(`✅ Professor created: ${professor.name}`);
  }

  // 5. Instructor Data (12명)
  const instructorsData = [
    {
      id: "inst-kim-ayoung",
      name: "김아영",
      title: "강사",
      role: "instructor",
      specialty: "기초그래픽디자인I",
      order: 0,
    },
    {
      id: "inst-shin-jiyoung",
      name: "신지영",
      title: "강사",
      role: "instructor",
      specialty: "일러스트레이션과스토리텔링디자인 I/II",
      order: 1,
    },
    {
      id: "inst-choi-hansol",
      name: "최한솔",
      title: "강사",
      role: "instructor",
      specialty: "기초그래픽디자인 I/II, 일러스트레이션과스토리텔링디자인 I/II",
      order: 2,
    },
    {
      id: "inst-jeon-hyewon",
      name: "전혜원",
      title: "강사",
      role: "instructor",
      specialty: "일러스트레이션과스토리텔링디자인 I/II",
      order: 3,
    },
    {
      id: "inst-jeong-seunghee",
      name: "정승희",
      title: "강사",
      role: "instructor",
      specialty: "일러스트레이션과스토리텔링디자인 I/II",
      order: 4,
    },
    {
      id: "inst-heo-jooyeon",
      name: "허주연",
      title: "강사",
      role: "instructor",
      specialty: "기초그래픽디자인 I/II",
      order: 5,
    },
    {
      id: "inst-kim-taeryong",
      name: "김태룡",
      title: "강사",
      role: "instructor",
      specialty: "타이포그래피디자인 I/II",
      order: 6,
    },
    {
      id: "inst-kwon-hyukjun",
      name: "권혁준",
      title: "강사",
      role: "instructor",
      specialty: "브랜드디자인 I/II",
      order: 7,
    },
    {
      id: "inst-kim-yeonji",
      name: "김연지",
      title: "강사",
      role: "instructor",
      specialty: "사용자경험디자인 I/II",
      order: 8,
    },
    {
      id: "inst-lee-juhyoung",
      name: "이주형",
      title: "강사",
      role: "instructor",
      specialty: "사용자경험디자인 I/II",
      order: 9,
    },
    {
      id: "inst-kim-doun",
      name: "김도운",
      title: "강사",
      role: "instructor",
      specialty: "사용자경험디자인 I/II",
      order: 10,
    },
    {
      id: "inst-jang-dayoon",
      name: "장다윤",
      title: "강사",
      role: "instructor",
      specialty: "모션디자인 I/II",
      order: 11,
    },
  ];

  console.log("👩‍🏫 Creating instructor data...");
  for (const instData of instructorsData) {
    const instructor = await prisma.people.upsert({
      where: { id: instData.id },
      update: instData,
      create: instData,
    });
    console.log(`✅ Instructor created: ${instructor.name}`);
  }

  // 6. ABOUT_PEOPLE Section (교수/강사 섹션 - 참조만)
  await prisma.section.upsert({
    where: { id: "section-about-people" },
    update: {},
    create: {
      id: "section-about-people",
      pageId: aboutPage.id,
      type: "ABOUT_PEOPLE",
      title: "Our People",
      content: {
        description: "교수진과 강사진 정보는 People 모델에서 관리됩니다.",
        note: "professor role로 4명, instructor role로 12명이 등록되어 있습니다.",
      },
      order: 3,
    },
  });
  console.log("✅ ABOUT_PEOPLE section created");

  console.log("🎉 About page seeding completed!");
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
