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
  sectionId: z.string(),
  newOrder: z.number(),
});

// PUT: 섹션 순서 변경
export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sectionId, newOrder } = ReorderSchema.parse(body);

    // 섹션 존재 여부 확인
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      select: { id: true, order: true, pageId: true },
    });

    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    const oldOrder = section.order;

    // 트랜잭션을 사용하여 안전하게 순서 변경
    await prisma.$transaction(async (tx) => {
      if (newOrder > oldOrder) {
        // 아래로 이동: oldOrder < order <= newOrder 범위의 섹션들을 위로 올림
        await tx.section.updateMany({
          where: {
            pageId: section.pageId,
            order: {
              gt: oldOrder,
              lte: newOrder,
            },
          },
          data: {
            order: {
              decrement: 1,
            },
          },
        });
      } else if (newOrder < oldOrder) {
        // 위로 이동: newOrder <= order < oldOrder 범위의 섹션들을 아래로 내림
        await tx.section.updateMany({
          where: {
            pageId: section.pageId,
            order: {
              gte: newOrder,
              lt: oldOrder,
            },
          },
          data: {
            order: {
              increment: 1,
            },
          },
        });
      }

      // 해당 섹션의 순서를 새로운 값으로 설정
      await tx.section.update({
        where: { id: sectionId },
        data: { order: newOrder },
      });
    });

    // 업데이트 후 모든 섹션을 반환
    const updatedSections = await prisma.section.findMany({
      where: { pageId: section.pageId },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ sections: updatedSections });
  } catch (error) {
    console.error('PUT reorder sections error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to reorder sections' },
      { status: 500 }
    );
  }
}
