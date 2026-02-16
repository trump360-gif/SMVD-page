import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

interface ProcessedImage {
  webp: Buffer;
  thumbnail: Buffer;
  metadata: {
    width: number;
    height: number;
    format: string;
  };
}

export async function processImage(
  buffer: Buffer
): Promise<ProcessedImage> {
  try {
    // 원본 이미지 메타데이터 추출
    const metadata = await sharp(buffer).metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error("유효하지 않은 이미지: 크기를 가져올 수 없습니다");
    }

    // WebP 변환 (80% 품질)
    const webp = await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer();

    // 썸네일 생성 (300x300)
    const thumbnail = await sharp(buffer)
      .resize(300, 300, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: 70 })
      .toBuffer();

    return {
      webp,
      thumbnail,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: "webp",
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`이미지 처리 실패: ${error.message}`);
    }
    throw error;
  }
}

interface SaveImageOptions {
  altText?: string;
}

export async function saveProcessedImage(
  processedImage: ProcessedImage,
  options: SaveImageOptions = {}
): Promise<{
  filename: string;
  path: string;
  thumbnailPath: string;
  width: number;
  height: number;
  altText?: string;
}> {
  try {
    // 연도/월 기반 폴더 구조
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    const uploadDir = path.join(process.cwd(), "public", "uploads", String(year), month);

    // 폴더 생성
    await fs.mkdir(uploadDir, { recursive: true });

    // 파일명 생성 (해시 기반)
    const hash = crypto.randomBytes(8).toString("hex");
    const filename = `${hash}.webp`;
    const thumbnailFilename = `${hash}-thumb.webp`;

    const filePath = path.join(uploadDir, filename);
    const thumbnailPath = path.join(uploadDir, thumbnailFilename);

    // 파일 저장
    await fs.writeFile(filePath, processedImage.webp);
    await fs.writeFile(thumbnailPath, processedImage.thumbnail);

    // 공개 URL 구성
    const publicPath = `/uploads/${year}/${month}/${filename}`;
    const publicThumbnailPath = `/uploads/${year}/${month}/${thumbnailFilename}`;

    return {
      filename,
      path: publicPath,
      thumbnailPath: publicThumbnailPath,
      width: processedImage.metadata.width,
      height: processedImage.metadata.height,
      altText: options.altText,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`이미지 저장 실패: ${error.message}`);
    }
    throw error;
  }
}

export async function deleteImage(filepath: string): Promise<void> {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadsDir, filepath);

    // 썸네일 경로: "2026/02/abc123.webp" → "2026/02/abc123-thumb.webp"
    const thumbnailPath = filePath.replace(/\.webp$/, "-thumb.webp");

    try {
      await fs.unlink(filePath);
    } catch (err) {
      // 파일이 없거나 접근 불가 (무시)
    }

    try {
      await fs.unlink(thumbnailPath);
    } catch (err) {
      // 썸네일이 없을 수 있음 (무시)
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`이미지 삭제 실패: ${error.message}`);
    }
    throw error;
  }
}

export function getImagePublicPath(filename: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  return `/uploads/${year}/${month}/${filename}`;
}
