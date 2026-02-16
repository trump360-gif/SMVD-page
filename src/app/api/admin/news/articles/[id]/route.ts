import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth-check';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api-response';
import { z } from 'zod';

const GallerySchema = z.object({
  main: z.string().default(''),
  layout: z.string().default('1+2+3'),
  centerLeft: z.string().default(''),
  centerRight: z.string().default(''),
  bottomLeft: z.string().default(''),
  bottomCenter: z.string().default(''),
  bottomRight: z.string().default(''),
}).optional();

// Legacy content format (introTitle, introText, gallery)
const LegacyContentSchema = z.object({
  introTitle: z.string().optional(),
  introText: z.string().optional(),
  gallery: GallerySchema,
});

// Content can be either legacy or block format
// Use passthrough() to allow any JSON shape, since block content is complex and dynamic
const ContentSchema = z.union([
  LegacyContentSchema,
  z.object({
    blocks: z.array(z.any()),
    version: z.string(),
  }).passthrough(),
]).optional();

const UpdateArticleSchema = z.object({
  title: z.string().min(1).optional(),
  category: z.enum(['Notice', 'Event', 'Awards', 'Recruiting']).optional(),
  excerpt: z.string().nullable().optional(),
  thumbnailImage: z.string().optional(),
  content: ContentSchema.nullable(),
  publishedAt: z.string().optional(),
  published: z.boolean().optional(),
});

/**
 * GET /api/admin/news/articles/:id
 * 단일 뉴스 조회
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { id } = await params;

    const article = await prisma.newsEvent.findUnique({
      where: { id },
    });

    if (!article) {
      return notFoundResponse('뉴스');
    }

    return successResponse(article, '뉴스 조회 성공');
  } catch (error) {
    console.error('뉴스 조회 오류:', error);
    return errorResponse('뉴스를 불러오는 중 오류가 발생했습니다', 'FETCH_ERROR', 500);
  }
}

/**
 * PUT /api/admin/news/articles/:id
 * 뉴스 수정
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { id } = await params;
    const body = await request.json();

    const validation = UpdateArticleSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return errorResponse(
        '입력값 검증 실패: ' +
          Object.entries(errors)
            .map(([k, v]) => `${k}: ${(v as string[])?.[0]}`)
            .join(', '),
        'VALIDATION_ERROR',
        400
      );
    }

    const existing = await prisma.newsEvent.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse('뉴스');
    }

    const updateData: Record<string, unknown> = { ...validation.data };

    // Convert publishedAt string to Date if provided
    if (validation.data.publishedAt) {
      updateData.publishedAt = new Date(validation.data.publishedAt);
    }

    const updated = await prisma.newsEvent.update({
      where: { id },
      data: updateData,
    });

    return successResponse(updated, '뉴스가 수정되었습니다');
  } catch (error) {
    console.error('뉴스 수정 오류:', error);
    return errorResponse('뉴스를 수정하는 중 오류가 발생했습니다', 'UPDATE_ERROR', 500);
  }
}

/**
 * DELETE /api/admin/news/articles/:id
 * 뉴스 삭제
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { id } = await params;

    const existing = await prisma.newsEvent.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse('뉴스');
    }

    await prisma.newsEvent.delete({ where: { id } });

    return successResponse(null, '뉴스가 삭제되었습니다');
  } catch (error) {
    console.error('뉴스 삭제 오류:', error);
    return errorResponse('뉴스를 삭제하는 중 오류가 발생했습니다', 'DELETE_ERROR', 500);
  }
}
