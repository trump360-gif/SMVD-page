import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth-check";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
} from "@/lib/api-response";
import { SectionReorderSchema } from "@/types/schemas";
import { logger } from "@/lib/logger";

/**
 * PUT /api/admin/sections/reorder
 * 섹션 순서 변경 (드래그 앤 드롭) - 트랜잭션으로 원자적 처리
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();

    // Zod 검증
    const validation = SectionReorderSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return validationErrorResponse(
        Object.fromEntries(
          Object.entries(errors).map(([key, messages]) => [
            key,
            (messages as string[])?.[0] || "검증 실패",
          ])
        )
      );
    }

    const { pageId, sections } = validation.data;

    // 페이지 존재 확인
    const page = await prisma.page.findUnique({ where: { id: pageId } });
    if (!page) {
      return notFoundResponse("페이지");
    }

    // 모든 섹션이 해당 페이지에 속하는지 확인
    const existingSections = await prisma.section.findMany({
      where: { pageId },
      select: { id: true },
    });

    const existingIds = new Set(existingSections.map((s: { id: string }) => s.id));
    const requestedIds = new Set(sections.map((s) => s.id));

    for (const id of requestedIds) {
      if (!existingIds.has(id)) {
        return errorResponse(
          `섹션 ${id}는 이 페이지에 속하지 않습니다`,
          "INVALID_SECTION",
          400
        );
      }
    }

    // 트랜잭션으로 모든 섹션의 order 업데이트
    const updatePromises = sections.map((section) =>
      prisma.section.update({
        where: { id: section.id },
        data: { order: section.order },
        select: {
          id: true,
          pageId: true,
          type: true,
          title: true,
          order: true,
        },
      })
    );

    const updated = await prisma.$transaction(updatePromises);

    return successResponse(
      updated,
      "섹션 순서가 변경되었습니다"
    );
  } catch (error) {
    logger.error({ err: error, context: "GET /api/..." }, "섹션 순서 변경 오류:");
    return errorResponse(
      "섹션 순서를 변경하는 중 오류가 발생했습니다",
      "REORDER_ERROR",
      500
    );
  }
}
