import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth-check';
import { successResponse, errorResponse } from '@/lib/api-response';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const ReorderNavigationSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1, 'id는 필수입니다'),
      order: z.number().int().min(0, 'order는 0 이상의 정수여야 합니다'),
    })
  ).min(1, '최소 1개 이상의 항목이 필요합니다'),
});

/**
 * PATCH /api/admin/navigation/reorder
 * 모든 네비게이션 항목 순서 일괄 변경 (Drag & Drop 용)
 * - 트랜잭션 기반으로 일괄 업데이트
 */
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const validation = ReorderNavigationSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return errorResponse(
        '입력값 검증 실패: ' +
          Object.entries(errors)
            .map(([k, v]) => `${k}: ${(v as string[])?.[0]}`)
            .join(', '),
        'VALIDATION_ERROR',
        400
      );
    }

    const { items } = validation.data;

    // 트랜잭션으로 일괄 업데이트
    await prisma.$transaction(
      items.map(({ id, order }) =>
        prisma.navigation.update({
          where: { id },
          data: { order },
        })
      )
    );

    const updated = await prisma.navigation.findMany({
      orderBy: { order: 'asc' },
    });

    logger.info(
      { context: 'PATCH /api/admin/navigation/reorder' },
      `네비게이션 순서 변경: ${items.length}개 항목`
    );
    return successResponse(updated, '네비게이션 순서가 변경되었습니다');
  } catch (error) {
    logger.error({ err: error, context: 'PATCH /api/admin/navigation/reorder' }, '네비게이션 순서 변경 오류');
    return errorResponse('네비게이션 순서를 변경하는 중 오류가 발생했습니다', 'REORDER_ERROR', 500);
  }
}
