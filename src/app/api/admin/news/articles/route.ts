import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@/generated/prisma';
import { checkAdminAuth } from '@/lib/auth-check';
import {
  successResponse,
  errorResponse,
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

const CreateArticleSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  category: z.enum(['Notice', 'Event', 'Awards', 'Recruiting']),
  excerpt: z.string().optional(),
  thumbnailImage: z.string().default('/Group-27.svg'),
  content: ContentSchema,
  publishedAt: z.string().optional(),
  published: z.boolean().default(true),
});

/**
 * GET /api/admin/news/articles
 * 뉴스 게시글 전체 조회 (카테고리 필터 지원)
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where = category && category !== 'ALL'
      ? { category }
      : {};

    const articles = await prisma.newsEvent.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return successResponse(articles, '뉴스 목록 조회 성공');
  } catch (error) {
    console.error('뉴스 조회 오류:', error);
    return errorResponse('뉴스 목록을 불러오는 중 오류가 발생했습니다', 'FETCH_ERROR', 500);
  }
}

/**
 * POST /api/admin/news/articles
 * 새 뉴스 게시글 생성
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const validation = CreateArticleSchema.safeParse(body);

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

    const data = validation.data;

    // Get next order
    const lastArticle = await prisma.newsEvent.findFirst({
      orderBy: { order: 'desc' },
    });
    const nextOrder = lastArticle ? lastArticle.order + 1 : 0;

    // Generate slug from title
    const baseSlug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const slugCount = await prisma.newsEvent.count({
      where: { slug: { startsWith: baseSlug } },
    });
    const slug = slugCount > 0 ? `${baseSlug}-${slugCount + 1}` : baseSlug;

    const article = await prisma.newsEvent.create({
      data: {
        slug,
        title: data.title,
        category: data.category,
        excerpt: data.excerpt || null,
        thumbnailImage: data.thumbnailImage,
        content: data.content ? (data.content as Prisma.InputJsonValue) : Prisma.JsonNull,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
        published: data.published,
        order: nextOrder,
      },
    });

    return successResponse(article, '뉴스가 생성되었습니다', 201);
  } catch (error) {
    console.error('뉴스 생성 오류:', error);
    return errorResponse('뉴스를 생성하는 중 오류가 발생했습니다', 'CREATE_ERROR', 500);
  }
}

/**
 * PUT /api/admin/news/articles/:id
 * 뉴스 게시글 수정
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { id } = await params;
    const body = await request.json();

    // Validate update data (all fields optional for PUT)
    const updateSchema = z.object({
      title: z.string().min(1).optional(),
      category: z.enum(['Notice', 'Event', 'Awards', 'Recruiting']).optional(),
      excerpt: z.string().nullable().optional(),
      thumbnailImage: z.string().optional(),
      content: ContentSchema,
      publishedAt: z.string().optional(),
      published: z.boolean().optional(),
    });

    const validation = updateSchema.safeParse(body);

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

    const data = validation.data;

    // Build update object with only provided fields
    const updateData: Record<string, any> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.thumbnailImage !== undefined) updateData.thumbnailImage = data.thumbnailImage;
    if (data.content !== undefined) updateData.content = data.content ? (data.content as Prisma.InputJsonValue) : Prisma.JsonNull;
    if (data.publishedAt !== undefined) updateData.publishedAt = new Date(data.publishedAt);
    if (data.published !== undefined) updateData.published = data.published;

    const article = await prisma.newsEvent.update({
      where: { id },
      data: updateData,
    });

    return successResponse(article, '뉴스가 수정되었습니다');
  } catch (error) {
    console.error('뉴스 수정 오류:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      return errorResponse('해당 뉴스를 찾을 수 없습니다', 'NOT_FOUND', 404);
    }
    return errorResponse('뉴스를 수정하는 중 오류가 발생했습니다', 'UPDATE_ERROR', 500);
  }
}

/**
 * DELETE /api/admin/news/articles/:id
 * 뉴스 게시글 삭제
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { id } = await params;

    await prisma.newsEvent.delete({
      where: { id },
    });

    return successResponse(null, '뉴스가 삭제되었습니다');
  } catch (error) {
    console.error('뉴스 삭제 오류:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      return errorResponse('해당 뉴스를 찾을 수 없습니다', 'NOT_FOUND', 404);
    }
    return errorResponse('뉴스를 삭제하는 중 오류가 발생했습니다', 'DELETE_ERROR', 500);
  }
}
