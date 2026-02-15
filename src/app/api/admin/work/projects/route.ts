import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth-check';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api-response';
import { z } from 'zod';

const CreateProjectSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  subtitle: z.string().min(1, '부제는 필수입니다'),
  category: z.string().min(1, '카테고리는 필수입니다'),
  tags: z.array(z.string()).default([]),
  author: z.string().min(1, '작가명은 필수입니다'),
  email: z.string().email('유효한 이메일을 입력하세요'),
  description: z.string().default(''),
  year: z.string().default('2025'),
  heroImage: z.string().min(1, '히어로 이미지는 필수입니다'),
  thumbnailImage: z.string().min(1, '썸네일 이미지는 필수입니다'),
  galleryImages: z.array(z.string()).default([]),
  published: z.boolean().default(true),
});

/**
 * GET /api/admin/work/projects
 * Work 프로젝트 전체 조회
 */
export async function GET() {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const projects = await prisma.workProject.findMany({
      orderBy: { order: 'asc' },
    });

    return successResponse(projects, '프로젝트 목록 조회 성공');
  } catch (error) {
    console.error('프로젝트 조회 오류:', error);
    return errorResponse('프로젝트 목록을 불러오는 중 오류가 발생했습니다', 'FETCH_ERROR', 500);
  }
}

/**
 * POST /api/admin/work/projects
 * 새 Work 프로젝트 생성
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const validation = CreateProjectSchema.safeParse(body);

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

    // slug 자동 생성
    const lastProject = await prisma.workProject.findFirst({
      orderBy: { order: 'desc' },
    });
    const nextOrder = lastProject ? lastProject.order + 1 : 0;

    // slug: title 기반으로 생성
    const baseSlug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const slugCount = await prisma.workProject.count({
      where: { slug: { startsWith: baseSlug } },
    });
    const slug = slugCount > 0 ? `${baseSlug}-${slugCount + 1}` : baseSlug;

    const project = await prisma.workProject.create({
      data: {
        slug,
        title: data.title,
        subtitle: data.subtitle,
        category: data.category,
        tags: data.tags,
        author: data.author,
        email: data.email,
        description: data.description,
        year: data.year,
        heroImage: data.heroImage,
        thumbnailImage: data.thumbnailImage,
        galleryImages: data.galleryImages,
        order: nextOrder,
        published: data.published,
      },
    });

    return successResponse(project, '프로젝트가 생성되었습니다', 201);
  } catch (error) {
    console.error('프로젝트 생성 오류:', error);
    return errorResponse('프로젝트를 생성하는 중 오류가 발생했습니다', 'CREATE_ERROR', 500);
  }
}
