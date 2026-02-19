'use client';

import React, { useState, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';

interface ExhibitionItem {
  id: string;
  year: string;
  media?: {
    filepath?: string;
    filename?: string;
  };
  order: number;
}

interface ExhibitionItemsListProps {
  items: ExhibitionItem[];
  sectionId: string;
  onReorder: (itemId: string, newOrder: number) => Promise<void>;
  onDelete: (itemId: string) => Promise<void>;
}

function SortableItem({
  item,
  onDelete,
}: {
  item: ExhibitionItem;
  onDelete: (itemId: string) => Promise<void>;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors bg-white"
    >
      <button
        {...attributes}
        {...listeners}
        className="p-2 cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded transition-colors shrink-0"
        title="드래그해서 순서 변경"
      >
        <GripVertical size={20} className="text-gray-400" />
      </button>

      <div className="w-16 h-16 bg-gray-200 rounded shrink-0 flex items-center justify-center overflow-hidden">
        {item.media?.filepath ? (
          <img
            src={item.media.filepath}
            alt={`${item.year} 전시회`}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <span className="text-gray-400 text-xs">No Image</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900">{item.year}</p>
        <p className="text-sm text-gray-600 truncate">
          {item.media?.filename || 'No media'}
        </p>
      </div>

      <button
        onClick={async () => {
          try {
            await onDelete(item.id);
          } catch (err) {
            alert(err instanceof Error ? err.message : '삭제 실패');
          }
        }}
        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors shrink-0"
        title="삭제"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}

export default function ExhibitionItemsList({
  items: initialItems,
  sectionId,
  onReorder,
  onDelete,
}: ExhibitionItemsListProps) {
  const [items, setItems] = useState<ExhibitionItem[]>(initialItems || []);
  const [activeId, setActiveId] = useState<string | null>(null);
  // 드래그 시작 시점의 상태를 저장 - 클로저 버그 방지용
  const itemsBeforeDragRef = useRef<ExhibitionItem[]>(initialItems || []);

  // Sync with parent when items change
  React.useEffect(() => {
    setItems(initialItems || []);
  }, [initialItems]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    // 드래그 시작 시점의 상태를 ref에 저장 (클로저 버그 방지)
    itemsBeforeDragRef.current = items;
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = items[newIndex].order;
        // 복구용으로 ref에 저장된 드래그 전 상태를 사용
        const previousItems = itemsBeforeDragRef.current;

        // 로컬 state 먼저 업데이트 (즉시 UI 반영)
        const newItems = arrayMove(items, oldIndex, newIndex);
        setItems(newItems);

        try {
          await onReorder(active.id as string, newOrder);
        } catch (err) {
          // 에러 시 ref에 저장된 드래그 전 상태로 복구
          setItems(previousItems);
          alert(err instanceof Error ? err.message : '순서 변경 실패');
        }
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {items.length > 0 ? (
            items.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                onDelete={onDelete}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              아이템이 없습니다
            </div>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}
