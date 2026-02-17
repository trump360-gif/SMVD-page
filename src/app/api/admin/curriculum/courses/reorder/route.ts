import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth-check";
import { logger } from "@/lib/logger";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api-response";
import {
  ReorderCoursesSchema,
  UndergraduateContent,
} from "@/lib/validation/curriculum";

/**
 * PUT /api/admin/curriculum/courses/reorder
 * 특정 학기 내 과목 순서 변경
 * Body: { sectionId, semesterIndex, courses: [{ name, color, classification }] }
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const validation = ReorderCoursesSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(
        "입력값 검증에 실패했습니다",
        "VALIDATION_ERROR",
        400,
        { errors: validation.error.flatten().fieldErrors }
      );
    }

    const { sectionId, semesterIndex, courses } = validation.data;

    // 섹션 조회
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
    });

    if (!section) {
      return notFoundResponse("섹션");
    }

    if (section.type !== "CURRICULUM_UNDERGRADUATE") {
      return errorResponse(
        "학부 교과과정 섹션만 과목 순서 변경이 가능합니다",
        "INVALID_TYPE",
        400
      );
    }

    const content = section.content as unknown as UndergraduateContent;

    // 학기 인덱스 범위 확인
    if (semesterIndex < 0 || semesterIndex >= content.semesters.length) {
      return errorResponse(
        "유효하지 않은 학기 인덱스입니다",
        "INVALID_INDEX",
        400
      );
    }

    // 과목 배열 교체 (새 순서 적용)
    content.semesters[semesterIndex].courses = courses;

    // DB 업데이트
    const updatedSection = await prisma.section.update({
      where: { id: sectionId },
      data: { content: content as object },
    });

    return successResponse(updatedSection, "과목 순서가 변경되었습니다");
  } catch (error) {
    logger.error({ err: error, context: "GET /api/..." }, "Curriculum courses reorder error:");
    return errorResponse(
      "과목 순서를 변경하는 중 오류가 발생했습니다",
      "REORDER_ERROR",
      500
    );
  }
}
