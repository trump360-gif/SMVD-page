'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Page {
  id: string;
  slug: string;
  title: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function PagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch('/api/pages');
        if (!res.ok) throw new Error('페이지를 불러올 수 없습니다');

        const data = await res.json();
        setPages(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : '오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  if (status === 'loading' || loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-300 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">페이지 관리</h1>
        <p className="text-gray-600 mt-2">웹사이트의 모든 페이지를 관리합니다</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Pages Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  페이지
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  슬러그
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  설명
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  순서
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  작업
                </th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{page.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(page.updatedAt).toLocaleDateString('ko-KR')}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">
                      {page.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {page.description ? page.description.substring(0, 50) + '...' : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                      {page.order}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/pages/${page.id}/edit`}
                      className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                    >
                      편집
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">페이지가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
