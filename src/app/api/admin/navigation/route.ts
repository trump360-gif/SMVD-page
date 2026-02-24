import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuth, checkAdminAuthFast } from '@/lib/auth-check';
import {
  successResponse,
  errorResponse,
} from '@/lib/api-response';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const CreateNavigationSchema = z.object({
  label: z.string().min(1, '메뉴 이름은 필수입니다'),
  href: z.string().min(1, 'href는 필수입니다'),
  parentId: z.string().optional(),
});

/**
 * GET /api/admin/navigation
 * 모든 네비게이션 항목 조회 (order ASC)
 */
export async function GET(request: Request) {
  try {
    const authResult = await checkAdminAuthFast(request);
    if (!authResult.authenticated) return authResult.error;

    const items = await prisma.navigation.findMany({
      orderBy: { order: 'asc' },
    });

    return successResponse(items, '네비게이션 목록 조회 성공');
  } catch (error) {
    logger.error({ err: error, context: 'GET /api/admin/navigation' }, '네비게이션 조회 오류');
    return errorResponse('네비게이션 목록을 불러오는 중 오류가 발생했습니다', 'FETCH_ERROR', 500);
  }
}

/**
 * POST /api/admin/navigation
 * 새 네비게이션 항목 추가
 * - order: (마지막 항목의 order) + 1
 * - isActive: true (기본값)
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const validation = CreateNavigationSchema.safeParse(body);

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

    const data = validation.data;

    const lastItem = await prisma.navigation.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const nextOrder = (lastItem?.order ?? -1) + 1;

    const item = await prisma.navigation.create({
      data: {
        label: data.label,
        href: data.href,
        parentId: data.parentId ?? null,
        order: nextOrder,
        isActive: true,
      },
    });

    logger.info({ context: 'POST /api/admin/navigation' }, `네비게이션 항목 생성: ${item.id}`);
    return successResponse(item, '네비게이션 항목이 생성되었습니다', 201);
  } catch (error) {
    logger.error({ err: error, context: 'POST /api/admin/navigation' }, '네비게이션 생성 오류');
    return errorResponse('네비게이션 항목을 생성하는 중 오류가 발생했습니다', 'CREATE_ERROR', 500);
  }
}
