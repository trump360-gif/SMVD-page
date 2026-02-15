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

// 교수 정보 업데이트 스키마
const ProfessorUpdateSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  role: z.enum(['professor', 'instructor']).optional(),
  office: z.string().optional(),
  email: z.array(z.string()).optional(),
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

// PUT: 교수 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = ProfessorUpdateSchema.parse(body);

    // 교수 존재 여부 확인
    const existingPerson = await prisma.people.findUnique({
      where: { id },
    });

    if (!existingPerson) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    const updatedPerson = await prisma.people.update({
      where: { id },
      data: {
        ...validatedData,
      },
    });

    return NextResponse.json({ person: updatedPerson });
  } catch (error) {
    console.error('PUT person error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update person' },
      { status: 500 }
    );
  }
}

// DELETE: 교수 삭제 (소프트 삭제)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // 교수 존재 여부 확인
    const existingPerson = await prisma.people.findUnique({
      where: { id },
    });

    if (!existingPerson) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    // 소프트 삭제 (archived_at 설정)
    const deletedPerson = await prisma.people.update({
      where: { id },
      data: {
        archivedAt: new Date(),
      },
    });

    return NextResponse.json({ person: deletedPerson });
  } catch (error) {
    console.error('DELETE person error:', error);
    return NextResponse.json(
      { error: 'Failed to delete person' },
      { status: 500 }
    );
  }
}
