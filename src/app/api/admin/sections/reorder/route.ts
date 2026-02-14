import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth-check';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const { sectionId, direction } = body;

    if (!sectionId || !['up', 'down'].includes(direction)) {
      return errorResponse('섹션 ID와 방향(up/down)이 필요합니다', 'INVALID_PARAMS', 400);
    }

    const section = await prisma.section.findUnique({
      where: { id: sectionId },
    });

    if (!section) {
      return errorResponse('섹션을 찾을 수 없습니다', 'NOT_FOUND', 404);
    }

    const pageId = section.pageId;

    if (direction === 'up') {
      // 현재 섹션보다 order가 작은 섹션 중 가장 큰 값을 찾음
      const prevSection = await prisma.section.findFirst({
        where: {
          pageId,
          order: { lt: section.order },
        },
        orderBy: { order: 'desc' },
      });

      if (prevSection) {
        // 두 섹션의 order 값을 교환
        await prisma.section.update({
          where: { id: section.id },
          data: { order: prevSection.order },
        });

        await prisma.section.update({
          where: { id: prevSection.id },
          data: { order: section.order },
        });
      }
    } else if (direction === 'down') {
      // 현재 섹션보다 order가 큰 섹션 중 가장 작은 값을 찾음
      const nextSection = await prisma.section.findFirst({
        where: {
          pageId,
          order: { gt: section.order },
        },
        orderBy: { order: 'asc' },
      });

      if (nextSection) {
        // 두 섹션의 order 값을 교환
        await prisma.section.update({
          where: { id: section.id },
          data: { order: nextSection.order },
        });

        await prisma.section.update({
          where: { id: nextSection.id },
          data: { order: section.order },
        });
      }
    }

    // 업데이트된 섹션 목록 반환
    const updatedSections = await prisma.section.findMany({
      where: { pageId },
      orderBy: { order: 'asc' },
      include: {
        exhibitionItems: {
          orderBy: { order: 'asc' },
          include: { media: true },
        },
        workPortfolios: {
          orderBy: { order: 'asc' },
          include: { media: true },
        },
      },
    });

    return successResponse(updatedSections, '섹션 순서가 변경되었습니다');
  } catch (error) {
    console.error('섹션 순서 변경 오류:', error);
    return errorResponse('섹션 순서 변경 실패', 'UPDATE_ERROR', 500);
  }
}
