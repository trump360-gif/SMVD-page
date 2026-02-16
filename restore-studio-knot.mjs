import { PrismaClient } from "./src/generated/prisma/index.js";

const prisma = new PrismaClient();

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

try {
  console.log("🔄 STUDIO KNOT 데이터 복원 중...\n");
  
  const studioKnot = await prisma.workProject.findFirst({
    where: { title: "STUDIO KNOT" }
  });

  if (!studioKnot) {
    console.log("❌ STUDIO KNOT 프로젝트를 찾을 수 없습니다");
    process.exit(1);
  }

  const updated = await prisma.workProject.update({
    where: { id: studioKnot.id },
    data: { content: studioKnotBlogContent }
  });

  console.log("✅ 복원 완료!\n");
  console.log(`   📦 블록: ${updated.content.blocks.length}개`);
  updated.content.blocks.forEach((block, idx) => {
    console.log(`      ${idx + 1}. ${block.type}`);
  });
  console.log(`\n   📐 행 구성: ${updated.content.rowConfig.length}개 행`);
  console.log("\n💡 팁: 브라우저를 새로고침하면 변경사항이 반영됩니다!");

  process.exit(0);
} catch (error) {
  console.error("❌ 에러:", error.message);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
