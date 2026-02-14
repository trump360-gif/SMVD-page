import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth/auth';

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    // Home 페이지 찾기
    let homePage = await prisma.page.findUnique({
      where: { slug: 'home' },
    });

    // Home 페이지 없으면 생성
    if (!homePage) {
      homePage = await prisma.page.create({
        data: {
          slug: 'home',
          title: 'Home',
          description: 'SMVD Home Page',
          order: 0,
        },
      });
    }

    // 기존 섹션 확인
    const existingSections = await prisma.section.findMany({
      where: { pageId: homePage.id },
    });

    const requiredSections = [
      {
        type: 'EXHIBITION_SECTION',
        title: '전시회 섹션',
      },
      {
        type: 'WORK_PORTFOLIO',
        title: '작품 포트폴리오 섹션',
      },
      {
        type: 'HOME_ABOUT',
        title: '소개 섹션',
        content: {
          title: 'About SMVD',
          visionLines: [
            'FROM VISUAL DELIVERY',
            'TO SYSTEMIC SOLUTIONS',
            'SOLVING PROBLEMS,',
            'SHAPING THE FUTURE OF VISUALS',
          ],
        },
      },
    ];

    const createdSections = [];

    // 누락된 섹션 생성
    for (const required of requiredSections) {
      const exists = existingSections.some((s) => s.type === required.type);

      if (!exists) {
        const order = existingSections.filter((s) =>
          s.type.includes(required.type)
        ).length;

        const section = await prisma.section.create({
          data: {
            pageId: homePage.id,
            type: required.type as any,
            title: required.title,
            content: (required as any).content || {},
            order,
          },
        });

        createdSections.push({
          id: section.id,
          type: section.type,
          title: section.title,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: '섹션 초기화 완료',
      homePageId: homePage.id,
      createdSections,
      totalSections: existingSections.length + createdSections.length,
    });
  } catch (error) {
    console.error('섹션 초기화 에러:', error);
    return NextResponse.json(
      {
        success: false,
        message: '섹션 초기화 실패',
        error: error instanceof Error ? error.message : '알 수 없는 에러',
      },
      { status: 500 }
    );
  }
}
