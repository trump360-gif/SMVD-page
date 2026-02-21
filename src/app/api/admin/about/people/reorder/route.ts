import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { logger } from "@/lib/logger";

// 인증 확인
async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return null;
  }
  return session;
}

// 재정렬 스키마
const ReorderSchema = z.object({
  personId: z.string(),
  newOrder: z.number(),
});

// PUT: 교수 순서 변경
export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { personId, newOrder } = ReorderSchema.parse(body);

    // 교수 존재 여부 확인 (role 포함)
    const person = await prisma.people.findUnique({
      where: { id: personId },
      select: { id: true, order: true, role: true },
    });

    if (!person) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    const oldOrder = person.order;
    // 같은 role 내에서만 순서 변경 (교수↔강사 order 충돌 방지)
    const roleFilter = person.role === 'instructor'
      ? { role: 'instructor' }
      : { OR: [{ role: 'professor' }, { role: null }] };

    // 트랜잭션을 사용하여 안전하게 순서 변경
    await prisma.$transaction(async (tx) => {
      if (newOrder > oldOrder) {
        // 아래로 이동
        await tx.people.updateMany({
          where: {
            ...roleFilter,
            order: {
              gt: oldOrder,
              lte: newOrder,
            },
            archivedAt: null,
          },
          data: {
            order: {
              decrement: 1,
            },
          },
        });
      } else if (newOrder < oldOrder) {
        // 위로 이동
        await tx.people.updateMany({
          where: {
            ...roleFilter,
            order: {
              gte: newOrder,
              lt: oldOrder,
            },
            archivedAt: null,
          },
          data: {
            order: {
              increment: 1,
            },
          },
        });
      }

      // 해당 교수의 순서를 새로운 값으로 설정
      await tx.people.update({
        where: { id: personId },
        data: { order: newOrder },
      });
    });

    // 업데이트 후 모든 교수를 반환 (전체 필드)
    const updatedPeople = await prisma.people.findMany({
      where: { archivedAt: null },
      orderBy: { order: 'asc' },
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
        order: true,
      },
    });

    // ISR 캐시 무효화
    revalidatePath('/about');

    return NextResponse.json({ people: updatedPeople });
  } catch (error) {
    logger.error({ err: error, context: 'PUT /api/admin/about/people/reorder' }, 'PUT reorder people error');
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to reorder people' },
      { status: 500 }
    );
  }
}
