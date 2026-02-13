'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import SectionEditor from '@/components/admin/SectionEditor';

interface PageData {
  id: string;
  slug: string;
  title: string;
  description?: string;
  sections: Array<{
    id: string;
    type: string;
    title?: string;
    order: number;
  }>;
}

export default function PageEditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;

  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        // DB에서 직접 페이지 조회 (API는 공개용이므로)
        const res = await fetch(`/api/admin/pages/${pageId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }

        if (!res.ok) {
          throw new Error('페이지를 불러올 수 없습니다');
        }

        const data = await res.json();
        setPage(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    };

    if (pageId) {
      fetchPage();
    }
  }, [pageId, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-1/3 bg-gray-300 rounded" />
          <div className="h-96 bg-gray-300 rounded" />
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-lg font-semibold text-red-900 mb-2">오류</h2>
            <p className="text-red-800">{error || '페이지를 찾을 수 없습니다'}</p>
            <button
              onClick={() => router.push('/admin/pages')}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              페이지 목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/admin/pages')}
          className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4"
        >
          ← 페이지 목록으로
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{page.title} 편집</h1>
        <p className="text-gray-600 mt-2">페이지의 섹션을 관리하고 순서를 변경하세요</p>
      </div>

      {/* Section Editor */}
      <SectionEditor pageId={page.id} initialSections={page.sections} />
    </div>
  );
}
