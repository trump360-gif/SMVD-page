import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth-check';
import { successResponse, errorResponse } from '@/lib/api-response';

/**
 * GET /api/admin/pages
 * 모든 페이지 목록 조회 (관리자)
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const pages = await prisma.page.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { sections: true },
        },
      },
    });

    return successResponse(pages, '페이지 목록을 조회했습니다');
  } catch (error) {
    console.error('페이지 목록 조회 오류:', error);
    return errorResponse(
      '페이지 목록을 조회하는 중 오류가 발생했습니다',
      'FETCH_ERROR',
      500
    );
  }
}
