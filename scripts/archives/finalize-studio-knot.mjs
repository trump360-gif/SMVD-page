import { PrismaClient } from "./src/generated/prisma/index.js";

const prisma = new PrismaClient();

const project = await prisma.workProject.update({
  where: { slug: '9' }, // STUDIO KNOT slug
  data: {
    hero_image: '/images/work/knot/hero.png', // Set heroImage explicitly
    content: {
      blocks: [
        {
          id: 'hero-section-1771167925547',
          type: 'hero-section',
          order: 0,
          url: '/images/work/knot/hero.png',
          alt: 'STUDIO KNOT',
          title: 'STUDIO KNOT',
          author: '노하린',
          email: 'havein6@gmail.com',
          titleFontSize: 60,
          authorFontSize: 14,
          gap: 24,
          titleFontWeight: '700',
          authorFontWeight: '500',
          emailFontWeight: '400',
          titleColor: '#1b1d1f',
          authorColor: '#1b1d1f',
          emailColor: '#7b828e',
          overlayPosition: 'bottom-left',
          overlayOpacity: 0.8,
          overlayBackground: 'rgba(0, 0, 0, 0.3)'
        },
        {
          id: 'block-1771162397281-i2seenbtf',
          type: 'text',
          order: 1,
          content: 'STUDIO KNOT는 입지 않는 옷에 새로운 쓰임을 더해 반려견 장난감으로 재탄생시키는 업사이클링 터그 토이 브랜드입니다.\n쉽게 버려지는 의류와 빠르게 닳는 반려견 장난감의 순환 구조를 개선하며, 보호자의 체취가 남은 옷으로 만든 토이는\n정서적 가치를 담은 지속가능한 대안을 제시합니다.',
          fontSize: 18,
          fontWeight: '400',
          color: '#1b1d1f',
          lineHeight: 1.8
        },
        {
          id: 'block-1771162397281-te4kovzo7',
          type: 'work-gallery',
          order: 2,
          images: [
            { id: 'block-1771162397281-okn8b6ftd', url: '/images/work/knot/text-below.png' },
            { id: 'block-1771162397281-z7s9nu8fw', url: '/images/work/knot/gallery-1.png' },
            { id: 'block-1771162397281-58r9su5f4', url: '/images/work/knot/gallery-2.png' },
            { id: 'block-1771162397281-wq7todnkm', url: '/images/work/knot/gallery-3.png' },
            { id: 'block-1771162397281-k1aozr4ug', url: '/images/work/knot/gallery-4.png' },
            { id: 'block-1771162397281-3zvf75pfl', url: '/images/work/knot/gallery-5.png' },
            { id: 'block-1771162397281-u3aty4f8p', url: '/images/work/knot/gallery-6.png' },
            { id: 'block-1771162397281-d0mgptt8i', url: '/images/work/knot/gallery-7.png' },
            { id: 'block-1771162397281-ziclhqacd', url: '/images/work/knot/gallery-8.png' }
          ],
          imageLayout: 1
        }
      ],
      version: '1.0'
    }
  }
});

console.log('✅ STUDIO KNOT 프로젝트 업데이트 완료!');
console.log('📋 최종 구조:');
console.log(JSON.stringify(project.content, null, 2));

await prisma.$disconnect();
