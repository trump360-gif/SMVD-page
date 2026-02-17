import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth-check';
import { successResponse, errorResponse } from '@/lib/api-response';
import { logger } from "@/lib/logger";

/**
 * POST /api/admin/exhibition-items
 * 새로운 전시 아이템 생성
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const { sectionId, year, mediaId } = body;

    // 필수 필드 확인
    if (!sectionId) {
      return errorResponse('섹션 ID가 필요합니다', 'MISSING_SECTION_ID', 400);
    }

    if (!year) {
      return errorResponse('연도가 필요합니다', 'MISSING_YEAR', 400);
    }

    if (!mediaId) {
      return errorResponse('미디어 ID가 필요합니다', 'MISSING_MEDIA', 400);
    }

    // 섹션 존재 확인
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
    });

    if (!section) {
      return errorResponse('섹션을 찾을 수 없습니다', 'SECTION_NOT_FOUND', 404);
    }

    // 미디어 존재 확인
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      return errorResponse('미디어를 찾을 수 없습니다', 'MEDIA_NOT_FOUND', 404);
    }

    // order 자동 계산 (마지막 order + 1)
    const lastItem = await prisma.exhibitionItem.findFirst({
      where: { sectionId },
      orderBy: { order: 'desc' },
    });

    const order = lastItem ? lastItem.order + 1 : 0;

    // 전시 아이템 생성
    const item = await prisma.exhibitionItem.create({
      data: {
        sectionId,
        year,
        mediaId,
        order,
      },
      include: { media: true },
    });

    return successResponse(item, '전시 아이템이 생성되었습니다', 201);
  } catch (error) {
    logger.error({ err: error, context: 'POST /api/admin/exhibition-items' }, '전시 아이템 생성 오류');
    return errorResponse('전시 아이템 생성 실패', 'CREATE_ERROR', 500);
  }
}

/**
 * PUT /api/admin/exhibition-items
 * 전시 아이템 업데이트
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const { itemId, year, mediaId } = body;

    if (!itemId) {
      return errorResponse('아이템 ID가 필요합니다', 'MISSING_ID', 400);
    }

    if (!year) {
      return errorResponse('연도가 필요합니다', 'MISSING_YEAR', 400);
    }

    if (!mediaId) {
      return errorResponse('미디어 ID가 필요합니다', 'MISSING_MEDIA', 400);
    }

    const item = await prisma.exhibitionItem.findUnique({
      where: { id: itemId },
      include: { media: true },
    });

    if (!item) {
      return errorResponse('아이템을 찾을 수 없습니다', 'NOT_FOUND', 404);
    }

    const media = await prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      return errorResponse('미디어를 찾을 수 없습니다', 'MEDIA_NOT_FOUND', 404);
    }

    // 아이템 업데이트
    const updatedItem = await prisma.exhibitionItem.update({
      where: { id: itemId },
      data: {
        year,
        mediaId,
      },
      include: { media: true },
    });

    return successResponse(updatedItem, '전시 아이템이 업데이트되었습니다');
  } catch (error) {
    logger.error({ err: error, context: 'PUT /api/admin/exhibition-items' }, '전시 아이템 업데이트 오류');
    return errorResponse('전시 아이템 업데이트 실패', 'UPDATE_ERROR', 500);
  }
}

/**
 * DELETE /api/admin/exhibition-items?id={itemId}
 * 전시 아이템 삭제
 */
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const itemId = request.nextUrl.searchParams.get('id');
    if (!itemId) {
      return errorResponse('아이템 ID가 필요합니다', 'MISSING_ID', 400);
    }

    // 아이템 존재 확인
    const item = await prisma.exhibitionItem.findUnique({
      where: { id: itemId },
      include: { media: true },
    });

    if (!item) {
      return errorResponse('아이템을 찾을 수 없습니다', 'NOT_FOUND', 404);
    }

    // 미디어가 다른 곳에서 사용되는지 확인
    const mediaUsageCount = await prisma.exhibitionItem.count({
      where: { mediaId: item.mediaId, id: { not: itemId } },
    });

    const portfolioUsageCount = await prisma.workPortfolio.count({
      where: { mediaId: item.mediaId },
    });

    const isMediaUsedElsewhere = mediaUsageCount > 0 || portfolioUsageCount > 0;

    // 아이템 삭제
    await prisma.exhibitionItem.delete({
      where: { id: itemId },
    });

    // 미디어가 다른 곳에서 사용되지 않으면 함께 삭제
    if (!isMediaUsedElsewhere && item.media) {
      try {
        await prisma.media.delete({
          where: { id: item.mediaId },
        });
      } catch (error) {
        if (process.env.DEBUG) console.warn('미디어 삭제 실패:', error);
      }
    }

    return successResponse(null, '전시 아이템이 삭제되었습니다');
  } catch (error) {
    logger.error({ err: error, context: 'DELETE /api/admin/exhibition-items' }, '전시 아이템 삭제 오류');
    return errorResponse('전시 아이템 삭제 실패', 'DELETE_ERROR', 500);
  }
}
