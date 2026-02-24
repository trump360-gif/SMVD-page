'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
const FooterEditor = dynamic(
  () => import('@/components/admin/footer').then((mod) => mod.FooterEditor),
  { ssr: false }
);

export default function FooterAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="대시보드로 돌아가기"
              data-testid="footer-back-btn"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">푸터 관리</h1>
              <p className="text-sm text-gray-500">
                {session?.user?.email}
              </p>
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            공개 사이트 보기
          </Link>
        </div>
      </header>

      {/* Main */}
      <main
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        data-testid="footer-admin-main"
      >
        <FooterEditor />
      </main>
    </div>
  );
}
