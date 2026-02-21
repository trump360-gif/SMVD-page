import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth-check';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { logger } from "@/lib/logger";

// 교수 정보 스키마
const ProfessorSchema = z.object({
  name: z.string(),
  title: z.string(),
  role: z.enum(['professor', 'instructor']).optional(),
  office: z.string().optional(),
  email: z.array(z.string()),
  phone: z.string().optional(),
  major: z.string().optional(),
  specialty: z.string().optional(),
  badge: z.string().optional(),
  profileImage: z.string().optional(), // 프로필 이미지 경로
  courses: z.object({
    undergraduate: z.array(z.string()),
    graduate: z.array(z.string()),
  }).optional(),
  biography: z.object({
    cvText: z.string().optional(),
    position: z.string().optional(),
    education: z.array(z.string()),
    experience: z.array(z.string()),
  }).optional(),
});

// GET: 모든 교수/강사 조회
export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const people = await prisma.people.findMany({
      where: { archivedAt: null },
      select: {
        id: true,
        name: true,
        title: true,
        role: true,
        office: true,
        email: true,
        phone: true,
        major: true,
        specialty: true,
        badge: true,
        profileImage: true,
        courses: true,
        biography: true,
        mediaId: true,
        media: {
          select: {
            id: true,
            filename: true,
            filepath: true,
            mimeType: true,
            altText: true,
            width: true,
            height: true,
          },
        },
        order: true,
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ people });
  } catch (error) {
    logger.error({ err: error, context: 'GET /api/admin/about/people' }, 'GET people error');
    return NextResponse.json(
      { error: 'Failed to fetch people' },
      { status: 500 }
    );
  }
}

// POST: 새 교수 추가
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const validatedData = ProfessorSchema.parse(body);

    // 다음 순서 번호 계산
    const lastPerson = await prisma.people.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const nextOrder = (lastPerson?.order || 0) + 1;

    const newPerson = await prisma.people.create({
      data: {
        name: validatedData.name,
        title: validatedData.title,
        role: validatedData.role,
        office: validatedData.office,
        email: validatedData.email,
        phone: validatedData.phone,
        major: validatedData.major,
        specialty: validatedData.specialty,
        badge: validatedData.badge,
        profileImage: validatedData.profileImage,
        courses: validatedData.courses ?? undefined,
        biography: validatedData.biography ?? undefined,
        order: nextOrder,
        published: true,
      },
    });

    revalidatePath('/about');

    return NextResponse.json({ person: newPerson }, { status: 201 });
  } catch (error) {
    logger.error({ err: error, context: 'POST /api/admin/about/people' }, 'POST people error');
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create person' },
      { status: 500 }
    );
  }
}
