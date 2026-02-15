import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth-check';
import { successResponse, errorResponse } from '@/lib/api-response';
import { z } from 'zod';

const ReorderSchema = z.object({
  articleId: z.string().min(1),
  newOrder: z.number().int().min(0),
});

/**
 * PUT /api/admin/news/articles/reorder
 * 뉴스 순서 변경 (트랜잭션 기반, unique constraint 안전)
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const validation = ReorderSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('유효하지 않은 요청입니다', 'VALIDATION_ERROR', 400);
    }

    const { articleId, newOrder } = validation.data;

    const currentArticle = await prisma.newsEvent.findUnique({
      where: { id: articleId },
    });

    if (!currentArticle) {
      return errorResponse('뉴스를 찾을 수 없습니다', 'NOT_FOUND', 404);
    }

    // Transaction with two-pass approach to avoid unique constraint violations
    await prisma.$transaction(async (tx) => {
      const allArticles = await tx.newsEvent.findMany({
        orderBy: { order: 'asc' },
      });

      // First pass: set temporary negative orders
      let idx = 0;
      for (const article of allArticles) {
        if (article.id === articleId) continue;

        if (idx === newOrder) idx++;

        await tx.newsEvent.update({
          where: { id: article.id },
          data: { order: -(idx + 100) },
        });
        idx++;
      }

      await tx.newsEvent.update({
        where: { id: articleId },
        data: { order: -(newOrder + 100) },
      });

      // Second pass: set final positive orders
      idx = 0;
      for (const article of allArticles) {
        if (article.id === articleId) continue;

        if (idx === newOrder) idx++;

        await tx.newsEvent.update({
          where: { id: article.id },
          data: { order: idx },
        });
        idx++;
      }

      await tx.newsEvent.update({
        where: { id: articleId },
        data: { order: newOrder },
      });
    });

    const updated = await prisma.newsEvent.findUnique({
      where: { id: articleId },
    });

    return successResponse(updated, '순서가 변경되었습니다');
  } catch (error) {
    console.error('뉴스 순서 변경 오류:', error);
    return errorResponse('순서 변경 중 오류가 발생했습니다', 'REORDER_ERROR', 500);
  }
}
