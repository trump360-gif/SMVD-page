import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { checkAdminAuth } from "@/lib/auth-check";
import {
  successResponse,
  errorResponse,
} from "@/lib/api-response";
import {
  processImage,
  saveProcessedImage,
} from "@/lib/image/process";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * POST /api/admin/upload
 * 이미지 업로드 및 WebP 변환 (관리자)
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    // FormData 파싱
    const formData = await request.formData();
    const file = formData.get("file");
    const altText = formData.get("altText") as string | null;

    if (!file || !(file instanceof File)) {
      return errorResponse("파일이 필요합니다", "MISSING_FILE", 400);
    }

    // 파일 크기 확인
    if (file.size > MAX_FILE_SIZE) {
      return errorResponse(
        `파일 크기는 10MB 이하여야 합니다 (현재: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
        "FILE_TOO_LARGE",
        400
      );
    }

    // 파일 타입 확인
    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse(
        `지원하지 않는 파일 형식입니다. 지원: ${ALLOWED_TYPES.join(", ")}`,
        "INVALID_FILE_TYPE",
        400
      );
    }

    // 파일을 Buffer로 변환
    const buffer = Buffer.from(await file.arrayBuffer());

    // 이미지 처리 (WebP 변환)
    const processed = await processImage(buffer);

    // 처리된 이미지 저장
    const saved = await saveProcessedImage(processed, {
      altText: altText || undefined,
    });

    // DB에 메타 정보 저장
    const media = await prisma.media.create({
      data: {
        filename: saved.filename,
        filepath: saved.path,
        mimeType: "image/webp",
        size: processed.webp.length,
        width: saved.width,
        height: saved.height,
        altText: saved.altText,
        formats: {
          original: file.type,
          size: file.size,
        },
      } as any,
    });

    return successResponse(
      {
        id: media.id,
        filename: media.filename,
        path: media.filepath,
        width: media.width,
        height: media.height,
        altText: media.altText,
      },
      "이미지가 업로드되었습니다",
      201
    );
  } catch (error) {
    console.error("이미지 업로드 오류:", error);

    if (error instanceof Error && error.message.includes("이미지 처리")) {
      return errorResponse(
        error.message,
        "IMAGE_PROCESS_ERROR",
        400
      );
    }

    return errorResponse(
      "이미지를 업로드하는 중 오류가 발생했습니다",
      "UPLOAD_ERROR",
      500
    );
  }
}

/**
 * DELETE /api/admin/upload/:id
 * 업로드된 이미지 삭제 (관리자)
 */
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const fileId = request.nextUrl.pathname.split("/").pop();
    if (!fileId) {
      return errorResponse("파일 ID가 필요합니다", "MISSING_ID", 400);
    }

    // 미디어 파일 확인
    const media = await prisma.media.findUnique({
      where: { id: fileId },
    });

    if (!media) {
      return errorResponse(
        "파일을 찾을 수 없습니다",
        "NOT_FOUND",
        404
      );
    }

    // 파일 시스템에서 삭제
    const { deleteImage } = await import("@/lib/image/process");
    await deleteImage(media.filename);

    // DB에서 삭제
    await prisma.media.delete({
      where: { id: fileId },
    });

    return successResponse(null, "이미지가 삭제되었습니다");
  } catch (error) {
    console.error("이미지 삭제 오류:", error);
    return errorResponse(
      "이미지를 삭제하는 중 오류가 발생했습니다",
      "DELETE_ERROR",
      500
    );
  }
}
