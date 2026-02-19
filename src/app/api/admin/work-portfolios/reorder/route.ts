import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth/auth';
import { z } from 'zod';
import { logger } from "@/lib/logger";

const ReorderSchema = z.object({
  itemId: z.string().min(1),
  newOrder: z.number().int().min(0),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { itemId, newOrder } = ReorderSchema.parse(body);

    const currentItem = await prisma.workPortfolio.findUnique({
      where: { id: itemId },
    });

    if (!currentItem) {
      return NextResponse.json(
        { success: false, message: '아이템을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // Use transaction with temporary negative values to avoid unique constraint violations
    await prisma.$transaction(async (tx) => {
      // Get all items in the section sorted by current order
      const allItems = await tx.workPortfolio.findMany({
        where: { sectionId: currentItem.sectionId },
        orderBy: { order: 'asc' },
      });

      // Build the new ordered list in a single pass:
      // 1. Remove the moved item from the list
      // 2. Insert it at the target position (newOrder index)
      const otherItems = allItems.filter((item) => item.id !== itemId);
      const clampedOrder = Math.min(newOrder, otherItems.length);
      const reorderedIds: string[] = [
        ...otherItems.slice(0, clampedOrder).map((item) => item.id),
        itemId,
        ...otherItems.slice(clampedOrder).map((item) => item.id),
      ];

      // First pass: set all items to temporary negative values to avoid constraint conflicts
      for (let i = 0; i < reorderedIds.length; i++) {
        await tx.workPortfolio.update({
          where: { id: reorderedIds[i] },
          data: { order: -(i + 1) },
        });
      }

      // Second pass: set final positive order values
      for (let i = 0; i < reorderedIds.length; i++) {
        await tx.workPortfolio.update({
          where: { id: reorderedIds[i] },
          data: { order: i },
        });
      }
    });

    const updated = await prisma.workPortfolio.findUnique({
      where: { id: itemId },
      include: { media: true },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: '순서가 변경되었습니다',
    });
  } catch (error) {
    console.error('순서 변경 에러:', error);
    return NextResponse.json(
      { success: false, message: '순서 변경 실패' },
      { status: 500 }
    );
  }
}
