import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth-check';
import { successResponse, errorResponse } from '@/lib/api-response';
import { z } from 'zod';

const BatchReorderSchema = z.object({
  pageId: z.string().min(1),
  sections: z.array(
    z.object({
      id: z.string().min(1),
      order: z.number().int().min(0),
    })
  ).min(1),
});

/**
 * PUT /api/admin/sections/batch-reorder
 * 섹션 순서 일괄 변경 (모달에서 드래그 후 저장)
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const validation = BatchReorderSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        '입력값이 올바르지 않습니다',
        'VALIDATION_ERROR',
        400
      );
    }

    const { pageId, sections } = validation.data;

    // Verify page exists
    const page = await prisma.page.findUnique({
      where: { id: pageId },
    });

    if (!page) {
      return errorResponse('페이지를 찾을 수 없습니다', 'NOT_FOUND', 404);
    }

    // Update all section orders in a transaction
    await prisma.$transaction(
      sections.map((item) =>
        prisma.section.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    // Return updated sections
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
    console.error('섹션 일괄 순서 변경 오류:', error);
    return errorResponse(
      '섹션 순서 변경에 실패했습니다',
      'UPDATE_ERROR',
      500
    );
  }
}
