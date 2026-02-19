import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

interface ProcessedImage {
  original: Buffer;
  webp: Buffer;
  thumbnail: Buffer;
  metadata: {
    width: number;
    height: number;
    format: string;
    originalFormat: string;
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

    // 원본 포맷 결정 (jpg, png, webp 등)
    const originalFormat = metadata.format || "jpg";

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
      original: buffer,
      webp,
      thumbnail,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: "webp",
        originalFormat,
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
  originalPath: string;
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
    const originalDir = path.join(process.cwd(), "public", "uploads", "originals", String(year), month);

    // 폴더 생성
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.mkdir(originalDir, { recursive: true });

    // 파일명 생성 (해시 기반)
    const hash = crypto.randomBytes(8).toString("hex");
    const filename = `${hash}.webp`;
    const originalFilename = `${hash}.${processedImage.metadata.originalFormat}`;
    const thumbnailFilename = `${hash}-thumb.webp`;

    const filePath = path.join(uploadDir, filename);
    const originalFilePath = path.join(originalDir, originalFilename);
    const thumbnailPath = path.join(uploadDir, thumbnailFilename);

    // 파일 저장: 원본, WebP, 썸네일 세 개 모두
    await fs.writeFile(originalFilePath, processedImage.original);
    await fs.writeFile(filePath, processedImage.webp);
    await fs.writeFile(thumbnailPath, processedImage.thumbnail);

    // 공개 URL 구성
    const publicPath = `/uploads/${year}/${month}/${filename}`;
    const publicOriginalPath = `/uploads/originals/${year}/${month}/${originalFilename}`;
    const publicThumbnailPath = `/uploads/${year}/${month}/${thumbnailFilename}`;

    return {
      filename,
      path: publicPath,
      originalPath: publicOriginalPath,
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

    // 원본 파일명 추출: "2026/02/abc123.webp" → "abc123"
    const hash = filepath.match(/([a-f0-9]+)\.webp$/)?.[1];

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

    // 원본 파일도 삭제 (originals 폴더에서)
    if (hash) {
      const originalDir = path.join(process.cwd(), "public", "uploads", "originals");
      const dateMatch = filepath.match(/^(\d{4})\/(\d{2})\//);
      if (dateMatch) {
        const [, year, month] = dateMatch;
        const originalDirPath = path.join(originalDir, year, month);

        try {
          const files = await fs.readdir(originalDirPath);
          // 해당 해시의 모든 파일 삭제 (jpg, png, webp 등)
          for (const file of files) {
            if (file.startsWith(hash + ".")) {
              await fs.unlink(path.join(originalDirPath, file));
            }
          }
        } catch (err) {
          // 폴더나 파일이 없을 수 있음 (무시)
        }
      }
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
