'use client';

import { useState } from 'react';
import type {
  UndergraduateContent,
  CourseData,
  SemesterData,
  TrackData,
  ModuleDetailData,
} from '@/lib/validation/curriculum';
import CourseTable from './CourseTable';
import TrackRequirementsTable from './TrackRequirementsTable';
import ModuleDetailsTable from './ModuleDetailsTable';

// ============================================================
// Default data matching UndergraduateTab.tsx hardcoded values
// ============================================================

const DEFAULT_SEMESTERS: SemesterData[] = [
  {
    year: 1,
    term: 1,
    courses: [
      { name: 'Basic Graphic Design I', color: '#ff5f5aff', classification: 'elective' },
      { name: 'Basic Visual Design I', color: '#ffcc54ff', classification: 'elective' },
      { name: 'Illustration and Storytelling Design I', color: '#a24affff', classification: 'elective' },
    ],
  },
  {
    year: 1,
    term: 2,
    courses: [
      { name: 'Basic Graphic Design II', color: '#ff5f5aff', classification: 'required' },
      { name: 'Basic Visual Design II', color: '#ffcc54ff', classification: 'elective' },
      { name: 'Illustration and Storytelling Design II', color: '#a24affff', classification: 'elective' },
      { name: 'Typography Design I', color: '#53c9ffff', classification: 'elective' },
      { name: 'Design and Culture', color: '#70d970ff', classification: 'elective' },
    ],
  },
  {
    year: 2,
    term: 1,
    courses: [
      { name: 'AI Startup Design I', color: '#ffcc54ff', classification: 'required' },
      { name: 'Brand Design I', color: '#1e90ffff', classification: 'elective' },
      { name: 'Data Visualization and Info Design I', color: '#ff6b9dff', classification: 'elective' },
      { name: 'Motion Design I', color: '#a24affff', classification: 'elective' },
      { name: 'Animation I', color: '#32cd32ff', classification: 'elective' },
      { name: 'Typography Design I', color: '#1e90ffff', classification: 'elective' },
      { name: 'Marketing Design', color: '#70d970ff', classification: 'elective' },
    ],
  },
  {
    year: 2,
    term: 2,
    courses: [
      { name: 'AI Startup Design II', color: '#ffcc54ff', classification: 'required' },
      { name: 'Brand Design II', color: '#1e90ffff', classification: 'elective' },
      { name: 'Data Visualization and Info Design II', color: '#ff6b9dff', classification: 'elective' },
      { name: 'Motion Design III', color: '#a24affff', classification: 'elective' },
      { name: 'Animation II', color: '#32cd32ff', classification: 'elective' },
      { name: 'Design Psychology', color: '#70d970ff', classification: 'elective' },
    ],
  },
  {
    year: 3,
    term: 1,
    courses: [
      { name: 'Advertising Design I', color: '#1e90ffff', classification: 'required' },
      { name: 'User Experience Design I', color: '#ff5f5aff', classification: 'required' },
      { name: 'Editorial Design I', color: '#70d970ff', classification: 'elective' },
      { name: 'YouTube Video Design I', color: '#ffcc54ff', classification: 'elective' },
      { name: 'AI Metaverse Design I', color: '#a24affff', classification: 'elective' },
    ],
  },
  {
    year: 3,
    term: 2,
    courses: [
      { name: 'Advertising Design II', color: '#1e90ffff', classification: 'required' },
      { name: 'User Experience Design II', color: '#ff5f5aff', classification: 'required' },
      { name: 'Editorial Design II', color: '#70d970ff', classification: 'elective' },
      { name: 'YouTube Video Design II', color: '#ffcc54ff', classification: 'elective' },
      { name: 'AI Metaverse Design II', color: '#a24affff', classification: 'elective' },
    ],
  },
  {
    year: 4,
    term: 1,
    courses: [
      { name: 'Graduation Project Studio I', color: '#20b2aaff', classification: 'required' },
    ],
  },
  {
    year: 4,
    term: 2,
    courses: [
      { name: 'Graduation Project Studio II', color: '#20b2aaff', classification: 'required' },
    ],
  },
];

const DEFAULT_TRACKS: TrackData[] = [
  {
    name: 'Module B',
    track: 'Brand Communication Design',
    courses: 'Typography Design I, II\\nBrand Design I, II\\nAdvertising Design I, II\\nEditorial Design I',
    requirements: 'Module A required, track courses required',
    credits: '16',
  },
  {
    name: 'Module C',
    track: 'AI Digital Marketing Design',
    courses: 'Illustration and Storytelling Design I, II\\nAI Startup Design I, II\\nMarketing Design\\nYouTube Video Design I, II',
    requirements: 'Module A required, track courses required',
    credits: '16',
  },
  {
    name: 'Module D',
    track: 'UX Design',
    courses: 'Basic Graphic Design I, II\\nData Visualization and Info Design I, II\\nDesign Psychology\\nUser Experience Design I, II',
    requirements: 'Module A required, track courses required',
    credits: '16',
  },
  {
    name: 'Module E',
    track: 'XR & Visual Design',
    courses: 'Basic Visual Design I, II\\nMotion Design I, II\\nAnimation\\nAI Metaverse Design I, II',
    requirements: 'Module A required, track courses required',
    credits: '16',
  },
];

