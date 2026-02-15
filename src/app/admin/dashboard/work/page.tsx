'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWorkEditor } from '@/hooks/useWorkEditor';
import {
  WorkProjectList,
  WorkBlogModal,
  WorkExhibitionList,
  WorkExhibitionModal,
} from '@/components/admin/work';
import type {
  WorkProjectData,
  WorkExhibitionData,
  CreateProjectInput,
  UpdateProjectInput,
  CreateExhibitionInput,
  UpdateExhibitionInput,
} from '@/hooks/useWorkEditor';

export default function WorkDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [activeTab, setActiveTab] = useState<'achieve' | 'exhibition'>('achieve');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Project modal state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<WorkProjectData | null>(null);

  // Exhibition modal state
  const [isExhibitionModalOpen, setIsExhibitionModalOpen] = useState(false);
  const [editingExhibition, setEditingExhibition] = useState<WorkExhibitionData | null>(null);

  const {
    projects,
    exhibitions,
    isLoading,
    error,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
    reorderProject,
    fetchExhibitions,
    addExhibition,
    updateExhibition,
    deleteExhibition,
    reorderExhibition,
    initializeData,
    clearError,
  } = useWorkEditor();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProjects();
      fetchExhibitions();
    }
  }, [status, fetchProjects, fetchExhibitions]);

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

  const showSuccess = useCallback((msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  }, []);

  // ---- Project handlers ----

  const handleAddProject = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (project: WorkProjectData) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleProjectSubmit = async (data: CreateProjectInput | UpdateProjectInput) => {
    if (editingProject) {
      await updateProject(editingProject.id, data as UpdateProjectInput);
      showSuccess('프로젝트가 수정되었습니다');
    } else {
      await addProject(data as CreateProjectInput);
      showSuccess('프로젝트가 추가되었습니다');
    }
    refreshPreview();
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
    showSuccess('프로젝트가 삭제되었습니다');
    refreshPreview();
  };

  const handleReorderProject = async (projectId: string, newOrder: number) => {
    await reorderProject(projectId, newOrder);
    refreshPreview();
  };

  // ---- Exhibition handlers ----

  const handleAddExhibition = () => {
    setEditingExhibition(null);
    setIsExhibitionModalOpen(true);
  };

  const handleEditExhibition = (exhibition: WorkExhibitionData) => {
    setEditingExhibition(exhibition);
    setIsExhibitionModalOpen(true);
  };

  const handleExhibitionSubmit = async (data: CreateExhibitionInput | UpdateExhibitionInput) => {
    if (editingExhibition) {
      await updateExhibition(editingExhibition.id, data as UpdateExhibitionInput);
      showSuccess('전시가 수정되었습니다');
    } else {
      await addExhibition(data as CreateExhibitionInput);
      showSuccess('전시가 추가되었습니다');
    }
    refreshPreview();
  };

  const handleDeleteExhibition = async (id: string) => {
    await deleteExhibition(id);
    showSuccess('전시가 삭제되었습니다');
    refreshPreview();
  };

  const handleReorderExhibition = async (exhibitionId: string, newOrder: number) => {
    await reorderExhibition(exhibitionId, newOrder);
    refreshPreview();
  };

  // ---- Initialize ----

  const handleInitialize = async () => {
    if (!confirm('Work 데이터를 초기화하시겠습니까?\n12개 프로젝트 + 6개 전시가 생성됩니다.')) return;
    try {
      await initializeData();
      showSuccess('초기화 완료! 12개 프로젝트 + 6개 전시 생성');
      refreshPreview();
    } catch (err) {
      // Error is handled by the hook
    }
  };

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
                Work 페이지 관리
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                포트폴리오 프로젝트 및 전시 정보를 관리합니다
              </p>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors text-sm font-medium"
            >
              &larr; 돌아가기
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
                className="text-red-500 hover:text-red-700 text-lg ml-4"
              >
                x
              </button>
            </div>
          )}

          {/* Initialize button (when no data) */}
          {projects.length === 0 && exhibitions.length === 0 && !isLoading && (
            <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                    Work 데이터가 비어있습니다
                  </h3>
                  <p className="text-sm text-yellow-800">
                    기존 하드코딩 데이터 (12개 프로젝트 + 6개 전시)를 DB에 초기화하세요.
                  </p>
                </div>
                <button
                  onClick={handleInitialize}
                  className="shrink-0 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-medium"
                >
                  초기화하기
                </button>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 bg-white rounded-lg shadow p-1">
            <button
              onClick={() => setActiveTab('achieve')}
              className={`flex-1 px-4 py-3 font-medium rounded-lg transition-colors ${
                activeTab === 'achieve'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Achieve ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('exhibition')}
              className={`flex-1 px-4 py-3 font-medium rounded-lg transition-colors ${
                activeTab === 'exhibition'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Exhibition ({exhibitions.length})
            </button>
          </div>

          {/* Achieve Tab */}
          {activeTab === 'achieve' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    프로젝트 목록
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    포트폴리오 프로젝트 관리 ({projects.length}개)
                  </p>
                </div>
                <button
                  onClick={handleAddProject}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  + 프로젝트 추가
                </button>
              </div>

              <WorkProjectList
                items={projects}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                onReorder={handleReorderProject}
              />
            </div>
          )}

          {/* Exhibition Tab */}
          {activeTab === 'exhibition' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    전시 목록
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    전시 아이템 관리 ({exhibitions.length}개)
                  </p>
                </div>
                <button
                  onClick={handleAddExhibition}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  + 전시 추가
                </button>
              </div>

              <WorkExhibitionList
                items={exhibitions}
                onEdit={handleEditExhibition}
                onDelete={handleDeleteExhibition}
                onReorder={handleReorderExhibition}
              />
            </div>
          )}
        </div>

        {/* Right Side - Preview */}
        <div className="hidden lg:flex lg:w-1/2 bg-white border-l border-gray-200 flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">실시간 미리보기</h3>
              <p className="text-xs text-gray-600 mt-1">변경사항이 저장 후 반영됩니다</p>
            </div>
            <button
              onClick={() => window.open('/work', '_blank')}
              className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
            >
              페이지로 이동
            </button>
          </div>
          <iframe
            ref={iframeRef}
            src="/work"
            className="flex-1 border-0 w-full overflow-auto"
            title="Work Page Preview"
          />
        </div>
      </main>

      {/* Project Blog Modal */}
      <WorkBlogModal
        isOpen={isProjectModalOpen}
        project={editingProject}
        onClose={() => {
          setIsProjectModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={handleProjectSubmit}
      />

      {/* Exhibition Modal */}
      <WorkExhibitionModal
        isOpen={isExhibitionModalOpen}
        exhibition={editingExhibition}
        onClose={() => {
          setIsExhibitionModalOpen(false);
          setEditingExhibition(null);
        }}
        onSubmit={handleExhibitionSubmit}
      />
    </div>
  );
}
