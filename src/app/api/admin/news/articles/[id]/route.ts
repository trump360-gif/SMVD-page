import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@/generated/prisma';
import { checkAdminAuth } from '@/lib/auth-check';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api-response';
import { z } from 'zod';
import { invalidateNews } from '@/lib/cache';
import { logger } from '@/lib/logger';

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
// 🔧 FIX: Block format MUST come FIRST in union!
// LegacyContentSchema has all optional fields, so if it's first, Zod matches it for everything
const ContentSchema = z.union([
  // Try block format FIRST (requires blocks + version)
  z.object({
    blocks: z.array(z.any()),
    version: z.string(),
  }).passthrough(),
  // Fall back to legacy format (all optional fields)
  LegacyContentSchema,
]).optional();

// Attachment schema for file metadata (NEW - 2026-02-16)
// Use passthrough() to allow flexible attachment object shapes (temporary IDs, missing fields)
const AttachmentSchema = z.object({}).passthrough().optional();

const UpdateArticleSchema = z.object({
  title: z.string().min(1).optional(),
  category: z.enum(['Notice', 'Event', 'Awards', 'Recruiting']).optional(),
  excerpt: z.string().nullable().optional(),
  thumbnailImage: z.string().optional(),
  content: ContentSchema.nullable(),
  attachments: z.array(z.object({}).passthrough()).nullable().optional(), // NEW - 2026-02-16
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

    // 🔧 Fix: Convert empty object {} to null for content field
    // Prisma stores JsonNull as {}, so we need to convert it back
    const articleData = {
      ...article,
      content: (article.content && Object.keys(article.content).length === 0)
        ? null
        : article.content,
    };

    return successResponse(articleData, '뉴스 조회 성공');
  } catch (error) {
    logger.error({ err: error, context: 'GET /api/admin/news/articles/:id' }, '뉴스 조회 오류');
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

    const updateData: Record<string, unknown> = {};

    // Copy all fields and convert types appropriately
    if (validation.data.title !== undefined) updateData.title = validation.data.title;
    if (validation.data.category !== undefined) updateData.category = validation.data.category;
    if (validation.data.excerpt !== undefined) updateData.excerpt = validation.data.excerpt;
    if (validation.data.thumbnailImage !== undefined) updateData.thumbnailImage = validation.data.thumbnailImage;
    if (validation.data.content !== undefined) {
      // Use Record<string, unknown> to access dynamic properties safely
      const content = validation.data.content as Record<string, unknown> | null;

      // CRITICAL: Explicitly reject empty objects - this is the core bug!
      if (content && typeof content === 'object' && JSON.stringify(content) === '{}') {
        return errorResponse(
          '콘텐츠가 비어있습니다. 최소 1개의 블록이 필요합니다.',
          'EMPTY_CONTENT',
          400
        );
      }

      // Check if content is valid (either block format or legacy format)
      // FIX: Require blocks array to have length > 0 to prevent data loss
      const blocks = content?.blocks;
      const isBlockFormat = Array.isArray(blocks) && blocks.length > 0;
      const isLegacyFormat = Boolean(content?.introTitle || content?.introText || content?.gallery);
      const isValidContent = isBlockFormat || isLegacyFormat;

      // Save valid content or null
      updateData.content = isValidContent
        ? (content as Prisma.InputJsonValue)
        : Prisma.JsonNull;
    }
    if (validation.data.attachments !== undefined) {
      updateData.attachments = validation.data.attachments && validation.data.attachments.length > 0
        ? (validation.data.attachments as Prisma.InputJsonValue)
        : Prisma.JsonNull;
    }
    if (validation.data.publishedAt !== undefined) updateData.publishedAt = new Date(validation.data.publishedAt);
    if (validation.data.published !== undefined) updateData.published = validation.data.published;

    const updated = await prisma.newsEvent.update({
      where: { id },
      data: updateData,
    });

    // Invalidate ISR caches
    invalidateNews();

    return successResponse(updated, '뉴스가 수정되었습니다');
  } catch (error) {
    logger.error({ err: error, context: 'PUT /api/admin/news/articles/:id' }, '뉴스 수정 오류');
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

    // Invalidate ISR caches
    invalidateNews();

    return successResponse(null, '뉴스가 삭제되었습니다');
  } catch (error) {
    logger.error({ err: error, context: 'DELETE /api/admin/news/articles/:id' }, '뉴스 삭제 오류');
    return errorResponse('뉴스를 삭제하는 중 오류가 발생했습니다', 'DELETE_ERROR', 500);
  }
}
