import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fix /work/9 description - restore from hardcoded data
 * The DB has JSON in description field instead of text
 */
async function fixWork9Description() {
  try {
    console.log('🔍 Finding /work/9 in database...');

    const project = await prisma.workProject.findFirst({
      where: { slug: '9' }
    });

    if (!project) {
      console.log('ℹ️  /work/9 not found in DB - using hardcoded data is fine');
      return;
    }

    console.log('📋 Current /work/9 data:');
    console.log('  ID:', project.id);
    console.log('  Title:', project.title);
    console.log('  Description type:', typeof project.description);
    console.log('  Description (first 200 chars):',
      typeof project.description === 'string'
        ? project.description.substring(0, 200)
        : JSON.stringify(project.description).substring(0, 200)
    );

    // Check if description is object (wrong)
    if (typeof project.description === 'object' && project.description !== null) {
      console.log('\n⚠️  Description is a JSON object! This is wrong.');
      console.log('🔄 Fixing...\n');

      // Correct description (from hardcoded work-details.ts)
      const correctDescription = `STUDIO KNOT는 입지 않는 옷에 새로운 쓰임을 더해 반려견 장난감으로 재탄생시키는 업사이클링 터그 토이 브랜드입니다. 쉽게 버려지는 의류와 빠르게 닳는 반려견 장난감의 순환 구조를 개선하며, 보호자의 체취가 남은 옷으로 만든 토이는 정서적 가치를 담은 지속가능한 대안을 제시합니다.`;

      // Update to correct description
      const updated = await prisma.workProject.update({
        where: { id: project.id },
        data: {
          description: correctDescription
        }
      });

      console.log('✅ Updated /work/9 description:');
      console.log('  New description (first 100 chars):', updated.description.substring(0, 100));
      console.log('\n✨ Fix complete!');
    } else if (typeof project.description === 'string') {
      console.log('\n✅ Description is already a string - no fix needed');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixWork9Description();
