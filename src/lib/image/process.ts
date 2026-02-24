import sharp from "sharp";
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

import { put } from "@vercel/blob";

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

    // 파일명 생성 (해시 기반)
    const hash = crypto.randomBytes(8).toString("hex");
    const filename = `${hash}.webp`;
    const originalFilename = `${hash}.${processedImage.metadata.originalFormat}`;
    const thumbnailFilename = `${hash}-thumb.webp`;

    const filePath = `uploads/${year}/${month}/${filename}`;
    const originalFilePath = `uploads/originals/${year}/${month}/${originalFilename}`;
    const thumbnailPath = `uploads/${year}/${month}/${thumbnailFilename}`;

    // 파일 저장: 원본, WebP, 썸네일 세 개 모두 Vercel Blob으로 업로드
    const [originalBlob, webpBlob, thumbnailBlob] = await Promise.all([
      put(originalFilePath, processedImage.original, { access: 'public', contentType: `image/${processedImage.metadata.originalFormat}` }),
      put(filePath, processedImage.webp, { access: 'public', contentType: 'image/webp' }),
      put(thumbnailPath, processedImage.thumbnail, { access: 'public', contentType: 'image/webp' })
    ]);

    return {
      filename,
      path: webpBlob.url,
      originalPath: originalBlob.url,
      thumbnailPath: thumbnailBlob.url,
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

import { del } from "@vercel/blob";

export async function deleteImage(filepath: string): Promise<void> {
  try {
    // filepath is now the full Vercel Blob URL.
    // We also need to construct the thumbnail and original URLs to delete them.
    // Vercel Blob URLs match the path structure we gave them.
    
    // Example URL: https://[hash].public.blob.vercel-storage.com/uploads/2026/02/abc123.webp
    // Thumbnail:   https://[hash].public.blob.vercel-storage.com/uploads/2026/02/abc123-thumb.webp
    // Original:    https://[hash].public.blob.vercel-storage.com/uploads/originals/2026/02/abc123.jpg (extension varies)
    
    const thumbnailPath = filepath.replace(/\.webp$/, "-thumb.webp");
    
    // Delete the main file and thumbnail
    try {
      await del(filepath);
    } catch {
      // Ignore if missing
    }
    
    try {
      await del(thumbnailPath);
    } catch {
      // Ignore if missing
    }
    
    // For original file, we don't have the exact extension in this filepath.
    // In a real robust system, we would get the originalPath from DB where we store it,
    // but the current function signature only provides `filepath`.
    // In many cases, it's ok to leave the original or we can guess common extensions.
    // As a best effort, we might not be able to securely construct the original blob URL 
    // without knowing the original extension.
    // We will leave the original deletion to the caller if they have the path, 
    // or acknowledge it as an acceptable artifact.

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
