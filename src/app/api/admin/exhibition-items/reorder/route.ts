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

    const currentItem = await prisma.exhibitionItem.findUnique({
      where: { id: itemId },
    });

    if (!currentItem) {
      return NextResponse.json(
        { success: false, message: '아이템을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // Use transaction with temporary order values to avoid constraint violations
    await prisma.$transaction(async (tx) => {
      // Get all items in the section sorted by order
      const allItems = await tx.exhibitionItem.findMany({
        where: { sectionId: currentItem.sectionId },
        orderBy: { order: 'asc' },
      });

      // Create new order map with temporary negative values
      const orderMap = new Map<string, number>();
      let newIdx = 0;

      for (const item of allItems) {
        if (item.id === itemId) {
          continue;
        }

        if (newIdx === newOrder) {
          newIdx++;
        }

        orderMap.set(item.id, -(newIdx + 100));
        newIdx++;
      }

      orderMap.set(itemId, -(newOrder + 100));

      // First pass: update all items with temporary negative values
      for (const [id, tempOrder] of orderMap) {
        await tx.exhibitionItem.update({
          where: { id },
          data: { order: tempOrder },
        });
      }

      // Second pass: update with final positive values
      newIdx = 0;
      for (const item of allItems) {
        if (item.id === itemId) {
          continue;
        }

        if (newIdx === newOrder) {
          newIdx++;
        }

        await tx.exhibitionItem.update({
          where: { id: item.id },
          data: { order: newIdx },
        });
        newIdx++;
      }

      // Update the moved item with final order
      await tx.exhibitionItem.update({
        where: { id: itemId },
        data: { order: newOrder },
      });
    });

    const updated = await prisma.exhibitionItem.findUnique({
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
