import { prisma } from '@/lib/db';
import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Simple protection: check secret parameter
    const secret = req.nextUrl.searchParams.get('secret');
    if (secret !== 'fix-work-9-2026') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔍 Finding /work/9 in database...');

    const project = await prisma.workProject.findFirst({
      where: { slug: '9' }
    });

    if (!project) {
      return NextResponse.json(
        { message: '/work/9 not found in DB - using hardcoded data is fine' },
        { status: 200 }
      );
    }

    console.log('📋 Current /work/9 data:', {
      id: project.id,
      title: project.title,
      descriptionType: typeof project.description,
    });

    // Check if description is object (wrong)
    if (typeof project.description === 'object' && project.description !== null) {
      console.log('⚠️  Description is a JSON object! Fixing...');

      // Correct description (from hardcoded work-details.ts)
      const correctDescription = `STUDIO KNOT는 입지 않는 옷에 새로운 쓰임을 더해 반려견 장난감으로 재탄생시키는 업사이클링 터그 토이 브랜드입니다. 쉽게 버려지는 의류와 빠르게 닳는 반려견 장난감의 순환 구조를 개선하며, 보호자의 체취가 남은 옷으로 만든 토이는 정서적 가치를 담은 지속가능한 대안을 제시합니다.`;

      // Update to correct description
      const updated = await prisma.workProject.update({
        where: { id: project.id },
        data: {
          description: correctDescription
        }
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Fixed /work/9 description',
          updated: {
            id: updated.id,
            title: updated.title,
            description: updated.description.substring(0, 100) + '...'
          }
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'Description is already a string - no fix needed' },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
