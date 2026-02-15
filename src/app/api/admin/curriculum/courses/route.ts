import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth-check";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api-response";
import {
  AddCourseSchema,
  UpdateCourseSchema,
  DeleteCourseSchema,
  UndergraduateContent,
} from "@/lib/validation/curriculum";

/**
 * 헬퍼: 섹션에서 학부 콘텐츠를 안전하게 가져오기
 */
async function getUndergraduateContent(sectionId: string) {
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
  });

  if (!section) return null;
  if (section.type !== "CURRICULUM_UNDERGRADUATE") return null;

  return {
    section,
    content: section.content as unknown as UndergraduateContent,
  };
}

/**
 * POST /api/admin/curriculum/courses
 * 특정 학기에 과목 추가
 * Body: { sectionId, semesterIndex, course: { name, color, classification } }
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const validation = AddCourseSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(
        "입력값 검증에 실패했습니다",
        "VALIDATION_ERROR",
        400,
        { errors: validation.error.flatten().fieldErrors }
      );
    }

    const { sectionId, semesterIndex, course } = validation.data;

    const result = await getUndergraduateContent(sectionId);
    if (!result) {
      return notFoundResponse("학부 교과과정 섹션");
    }

    const { content } = result;

    // 학기 인덱스 범위 확인
    if (semesterIndex < 0 || semesterIndex >= content.semesters.length) {
      return errorResponse(
        `유효하지 않은 학기 인덱스입니다 (0-${content.semesters.length - 1})`,
        "INVALID_INDEX",
        400
      );
    }

    // 과목 추가
    content.semesters[semesterIndex].courses.push(course);

    // DB 업데이트
    const updatedSection = await prisma.section.update({
      where: { id: sectionId },
      data: { content: content as object },
    });

    return successResponse(
      updatedSection,
      "과목이 추가되었습니다",
      201
    );
  } catch (error) {
    console.error("Curriculum courses POST error:", error);
    return errorResponse(
      "과목을 추가하는 중 오류가 발생했습니다",
      "CREATE_ERROR",
      500
    );
  }
}

/**
 * PUT /api/admin/curriculum/courses
 * 특정 학기의 특정 과목 수정
 * Body: { sectionId, semesterIndex, courseIndex, course: { name, color, classification } }
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const validation = UpdateCourseSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(
        "입력값 검증에 실패했습니다",
        "VALIDATION_ERROR",
        400,
        { errors: validation.error.flatten().fieldErrors }
      );
    }

    const { sectionId, semesterIndex, courseIndex, course } = validation.data;

    const result = await getUndergraduateContent(sectionId);
    if (!result) {
      return notFoundResponse("학부 교과과정 섹션");
    }

    const { content } = result;

    // 인덱스 범위 확인
    if (semesterIndex < 0 || semesterIndex >= content.semesters.length) {
      return errorResponse(
        "유효하지 않은 학기 인덱스입니다",
        "INVALID_INDEX",
        400
      );
    }

    const semester = content.semesters[semesterIndex];
    if (courseIndex < 0 || courseIndex >= semester.courses.length) {
      return errorResponse(
        "유효하지 않은 과목 인덱스입니다",
        "INVALID_INDEX",
        400
      );
    }

    // 과목 수정
    content.semesters[semesterIndex].courses[courseIndex] = course;

    // DB 업데이트
    const updatedSection = await prisma.section.update({
      where: { id: sectionId },
      data: { content: content as object },
    });

    return successResponse(updatedSection, "과목이 수정되었습니다");
  } catch (error) {
    console.error("Curriculum courses PUT error:", error);
    return errorResponse(
      "과목을 수정하는 중 오류가 발생했습니다",
      "UPDATE_ERROR",
      500
    );
  }
}

/**
 * DELETE /api/admin/curriculum/courses
 * 특정 학기의 특정 과목 삭제
 * Body: { sectionId, semesterIndex, courseIndex }
 */
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const validation = DeleteCourseSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(
        "입력값 검증에 실패했습니다",
        "VALIDATION_ERROR",
        400,
        { errors: validation.error.flatten().fieldErrors }
      );
    }

    const { sectionId, semesterIndex, courseIndex } = validation.data;

    const result = await getUndergraduateContent(sectionId);
    if (!result) {
      return notFoundResponse("학부 교과과정 섹션");
    }

    const { content } = result;

    // 인덱스 범위 확인
    if (semesterIndex < 0 || semesterIndex >= content.semesters.length) {
      return errorResponse(
        "유효하지 않은 학기 인덱스입니다",
        "INVALID_INDEX",
        400
      );
    }

    const semester = content.semesters[semesterIndex];
    if (courseIndex < 0 || courseIndex >= semester.courses.length) {
      return errorResponse(
        "유효하지 않은 과목 인덱스입니다",
        "INVALID_INDEX",
        400
      );
    }

    // 과목 삭제
    content.semesters[semesterIndex].courses.splice(courseIndex, 1);

    // DB 업데이트
    const updatedSection = await prisma.section.update({
      where: { id: sectionId },
      data: { content: content as object },
    });

    return successResponse(updatedSection, "과목이 삭제되었습니다");
  } catch (error) {
    console.error("Curriculum courses DELETE error:", error);
    return errorResponse(
      "과목을 삭제하는 중 오류가 발생했습니다",
      "DELETE_ERROR",
      500
    );
  }
}
