import { prisma } from '../src/lib/db';

/**
 * Add image node to /news/5 (2024 졸업전시회)
 * Fixes the "이미지 살리라고 몇 번 말하지 내가?" issue
 */
async function addImageToNews5() {
  try {
    console.log('🔍 Finding /news/5 article...');

    const article = await prisma.newsEvent.findUnique({
      where: { slug: '5' }
    });

    if (!article) {
      console.error('❌ Article /news/5 not found');
      return;
    }

    console.log('✅ Found:', article.title);
    console.log('Current content type:', typeof article.content);

    // Parse existing content
    let content = article.content;
    if (typeof content === 'string') {
      try {
        content = JSON.parse(content);
      } catch (e) {
        console.error('Failed to parse content:', e);
        return;
      }
    }

    if (!content || typeof content !== 'object') {
      console.error('Invalid content structure');
      return;
    }

    const doc = content as any;

    // Check if already has images
    const hasImages = doc.content?.some((node: any) => node.type === 'image');
    if (hasImages) {
      console.log('⚠️ Article already has images');
      return;
    }

    // Add image node after first paragraph
    const imageNode = {
      type: 'image',
      attrs: {
        src: '/images/news/graduation-exhibition-2024.jpg',
        alt: '2024 졸업전시회 개막식',
        align: 'center'
      }
    };

    // Insert image after first paragraph
    const firstParaIndex = doc.content.findIndex((node: any) => node.type === 'paragraph');
    if (firstParaIndex >= 0) {
      doc.content.splice(firstParaIndex + 1, 0, imageNode);
    } else {
      // No paragraph found, add at beginning
      doc.content.unshift(imageNode);
    }

    console.log('📸 Adding image node...');
    console.log('New structure:', JSON.stringify(doc, null, 2).slice(0, 200) + '...');

    // Update article
    await prisma.newsEvent.update({
      where: { slug: '5' },
      data: {
        content: doc as any
      }
    });

    console.log('✅ Image added to /news/5');
    console.log('🔄 Clearing ISR cache...');

    // Clear ISR cache
    const response = await fetch('http://localhost:3000/api/revalidate?path=/news/5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => null);

    if (response?.ok) {
      console.log('✅ ISR cache cleared');
    }

    console.log('\n✨ Done! Visit http://localhost:3000/news/5 to see the image');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addImageToNews5();
