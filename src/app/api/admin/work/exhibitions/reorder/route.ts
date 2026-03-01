import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth-check';
import { successResponse, errorResponse } from '@/lib/api-response';
import { z } from 'zod';

const BatchReorderSchema = z.object({
  items: z.array(z.object({
    id: z.string().min(1),
    order: z.number().int().min(0),
  })).min(1),
});

/**
 * PUT /api/admin/work/exhibitions/reorder
 * Work 전시 순서 일괄 변경 (batch, 단일 트랜잭션)
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const validation = BatchReorderSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('유효하지 않은 요청입니다', 'VALIDATION_ERROR', 400);
    }

    const { items } = validation.data;

    // Verify all exhibitions exist
    const ids = items.map(i => i.id);
    const existing = await prisma.workExhibition.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    if (existing.length !== ids.length) {
      return errorResponse('일부 전시를 찾을 수 없습니다', 'NOT_FOUND', 404);
    }

    // Single transaction with direct updates (order is not unique)
    await prisma.$transaction(
      items.map(item =>
        prisma.workExhibition.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return successResponse(null, '순서가 일괄 변경되었습니다');
  } catch (error) {
    console.error('전시 순서 변경 오류:', error);
    return errorResponse('순서 변경 중 오류가 발생했습니다', 'REORDER_ERROR', 500);
  }
}
