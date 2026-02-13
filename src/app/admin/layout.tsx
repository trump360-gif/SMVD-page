'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';

interface SidebarItem {
  href: string;
  label: string;
  icon: string;
}

const sidebarItems: SidebarItem[] = [
  { href: '/admin/dashboard', label: '대시보드', icon: '📊' },
  { href: '/admin/pages', label: '페이지 관리', icon: '📄' },
  { href: '/admin/navigation', label: '네비게이션', icon: '🔗' },
  { href: '/admin/footer', label: '푸터', icon: '📌' },
  { href: '/admin/media', label: '미디어', icon: '🖼️' },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/admin/login' });
  };

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col fixed h-screen z-50`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
              S
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-bold text-sm">숙명여대</p>
                <p className="text-xs text-gray-400">CMS</p>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-grow overflow-y-auto py-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-6 py-3 flex items-center gap-3 transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
              {session?.user?.email?.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="flex-grow min-w-0">
                <p className="text-xs text-gray-400 truncate">
                  {session?.user?.email}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 text-xs bg-red-600 hover:bg-red-700 rounded transition-colors text-center font-medium"
          >
            {sidebarOpen ? '로그아웃' : '로그'}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 border-t border-gray-800 hover:bg-gray-800 transition-colors"
        >
          <svg
            className="w-5 h-5 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={sidebarOpen ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
            />
          </svg>
        </button>
      </aside>

      {/* Main Content */}
      <main className={`flex-grow overflow-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  );
}
