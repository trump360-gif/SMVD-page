import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@/generated/prisma';
import { checkAdminAuth } from '@/lib/auth-check';
import {
  successResponse,
  errorResponse,
} from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { UpdateFooterSchema } from '@/types/schemas';

/**
 * GET /api/admin/footer
 * Footer 데이터 전체 조회
 */
export async function GET() {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const footer = await prisma.footer.findFirst();

    if (!footer) {
      // Footer가 없으면 기본값으로 생성
      const created = await prisma.footer.create({
        data: {
          title: '숙명여자대학교 시각영상디자인과',
          socialLinks: Prisma.JsonNull,
        },
      });
      logger.info({ context: 'GET /api/admin/footer' }, 'Footer 기본 데이터 생성');
      return successResponse(created, 'Footer 조회 성공 (기본값 생성)');
    }

    return successResponse(footer, 'Footer 조회 성공');
  } catch (error) {
    logger.error({ err: error, context: 'GET /api/admin/footer' }, 'Footer 조회 오류');
    return errorResponse('Footer를 불러오는 중 오류가 발생했습니다', 'FETCH_ERROR', 500);
  }
}

/**
 * PUT /api/admin/footer
 * Footer 텍스트 필드 수정 (partial update)
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const validation = UpdateFooterSchema.safeParse(body);

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

    // 업데이트할 필드가 없는 경우
    if (Object.keys(data).length === 0) {
      return errorResponse('수정할 필드가 없습니다', 'VALIDATION_ERROR', 400);
    }

    // Footer가 없으면 생성, 있으면 수정
    const existing = await prisma.footer.findFirst();

    let updated;
    if (!existing) {
      updated = await prisma.footer.create({
        data: {
          title: data.title ?? '숙명여자대학교 시각영상디자인과',
          description: data.description,
          address: data.address,
          phone: data.phone,
          email: data.email,
          copyright: data.copyright,
          socialLinks: Prisma.JsonNull,
        },
      });
      logger.info({ context: 'PUT /api/admin/footer' }, 'Footer 생성');
    } else {
      updated = await prisma.footer.update({
        where: { id: existing.id },
        data,
      });
      logger.info({ context: 'PUT /api/admin/footer' }, `Footer 수정: ${existing.id}`);
    }

    return successResponse(updated, 'Footer가 수정되었습니다');
  } catch (error) {
    logger.error({ err: error, context: 'PUT /api/admin/footer' }, 'Footer 수정 오류');
    return errorResponse('Footer를 수정하는 중 오류가 발생했습니다', 'UPDATE_ERROR', 500);
  }
}
