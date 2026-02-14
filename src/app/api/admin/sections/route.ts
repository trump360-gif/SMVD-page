import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth-check';
import { successResponse, errorResponse } from '@/lib/api-response';
import { z } from 'zod';

const sectionSchema = z.object({
  pageId: z.string().optional(),
  type: z.string().optional(),
  title: z.string().optional(),
  content: z.any().optional(),
  order: z.number().optional(),
  mediaIds: z.array(z.string()).optional(),
});

const sectionCreateSchema = z.object({
  pageId: z.string().min(1, 'pageId is required'),
  type: z.string().min(1, 'type is required'),
  title: z.string().optional(),
  content: z.any().optional(),
  order: z.number().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const pageId = request.nextUrl.searchParams.get('pageId');

    if (!pageId) {
      return errorResponse('pageId 파라미터는 필수입니다', 'MISSING_PARAM', 400);
    }

    const sections = await prisma.section.findMany({
      where: { pageId },
      orderBy: { order: 'asc' },
      include: {
        exhibitionItems: {
          orderBy: { order: 'asc' },
          include: { media: true },
        },
        workPortfolios: {
          orderBy: { order: 'asc' },
          include: { media: true },
        },
      },
    });

    return successResponse(sections, '섹션 목록을 조회했습니다');
  } catch (error) {
    console.error('섹션 조회 오류:', error);
    return errorResponse('섹션을 조회하는 중 오류가 발생했습니다', 'FETCH_ERROR', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const parsed = sectionCreateSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse('Invalid section data', 'VALIDATION_ERROR', 400);
    }

    const section = await prisma.section.create({
      data: {
        pageId: parsed.data.pageId,
        type: parsed.data.type as any,
        title: parsed.data.title || null,
        content: parsed.data.content || null,
        order: parsed.data.order || 0,
      },
    });

    return successResponse(section, '섹션이 생성되었습니다', 201);
  } catch (error) {
    console.error('섹션 생성 오류:', error);
    return errorResponse('섹션을 생성하는 중 오류가 발생했습니다', 'CREATE_ERROR', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const sectionId = request.nextUrl.searchParams.get('id');
    if (!sectionId) {
      return errorResponse('섹션 ID가 필요합니다', 'MISSING_ID', 400);
    }

    const body = await request.json();
    const parsed = sectionSchema.partial().safeParse(body);

    if (!parsed.success) {
      return errorResponse('Invalid section data', 'VALIDATION_ERROR', 400);
    }

    const section = await prisma.section.update({
      where: { id: sectionId },
      data: parsed.data as any,
    });

    return successResponse(section, '섹션이 수정되었습니다');
  } catch (error) {
    console.error('섹션 수정 오류:', error);
    return errorResponse('섹션을 수정하는 중 오류가 발생했습니다', 'UPDATE_ERROR', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const sectionId = request.nextUrl.searchParams.get('id');
    if (!sectionId) {
      return errorResponse('섹션 ID가 필요합니다', 'MISSING_ID', 400);
    }

    await prisma.section.delete({
      where: { id: sectionId },
    });

    return successResponse(null, '섹션이 삭제되었습니다');
  } catch (error) {
    console.error('섹션 삭제 오류:', error);
    return errorResponse('섹션을 삭제하는 중 오류가 발생했습니다', 'DELETE_ERROR', 500);
  }
}
