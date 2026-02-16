import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { SectionType } from "@/generated/prisma";
import { checkAdminAuth } from "@/lib/auth-check";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api-response";
import {
  UpdateCurriculumSectionSchema,
  UndergraduateContentSchema,
  GraduateContentSchema,
} from "@/lib/validation/curriculum";
import { z } from "zod";
import { invalidateCurriculum } from "@/lib/cache";

/**
 * GET /api/admin/curriculum/sections
 * Curriculum 페이지의 모든 섹션 조회
 */
export async function GET() {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    // curriculum 페이지 찾기
    const curriculumPage = await prisma.page.findUnique({
      where: { slug: "curriculum" },
      include: {
        sections: {
          where: {
            type: {
              in: [SectionType.CURRICULUM_UNDERGRADUATE, SectionType.CURRICULUM_GRADUATE],
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!curriculumPage) {
      return notFoundResponse("Curriculum 페이지");
    }

    return successResponse(
      curriculumPage.sections,
      "교과과정 섹션을 조회했습니다"
    );
  } catch (error) {
    console.error("Curriculum sections GET error:", error);
    return errorResponse(
      "교과과정 섹션을 조회하는 중 오류가 발생했습니다",
      "FETCH_ERROR",
      500
    );
  }
}

/**
 * PUT /api/admin/curriculum/sections
 * Curriculum 섹션 전체 업데이트
 * Body: { sectionId, type, content }
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();

    // 기본 스키마 검증
    const baseValidation = UpdateCurriculumSectionSchema.safeParse(body);
    if (!baseValidation.success) {
      return errorResponse(
        "입력값 검증에 실패했습니다",
        "VALIDATION_ERROR",
        400,
        { errors: baseValidation.error.flatten().fieldErrors }
      );
    }

    const { sectionId, type, content } = baseValidation.data;

    // 섹션 존재 확인
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
    });
    if (!section) {
      return notFoundResponse("섹션");
    }

    // 타입별 content 검증
    let validatedContent: unknown;
    if (type === "CURRICULUM_UNDERGRADUATE") {
      const contentValidation = UndergraduateContentSchema.safeParse(content);
      if (!contentValidation.success) {
        return errorResponse(
          "학부 교과과정 데이터 형식이 올바르지 않습니다",
          "VALIDATION_ERROR",
          400,
          { errors: contentValidation.error.flatten() }
        );
      }
      validatedContent = contentValidation.data;
    } else {
      const contentValidation = GraduateContentSchema.safeParse(content);
      if (!contentValidation.success) {
        return errorResponse(
          "대학원 교과과정 데이터 형식이 올바르지 않습니다",
          "VALIDATION_ERROR",
          400,
          { errors: contentValidation.error.flatten() }
        );
      }
      validatedContent = contentValidation.data;
    }

    // 섹션 업데이트
    const updatedSection = await prisma.section.update({
      where: { id: sectionId },
      data: {
        content: validatedContent as object,
        type: type as SectionType,
      },
    });

    // Invalidate ISR caches
    invalidateCurriculum();

    return successResponse(updatedSection, "교과과정 섹션이 업데이트되었습니다");
  } catch (error) {
    console.error("Curriculum sections PUT error:", error);
    if (error instanceof z.ZodError) {
      return errorResponse(
        "데이터 형식이 올바르지 않습니다",
        "VALIDATION_ERROR",
        400,
        { issues: error.issues }
      );
    }
    return errorResponse(
      "교과과정 섹션을 업데이트하는 중 오류가 발생했습니다",
      "UPDATE_ERROR",
      500
    );
  }
}
