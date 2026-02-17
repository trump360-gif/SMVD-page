import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma";
import { checkAdminAuth } from "@/lib/auth-check";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
} from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { UpdateFooterSchema } from "@/types/schemas";

/**
 * GET /api/footer
 * 푸터 정보 조회 (공개)
 */
export async function GET() {
  try {
    const footer = await prisma.footer.findFirst();

    if (!footer) {
      return notFoundResponse("푸터");
    }

    logger.info({ context: 'GET /api/footer' }, '푸터를 조회했습니다');
    return successResponse(footer, "푸터를 조회했습니다");
  } catch (error) {
    logger.error({ err: error, context: 'GET /api/footer' }, '푸터 조회 오류');
    return errorResponse(
      "푸터를 조회하는 중 오류가 발생했습니다",
      "FETCH_ERROR",
      500
    );
  }
}

/**
 * PUT /api/footer
 * 푸터 수정 (관리자)
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();

    // Zod 검증
    const validation = UpdateFooterSchema.safeParse(body);
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

    // 푸터 조회
    let footer = await prisma.footer.findFirst();

    if (!footer) {
      // 푸터가 없으면 생성
      footer = await prisma.footer.create({
        data: {
          id: "footer-default",
          title: validation.data.title || "숙명여자대학교 시각영상디자인과",
          description: validation.data.description ?? null,
          address: validation.data.address ?? null,
          phone: validation.data.phone ?? null,
          email: validation.data.email ?? null,
          socialLinks: validation.data.socialLinks
            ? (validation.data.socialLinks as Prisma.InputJsonValue)
            : Prisma.JsonNull,
          copyright: validation.data.copyright ?? null,
        },
      });
    } else {
      // 푸터 수정
      const updateData: Prisma.FooterUpdateInput = {
        title: validation.data.title,
        description: validation.data.description ?? undefined,
        address: validation.data.address ?? undefined,
        phone: validation.data.phone ?? undefined,
        email: validation.data.email ?? undefined,
        socialLinks: validation.data.socialLinks
          ? (validation.data.socialLinks as Prisma.InputJsonValue)
          : undefined,
        copyright: validation.data.copyright ?? undefined,
      };

      footer = await prisma.footer.update({
        where: { id: footer.id },
        data: updateData,
      });
    }

    logger.info({ context: 'PUT /api/footer' }, '푸터가 수정되었습니다');
    return successResponse(footer, "푸터가 수정되었습니다");
  } catch (error) {
    logger.error({ err: error, context: 'PUT /api/footer' }, '푸터 수정 오류');
    return errorResponse(
      "푸터를 수정하는 중 오류가 발생했습니다",
      "UPDATE_ERROR",
      500
    );
  }
}
