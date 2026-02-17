import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth-check';
import { prisma } from '@/lib/db';
import { UpdateHeaderConfigSchema } from '@/types/schemas';
import { logger } from '@/lib/logger';

// GET /api/admin/header-config - 헤더 설정 조회
export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const headerConfig = await prisma.headerConfig.findFirst({
      include: {
        logoImage: true,
        faviconImage: true,
      },
    });

    if (!headerConfig) {
      logger.info({ context: 'GET /api/admin/header-config' }, '헤더 설정이 없음 - 새로 생성');
      const newConfig = await prisma.headerConfig.create({
        data: {},
        include: {
          logoImage: true,
          faviconImage: true,
        },
      });
      return NextResponse.json({ success: true, data: newConfig });
    }

    logger.info({ context: 'GET /api/admin/header-config' }, '헤더 설정 조회 성공');
    return NextResponse.json({ success: true, data: headerConfig });
  } catch (error) {
    const message = error instanceof Error ? error.message : '헤더 설정 조회 실패';
    logger.error({ err: error, context: 'GET /api/admin/header-config' }, message);
    return NextResponse.json({ message }, { status: 500 });
  }
}

// PUT /api/admin/header-config - 헤더 설정 수정 (로고/파비콘 ID 업데이트)
export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const input = UpdateHeaderConfigSchema.parse(body);

    // 기존 HeaderConfig 찾기 또는 생성
    let headerConfig = await prisma.headerConfig.findFirst();
    if (!headerConfig) {
      headerConfig = await prisma.headerConfig.create({ data: {} });
    }

    // 업데이트
    const updated = await prisma.headerConfig.update({
      where: { id: headerConfig.id },
      data: {
        ...(input.logoImageId !== undefined && { logoImageId: input.logoImageId }),
        ...(input.faviconImageId !== undefined && { faviconImageId: input.faviconImageId }),
      },
      include: {
        logoImage: true,
        faviconImage: true,
      },
    });

    logger.info({ context: 'PUT /api/admin/header-config' }, '헤더 설정 수정 성공');
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : '헤더 설정 수정 실패';
    logger.error({ err: error, context: 'PUT /api/admin/header-config' }, message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
