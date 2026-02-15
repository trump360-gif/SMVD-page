import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import z from 'zod';

// 인증 확인
async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return null;
  }
  return session;
}

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
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
        courses: true,
        biography: true,
        order: true,
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ people });
  } catch (error) {
    console.error('GET people error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch people' },
      { status: 500 }
    );
  }
}

// POST: 새 교수 추가
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
        courses: validatedData.courses ?? undefined,
        biography: validatedData.biography ?? undefined,
        order: nextOrder,
        published: true,
      },
    });

    return NextResponse.json({ person: newPerson }, { status: 201 });
  } catch (error) {
    console.error('POST people error:', error);
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
