import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth-check";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api-response";
import {
  UpdateModulesSchema,
  UndergraduateContent,
} from "@/lib/validation/curriculum";

/**
 * PUT /api/admin/curriculum/modules
 * 모듈 상세 설명 전체 업데이트
 * Body: { sectionId, modules: [{ module, title, description, courses }] }
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const validation = UpdateModulesSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(
        "입력값 검증에 실패했습니다",
        "VALIDATION_ERROR",
        400,
        { errors: validation.error.flatten().fieldErrors }
      );
    }

    const { sectionId, modules } = validation.data;

    // 섹션 조회
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
    });

    if (!section) {
      return notFoundResponse("섹션");
    }

    if (section.type !== "CURRICULUM_UNDERGRADUATE") {
      return errorResponse(
        "학부 교과과정 섹션만 모듈 수정이 가능합니다",
        "INVALID_TYPE",
        400
      );
    }

    const content = section.content as unknown as UndergraduateContent;

    // 모듈 정보 업데이트
    content.modules = modules;

    // DB 업데이트
    const updatedSection = await prisma.section.update({
      where: { id: sectionId },
      data: { content: content as object },
    });

    return successResponse(updatedSection, "모듈 정보가 업데이트되었습니다");
  } catch (error) {
    console.error("Curriculum modules PUT error:", error);
    return errorResponse(
      "모듈 정보를 업데이트하는 중 오류가 발생했습니다",
      "UPDATE_ERROR",
      500
    );
  }
}
