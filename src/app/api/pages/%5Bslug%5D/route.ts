import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, notFoundResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";

/**
 * GET /api/pages/[slug]
 * 특정 페이지 상세 조회 (공개 API)
 * 섹션 포함
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        sections: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            type: true,
            title: true,
            content: true,
            mediaIds: true,
            order: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!page) {
      return notFoundResponse("페이지");
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
