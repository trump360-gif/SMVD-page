import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth-check";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
} from "@/lib/api-response";
import { UpdateSectionSchema } from "@/types/schemas";
import { Prisma } from "@/generated/prisma";
import { logger } from "@/lib/logger";

/**
 * PUT /api/admin/sections/[id]
 * 섹션 수정 (관리자)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { id: sectionId } = await params;

    if (!sectionId) {
      return errorResponse("섹션 ID가 필요합니다", "MISSING_ID", 400);
    }

    const body = await request.json();

    // Zod 검증
    const validation = UpdateSectionSchema.safeParse(body);
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

    // 섹션 존재 확인
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
    });
    if (!section) {
      return notFoundResponse("섹션");
    }

    // 섹션 수정
    const { content, mediaIds, ...restData } = validation.data;
    const updatePayload: Prisma.SectionUpdateInput = {
      ...restData,
      ...(content !== undefined && { content: content as Prisma.InputJsonValue }),
      ...(mediaIds !== undefined && { mediaIds: mediaIds as Prisma.InputJsonValue }),
    };
    const updated = await prisma.section.update({
      where: { id: sectionId },
      data: updatePayload,
    });

    return successResponse(updated, "섹션이 수정되었습니다");
  } catch (error) {
    logger.error({ err: error, context: "GET /api/..." }, "섹션 수정 오류:");
    return errorResponse(
      "섹션을 수정하는 중 오류가 발생했습니다",
      "UPDATE_ERROR",
      500
    );
  }
}

/**
 * DELETE /api/admin/sections/[id]
 * 섹션 삭제 (관리자)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { id: sectionId } = await params;

    if (!sectionId) {
      return errorResponse("섹션 ID가 필요합니다", "MISSING_ID", 400);
    }

    // 섹션 존재 확인
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
    });
    if (!section) {
      return notFoundResponse("섹션");
    }

    // 섹션 삭제
    await prisma.section.delete({
      where: { id: sectionId },
    });

    return successResponse(null, "섹션이 삭제되었습니다");
  } catch (error) {
    logger.error({ err: error, context: "GET /api/..." }, "섹션 삭제 오류:");
    return errorResponse(
      "섹션을 삭제하는 중 오류가 발생했습니다",
      "DELETE_ERROR",
      500
    );
  }
}
