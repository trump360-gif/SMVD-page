'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Curriculum', href: '/curriculum' },
  { label: 'People', href: '/people' },
  { label: 'Work', href: '/work' },
  { label: 'News & Event', href: '/news' },
];

export function MobileMenuButton() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 transition-colors"
        style={{
          color: 'var(--color-neutral-800)',
          borderRadius: 'var(--radius-md)',
        }}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div
          className="fixed inset-x-0 top-[57px] z-50"
          style={{
            backgroundColor: 'var(--color-neutral-0)',
            borderBottom: '1px solid var(--color-neutral-200)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <nav className="py-4 px-4" aria-hidden={!isOpen}>
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 px-4 font-medium transition-colors"
                  style={{
                    fontSize: '0.9375rem',
                    color: active ? 'var(--color-primary-blue)' : 'var(--color-neutral-1000)',
                    backgroundColor: active ? 'rgba(26, 70, 231, 0.04)' : 'transparent',
                    borderRadius: 'var(--radius-md)',
                  }}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
