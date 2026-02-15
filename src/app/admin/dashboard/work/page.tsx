'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Section {
  id: string;
  pageId: string;
  type: string;
  title: string | null;
  content: any;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function WorkDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSections();
    }
  }, [status]);

  const fetchSections = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/sections?pageId=work', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch sections');
      const data = await res.json();
      setSections(data.sections || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
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
      } catch (error) {
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

  if (status === 'loading' || loading) {
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
                포트폴리오 및 작품 정보를 관리합니다
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

          {sections.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <p>Work 페이지 섹션이 아직 없습니다.</p>
              <p className="text-sm mt-2">DB에 섹션을 추가해주세요.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                총 {sections.length}개의 섹션
              </div>
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {section.title || section.type}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Type: {section.type} | Order: {section.order}
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-400">
                      <p>수정됨:</p>
                      <p>{new Date(section.updatedAt).toLocaleDateString('ko-KR')}</p>
                    </div>
                  </div>
                </div>
              ))}
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
    </div>
  );
}
