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
  CreateSectionSchema,
  UpdateSectionSchema,
} from "@/types/schemas";

/**
 * GET /api/admin/sections?pageId=xxx
 * 특정 페이지의 섹션 조회 (관리자)
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const pageId = request.nextUrl.searchParams.get("pageId");

    if (!pageId) {
      return errorResponse(
        "pageId 파라미터는 필수입니다",
        "MISSING_PARAM",
        400
      );
    }

    const sections = await prisma.section.findMany({
      where: { pageId },
      orderBy: { order: "asc" },
      include: {
        exhibitionItems: {
          include: { media: true },
          orderBy: { order: "asc" },
        },
        workPortfolios: {
          include: { media: true },
          orderBy: { order: "asc" },
        },
      },
    });

    return successResponse(sections, "섹션 목록을 조회했습니다");
  } catch (error) {
    console.error("섹션 조회 오류:", error);
    return errorResponse(
      "섹션을 조회하는 중 오류가 발생했습니다",
      "FETCH_ERROR",
      500
    );
  }
}

/**
 * POST /api/admin/sections
 * 새 섹션 생성 (관리자)
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();

    // Zod 검증
    const validation = CreateSectionSchema.safeParse(body);
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

    const { pageId, type, title, content, mediaIds } = validation.data;

    // 페이지 존재 확인
    const page = await prisma.page.findUnique({ where: { id: pageId } });
    if (!page) {
      return notFoundResponse("페이지");
    }

    // 섹션 순서 계산
    const lastSection = await prisma.section.findFirst({
      where: { pageId },
      orderBy: { order: "desc" },
    });
    const order = (lastSection?.order ?? -1) + 1;

    // 섹션 생성
    const section = await prisma.section.create({
      data: {
        pageId,
        type,
        title,
        content,
        mediaIds,
        order,
      } as any,
    });

    return successResponse(section, "섹션이 생성되었습니다", 201);
  } catch (error) {
    console.error("섹션 생성 오류:", error);
    return errorResponse(
      "섹션을 생성하는 중 오류가 발생했습니다",
      "CREATE_ERROR",
      500
    );
  }
}

