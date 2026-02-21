'use client';

import { useState } from 'react';
import { AboutSection } from '@/hooks/useAboutEditor';

interface SectionEditorProps {
  section: AboutSection;
  onChange: (
    sectionId: string,
    title: string,
    content: Record<string, unknown>,
  ) => void;
}

const SECTION_TITLES: Record<string, string> = {
  ABOUT_INTRO: '학과 소개 (Intro)',
  ABOUT_VISION: '비전 (Vision)',
  ABOUT_HISTORY: '역사 (History)',
  ABOUT_PEOPLE: '교수/강사 (People)',
};

export default function SectionEditor({ section, onChange }: SectionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const content = (section.content ?? {}) as Record<string, unknown>;
  const title = section.title || '';

  const handleContentChange = (newContent: Record<string, unknown>) => {
    onChange(section.id, title, newContent);
  };

  const handleTitleChange = (newTitle: string) => {
    onChange(section.id, newTitle, content);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="text-left">
          <h3 className="text-lg font-semibold">
            {SECTION_TITLES[section.type] || section.type}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {section.title || '제목 없음'}
          </p>
        </div>
        <span className="text-gray-400 text-sm">
          {isExpanded ? '접기' : '펼치기'}
        </span>
      </button>

      {isExpanded && (
        <div className="border-t p-6 bg-gray-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="섹션 제목"
              />
            </div>

            <ContentEditor
              type={section.type}
              content={content}
              onChange={handleContentChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// -- Content Editor per section type --

interface ContentEditorProps {
  type: string;
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

function ContentEditor({ type, content, onChange }: ContentEditorProps) {
  switch (type) {
    case 'ABOUT_INTRO':
      return <IntroEditor content={content} onChange={onChange} />;
    case 'ABOUT_VISION':
      return <VisionEditor content={content} onChange={onChange} />;
    case 'ABOUT_HISTORY':
      return <HistoryEditor content={content} onChange={onChange} />;
    default:
      return (
        <div className="text-gray-500 p-4">
          이 섹션 타입은 아직 편집을 지원하지 않습니다.
        </div>
      );
  }
}

// -- Intro Section Editor (controlled) --

function IntroEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}) {
  const introTitle = (content?.title as string) || '';
  const description = (content?.description as string) || '';
  const imageSrc = (content?.imageSrc as string) || '';

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          소개 제목
        </label>
        <input
          type="text"
          value={introTitle}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="학과 소개 제목"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          설명
        </label>
        <textarea
          value={description}
          onChange={(e) => onChange({ ...content, description: e.target.value })}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="학과 소개 설명"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이미지 경로
        </label>
        <input
          type="text"
          value={imageSrc}
          onChange={(e) => onChange({ ...content, imageSrc: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="/images/about/image 32.png"
        />
      </div>
    </>
  );
}

// -- Vision Section Editor (controlled) --

function VisionEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}) {
  const visionTitle = (content?.title as string) || '';
  const visionContent = (content?.content as string) || '';
  const chips = (content?.chips as string[]) || [];
  const chipsText = chips.join(', ');

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          비전 제목
        </label>
        <input
          type="text"
          value={visionTitle}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="비전 제목"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          내용
        </label>
        <textarea
          value={visionContent}
          onChange={(e) => onChange({ ...content, content: e.target.value })}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="비전 내용"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          칩 (쉼표로 구분)
        </label>
        <input
          type="text"
          value={chipsText}
          onChange={(e) =>
            onChange({
              ...content,
              chips: e.target.value
                .split(',')
                .map((c) => c.trim())
                .filter(Boolean),
            })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="UX/UI, Graphic, Editorial, Illustration, Branding"
        />
        <p className="text-xs text-gray-500 mt-1">
          현재: {chips.length}개
        </p>
      </div>
    </>
  );
}

// -- History Section Editor (controlled) --

interface TimelineItem {
  year: string;
  description: string;
}

function HistoryEditor({
  content,
  onChange,
}: {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}) {
  const historyTitle = (content?.title as string) || '';
  const introText = (content?.introText as string) || '';
  const timelineItems = (content?.timelineItems as TimelineItem[]) || [];

  const updateTimelineItem = (
    idx: number,
    field: keyof TimelineItem,
    value: string,
  ) => {
    const newItems = timelineItems.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item,
    );
    onChange({ ...content, timelineItems: newItems });
  };

  const addTimelineItem = () => {
    onChange({
      ...content,
      timelineItems: [...timelineItems, { year: '', description: '' }],
    });
  };

  const removeTimelineItem = (idx: number) => {
    onChange({
      ...content,
      timelineItems: timelineItems.filter((_, i) => i !== idx),
    });
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          역사 제목
        </label>
        <input
          type="text"
          value={historyTitle}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="역사 제목"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          소개 텍스트
        </label>
        <textarea
          value={introText}
          onChange={(e) => onChange({ ...content, introText: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="역사 소개 (줄바꿈은 Enter로 입력)"
        />
        <p className="text-xs text-gray-500 mt-1">Enter를 눌러 줄바꿈하세요</p>
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            타임라인 항목 ({timelineItems.length}개)
          </label>
          <button
            type="button"
            onClick={addTimelineItem}
            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
          >
            + 항목 추가
          </button>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {timelineItems.map((item, idx) => (
            <div key={idx} className="space-y-1 pb-2 border-b border-gray-200">
              <div className="flex gap-2 items-start">
                <input
                  type="text"
                  value={item.year}
                  onChange={(e) =>
                    updateTimelineItem(idx, 'year', e.target.value)
                  }
                  placeholder="년도"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <textarea
                  value={item.description}
                  onChange={(e) =>
                    updateTimelineItem(idx, 'description', e.target.value)
                  }
                  placeholder="내용 (Enter로 줄바꿈)"
                  rows={2}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
                <button
                  type="button"
                  onClick={() => removeTimelineItem(idx)}
                  className="px-2 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors text-sm font-medium"
                  title="삭제"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
