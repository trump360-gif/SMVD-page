'use client';

import { useState } from 'react';
import type {
  GraduateContent,
  GraduateCourseItemData,
  ThesisCardData,
} from '@/lib/validation/curriculum';
import CurriculumSectionEditor from './CurriculumSectionEditor';
import ThesisTable from './ThesisTable';

// ============================================================
// Default data matching GraduateTab.tsx hardcoded values
// ============================================================

const DEFAULT_MASTER = {
  id: 'master',
  title: 'Master',
  leftCourses: [
    { title: '시각영상디자인' },
    { title: '시각영상디자인세미나' },
    { title: '시각영상디자인론' },
  ],
  rightCourses: [
    { title: '논문디자인&리서치' },
    { title: '디자인연구방법론' },
    { title: '논문연구' },
  ],
};

const DEFAULT_DOCTOR = {
  id: 'doctor',
  title: 'Doctor',
  leftCourses: [
    { title: '뉴미디어컨텐츠디자인개발연구' },
    { title: '시각영상디자인론연구' },
    { title: '연구방법론세미나' },
  ],
  rightCourses: [
    { title: '시각영상디자인논문연구' },
    { title: '시각영상디자인스튜디오' },
    { title: '시각영상디자인세미나' },
  ],
};

const DEFAULT_THESES: ThesisCardData[] = [
  {
    category: 'UX/UI',
    title: 'AI 기반 3D 애니메이션 제작 기술의 프리 프로덕션 활용 연구',
    date: '2025 11.',
  },
  {
    category: 'UX/UI',
    title: '바이브 코딩 환경에서 디자이너의 역할 확장과 프로세스 재구',
    date: '2025. 11',
  },
  {
    category: 'UX/UI',
    title: '메타버스 상에서의 은둔형 외톨이 캐릭터 제작 연구',
    date: '2024. 10',
  },
  {
    category: 'UX/UI',
    title: '스타트업 UX 디자이너의 프로세스 분석을 통한 AI 활용 가능성 탐색',
    date: '2024. 07',
  },
  {
    category: 'UX/UI',
    title: '생성형 AI 도구를 활용한 게임 캐릭터 디자인 프로세스 연구',
    date: '2024. 06.',
  },
  {
    category: 'UX/UI',
    title: 'K-POP 및 C-POP 팝업스토어의 전략 차이 연구: 중국 Z세대의 소비 선호 분석을 바탕으로',
    date: '2024. 06',
  },
];

// ============================================================
// GraduateEditor Props
// ============================================================

export interface GraduateEditorProps {
  content?: GraduateContent | null;
  onSaveMaster?: (courses: { leftCourses: GraduateCourseItemData[]; rightCourses: GraduateCourseItemData[] }) => Promise<void>;
  onSaveDoctor?: (courses: { leftCourses: GraduateCourseItemData[]; rightCourses: GraduateCourseItemData[] }) => Promise<void>;
  onAddThesis?: (thesis: ThesisCardData) => Promise<void>;
  onEditThesis?: (index: number, thesis: ThesisCardData) => Promise<void>;
  onDeleteThesis?: (index: number) => Promise<void>;
  isSaving?: boolean;
}

// ============================================================
// Sub Tab Config
// ============================================================

type GradSubTab = 'master' | 'doctor' | 'thesis';

const GRAD_SUB_TABS: { key: GradSubTab; label: string }[] = [
  { key: 'master', label: 'Master' },
  { key: 'doctor', label: 'Doctor' },
  { key: 'thesis', label: 'Graduation Thesis' },
];

// ============================================================
// GraduateEditor (Main)
// ============================================================

export default function GraduateEditor({
  content,
  onSaveMaster,
  onSaveDoctor,
  onAddThesis,
  onEditThesis,
  onDeleteThesis,
  isSaving,
}: GraduateEditorProps) {
  const [activeSubTab, setActiveSubTab] = useState<GradSubTab>('master');

  // Use content from props if available, otherwise fall back to defaults
  const masterSection = content?.master ?? DEFAULT_MASTER;
  const doctorSection = content?.doctor ?? DEFAULT_DOCTOR;
  const theses = content?.theses ?? DEFAULT_THESES;

  return (
    <div className="space-y-6">
      {/* Sub Tab Navigation */}
      <div className="flex gap-2 bg-white rounded-lg shadow p-1">
        {GRAD_SUB_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSubTab(tab.key)}
            className={`flex-1 px-4 py-3 font-medium rounded-lg transition-colors text-sm ${
              activeSubTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeSubTab === 'master' && (
          <CurriculumSectionEditor
            section={masterSection}
            onSave={onSaveMaster}
            isSaving={isSaving}
          />
        )}

        {activeSubTab === 'doctor' && (
          <CurriculumSectionEditor
            section={doctorSection}
            onSave={onSaveDoctor}
            isSaving={isSaving}
          />
        )}

        {activeSubTab === 'thesis' && (
          <ThesisTable
            theses={theses}
            onAddThesis={onAddThesis}
            onEditThesis={onEditThesis}
            onDeleteThesis={onDeleteThesis}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}
