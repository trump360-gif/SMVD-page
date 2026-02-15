import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth-check';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api-response';
import { z } from 'zod';

const UpdateProjectSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().min(1).optional(),
  email: z.string().email().optional(),
  description: z.string().optional(),
  year: z.string().optional(),
  heroImage: z.string().min(1).optional(),
  thumbnailImage: z.string().min(1).optional(),
  galleryImages: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

/**
 * GET /api/admin/work/projects/:id
 * 단일 프로젝트 조회
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { id } = await params;

    const project = await prisma.workProject.findUnique({
      where: { id },
    });

    if (!project) {
      return notFoundResponse('프로젝트');
    }

    return successResponse(project, '프로젝트 조회 성공');
  } catch (error) {
    console.error('프로젝트 조회 오류:', error);
    return errorResponse('프로젝트를 불러오는 중 오류가 발생했습니다', 'FETCH_ERROR', 500);
  }
}

/**
 * PUT /api/admin/work/projects/:id
 * 프로젝트 수정
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

    const validation = UpdateProjectSchema.safeParse(body);
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

    const existing = await prisma.workProject.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse('프로젝트');
    }

    const updated = await prisma.workProject.update({
      where: { id },
      data: validation.data,
    });

    return successResponse(updated, '프로젝트가 수정되었습니다');
  } catch (error) {
    console.error('프로젝트 수정 오류:', error);
    return errorResponse('프로젝트를 수정하는 중 오류가 발생했습니다', 'UPDATE_ERROR', 500);
  }
}

/**
 * DELETE /api/admin/work/projects/:id
 * 프로젝트 삭제
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { id } = await params;

    const existing = await prisma.workProject.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse('프로젝트');
    }

    await prisma.workProject.delete({ where: { id } });

    return successResponse(null, '프로젝트가 삭제되었습니다');
  } catch (error) {
    console.error('프로젝트 삭제 오류:', error);
    return errorResponse('프로젝트를 삭제하는 중 오류가 발생했습니다', 'DELETE_ERROR', 500);
  }
}
