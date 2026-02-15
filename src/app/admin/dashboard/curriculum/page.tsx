'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UndergraduateEditor, GraduateEditor } from '@/components/admin/curriculum';
import type { UndergraduateContent, GraduateContent } from '@/lib/validation/curriculum';
import { useCurriculumEditor } from '@/hooks/useCurriculumEditor';

type ActiveTab = 'undergraduate' | 'graduate';

export default function CurriculumDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('undergraduate');

  const {
    sections,
    isLoading,
    isSaving,
    error,
    successMessage,
    getUndergraduateContent,
    getGraduateContent,
    getSection,
    fetchSections,
    updateSection,
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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSections();
    }
  }, [status, fetchSections]);

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

  // Get sections for API calls
  const undergradSection = getSection('CURRICULUM_UNDERGRADUATE');
  const undergradContent = getUndergraduateContent();
  const gradSection = getSection('CURRICULUM_GRADUATE');
  const gradContent = getGraduateContent();

  if (status === 'loading' || isLoading) {
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
                Curriculum Page Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage undergraduate and graduate curriculum
              </p>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors text-sm font-medium"
            >
              &#8592; Back
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side - Editor */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

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
              Graduate
            </button>
          </div>

          {/* Undergraduate Editor */}
          {activeTab === 'undergraduate' && (
            <UndergraduateEditor
              content={undergradContent}
              onSaveCourse={async (semIdx, course) => {
                if (undergradSection) {
                  const ok = await addCourse(undergradSection.id, semIdx, course);
                  if (ok) refreshPreview();
                }
              }}
              onEditCourse={async (semIdx, cIdx, course) => {
                if (undergradSection) {
                  const ok = await updateCourse(undergradSection.id, semIdx, cIdx, course);
                  if (ok) refreshPreview();
                }
              }}
              onDeleteCourse={async (semIdx, cIdx) => {
                if (undergradSection) {
                  const ok = await deleteCourse(undergradSection.id, semIdx, cIdx);
                  if (ok) refreshPreview();
                }
              }}
              onReorderCourses={async (semIdx, courses) => {
                if (undergradSection) {
                  const ok = await reorderCourses(undergradSection.id, semIdx, courses);
                  if (ok) refreshPreview();
                }
              }}
              onSaveTracks={async (tracks) => {
                if (undergradSection) {
                  const ok = await updateTracks(undergradSection.id, tracks);
                  if (ok) refreshPreview();
                }
              }}
              onSaveModules={async (modules) => {
                if (undergradSection) {
                  const ok = await updateModules(undergradSection.id, modules);
                  if (ok) refreshPreview();
                }
              }}
              isSaving={isSaving}
            />
          )}

          {/* Graduate Editor */}
          {activeTab === 'graduate' && (
            <GraduateEditor
              content={gradContent}
              onSaveMaster={async (courses) => {
                if (gradSection && gradContent) {
                  const updatedContent: GraduateContent = {
                    ...gradContent,
                    master: {
                      ...gradContent.master,
                      leftCourses: courses.leftCourses,
                      rightCourses: courses.rightCourses,
                    },
                  };
                  const ok = await updateSection(gradSection.id, 'CURRICULUM_GRADUATE', updatedContent);
                  if (ok) refreshPreview();
                }
              }}
              onSaveDoctor={async (courses) => {
                if (gradSection && gradContent) {
                  const updatedContent: GraduateContent = {
                    ...gradContent,
                    doctor: {
                      ...gradContent.doctor,
                      leftCourses: courses.leftCourses,
                      rightCourses: courses.rightCourses,
                    },
                  };
                  const ok = await updateSection(gradSection.id, 'CURRICULUM_GRADUATE', updatedContent);
                  if (ok) refreshPreview();
                }
              }}
              onAddThesis={async (thesis) => {
                if (gradSection) {
                  const ok = await addThesis(gradSection.id, thesis);
                  if (ok) refreshPreview();
                }
              }}
              onEditThesis={async (index, thesis) => {
                if (gradSection) {
                  const ok = await updateThesis(gradSection.id, index, thesis);
                  if (ok) refreshPreview();
                }
              }}
              onDeleteThesis={async (index) => {
                if (gradSection) {
                  const ok = await deleteThesis(gradSection.id, index);
                  if (ok) refreshPreview();
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
              <h3 className="text-sm font-semibold text-gray-900">Live Preview</h3>
              <p className="text-xs text-gray-600 mt-1">Changes reflect after save</p>
            </div>
            <button
              onClick={() => window.open('/curriculum', '_blank')}
              className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
            >
              Open Page
            </button>
          </div>
          <iframe
            ref={iframeRef}
            src="/curriculum"
            className="flex-1 border-0 w-full overflow-auto"
            title="Curriculum Page Preview"
          />
        </div>
      </main>
    </div>
  );
}
