import Link from 'next/link';
import { TopNavigation } from './TopNavigation';
import { MobileMenuButton } from './MobileMenuButton';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
}

interface HeaderProps {
  navigation: NavigationItem[];
}

export function Header({ navigation }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-40"
      style={{
        backgroundColor: 'var(--color-neutral-0)',
        borderBottom: '1px solid var(--color-neutral-200)',
      }}
    >
      <nav className="section-container py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="shrink-0 group">
            <div>
              <h1
                className="font-bold transition-colors"
                style={{
                  fontSize: '1.125rem',
                  color: 'var(--color-primary-deep-blue)',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '-0.01em',
                }}
              >
                SMVD
              </h1>
              <p
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--color-neutral-650)',
                  letterSpacing: '0.02em',
                }}
              >
                Visual & Media Design
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <TopNavigation items={navigation} />

          {/* Mobile Menu Button */}
          <MobileMenuButton />
        </div>
      </nav>
    </header>
  );
}
