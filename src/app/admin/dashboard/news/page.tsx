'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNewsEditor } from '@/hooks/useNewsEditor';
import {
  NewsArticleList,
  NewsBlogModal,
} from '@/components/admin/news';
import type {
  NewsArticleData,
  CreateArticleInput,
  UpdateArticleInput,
} from '@/hooks/useNewsEditor';

const FILTER_CATEGORIES = ['ALL', 'Notice', 'Event', 'Awards', 'Recruiting'];

export default function NewsDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticleData | null>(null);

  const {
    articles,
    isLoading,
    error,
    fetchArticles,
    addArticle,
    updateArticle,
    deleteArticle,
    reorderArticle,
    initializeData,
    clearError,
  } = useNewsEditor();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchArticles();
    }
  }, [status, fetchArticles]);

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

  // Filter articles by category
  const filteredArticles =
    activeCategory === 'ALL'
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  // ---- Article handlers ----

  const handleAddArticle = () => {
    setEditingArticle(null);
    setIsModalOpen(true);
  };

  const handleEditArticle = (article: NewsArticleData) => {
    setEditingArticle(article);
    setIsModalOpen(true);
  };

  const handleArticleSubmit = async (data: CreateArticleInput | UpdateArticleInput) => {
    if (editingArticle) {
      await updateArticle(editingArticle.id, data as UpdateArticleInput);
      showSuccess('뉴스가 수정되었습니다');
    } else {
      await addArticle(data as CreateArticleInput);
      showSuccess('뉴스가 추가되었습니다');
    }
    refreshPreview();
  };

  const handleDeleteArticle = async (id: string) => {
    await deleteArticle(id);
    showSuccess('뉴스가 삭제되었습니다');
    refreshPreview();
  };

  const handleReorderArticle = async (articleId: string, newOrder: number) => {
    await reorderArticle(articleId, newOrder);
    refreshPreview();
  };

  const handleTogglePublish = async (article: NewsArticleData) => {
    await updateArticle(article.id, { published: !article.published });
    showSuccess(article.published ? '비공개로 변경되었습니다' : '공개로 변경되었습니다');
    refreshPreview();
  };

  // ---- Initialize ----

  const handleInitialize = async () => {
    if (!confirm('News 데이터를 초기화하시겠습니까?\n10개 뉴스가 생성됩니다.')) return;
    try {
      await initializeData();
      showSuccess('초기화 완료! 10개 뉴스 생성');
      refreshPreview();
    } catch {
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
                News&Event 페이지 관리
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                뉴스 및 행사 정보를 관리합니다
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
          {articles.length === 0 && !isLoading && (
            <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                    News 데이터가 비어있습니다
                  </h3>
                  <p className="text-sm text-yellow-800">
                    기존 하드코딩 데이터 (10개 뉴스)를 DB에 초기화하세요.
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

          {/* Category Filter Tabs */}
          <div className="flex gap-2 mb-6 bg-white rounded-lg shadow p-1">
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-1 px-4 py-3 font-medium rounded-lg transition-colors text-sm ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat} (
                {cat === 'ALL'
                  ? articles.length
                  : articles.filter((a) => a.category === cat).length}
                )
              </button>
            ))}
          </div>

          {/* Articles List */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  뉴스 목록
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {activeCategory === 'ALL' ? '전체' : activeCategory} 뉴스 관리 ({filteredArticles.length}개)
                </p>
              </div>
              <button
                onClick={handleAddArticle}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                + 뉴스 추가
              </button>
            </div>

            <NewsArticleList
              items={filteredArticles}
              onEdit={handleEditArticle}
              onDelete={handleDeleteArticle}
              onReorder={handleReorderArticle}
              onTogglePublish={handleTogglePublish}
            />
          </div>
        </div>

        {/* Right Side - Preview */}
        <div className="hidden lg:flex lg:w-1/2 bg-white border-l border-gray-200 flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">실시간 미리보기</h3>
              <p className="text-xs text-gray-600 mt-1">변경사항이 저장 후 반영됩니다</p>
            </div>
            <button
              onClick={() => window.open('/news', '_blank')}
              className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
            >
              페이지로 이동
            </button>
          </div>
          <iframe
            ref={iframeRef}
            src="/news"
            className="flex-1 border-0 w-full overflow-auto"
            title="News Page Preview"
          />
        </div>
      </main>

      {/* Article Blog Modal */}
      <NewsBlogModal
        isOpen={isModalOpen}
        article={editingArticle}
        onClose={() => {
          setIsModalOpen(false);
          setEditingArticle(null);
        }}
        onSubmit={handleArticleSubmit}
      />
    </div>
  );
}
