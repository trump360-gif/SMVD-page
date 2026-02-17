'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import NavigationRow from './NavigationRow';
import type { NavigationItem, ReorderItem } from '@/hooks/useNavigationEditor';

// NavigationItem type re-used for toggle return type

interface NavigationTableProps {
  items: NavigationItem[];
  onEdit: (item: NavigationItem) => void;
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string) => Promise<void | NavigationItem>;
  onReorder: (items: ReorderItem[]) => Promise<void>;
}

export default function NavigationTable({
  items: initialItems,
  onEdit,
  onDelete,
  onToggle,
  onReorder,
}: NavigationTableProps) {
  const [items, setItems] = useState<NavigationItem[]>(initialItems || []);

  useEffect(() => {
    setItems(initialItems || []);
  }, [initialItems]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(items, oldIndex, newIndex);
        // Optimistic update
        setItems(newItems);

        // Build reorder payload with new sequential order values
        const reorderPayload: ReorderItem[] = newItems.map((item, index) => ({
          id: item.id,
          order: index,
        }));

        try {
          await onReorder(reorderPayload);
        } catch (err) {
          // Rollback on failure
          setItems(items);
          alert(err instanceof Error ? err.message : '순서 변경 실패');
        }
      }
    }
  };

  if (items.length === 0) {
    return (
      <div
        className="text-center py-12 text-gray-500"
        data-testid="navigation-empty-state"
      >
        메뉴가 없습니다. 상단의 메뉴 추가 버튼을 눌러 추가해주세요.
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="overflow-x-auto">
          <table
            className="w-full text-left"
            aria-label="네비게이션 메뉴 목록"
            data-testid="navigation-table"
          >
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-3 py-3 w-10 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="sr-only">순서 변경</span>
                </th>
                <th className="px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Label
                </th>
                <th className="px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Href
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active
                </th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <NavigationRow
                  key={item.id}
                  item={item}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggle={onToggle}
                />
              ))}
            </tbody>
          </table>
        </div>
      </SortableContext>
    </DndContext>
  );
}
