import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth-check";
import { logger } from "@/lib/logger";
import {
  successResponse,
  errorResponse,
} from "@/lib/api-response";

/**
 * DELETE /api/admin/upload/:id
 * 업로드된 이미지 삭제 (관리자)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { id } = params;

    // 미디어 파일 확인
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return errorResponse(
        "파일을 찾을 수 없습니다",
        "NOT_FOUND",
        404
      );
    }

    // 파일 시스템에서 삭제
    const { deleteImage } = await import("@/lib/image/process");
    await deleteImage(media.filepath);

    // DB에서 삭제
    await prisma.media.delete({
      where: { id },
    });

    return successResponse(null, "이미지가 삭제되었습니다");
  } catch (error) {
    logger.error({ err: error, context: "GET /api/..." }, "이미지 삭제 오류:");
    return errorResponse(
      "이미지를 삭제하는 중 오류가 발생했습니다",
      "DELETE_ERROR",
      500
    );
  }
}
