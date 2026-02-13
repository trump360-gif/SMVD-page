'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';

interface Section {
  id: string;
  type: string;
  title?: string;
  order: number;
}

interface SectionItemProps {
  section: Section;
  index: number;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

const sectionTypeLabels: Record<string, string> = {
  HERO: 'Hero 배너',
  TEXT_BLOCK: '텍스트',
  IMAGE_GALLERY: '이미지 갤러리',
  TWO_COLUMN: '2열 레이아웃',
  THREE_COLUMN: '3열 카드',
  VIDEO_EMBED: '비디오',
  CTA_BUTTON: 'CTA 섹션',
  STATS: '통계',
  TEAM_GRID: '팀 멤버',
  PORTFOLIO_GRID: '포트폴리오',
  NEWS_GRID: '뉴스',
  CURRICULUM_TABLE: '교과과정',
  FACULTY_LIST: '교수진',
  EVENT_LIST: '이벤트',
  CONTACT_FORM: '연락 폼',
};

export default function SectionItem({
  section,
  index,
  onDelete,
  disabled,
}: SectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-6 flex items-center gap-4 ${
        isDragging ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'
      } transition-all`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex-shrink-0 cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M8 4a2 2 0 100-4H8a2 2 0 000 4zm0 6a2 2 0 100-4H8a2 2 0 000 4zm0 6a2 2 0 100-4H8a2 2 0 000 4zM12 4a2 2 0 100-4h0a2 2 0 000 4zm0 6a2 2 0 100-4h0a2 2 0 000 4zm0 6a2 2 0 100-4h0a2 2 0 000 4z" />
        </svg>
      </div>

      {/* Index */}
      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
        {index + 1}
      </div>

      {/* Info */}
      <div className="flex-grow">
        <p className="font-semibold text-gray-900">
          {section.title || sectionTypeLabels[section.type] || section.type}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {sectionTypeLabels[section.type] || section.type}
        </p>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex gap-2">
        <button
          className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          title="편집"
        >
          ✎
        </button>
        <button
          onClick={() => onDelete(section.id)}
          className="px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
          title="삭제"
          disabled={disabled}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
