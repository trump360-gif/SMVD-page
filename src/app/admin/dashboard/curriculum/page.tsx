'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const UndergraduateEditor = dynamic(
  () => import('@/components/admin/curriculum').then((mod) => mod.UndergraduateEditor),
  { ssr: false }
);
const GraduateEditor = dynamic(
  () => import('@/components/admin/curriculum').then((mod) => mod.GraduateEditor),
  { ssr: false }
);
import type { GraduateContent } from '@/lib/validation/curriculum';
import { useCurriculumEditor } from '@/hooks/curriculum';
import { SaveBar } from '@/components/admin/shared/SaveBar';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';

type ActiveTab = 'undergraduate' | 'graduate';

export default function CurriculumDashboard() {
  const { status } = useSession();
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('undergraduate');
  const [activeSubTab, setActiveSubTab] = useState<'master' | 'doctor' | 'thesis'>('master');

  const {
    sections,
    isLoading,
    isSaving,
    isDirty,
    changeCount,
    error,
    getUndergraduateContent,
    getGraduateContent,
    getSection,
    fetchSections,
    saveChanges,
    revert,
    updateContent,
    addCourse,
    updateCourse,
    deleteCourse,
    reorderCourses,
    updateTracks,
    updateModules,
    addThesis,
    updateThesis,
    deleteThesis,
    clearError,
  } = useCurriculumEditor();

  useBeforeUnload(isDirty);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  // Fetch immediately on mount - middleware already handles auth
  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const refreshPreview = useCallback(() => {
    if (iframeRef.current) {
      try {
        if (iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.location.reload();
        } else {
          const url = iframeRef.current.src;
          if (url) {
            const baseUrl = url.split('?')[0];
            iframeRef.current.src = `${baseUrl}?refresh=${Date.now()}`;
          }
        }
      } catch {
        const url = iframeRef.current.src;
        if (url) {
          const baseUrl = url.split('?')[0];
          iframeRef.current.src = `${baseUrl}?refresh=${Date.now()}`;
        }
      }
    }
  }, []);

  // Refresh preview when activeSubTab changes (Graduate School tabs)
  useEffect(() => {
    if (activeTab === 'graduate') {
      refreshPreview();
    }
  }, [activeSubTab, activeTab, refreshPreview]);

  const handleSave = useCallback(async () => {
    const ok = await saveChanges();
    if (ok) refreshPreview();
  }, [saveChanges, refreshPreview]);

  // Get sections for editor props
  const undergradSection = getSection('CURRICULUM_UNDERGRADUATE');
  const undergradContent = getUndergraduateContent();
  const gradSection = getSection('CURRICULUM_GRADUATE');
  const gradContent = getGraduateContent();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                교과과정 페이지 관리
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                학부 및 대학원 교과과정을 관리합니다
              </p>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors text-sm font-medium"
            >
              &#8592; 돌아가기
            </Link>
          </div>
        </div>
      </header>

      {/* SaveBar */}
      <SaveBar
        isDirty={isDirty}
        changeCount={changeCount}
        isSaving={isSaving}
        onSave={handleSave}
        onRevert={revert}
      />

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side - Editor */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={clearError}
                className="text-red-700 hover:text-red-900 font-bold ml-4"
              >
                X
              </button>
            </div>
          )}

          {/* Tab Navigation: Undergraduate / Graduate */}
          <div className="flex gap-2 mb-6 bg-white rounded-lg shadow p-1">
            <button
              onClick={() => setActiveTab('undergraduate')}
              className={`flex-1 px-4 py-3 font-medium rounded-lg transition-colors ${
                activeTab === 'undergraduate'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Undergraduate
            </button>
            <button
              onClick={() => setActiveTab('graduate')}
              className={`flex-1 px-4 py-3 font-medium rounded-lg transition-colors ${
                activeTab === 'graduate'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Graduate School
            </button>
          </div>

          {/* Undergraduate Editor */}
          {activeTab === 'undergraduate' && (
            <UndergraduateEditor
              content={undergradContent}
              onSaveCourse={(semIdx, course) => {
                if (undergradSection) {
                  addCourse(undergradSection.id, semIdx, course);
                }
              }}
              onEditCourse={(semIdx, cIdx, course) => {
                if (undergradSection) {
                  updateCourse(undergradSection.id, semIdx, cIdx, course);
                }
              }}
              onDeleteCourse={(semIdx, cIdx) => {
                if (undergradSection) {
                  deleteCourse(undergradSection.id, semIdx, cIdx);
                }
              }}
              onReorderCourses={(semIdx, courses) => {
                if (undergradSection) {
                  reorderCourses(undergradSection.id, semIdx, courses);
                }
              }}
              onSaveTracks={(tracks) => {
                if (undergradSection) {
                  updateTracks(undergradSection.id, tracks);
                }
              }}
              onSaveModules={(modules) => {
                if (undergradSection) {
                  updateModules(undergradSection.id, modules);
                }
              }}
              isSaving={isSaving}
            />
          )}

          {/* Graduate Editor */}
          {activeTab === 'graduate' && (
            <GraduateEditor
              content={gradContent}
              onSubTabChange={setActiveSubTab}
              onSaveMaster={(courses) => {
                if (gradSection && gradContent) {
                  const updatedContent: GraduateContent = {
                    ...gradContent,
                    master: {
                      ...gradContent.master,
                      leftCourses: courses.leftCourses,
                      rightCourses: courses.rightCourses,
                    },
                  };
                  updateContent(gradSection.id, updatedContent);
                }
              }}
              onSaveDoctor={(courses) => {
                if (gradSection && gradContent) {
                  const updatedContent: GraduateContent = {
                    ...gradContent,
                    doctor: {
                      ...gradContent.doctor,
                      leftCourses: courses.leftCourses,
                      rightCourses: courses.rightCourses,
                    },
                  };
                  updateContent(gradSection.id, updatedContent);
                }
              }}
              onAddThesis={(thesis) => {
                if (gradSection) {
                  addThesis(gradSection.id, thesis);
                }
              }}
              onEditThesis={(index, thesis) => {
                if (gradSection) {
                  updateThesis(gradSection.id, index, thesis);
                }
              }}
              onDeleteThesis={(index) => {
                if (gradSection) {
                  deleteThesis(gradSection.id, index);
                }
              }}
              isSaving={isSaving}
            />
          )}
        </div>

        {/* Right Side - Preview */}
        <div className="hidden lg:flex lg:w-1/2 bg-white border-l border-gray-200 flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">실시간 미리보기</h3>
              <p className="text-xs text-gray-600 mt-1">저장 후 변경사항이 반영됩니다</p>
            </div>
            <button
              onClick={() => window.open('/curriculum', '_blank')}
              className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
            >
              페이지 열기
            </button>
          </div>
          <iframe
            ref={iframeRef}
            src={`/curriculum#${activeTab}${activeTab === 'graduate' ? ':' + activeSubTab : ''}`}
            className="flex-1 border-0 w-full overflow-auto"
            title="Curriculum Page Preview"
            loading="lazy"
          />
        </div>
      </main>
    </div>
  );
}
