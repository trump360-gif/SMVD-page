'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAboutEditor, AboutSection, AboutPerson } from '@/hooks/useAboutEditor';
import Link from 'next/link';
import SectionEditor from './SectionEditor';
import PeopleManager from './PeopleManager';

export default function AboutDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const {
    sections,
    people,
    isLoading,
    error,
    fetchSections,
    fetchPeople,
    updateSection,
    addPerson,
    updatePerson,
    deletePerson,
    reorderPeople,
  } = useAboutEditor();
  const [activeTab, setActiveTab] = useState<'sections' | 'people'>('sections');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSections();
      fetchPeople();
    }
  }, [status, fetchSections, fetchPeople]);

  const refreshPreview = useCallback(() => {
    if (iframeRef.current) {
      try {
        // contentWindow.location.reload()를 사용해 더 안정적으로 리로드
        if (iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.location.reload();
        } else {
          // contentWindow가 없으면 src 재할당으로 폴백
          const url = iframeRef.current.src;
          if (url) {
            const baseUrl = url.split('?')[0];
            iframeRef.current.src = `${baseUrl}?refresh=${Date.now()}`;
          }
        }
      } catch (error) {
        // 크로스-오리진 에러가 나면 src 재할당으로 폴백
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
                About 페이지 관리
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                학과 소개, 비전, 역사, 교수/강사 정보를 관리합니다
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
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 bg-white rounded-lg shadow p-1">
            <button
              onClick={() => setActiveTab('sections')}
              className={`flex-1 px-4 py-3 font-medium rounded-lg transition-colors ${
                activeTab === 'sections'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              섹션 관리
            </button>
            <button
              onClick={() => setActiveTab('people')}
              className={`flex-1 px-4 py-3 font-medium rounded-lg transition-colors ${
                activeTab === 'people'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              교수/강사 관리 ({people.length}명)
            </button>
          </div>

          {/* Sections Tab */}
          {activeTab === 'sections' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 text-sm">
                💡 교수/강사 정보는 "<strong>교수/강사 관리</strong>" 탭에서 관리하세요.
              </div>

              {sections.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                  About 페이지 섹션이 아직 없습니다. DB에 섹션을 추가해주세요.
                </div>
              ) : (
                sections
                  .filter((s) => s.type !== 'ABOUT_PEOPLE')
                  .map((section) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    onSave={async (sectionId, type, title, content) => {
                      await updateSection(sectionId, type, title, content);
                      refreshPreview();
                      showSuccess('섹션이 저장되었습니다.');
                    }}
                  />
                ))
              )}
            </div>
          )}

          {/* People Tab */}
          {activeTab === 'people' && (
            <PeopleManager
              people={people}
              onAdd={async (data) => {
                await addPerson(data);
                refreshPreview();
                showSuccess('새로운 교수/강사가 추가되었습니다.');
              }}
              onUpdate={async (id, data) => {
                await updatePerson(id, data);
                refreshPreview();
                showSuccess('교수/강사 정보가 수정되었습니다.');
              }}
              onDelete={async (id) => {
                await deletePerson(id);
                refreshPreview();
                showSuccess('교수/강사가 삭제되었습니다.');
              }}
              onReorder={async (id, newOrder) => {
                await reorderPeople(id, newOrder);
                refreshPreview();
              }}
            />
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
              onClick={() => window.open('/about', '_blank')}
              className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
            >
              페이지로 이동
            </button>
          </div>
          <iframe
            ref={iframeRef}
            src={activeTab === 'people' ? '/about?tab=people' : '/about'}
            className="flex-1 border-0 w-full overflow-auto"
            title="About Page Preview"
          />
        </div>
      </main>
    </div>
  );
}
