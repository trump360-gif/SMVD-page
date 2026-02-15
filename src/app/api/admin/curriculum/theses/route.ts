import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth-check";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api-response";
import {
  AddThesisSchema,
  UpdateThesisSchema,
  DeleteThesisSchema,
  GraduateContent,
} from "@/lib/validation/curriculum";

/**
 * 헬퍼: 섹션에서 대학원 콘텐츠를 안전하게 가져오기
 */
async function getGraduateContent(sectionId: string) {
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
  });

  if (!section) return null;
  if (section.type !== "CURRICULUM_GRADUATE") return null;

  return {
    section,
    content: section.content as unknown as GraduateContent,
  };
}

/**
 * POST /api/admin/curriculum/theses
 * 졸업 논문 추가
 * Body: { sectionId, thesis: { category, title, date } }
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const validation = AddThesisSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(
        "입력값 검증에 실패했습니다",
        "VALIDATION_ERROR",
        400,
        { errors: validation.error.flatten().fieldErrors }
      );
    }

    const { sectionId, thesis } = validation.data;

    const result = await getGraduateContent(sectionId);
    if (!result) {
      return notFoundResponse("대학원 교과과정 섹션");
    }

    const { content } = result;

    // 논문 추가
    content.theses.push(thesis);

    // DB 업데이트
    const updatedSection = await prisma.section.update({
      where: { id: sectionId },
      data: { content: content as object },
    });

    return successResponse(
      updatedSection,
      "논문이 추가되었습니다",
      201
    );
  } catch (error) {
    console.error("Curriculum theses POST error:", error);
    return errorResponse(
      "논문을 추가하는 중 오류가 발생했습니다",
      "CREATE_ERROR",
      500
    );
  }
}

/**
 * PUT /api/admin/curriculum/theses
 * 졸업 논문 수정
 * Body: { sectionId, thesisIndex, thesis: { category, title, date } }
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const validation = UpdateThesisSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(
        "입력값 검증에 실패했습니다",
        "VALIDATION_ERROR",
        400,
        { errors: validation.error.flatten().fieldErrors }
      );
    }

    const { sectionId, thesisIndex, thesis } = validation.data;

    const result = await getGraduateContent(sectionId);
    if (!result) {
      return notFoundResponse("대학원 교과과정 섹션");
    }

    const { content } = result;

    // 인덱스 범위 확인
    if (thesisIndex < 0 || thesisIndex >= content.theses.length) {
      return errorResponse(
        "유효하지 않은 논문 인덱스입니다",
        "INVALID_INDEX",
        400
      );
    }

    // 논문 수정
    content.theses[thesisIndex] = thesis;

    // DB 업데이트
    const updatedSection = await prisma.section.update({
      where: { id: sectionId },
      data: { content: content as object },
    });

    return successResponse(updatedSection, "논문이 수정되었습니다");
  } catch (error) {
    console.error("Curriculum theses PUT error:", error);
    return errorResponse(
      "논문을 수정하는 중 오류가 발생했습니다",
      "UPDATE_ERROR",
      500
    );
  }
}

/**
 * DELETE /api/admin/curriculum/theses
 * 졸업 논문 삭제
 * Body: { sectionId, thesisIndex }
 */
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const validation = DeleteThesisSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(
        "입력값 검증에 실패했습니다",
        "VALIDATION_ERROR",
        400,
        { errors: validation.error.flatten().fieldErrors }
      );
    }

    const { sectionId, thesisIndex } = validation.data;

    const result = await getGraduateContent(sectionId);
    if (!result) {
      return notFoundResponse("대학원 교과과정 섹션");
    }

    const { content } = result;

    // 인덱스 범위 확인
    if (thesisIndex < 0 || thesisIndex >= content.theses.length) {
      return errorResponse(
        "유효하지 않은 논문 인덱스입니다",
        "INVALID_INDEX",
        400
      );
    }

    // 논문 삭제
    content.theses.splice(thesisIndex, 1);

    // DB 업데이트
    const updatedSection = await prisma.section.update({
      where: { id: sectionId },
      data: { content: content as object },
    });

    return successResponse(updatedSection, "논문이 삭제되었습니다");
  } catch (error) {
    console.error("Curriculum theses DELETE error:", error);
    return errorResponse(
      "논문을 삭제하는 중 오류가 발생했습니다",
      "DELETE_ERROR",
      500
    );
  }
}
