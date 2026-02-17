import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth-check";
import { successResponse, errorResponse, notFoundResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";

/**
 * GET /api/admin/pages/[id]
 * 특정 페이지 조회 (섹션 포함) - 관리자 전용
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 권한 확인
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { id: pageId } = await params;

    if (!pageId) {
      return errorResponse("페이지 ID가 필요합니다", "INVALID_REQUEST", 400);
    }

    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        sections: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            type: true,
            title: true,
            order: true,
          },
        },
      },
    });

    if (!page) {
      return notFoundResponse("페이지를 찾을 수 없습니다");
    }

    return successResponse(page, "페이지를 조회했습니다");
  } catch (error) {
    logger.error({ err: error, context: "GET /api/..." }, "페이지 상세 조회 오류:");
    return errorResponse(
      "페이지를 조회하는 중 오류가 발생했습니다",
      "FETCH_ERROR",
      500
    );
  }
}
