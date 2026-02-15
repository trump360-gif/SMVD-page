import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import z from 'zod';

// 인증 확인
async function requireAuth() {
  const session = await getServerSession();
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

    // 교수 존재 여부 확인
    const person = await prisma.people.findUnique({
      where: { id: personId },
      select: { id: true, order: true },
    });

    if (!person) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    const oldOrder = person.order;

    // 트랜잭션을 사용하여 안전하게 순서 변경
    await prisma.$transaction(async (tx) => {
      if (newOrder > oldOrder) {
        // 아래로 이동
        await tx.people.updateMany({
          where: {
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

    // 업데이트 후 모든 교수를 반환
    const updatedPeople = await prisma.people.findMany({
      where: { archivedAt: null },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        title: true,
        role: true,
        order: true,
      },
    });

    return NextResponse.json({ people: updatedPeople });
  } catch (error) {
    console.error('PUT reorder people error:', error);
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
