import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth-check";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
} from "@/lib/api-response";
import { z } from "zod";
import { logger } from "@/lib/logger";

const UpdateExhibitionItemSchema = z.object({
  year: z.string().min(1, "연도는 필수입니다").optional(),
  mediaId: z.string().min(1, "이미지는 필수입니다").optional(),
});

/**
 * PUT /api/admin/exhibition-items/:id
 * 전시 아이템 수정
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { id } = params;

    const body = await request.json();

    // Zod 검증
    const validation = UpdateExhibitionItemSchema.safeParse(body);
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

    // 기존 아이템 확인
    const existing = await prisma.exhibitionItem.findUnique({
      where: { id },
    });
    if (!existing) {
      return notFoundResponse("아이템");
    }

    // 미디어 유효성 확인 (있으면)
    if (validation.data.mediaId) {
      const media = await prisma.media.findUnique({
        where: { id: validation.data.mediaId },
      });
      if (!media) {
        return notFoundResponse("이미지");
      }
    }

    // 아이템 수정
    const updated = await prisma.exhibitionItem.update({
      where: { id },
      data: validation.data,
      include: {
        media: true,
      },
    });

    return successResponse(updated, "전시 아이템이 수정되었습니다");
  } catch (error) {
    logger.error({ err: error, context: "GET /api/..." }, "전시 아이템 수정 오류:");
    return errorResponse(
      "전시 아이템을 수정하는 중 오류가 발생했습니다",
      "UPDATE_ERROR",
      500
    );
  }
}

/**
 * DELETE /api/admin/exhibition-items/:id
 * 전시 아이템 삭제
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { id } = params;

    // 기존 아이템 확인
    const existing = await prisma.exhibitionItem.findUnique({
      where: { id },
    });
    if (!existing) {
      return notFoundResponse("아이템");
    }

    // 아이템 삭제
    await prisma.exhibitionItem.delete({
      where: { id },
    });

    return successResponse(null, "전시 아이템이 삭제되었습니다");
  } catch (error) {
    logger.error({ err: error, context: "GET /api/..." }, "전시 아이템 삭제 오류:");
    return errorResponse(
      "전시 아이템을 삭제하는 중 오류가 발생했습니다",
      "DELETE_ERROR",
      500
    );
  }
}