const DEFAULT_MODULES: ModuleDetailData[] = [
  {
    module: 'Module A',
    title: 'Brand Design',
    description:
      'The core area of graphic communication in visual design. Understand domestic and international cases, current design trends, and derive creative ideas suited to each project. Build design processes for individual career paths and create portfolios.',
    courses: 'Brand Design I, II\nAdvertising Design I, II',
  },
  {
    module: 'Module B',
    title: 'Brand Communication Design',
    description:
      'With Instagram and YouTube-centered personal SNS as the core of visual and video content, research AI-powered self-branding and creative marketing content creation.',
    courses: 'AI Startup Design I, II\nYouTube Video Design I, II',
  },
  {
    module: 'Module C',
    title: 'UX Design',
    description:
      'Build foundations of data-driven design through data collection, analysis, data visualization and information design. On top of this, develop capabilities in UX/UI/interaction design for services and products on web, mobile, smart devices, games, metaverse and other new media through AI-integrated user experience design processes based on design thinking.',
    courses: 'Data Visualization and Info Design I, II\nUser Experience Design I, II',
  },
  {
    module: 'Module D',
    title: 'Visual Design',
    description:
      'Step-by-step coverage from basic visual design to advanced motion design. Through domestic and international case analysis and project-centered classes, understand trends in modern video and motion design and develop creative problem-solving abilities. Students build their own visual language and receive practice-based learning that can be extended into portfolios.',
    courses: 'Basic Visual Design I, II\nMotion Design I, II',
  },
];

// ============================================================
// UndergraduateEditor
// ============================================================

export interface UndergraduateEditorProps {
  content?: UndergraduateContent | null;
  onSaveCourse?: (semesterIndex: number, course: CourseData) => void;
  onEditCourse?: (semesterIndex: number, courseIndex: number, course: CourseData) => void;
  onDeleteCourse?: (semesterIndex: number, courseIndex: number) => void;
  onReorderCourses?: (semesterIndex: number, courses: CourseData[]) => void;
  onSaveTracks?: (tracks: TrackData[]) => void;
  onSaveModules?: (modules: ModuleDetailData[]) => void;
  isSaving?: boolean;
}

type SubTab = 'courses' | 'tracks' | 'modules';

const SUB_TABS: { key: SubTab; label: string; icon: string }[] = [
  { key: 'courses', label: 'Course Management', icon: 'books' },
  { key: 'tracks', label: 'Track Requirements', icon: 'chart' },
  { key: 'modules', label: 'Module Details', icon: 'list' },
];

export default function UndergraduateEditor({
  content,
  onSaveCourse,
  onEditCourse,
  onDeleteCourse,
  onReorderCourses,
  onSaveTracks,
  onSaveModules,
  isSaving,
}: UndergraduateEditorProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('courses');

  // Use content from props if available, otherwise fall back to defaults
  const semesters = content?.semesters ?? DEFAULT_SEMESTERS;
  const tracks = content?.tracks ?? DEFAULT_TRACKS;
  const modules = content?.modules ?? DEFAULT_MODULES;

  return (
    <div className="space-y-6">
      {/* Sub Tab Navigation */}
      <div className="flex gap-2 bg-white rounded-lg shadow p-1">
        {SUB_TABS.map((tab) => (
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
        {activeSubTab === 'courses' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Course Management
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage undergraduate courses by semester. Drag to reorder within a semester.
              </p>
            </div>
            <CourseTable
              semesters={semesters}
              onAddCourse={(semIdx, course) => onSaveCourse?.(semIdx, course)}
              onEditCourse={(semIdx, cIdx, course) => onEditCourse?.(semIdx, cIdx, course)}
              onDeleteCourse={(semIdx, cIdx) => onDeleteCourse?.(semIdx, cIdx)}
              onReorderCourses={(semIdx, courses) => onReorderCourses?.(semIdx, courses)}
              isSaving={isSaving}
            />
          </div>
        )}

        {activeSubTab === 'tracks' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Track Requirements
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Edit track information, courses, and credit requirements inline.
              </p>
            </div>
            <TrackRequirementsTable
              tracks={tracks}
              onSave={(t) => onSaveTracks?.(t)}
              isSaving={isSaving}
            />
          </div>
        )}

        {activeSubTab === 'modules' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Module Details
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Edit module descriptions and associated courses.
              </p>
            </div>
            <ModuleDetailsTable
              modules={modules}
              onSave={(m) => onSaveModules?.(m)}
              isSaving={isSaving}
            />
          </div>
        )}
      </div>
    </div>
  );
}
