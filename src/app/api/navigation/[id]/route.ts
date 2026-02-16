import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth-check";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
} from "@/lib/api-response";
import { UpdateNavigationItemSchema } from "@/types/schemas";

/**
 * PUT /api/navigation/:id
 * 네비게이션 항목 수정 (관리자)
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
    const validation = UpdateNavigationItemSchema.safeParse(body);
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

    // 항목 존재 확인
    const item = await prisma.navigation.findUnique({
      where: { id },
    });
    if (!item) {
      return notFoundResponse("네비게이션 항목");
    }

    // 항목 수정
    const updated = await prisma.navigation.update({
      where: { id },
      data: validation.data,
    });

    return successResponse(updated, "네비게이션 항목이 수정되었습니다");
  } catch (error) {
    console.error("네비게이션 항목 수정 오류:", error);
    return errorResponse(
      "네비게이션 항목을 수정하는 중 오류가 발생했습니다",
      "UPDATE_ERROR",
      500
    );
  }
}

/**
 * DELETE /api/navigation/:id
 * 네비게이션 항목 삭제 (관리자)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { id } = params;

    // 항목 존재 확인
    const item = await prisma.navigation.findUnique({
      where: { id },
    });
    if (!item) {
      return notFoundResponse("네비게이션 항목");
    }

    // 항목 삭제
    await prisma.navigation.delete({
      where: { id },
    });

    return successResponse(null, "네비게이션 항목이 삭제되었습니다");
  } catch (error) {
    console.error("네비게이션 항목 삭제 오류:", error);
    return errorResponse(
      "네비게이션 항목을 삭제하는 중 오류가 발생했습니다",
      "DELETE_ERROR",
      500
    );
  }
}
