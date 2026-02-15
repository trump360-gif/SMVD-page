import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth-check';
import { successResponse, errorResponse } from '@/lib/api-response';
import { z } from 'zod';

const ReorderSchema = z.object({
  exhibitionId: z.string().min(1),
  newOrder: z.number().int().min(0),
});

/**
 * PUT /api/admin/work/exhibitions/reorder
 * Work 전시 순서 변경 (트랜잭션 기반)
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const validation = ReorderSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('유효하지 않은 요청입니다', 'VALIDATION_ERROR', 400);
    }

    const { exhibitionId, newOrder } = validation.data;

    const currentExhibition = await prisma.workExhibition.findUnique({
      where: { id: exhibitionId },
    });

    if (!currentExhibition) {
      return errorResponse('전시를 찾을 수 없습니다', 'NOT_FOUND', 404);
    }

    await prisma.$transaction(async (tx) => {
      const allExhibitions = await tx.workExhibition.findMany({
        orderBy: { order: 'asc' },
      });

      // First pass: temporary negative orders
      let idx = 0;
      for (const exhibition of allExhibitions) {
        if (exhibition.id === exhibitionId) continue;
        if (idx === newOrder) idx++;

        await tx.workExhibition.update({
          where: { id: exhibition.id },
          data: { order: -(idx + 100) },
        });
        idx++;
      }

      await tx.workExhibition.update({
        where: { id: exhibitionId },
        data: { order: -(newOrder + 100) },
      });

      // Second pass: final positive orders
      idx = 0;
      for (const exhibition of allExhibitions) {
        if (exhibition.id === exhibitionId) continue;
        if (idx === newOrder) idx++;

        await tx.workExhibition.update({
          where: { id: exhibition.id },
          data: { order: idx },
        });
        idx++;
      }

      await tx.workExhibition.update({
        where: { id: exhibitionId },
        data: { order: newOrder },
      });
    });

    const updated = await prisma.workExhibition.findUnique({
      where: { id: exhibitionId },
    });

    return successResponse(updated, '순서가 변경되었습니다');
  } catch (error) {
    console.error('전시 순서 변경 오류:', error);
    return errorResponse('순서 변경 중 오류가 발생했습니다', 'REORDER_ERROR', 500);
  }
}
