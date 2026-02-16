import { NextRequest } from 'next/server';
import { checkAdminAuth } from '@/lib/auth-check';
import {
  successResponse,
  errorResponse,
} from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import crypto from 'crypto';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB for documents

/**
 * POST /api/admin/upload/document
 * 문서 파일 업로드 (PDF, Word, Excel 등 모든 파일 타입 지원)
 * Returns: { id, filename, filepath, uploadedAt }
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    // FormData 파싱
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return errorResponse('파일이 필요합니다', 'MISSING_FILE', 400);
    }

    // 파일 크기 확인
    if (file.size > MAX_FILE_SIZE) {
      return errorResponse(
        `파일 크기는 50MB 이하여야 합니다 (현재: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
        'FILE_TOO_LARGE',
        400
      );
    }

    // 파일 확장자 검증 (위험한 타입 차단)
    const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (BLOCKED_EXTENSIONS.includes(fileExtension)) {
      return errorResponse(
        '보안 정책상 이 파일 형식은 업로드할 수 없습니다',
        'BLOCKED_FILE_TYPE',
        400
      );
    }

    // 파일을 Buffer로 변환
    const buffer = Buffer.from(await file.arrayBuffer());

    // 저장 경로 생성 (날짜별 폴더)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const uploadDir = join(process.cwd(), 'public', 'uploads', String(year), month);

    // 폴더 생성 (없으면)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 파일명 생성 (해시 + 원본명)
    const hash = crypto.randomBytes(8).toString('hex');
    const cleanFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
    const savedFilename = `${hash}-${cleanFilename}`;
    const filepath = join(uploadDir, savedFilename);

    // 파일 저장
    await writeFile(filepath, buffer);

    // 공개 URL 생성 (클라이언트가 접근 가능한 경로)
    const publicUrl = `/uploads/${year}/${month}/${savedFilename}`;

    if (process.env.DEBUG) {
      console.log('[API POST /upload/document]', {
        filename: file.name,
        savedFilename,
        publicUrl,
        size: file.size,
      });
    }

    return successResponse(
      {
        id: hash,
        filename: file.name,
        filepath: publicUrl,
        mimeType: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      },
      '파일이 업로드되었습니다',
      201
    );
  } catch (error) {
    logger.error(
      { err: error, context: 'POST /api/admin/upload/document' },
      '파일 업로드 오류'
    );
    return errorResponse(
      '파일을 업로드하는 중 오류가 발생했습니다',
      'UPLOAD_ERROR',
      500
    );
  }
}
