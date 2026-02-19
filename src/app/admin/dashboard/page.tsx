'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  FileText,
  Link as LinkIcon,
  Image,
  Package,
  Home,
  BookOpen,
  Palette,
  Navigation as NavigationIcon,
  Layers,
} from 'lucide-react';
import { prisma } from '@/lib/db';

export default function DashboardPage() {
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
            <p className="text-sm text-gray-600 mt-1">
              숙명여자대학교 시각영상디자인과
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {session?.user?.email}
              </p>
              <p className="text-xs text-gray-500">관리자</p>
            </div>
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: '/admin/login' })}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">페이지</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">6</p>
              </div>
              <FileText className="w-12 h-12 text-blue-500" strokeWidth={1.5} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">메뉴 항목</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">6</p>
              </div>
              <LinkIcon className="w-12 h-12 text-green-500" strokeWidth={1.5} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">업로드된 파일</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <Image className="w-12 h-12 text-purple-500" strokeWidth={1.5} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">총 섹션</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <Package className="w-12 h-12 text-orange-500" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">빠른 메뉴</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/admin/dashboard/home"
              className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
            >
              <p className="font-semibold text-blue-900 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Home 페이지
              </p>
              <p className="text-xs text-blue-700 mt-1">
                전시 및 포트폴리오 관리
              </p>
            </a>

            <a
              href="/admin/dashboard/about"
              className="block p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
            >
              <p className="font-semibold text-indigo-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                About 페이지
              </p>
              <p className="text-xs text-indigo-700 mt-1">
                학과 소개 및 교수 관리
              </p>
            </a>

            <a
              href="/admin/dashboard/work"
              className="block p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
            >
              <p className="font-semibold text-purple-900 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Work 페이지
              </p>
              <p className="text-xs text-purple-700 mt-1">
                포트폴리오 프로젝트 및 전시 관리
              </p>
            </a>

            <a
              href="/admin/navigation"
              className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
            >
              <p className="font-semibold text-green-900 flex items-center gap-2">
                <NavigationIcon className="w-5 h-5" />
                네비게이션
              </p>
              <p className="text-xs text-green-700 mt-1">
                메뉴 항목 수정 및 순서 변경
              </p>
            </a>

            <a
              href="/admin/footer"
              className="block p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
            >
              <p className="font-semibold text-purple-900 flex items-center gap-2">
                <Layers className="w-5 h-5" />
                푸터
              </p>
              <p className="text-xs text-purple-700 mt-1">
                푸터 정보 및 링크 수정
              </p>
            </a>

            <a
              href="/admin/media"
              className="block p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200"
            >
              <p className="font-semibold text-orange-900 flex items-center gap-2">
                <Image className="w-5 h-5" />
                미디어
              </p>
              <p className="text-xs text-orange-700 mt-1">
                업로드된 이미지 및 파일 관리
              </p>
            </a>

            <a
              href="/admin/pages"
              className="block p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors border border-yellow-200"
            >
              <p className="font-semibold text-yellow-900 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                페이지 관리
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                페이지 정보 편집
              </p>
            </a>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Phase 4 & 5 진행 상황</h3>
          <p className="text-sm text-blue-800">
            ✅ Phase 4: 공개 페이지 구현 완료<br/>
            &nbsp;&nbsp;- 6개 메인 페이지 (Home, About, Curriculum, People, Work, News)<br/>
            &nbsp;&nbsp;- SectionRenderer (15개 섹션 타입)<br/>
            &nbsp;&nbsp;- 반응형 디자인 + 애니메이션<br/>
            🔜 Phase 5: 관리자 페이지 (드래그 앤 드롭)<br/>
            &nbsp;&nbsp;- 섹션 에디터 (핵심!)<br/>
            &nbsp;&nbsp;- 콘텐츠 관리 페이지
          </p>
        </div>
      </main>
    </div>
  );
}
