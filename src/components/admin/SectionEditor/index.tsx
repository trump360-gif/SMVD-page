'use client';

import { useEffect, useState } from 'react';
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
import SectionItem from './SectionItem';

interface Section {
  id: string;
  type: string;
  title?: string;
  order: number;
}

interface SectionEditorProps {
  pageId: string;
  initialSections: Section[];
}

export default function SectionEditor({
  pageId,
  initialSections,
}: SectionEditorProps) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 드래그 종료 시
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      // 낙관적 업데이트 (UI 즉시 반영)
      const newSections = arrayMove(sections, oldIndex, newIndex).map((s, idx) => ({
        ...s,
        order: idx,
      }));
      setSections(newSections);

      // 서버에 저장
      try {
        setLoading(true);
        const res = await fetch('/api/admin/sections/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageId,
            sections: newSections.map((s) => ({
              id: s.id,
              order: s.order,
            })),
          }),
        });

        if (!res.ok) {
          // 실패 시 롤백
          setSections(sections);
          throw new Error('순서 변경에 실패했습니다');
        }

        setMessage({
          type: 'success',
          text: '섹션 순서가 변경되었습니다',
        });
      } catch (error) {
        setMessage({
          type: 'error',
          text: error instanceof Error ? error.message : '오류가 발생했습니다',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('이 섹션을 삭제하시겠습니까?')) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/sections/${sectionId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('섹션 삭제에 실패했습니다');

      setSections(sections.filter((s) => s.id !== sectionId));
      setMessage({
        type: 'success',
        text: '섹션이 삭제되었습니다',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '오류가 발생했습니다',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
          <button
            onClick={() => setMessage(null)}
            className="float-right text-xl leading-none"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sections */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">섹션</h2>
          <p className="text-sm text-gray-600">
            섹션을 드래그하여 순서를 변경할 수 있습니다
          </p>
        </div>

        {sections.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">아직 섹션이 없습니다</p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
              + 섹션 추가
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
              disabled={loading}
            >
              <div className="divide-y divide-gray-200">
                {sections.map((section, idx) => (
                  <SectionItem
                    key={section.id}
                    section={section}
                    index={idx}
                    onDelete={handleDeleteSection}
                    disabled={loading}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Add Section Button */}
      <div className="mt-6 flex gap-4">
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          + 섹션 추가
        </button>
      </div>
    </div>
  );
}
