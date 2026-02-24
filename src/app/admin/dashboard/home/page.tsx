'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import WorkPortfolioModal from '@/components/admin/WorkPortfolioModal';
import ExhibitionItemModal from '@/components/admin/ExhibitionItemModal';
import dynamic from 'next/dynamic';
const ExhibitionItemsList = dynamic(() => import('@/components/admin/ExhibitionItemsList'), { ssr: false });
const WorkPortfolioList = dynamic(() => import('@/components/admin/WorkPortfolioList'), { ssr: false });
import { useHomeEditor } from '@/hooks/home';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';
import { SaveBar } from '@/components/admin/shared/SaveBar';

interface ExhibitionItem {
  id: string;
  sectionId: string;
  year: string;
  mediaId: string;
  order: number;
  media?: { id: string; filename: string; filepath: string };
}

interface WorkPortfolio {
  id: string;
  sectionId: string;
  title: string;
  category: string;
  mediaId: string;
  order: number;
  media?: { id: string; filename: string; filepath: string };
}

export default function HomeEditorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('work');
  const [homePageId, setHomePageId] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    sections,
    isLoading,
    isSaving,
    isDirty,
    changeCount,
    error,
    fetchSections,
    updateAboutSectionLocal,
    addExhibitionItem,
    updateExhibitionItem,
    deleteExhibitionItem,
    reorderExhibitionItem,
    addWorkPortfolio,
    updateWorkPortfolio,
    deleteWorkPortfolio,
    reorderWorkPortfolio,
    saveChanges,
    revert,
  } = useHomeEditor();

  useBeforeUnload(isDirty);

  // Modal states
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [selectedWorkItem, setSelectedWorkItem] = useState<WorkPortfolio | null>(null);
  const [isExhibitionModalOpen, setIsExhibitionModalOpen] = useState(false);
  const [selectedExhibitionItem, setSelectedExhibitionItem] = useState<ExhibitionItem | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      initializeSections();
    }
  }, [status]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('previewSection', activeSection);
    }
  }, [activeSection]);

  const initializeSections = async () => {
    try {
      const pagesResponse = await fetch('/api/admin/pages', {
        headers: { 'Content-Type': 'application/json' },
      });
      const pagesData = await pagesResponse.json();

      const homePage = pagesData.data?.find((p: { slug: string; id: string }) => p.slug === 'home');
      if (!homePage?.id) {
        console.error('Failed to find Home page');
        setLoading(false);
        return;
      }

      setHomePageId(homePage.id);
      await fetchSections(homePage.id);
    } catch (err) {
      console.error('Failed to fetch sections:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSave = async () => {
    if (!homePageId) return;
    await saveChanges(homePageId);
    refreshPreview();
    showSuccess('변경사항이 저장되었습니다.');
  };

  const handleInitialize = async () => {
    try {
      setIsInitializing(true);
      const response = await fetch('/api/admin/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        alert('섹션이 초기화되었습니다. 페이지를 새로고침합니다.');
        window.location.reload();
      } else {
        alert('초기화 실패: ' + data.message);
      }
    } catch (err) {
      alert('초기화 중 오류가 발생했습니다: ' + (err instanceof Error ? err.message : '알 수 없는 에러'));
    } finally {
      setIsInitializing(false);
    }
  };

  if (status === 'loading' || loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const exhibitionSection = sections.find(s => s.type === 'EXHIBITION_SECTION');
  const workSection = sections.find(s => s.type === 'WORK_PORTFOLIO');
  const aboutSection = sections.find(s => s.type === 'HOME_ABOUT');

  // About section data from local state
  const aboutTitle = (aboutSection?.content as Record<string, unknown>)?.title as string || 'About SMVD';
  const visionLines = (aboutSection?.content as Record<string, unknown>)?.visionLines as string[] || ['', '', '', ''];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Home 페이지 관리
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                좌측에서 수정하면 우측에서 실시간 미리보기
              </p>
            </div>
            <a
              href="/admin/dashboard"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors text-sm font-medium"
            >
              ← 돌아가기
            </a>
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side - Editor */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* SaveBar */}
          <SaveBar
            isDirty={isDirty}
            changeCount={changeCount}
            isSaving={isSaving}
            onSave={handleSave}
            onRevert={revert}
          />

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

          {/* Initialization Message */}
          {!exhibitionSection && !workSection && !aboutSection && (
            <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                    섹션이 초기화되지 않았습니다
                  </h3>
                  <p className="text-sm text-yellow-800">
                    홈 페이지 관리를 시작하기 위해 아래 버튼을 클릭하여 필수 섹션을 초기화합니다.
                  </p>
                </div>
                <button
                  onClick={handleInitialize}
                  disabled={isInitializing}
                  className="shrink-0 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
                >
                  {isInitializing ? '초기화 중...' : '초기화하기'}
                </button>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 bg-white rounded-lg shadow p-1">
            <button
              onClick={() => setActiveSection('exhibition')}
              className={`flex-1 px-4 py-3 font-medium rounded-lg transition-colors ${
                activeSection === 'exhibition'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              전시회 (Exhibition)
            </button>
            <button
              onClick={() => setActiveSection('work')}
              className={`flex-1 px-4 py-3 font-medium rounded-lg transition-colors ${
                activeSection === 'work'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              작품 (Work)
            </button>
            <button
              onClick={() => setActiveSection('about')}
              className={`flex-1 px-4 py-3 font-medium rounded-lg transition-colors ${
                activeSection === 'about'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              소개 (About)
            </button>
          </div>

          {/* Exhibition Section */}
          {activeSection === 'exhibition' && exhibitionSection && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    전시회 섹션
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    졸업 전시회 아이템 관리 ({exhibitionSection.exhibitionItems?.length || 0}개)
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedExhibitionItem(null);
                    setIsExhibitionModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  + 전시회 추가
                </button>
              </div>

              <ExhibitionItemsList
                items={exhibitionSection.exhibitionItems || []}
                sectionId={exhibitionSection.id}
                onReorder={(itemId, newOrder) => {
                  reorderExhibitionItem(exhibitionSection.id, itemId, newOrder);
                }}
                onDelete={(itemId) => {
                  deleteExhibitionItem(itemId);
                }}
              />
            </div>
          )}

          {/* Work Section */}
          {activeSection === 'work' && workSection && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    작품 포트폴리오 섹션
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    포트폴리오 작품 관리 ({workSection.workPortfolios?.length || 0}개)
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedWorkItem(null);
                    setIsWorkModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  + 작품 추가
                </button>
              </div>

              <WorkPortfolioList
                items={workSection.workPortfolios || []}
                sectionId={workSection.id}
                onReorder={(itemId, newOrder) => {
                  reorderWorkPortfolio(workSection.id, itemId, newOrder);
                }}
                onDelete={(itemId) => {
                  deleteWorkPortfolio(itemId);
                }}
              />
            </div>
          )}

          {/* About Section */}
          {activeSection === 'about' && aboutSection && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  소개 섹션 (About SMVD)
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  메인 페이지의 소개 텍스트를 관리합니다
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    value={aboutTitle}
                    onChange={(e) =>
                      updateAboutSectionLocal(aboutSection.id, {
                        ...((aboutSection.content as Record<string, unknown>) || {}),
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {visionLines.map((line, idx) => (
                  <div key={idx}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vision Line {idx + 1}
                    </label>
                    <input
                      type="text"
                      value={line}
                      onChange={(e) => {
                        const newLines = [...visionLines];
                        newLines[idx] = e.target.value;
                        updateAboutSectionLocal(aboutSection.id, {
                          ...((aboutSection.content as Record<string, unknown>) || {}),
                          visionLines: newLines,
                        });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                ))}
              </div>
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
              onClick={() => window.open('/', '_blank')}
              className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
            >
              페이지로 이동
            </button>
          </div>
          <iframe
            ref={iframeRef}
            src={`/#${activeSection}`}
            className="flex-1 border-0 w-full overflow-auto"
            title="Home Page Preview"
          />
        </div>
      </main>

      {/* Work Portfolio Modal */}
      <WorkPortfolioModal
        isOpen={isWorkModalOpen}
        isEditing={!!selectedWorkItem}
        item={selectedWorkItem || undefined}
        onClose={() => {
          setIsWorkModalOpen(false);
          setSelectedWorkItem(null);
        }}
        onSubmit={(data) => {
          const ws = sections.find((s) => s.type === 'WORK_PORTFOLIO');
          if (!ws) return;
          if (selectedWorkItem) {
            updateWorkPortfolio(selectedWorkItem.id, data);
          } else {
            addWorkPortfolio(ws.id, data);
          }
          setIsWorkModalOpen(false);
          setSelectedWorkItem(null);
        }}
      />

      {/* Exhibition Item Modal */}
      <ExhibitionItemModal
        isOpen={isExhibitionModalOpen}
        isEditing={!!selectedExhibitionItem}
        item={selectedExhibitionItem || undefined}
        onClose={() => {
          setIsExhibitionModalOpen(false);
          setSelectedExhibitionItem(null);
        }}
        onSubmit={(data) => {
          const es = sections.find((s) => s.type === 'EXHIBITION_SECTION');
          if (!es) return;
          if (selectedExhibitionItem) {
            updateExhibitionItem(selectedExhibitionItem.id, data);
          } else {
            addExhibitionItem(es.id, data);
          }
          setIsExhibitionModalOpen(false);
          setSelectedExhibitionItem(null);
        }}
      />
    </div>
  );
}
