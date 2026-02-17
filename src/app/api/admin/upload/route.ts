import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
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
import { Prisma } from "@/generated/prisma";
import { validateFileContent } from "@/lib/file-validation";
import { logger } from "@/lib/logger";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

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

    // SVG는 검증 스킵 (XML 기반이므로 매직 바이트 검증 불필요)
    if (file.type !== "image/svg+xml") {
      // 매직 바이트 검증 (파일 실제 내용 확인 - Content-Type 위조 방지)
      const fileValidation = validateFileContent(buffer, ALLOWED_TYPES);
      if (!fileValidation.valid) {
        return errorResponse(
          fileValidation.message || "파일이 손상되었거나 위조되었습니다",
          "INVALID_FILE_CONTENT",
          400
        );
      }
    }

    // SVG는 그대로 저장, 다른 이미지는 WebP 변환
    let filename: string;
    let filepath: string;
    let mimeType: string;
    let width: number = 0;
    let height: number = 0;
    let fileSize: number;

    if (file.type === "image/svg+xml") {
      // SVG 파일 직접 저장
      const now = new Date();
      const yearMonth = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
      const dir = path.join(process.cwd(), "public", "uploads", yearMonth);
      await fs.mkdir(dir, { recursive: true });

      filename = `${crypto.randomBytes(8).toString("hex")}.svg`;
      const fullPath = path.join(dir, filename);
      await fs.writeFile(fullPath, buffer);

      filepath = `/uploads/${yearMonth}/${filename}`;
      mimeType = "image/svg+xml";
      fileSize = buffer.length;
    } else {
      // 이미지 처리 (WebP 변환)
      const processed = await processImage(buffer);

      // 처리된 이미지 저장
      const saved = await saveProcessedImage(processed, {
        altText: altText || undefined,
      });

      filename = saved.filename;
      filepath = saved.path;
      mimeType = "image/webp";
      width = saved.width;
      height = saved.height;
      fileSize = processed.webp.length;
    }

    // DB에 메타 정보 저장
    const media = await prisma.media.create({
      data: {
        filename,
        filepath,
        mimeType,
        size: fileSize,
        width,
        height,
        altText: altText || undefined,
        formats: {
          original: file.type,
          size: file.size,
        } satisfies Prisma.InputJsonValue,
      },
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
    logger.error({ err: error, context: "POST /api/admin/upload" }, "이미지 업로드 오류");

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

