'use client';

import { useState } from 'react';
import { AboutSection } from '@/hooks/useAboutEditor';

interface SectionEditorProps {
  section: AboutSection;
  onSave: (
    sectionId: string,
    type: string,
    title: string,
    content: Record<string, unknown>
  ) => Promise<void>;
}

const SECTION_TITLES: Record<string, string> = {
  ABOUT_INTRO: '학과 소개 (Intro)',
  ABOUT_VISION: '비전 (Vision)',
  ABOUT_HISTORY: '역사 (History)',
  ABOUT_PEOPLE: '교수/강사 (People)',
};

export default function SectionEditor({ section, onSave }: SectionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(section.title || '');

  const handleSave = async (content: Record<string, unknown>) => {
    try {
      setIsSaving(true);
      await onSave(section.id, section.type, title, content);
    } catch {
      // Error is handled in parent
    } finally {
      setIsSaving(false);
    }
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
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="섹션 제목"
              />
            </div>

            <ContentEditor
              type={section.type}
              content={section.content}
              isSaving={isSaving}
              onSave={handleSave}
              onCancel={() => setIsExpanded(false)}
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
  content: AboutSection['content'];
  isSaving: boolean;
  onSave: (content: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}

function ContentEditor({
  type,
  content,
  isSaving,
  onSave,
  onCancel,
}: ContentEditorProps) {
  switch (type) {
    case 'ABOUT_INTRO':
      return (
        <IntroEditor
          content={content as Record<string, unknown> | null}
          isSaving={isSaving}
          onSave={onSave}
          onCancel={onCancel}
        />
      );
    case 'ABOUT_VISION':
      return (
        <VisionEditor
          content={content as Record<string, unknown> | null}
          isSaving={isSaving}
          onSave={onSave}
          onCancel={onCancel}
        />
      );
    case 'ABOUT_HISTORY':
      return (
        <HistoryEditor
          content={content as Record<string, unknown> | null}
          isSaving={isSaving}
          onSave={onSave}
          onCancel={onCancel}
        />
      );
    default:
      return (
        <div className="text-gray-500 p-4">
          이 섹션 타입은 아직 편집을 지원하지 않습니다.
        </div>
      );
  }
}

// -- Intro Section Editor --

function IntroEditor({
  content,
  isSaving,
  onSave,
  onCancel,
}: {
  content: Record<string, unknown> | null;
  isSaving: boolean;
  onSave: (content: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}) {
  const [description, setDescription] = useState(
    (content?.description as string) || ''
  );
  const [imageSrc, setImageSrc] = useState(
    (content?.imageSrc as string) || ''
  );
  const [introTitle, setIntroTitle] = useState(
    (content?.title as string) || ''
  );

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          소개 제목
        </label>
        <input
          type="text"
          value={introTitle}
          onChange={(e) => setIntroTitle(e.target.value)}
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
          onChange={(e) => setDescription(e.target.value)}
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
          onChange={(e) => setImageSrc(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="/images/about/image 32.png"
        />
      </div>
      <SaveCancelButtons
        isSaving={isSaving}
        onSave={() =>
          onSave({
            title: introTitle,
            description,
            imageSrc,
          })
        }
        onCancel={onCancel}
      />
    </>
  );
}

// -- Vision Section Editor --

function VisionEditor({
  content,
  isSaving,
  onSave,
  onCancel,
}: {
  content: Record<string, unknown> | null;
  isSaving: boolean;
  onSave: (content: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}) {
  const [visionTitle, setVisionTitle] = useState(
    (content?.title as string) || ''
  );
  const [visionContent, setVisionContent] = useState(
    (content?.content as string) || ''
  );
  const [chipsText, setChipsText] = useState(
    ((content?.chips as string[]) || []).join(', ')
  );

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          비전 제목
        </label>
        <input
          type="text"
          value={visionTitle}
          onChange={(e) => setVisionTitle(e.target.value)}
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
          onChange={(e) => setVisionContent(e.target.value)}
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
          onChange={(e) => setChipsText(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="UX/UI, Graphic, Editorial, Illustration, Branding"
        />
        <p className="text-xs text-gray-500 mt-1">
          현재: {chipsText.split(',').filter((c) => c.trim()).length}개
        </p>
      </div>
      <SaveCancelButtons
        isSaving={isSaving}
        onSave={() =>
          onSave({
            title: visionTitle,
            content: visionContent,
            chips: chipsText
              .split(',')
              .map((c) => c.trim())
              .filter(Boolean),
          })
        }
        onCancel={onCancel}
      />
    </>
  );
}

// -- History Section Editor --

interface TimelineItem {
  year: string;
  text: string;
}

function HistoryEditor({
  content,
  isSaving,
  onSave,
  onCancel,
}: {
  content: Record<string, unknown> | null;
  isSaving: boolean;
  onSave: (content: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}) {
  const [historyTitle, setHistoryTitle] = useState(
    (content?.title as string) || ''
  );
  const [introText, setIntroText] = useState(
    (content?.introText as string) || ''
  );
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(
    (content?.timelineItems as TimelineItem[]) || []
  );

  const updateTimelineItem = (
    idx: number,
    field: keyof TimelineItem,
    value: string
  ) => {
    setTimelineItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const addTimelineItem = () => {
    setTimelineItems((prev) => [...prev, { year: '', text: '' }]);
  };

  const removeTimelineItem = (idx: number) => {
    setTimelineItems((prev) => prev.filter((_, i) => i !== idx));
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
          onChange={(e) => setHistoryTitle(e.target.value)}
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
          onChange={(e) => setIntroText(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="역사 소개"
        />
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
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                value={item.year}
                onChange={(e) =>
                  updateTimelineItem(idx, 'year', e.target.value)
                }
                placeholder="년도"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <input
                type="text"
                value={item.text}
                onChange={(e) =>
                  updateTimelineItem(idx, 'text', e.target.value)
                }
                placeholder="내용"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => removeTimelineItem(idx)}
                className="px-2 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                title="삭제"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
      <SaveCancelButtons
        isSaving={isSaving}
        onSave={() =>
          onSave({
            title: historyTitle,
            introText,
            timelineItems,
          })
        }
        onCancel={onCancel}
      />
    </>
  );
}

// -- Save/Cancel Buttons --

function SaveCancelButtons({
  isSaving,
  onSave,
  onCancel,
}: {
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSaving}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium disabled:opacity-50"
      >
        취소
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
      >
        {isSaving ? '저장 중...' : '저장'}
      </button>
    </div>
  );
}
