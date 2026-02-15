'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import WorkPortfolioModal from '@/components/admin/WorkPortfolioModal';
import ExhibitionItemModal from '@/components/admin/ExhibitionItemModal';
import ExhibitionItemsList from '@/components/admin/ExhibitionItemsList';
import WorkPortfolioList from '@/components/admin/WorkPortfolioList';
import { useHomeEditor } from '@/hooks/useHomeEditor';

interface Section {
  id: string;
  pageId: string;
  type: string;
  title: string;
  content: any;
  order: number;
  exhibitionItems?: ExhibitionItem[];
  workPortfolios?: WorkPortfolio[];
}

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
  const [initialSections, setInitialSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('work');
  const [homePageId, setHomePageId] = useState<string>('');

  const {
    sections,
    addWorkPortfolio,
    updateWorkPortfolio,
    deleteWorkPortfolio,
    reorderWorkPortfolio,
    addExhibitionItem,
    updateExhibitionItem,
    deleteExhibitionItem,
    reorderExhibitionItem,
    updateAboutSection,
    fetchSections,
  } = useHomeEditor(initialSections);

  // Modal states
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [selectedWorkItem, setSelectedWorkItem] = useState<WorkPortfolio | null>(null);
  const [isExhibitionModalOpen, setIsExhibitionModalOpen] = useState(false);
  const [selectedExhibitionItem, setSelectedExhibitionItem] = useState<ExhibitionItem | null>(null);

  // About section form states
  const [aboutTitle, setAboutTitle] = useState('');
  const [visionLines, setVisionLines] = useState<string[]>(['', '', '', '']);
  const [aboutSectionId, setAboutSectionId] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    console.log('🔥 Home 에디터 페이지 로드됨! iframeRef:', iframeRef);
    console.log('📍 refreshPreview 함수:', refreshPreview);
    if (status === 'authenticated') {
      initializeSections();
    }
  }, [status]);

  // activeSection이 변경될 때 sessionStorage에 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('previewSection', activeSection);
      console.log('💾 sessionStorage에 저장:', activeSection);
    }
  }, [activeSection]);

  const initializeSections = async () => {
    try {
      const pagesResponse = await fetch('/api/admin/pages', {
        headers: { 'Content-Type': 'application/json' },
      });
      const pagesData = await pagesResponse.json();

      const homePage = pagesData.data?.find((p: any) => p.slug === 'home');
      if (!homePage?.id) {
        console.error('Failed to find Home page');
        setLoading(false);
        return;
      }

      setHomePageId(homePage.id);

      const response = await fetch(`/api/admin/sections?pageId=${homePage.id}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        setInitialSections(data.data);

        // Initialize About section form
        const aboutSection = data.data.find((s: Section) => s.type === 'HOME_ABOUT');
        if (aboutSection) {
          setAboutSectionId(aboutSection.id);
          setAboutTitle(aboutSection.content?.title || 'About SMVD');
          setVisionLines(aboutSection.content?.visionLines || ['', '', '', '']);
        }
      }
    } catch (error) {
      console.error('Failed to fetch sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const openHomePage = () => {
    // Open home page in new tab
    window.open('/', '_blank');
  };

  const refreshPreview = () => {
    console.log('🔄 refreshPreview 호출됨');
    if (iframeRef.current) {
      // Force iframe reload by resetting src
      const currentSrc = iframeRef.current.src;
      console.log('📲 iframe src:', currentSrc);
      iframeRef.current.src = currentSrc;
      console.log('✅ iframe 새로고침 완료');
    } else {
      console.warn('⚠️ iframeRef.current가 null입니다');
    }
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
        // Refresh the page to reload sections
        window.location.reload();
      } else {
        alert('초기화 실패: ' + data.message);
      }
    } catch (error) {
      alert('초기화 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 에러'));
    } finally {
      setIsInitializing(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const exhibitionSection = sections.find(s => s.type === 'EXHIBITION_SECTION');
  const workSection = sections.find(s => s.type === 'WORK_PORTFOLIO');
  const aboutSection = sections.find(s => s.type === 'HOME_ABOUT');

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
        {/* Initialization Message */}
        {!exhibitionSection && !workSection && !aboutSection && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  ⚠️ 섹션이 초기화되지 않았습니다
                </h3>
                <p className="text-sm text-yellow-800">
                  홈 페이지 관리를 시작하기 위해 아래 버튼을 클릭하여 필수 섹션을 초기화합니다.
                  (전시회, 작품 포트폴리오, 소개 섹션)
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
            📸 전시회 (Exhibition)
          </button>
          <button
            onClick={() => setActiveSection('work')}
            className={`flex-1 px-4 py-3 font-medium rounded-lg transition-colors ${
              activeSection === 'work'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            🎨 작품 (Work)
          </button>
          <button
            onClick={() => setActiveSection('about')}
            className={`flex-1 px-4 py-3 font-medium rounded-lg transition-colors ${
              activeSection === 'about'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            📝 소개 (About)
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

            {/* Exhibition Items List */}
            <ExhibitionItemsList
              items={exhibitionSection.exhibitionItems || []}
              sectionId={exhibitionSection.id}
              onReorder={async (itemId, newOrder) => {
                const response = await fetch(
                  `/api/admin/exhibition-items/reorder`,
                  {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ itemId, newOrder }),
                  }
                );
                if (!response.ok) throw new Error('순서 변경 실패');
                refreshPreview();
              }}
              onDelete={async (itemId) => {
                const response = await fetch(
                  `/api/admin/exhibition-items/${itemId}`,
                  { method: 'DELETE' }
                );
                if (!response.ok) throw new Error('삭제 실패');
                refreshPreview();
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

            {/* Work Items List */}
            <WorkPortfolioList
              items={workSection.workPortfolios || []}
              sectionId={workSection.id}
              onReorder={async (itemId, newOrder) => {
                const response = await fetch(
                  `/api/admin/work-portfolios/reorder`,
                  {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ itemId, newOrder }),
                  }
                );
                if (!response.ok) throw new Error('순서 변경 실패');
                refreshPreview();
              }}
              onDelete={async (itemId) => {
                const response = await fetch(
                  `/api/admin/work-portfolios/${itemId}`,
                  { method: 'DELETE' }
                );
                if (!response.ok) throw new Error('삭제 실패');
                refreshPreview();
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
                  onChange={(e) => setAboutTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vision Line 1
                </label>
                <input
                  type="text"
                  value={visionLines[0]}
                  onChange={(e) => setVisionLines([e.target.value, ...visionLines.slice(1)])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vision Line 2
                </label>
                <input
                  type="text"
                  value={visionLines[1]}
                  onChange={(e) => setVisionLines([visionLines[0], e.target.value, ...visionLines.slice(2)])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vision Line 3
                </label>
                <input
                  type="text"
                  value={visionLines[2]}
                  onChange={(e) => setVisionLines([visionLines[0], visionLines[1], e.target.value, visionLines[3]])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vision Line 4
                </label>
                <input
                  type="text"
                  value={visionLines[3]}
                  onChange={(e) => setVisionLines([...visionLines.slice(0, 3), e.target.value])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <button
                onClick={async () => {
                  try {
                    await updateAboutSection(aboutSectionId, {
                      title: aboutTitle,
                      visionLines,
                    });
                    alert('저장되었습니다');
                    refreshPreview();
                  } catch (err) {
                    alert(err instanceof Error ? err.message : '저장 실패');
                  }
                }}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                저장
              </button>
            </div>
          </div>
        )}
        </div>

        {/* Right Side - Preview */}
        <div className="hidden lg:flex lg:w-1/2 bg-white border-l border-gray-200 flex-col">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">📱 실시간 미리보기</h3>
              <p className="text-xs text-gray-600 mt-1">변경사항이 자동으로 반영됩니다</p>
            </div>
            <button
              onClick={openHomePage}
              className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
            >
              페이지로 이동 →
            </button>
          </div>
          <iframe
            ref={iframeRef}
            src="/"
            className="flex-1 border-0 w-full"
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
        onSubmit={async (data) => {
          const workSection = sections.find((s) => s.type === 'WORK_PORTFOLIO');
          if (!workSection) throw new Error('작품 섹션을 찾을 수 없습니다');

          if (selectedWorkItem) {
            await updateWorkPortfolio(selectedWorkItem.id, data);
          } else {
            await addWorkPortfolio(workSection.id, data);
          }
          refreshPreview();
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
        onSubmit={async (data) => {
          const exhibitionSection = sections.find((s) => s.type === 'EXHIBITION_SECTION');
          if (!exhibitionSection) throw new Error('전시 섹션을 찾을 수 없습니다');

          if (selectedExhibitionItem) {
            await updateExhibitionItem(selectedExhibitionItem.id, data);
          } else {
            await addExhibitionItem(exhibitionSection.id, data);
          }
          refreshPreview();
          setIsExhibitionModalOpen(false);
          setSelectedExhibitionItem(null);
        }}
      />
    </div>
  );
}
