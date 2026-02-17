import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth-check";
import { successResponse, errorResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";

/**
 * GET /api/admin/pages
 * 모든 페이지 목록 조회 - 관리자 전용
 */
export async function GET(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    // 모든 페이지 조회 (순서대로 정렬)
    const pages = await prisma.page.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        order: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(pages, "페이지 목록을 조회했습니다");
  } catch (error) {
    logger.error({ err: error, context: "GET /api/..." }, "페이지 목록 조회 오류:");
    return errorResponse(
      "페이지 목록을 조회하는 중 오류가 발생했습니다",
      "FETCH_ERROR",
      500
    );
  }
}
