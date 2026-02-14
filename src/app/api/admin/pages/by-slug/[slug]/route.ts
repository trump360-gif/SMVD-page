import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth-check';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api-response';

/**
 * GET /api/admin/pages/by-slug/[slug]
 * 슬러그로 페이지 조회 (섹션 포함, 관리자)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { slug } = await params;

    if (!slug) {
      return errorResponse('페이지 슬러그가 필요합니다', 'INVALID_REQUEST', 400);
    }

    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        sections: {
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
        },
      },
    });

    if (!page) {
      return notFoundResponse('페이지');
    }

    return successResponse(page, '페이지를 조회했습니다');
  } catch (error) {
    console.error('페이지 조회 오류:', error);
    return errorResponse(
      '페이지를 조회하는 중 오류가 발생했습니다',
      'FETCH_ERROR',
      500
    );
  }
}
