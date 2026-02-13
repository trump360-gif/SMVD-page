'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
}

interface TopNavigationProps {
  items: NavigationItem[];
}

export function TopNavigation({ items }: TopNavigationProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className="hidden md:flex items-center" style={{ gap: '4px' }}>
      {items.map((item) => {
        const active = isActive(item.href);

        return (
          <Link
            key={item.id}
            href={item.href}
            className="relative px-4 py-2 font-medium transition-colors"
            style={{
              fontSize: '0.875rem',
              borderRadius: 'var(--radius-md)',
              color: active
                ? 'var(--color-primary-blue)'
                : 'var(--color-neutral-800)',
              backgroundColor: active
                ? 'rgba(26, 70, 231, 0.06)'
                : 'transparent',
            }}
            aria-current={active ? 'page' : undefined}
          >
            {item.label}
            {active && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5"
                style={{ backgroundColor: 'var(--color-primary-blue)' }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
