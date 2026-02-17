import { PrismaClient } from "./src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function migrateHeroSectionBlock() {
  try {
    console.log('🔄 HeroSectionBlock 마이그레이션 시작...\n');
    
    // STUDIO KNOT 조회
    const project = await prisma.workProject.findFirst({
      where: { title: 'STUDIO KNOT' }
    });
    
    if (!project) {
      console.error('❌ STUDIO KNOT을 찾을 수 없습니다.');
      return;
    }
    
    const content = project.content || { blocks: [], version: '1.0' };
    const blocks = content.blocks || [];
    
    // hero-image와 work-title 찾기
    const heroImageIndex = blocks.findIndex(b => b.type === 'hero-image');
    const workTitleIndex = blocks.findIndex(b => b.type === 'work-title');
    
    if (heroImageIndex === -1 || workTitleIndex === -1) {
      console.log('⚠️  hero-image 또는 work-title을 찾을 수 없습니다.');
      return;
    }
    
    const heroImageBlock = blocks[heroImageIndex];
    const workTitleBlock = blocks[workTitleIndex];
    
    console.log('📋 변환 전:');
    console.log(`  - hero-image (order: ${heroImageBlock.order})`);
    console.log(`  - work-title (order: ${workTitleBlock.order})`);
    
    // HeroSectionBlock 생성
    const heroSectionBlock = {
      id: `hero-section-${Date.now()}`,
      type: 'hero-section',
      order: Math.min(heroImageBlock.order, workTitleBlock.order),
      
      // Image properties
      url: heroImageBlock.url,
      alt: heroImageBlock.alt || '',
      
      // Title properties
      title: workTitleBlock.title || '',
      author: workTitleBlock.author || '',
      email: workTitleBlock.email || '',
      
      // Title styling
      titleFontSize: workTitleBlock.titleFontSize || 60,
      authorFontSize: workTitleBlock.authorFontSize || 14,
      gap: workTitleBlock.gap || 24,
      titleFontWeight: workTitleBlock.titleFontWeight || '700',
      authorFontWeight: workTitleBlock.authorFontWeight || '500',
      emailFontWeight: workTitleBlock.emailFontWeight || '400',
      titleColor: workTitleBlock.titleColor || '#1b1d1f',
      authorColor: workTitleBlock.authorColor || '#1b1d1f',
      emailColor: workTitleBlock.emailColor || '#7b828e',
      
      // Overlay styling (기본값)
      overlayPosition: 'bottom-left',
      overlayOpacity: 0.8,
      overlayBackground: 'rgba(0, 0, 0, 0.3)'
    };
    
    // 기존 hero-image와 work-title 제거하고 hero-section 추가
    const newBlocks = blocks.filter(b => b.type !== 'hero-image' && b.type !== 'work-title');
    newBlocks.unshift(heroSectionBlock);
    
    // order 재정렬
    newBlocks.forEach((block, index) => {
      if (index !== heroImageIndex && index !== workTitleIndex) {
        block.order = index;
      }
    });
    
    // DB 업데이트
    const updated = await prisma.workProject.update({
      where: { id: project.id },
      data: {
        content: {
          blocks: newBlocks,
          version: '1.0'
        }
      }
    });
    
    console.log('\n✅ 변환 후:');
    console.log(`  - hero-section (order: 0) - 통합됨`);
    console.log(`  - 나머지 ${newBlocks.length - 1}개 블록 유지`);
    
    console.log('\n🎉 마이그레이션 완료!\n');
    console.log('📝 변환된 hero-section 구조:');
    console.log(JSON.stringify(heroSectionBlock, null, 2));
    
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateHeroSectionBlock();
