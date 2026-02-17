import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, notFoundResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";

/**
 * GET /api/pages
 * 모든 페이지 조회 (공개 API)
 */
export async function GET() {
  try {
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
    logger.error({ err: error, context: "GET /api/..." }, "페이지 조회 오류:");
    return errorResponse(
      "페이지를 조회하는 중 오류가 발생했습니다",
      "FETCH_ERROR",
      500
    );
  }
}
