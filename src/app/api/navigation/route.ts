import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth-check";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
} from "@/lib/api-response";
import {
  CreateNavigationItemSchema,
  UpdateNavigationItemSchema,
} from "@/types/schemas";

/**
 * GET /api/navigation
 * 모든 네비게이션 항목 조회 (공개)
 */
export async function GET() {
  try {
    const items = await prisma.navigation.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return successResponse(items, "네비게이션을 조회했습니다");
  } catch (error) {
    console.error("네비게이션 조회 오류:", error);
    return errorResponse(
      "네비게이션을 조회하는 중 오류가 발생했습니다",
      "FETCH_ERROR",
      500
    );
  }
}

/**
 * POST /api/navigation
 * 네비게이션 항목 추가 (관리자)
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();

    // Zod 검증
    const validation = CreateNavigationItemSchema.safeParse(body);
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

    // 순서 계산
    const lastItem = await prisma.navigation.findFirst({
      orderBy: { order: "desc" },
    });
    const order = (lastItem?.order ?? -1) + 1;

    // 항목 생성
    const item = await prisma.navigation.create({
      data: {
        ...validation.data,
        order,
      },
    });

    return successResponse(item, "네비게이션 항목이 추가되었습니다", 201);
  } catch (error) {
    console.error("네비게이션 항목 추가 오류:", error);
    return errorResponse(
      "네비게이션 항목을 추가하는 중 오류가 발생했습니다",
      "CREATE_ERROR",
      500
    );
  }
}

