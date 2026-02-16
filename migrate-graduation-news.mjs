import { PrismaClient } from "./src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function migrateGraduationNews() {
  try {
    console.log('🔄 졸업전시회 News 마이그레이션 시작...\n');
    
    // 졸업전시회 조회
    const news = await prisma.newsEvent.findFirst({
      where: { title: { contains: '졸업전시회' } }
    });
    
    if (!news) {
      console.error('❌ 졸업전시회를 찾을 수 없습니다.');
      return;
    }
    
    const oldContent = news.content || {};
    
    console.log('📋 변환 전:');
    console.log(`  - Gallery structure: ${Object.keys(oldContent.gallery || {}).length}개 이미지`);
    console.log(`  - Title: ${oldContent.introTitle}`);
    console.log(`  - Text: ${oldContent.introText?.substring(0, 50)}...`);
    
    // BlockEditor 구조로 변환
    const galleryImages = [];
    const gallery = oldContent.gallery || {};
    
    // main 이미지는 hero-section에서 사용
    // 나머지 이미지들을 gallery block으로 변환
    Object.entries(gallery).forEach(([key, url]) => {
      if (key !== 'main' && key !== 'layout' && typeof url === 'string') {
        galleryImages.push({
          id: `gallery-${key}-${Date.now()}`,
          url: url
        });
      }
    });
    
    const newContent = {
      blocks: [
        {
          id: `hero-section-${Date.now()}`,
          type: 'hero-section',
          order: 0,
          
          // Image from main gallery
          url: gallery.main || '',
          alt: oldContent.introTitle || '',
          
          // Title from introTitle
          title: oldContent.introTitle || '',
          author: '',
          email: '',
          
          // Default styling
          titleFontSize: 60,
          authorFontSize: 14,
          gap: 24,
          titleFontWeight: '700',
          authorFontWeight: '500',
          emailFontWeight: '400',
          titleColor: '#1b1d1f',
          authorColor: '#1b1d1f',
          emailColor: '#7b828e',
          
          // Overlay
          overlayPosition: 'bottom-left',
          overlayOpacity: 0.8,
          overlayBackground: 'rgba(0, 0, 0, 0.3)'
        },
        {
          id: `text-${Date.now()}`,
          type: 'text',
          order: 1,
          content: oldContent.introText || '',
          fontSize: 18,
          fontWeight: '400',
          color: '#1b1d1f',
          lineHeight: 1.8
        }
      ],
      version: '1.0'
    };
    
    // Gallery images가 있으면 추가
    if (galleryImages.length > 0) {
      newContent.blocks.push({
        id: `gallery-${Date.now()}`,
        type: 'work-gallery',
        order: 2,
        images: galleryImages,
        imageLayout: 1
      });
    }
    
    // DB 업데이트
    const updated = await prisma.newsEvent.update({
      where: { id: news.id },
      data: { content: newContent }
    });
    
    console.log('\n✅ 변환 후:');
    console.log(`  - hero-section (order: 0) ✨`);
    console.log(`  - text (order: 1)`);
    if (galleryImages.length > 0) {
      console.log(`  - work-gallery (order: 2) - ${galleryImages.length}개 이미지`);
    }
    
    console.log('\n🎉 마이그레이션 완료!\n');
    console.log('📝 변환된 구조:');
    console.log(JSON.stringify(newContent, null, 2).substring(0, 500) + '...');
    
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateGraduationNews();
