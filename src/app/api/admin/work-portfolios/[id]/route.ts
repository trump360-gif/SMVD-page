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

const UpdateWorkPortfolioSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다").optional(),
  category: z.string().min(1, "카테고리는 필수입니다").optional(),
  mediaId: z.string().min(1, "이미지는 필수입니다").optional(),
});

/**
 * PUT /api/admin/work-portfolios/:id
 * 작품 포트폴리오 수정
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
    const validation = UpdateWorkPortfolioSchema.safeParse(body);
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

    // 기존 작품 확인
    const existing = await prisma.workPortfolio.findUnique({
      where: { id },
    });
    if (!existing) {
      return notFoundResponse("작품");
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

    // 작품 수정
    const updated = await prisma.workPortfolio.update({
      where: { id },
      data: validation.data,
      include: {
        media: true,
      },
    });

    return successResponse(updated, "작품이 수정되었습니다");
  } catch (error) {
    console.error("작품 수정 오류:", error);
    return errorResponse(
      "작품을 수정하는 중 오류가 발생했습니다",
      "UPDATE_ERROR",
      500
    );
  }
}

/**
 * DELETE /api/admin/work-portfolios/:id
 * 작품 포트폴리오 삭제
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { id } = params;

    // 기존 작품 확인
    const existing = await prisma.workPortfolio.findUnique({
      where: { id },
    });
    if (!existing) {
      return notFoundResponse("작품");
    }

    // 작품 삭제
    await prisma.workPortfolio.delete({
      where: { id },
    });

    return successResponse(null, "작품이 삭제되었습니다");
  } catch (error) {
    console.error("작품 삭제 오류:", error);
    return errorResponse(
      "작품을 삭제하는 중 오류가 발생했습니다",
      "DELETE_ERROR",
      500
    );
  }
}
