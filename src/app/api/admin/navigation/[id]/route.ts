import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth-check';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api-response';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const UpdateNavigationSchema = z.object({
  label: z.string().min(1, '메뉴 이름은 필수입니다').optional(),
  href: z.string().min(1, 'href는 필수입니다').optional(),
  parentId: z.string().nullable().optional(),
});

/**
 * PUT /api/admin/navigation/:id
 * 특정 네비게이션 항목 수정
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { id } = await params;
    const body = await request.json();

    const validation = UpdateNavigationSchema.safeParse(body);
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

    const existing = await prisma.navigation.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse('네비게이션 항목');
    }

    const updated = await prisma.navigation.update({
      where: { id },
      data: validation.data,
    });

    logger.info({ context: 'PUT /api/admin/navigation/:id' }, `네비게이션 항목 수정: ${id}`);
    return successResponse(updated, '네비게이션 항목이 수정되었습니다');
  } catch (error) {
    logger.error({ err: error, context: 'PUT /api/admin/navigation/:id' }, '네비게이션 수정 오류');
    return errorResponse('네비게이션 항목을 수정하는 중 오류가 발생했습니다', 'UPDATE_ERROR', 500);
  }
}

/**
 * DELETE /api/admin/navigation/:id
 * 특정 네비게이션 항목 삭제
 */
export async function DELETE(
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

    await prisma.navigation.delete({ where: { id } });

    logger.info({ context: 'DELETE /api/admin/navigation/:id' }, `네비게이션 항목 삭제: ${id}`);
    return successResponse(null, '네비게이션 항목이 삭제되었습니다');
  } catch (error) {
    logger.error({ err: error, context: 'DELETE /api/admin/navigation/:id' }, '네비게이션 삭제 오류');
    return errorResponse('네비게이션 항목을 삭제하는 중 오류가 발생했습니다', 'DELETE_ERROR', 500);
  }
}
