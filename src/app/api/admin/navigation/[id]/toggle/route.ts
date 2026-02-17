import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth-check';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api-response';
import { logger } from '@/lib/logger';

/**
 * PATCH /api/admin/navigation/:id/toggle
 * 네비게이션 항목 활성화/비활성화 토글
 * - isActive = !isActive
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { id } = await params;

    const existing = await prisma.navigation.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse('네비게이션 항목');
    }

    const updated = await prisma.navigation.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });

    const state = updated.isActive ? '활성화' : '비활성화';
    logger.info(
      { context: 'PATCH /api/admin/navigation/:id/toggle' },
      `네비게이션 항목 ${state}: ${id}`
    );
    return successResponse(updated, `네비게이션 항목이 ${state}되었습니다`);
  } catch (error) {
    logger.error({ err: error, context: 'PATCH /api/admin/navigation/:id/toggle' }, '네비게이션 토글 오류');
    return errorResponse('네비게이션 항목 상태를 변경하는 중 오류가 발생했습니다', 'TOGGLE_ERROR', 500);
  }
}
