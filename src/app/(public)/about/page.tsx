import { Suspense } from 'react';
import {
  Header,
  Footer,
} from '@/components/public/home';
import AboutContent from './content';

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Content with Suspense */}
      <Suspense fallback={<div style={{ padding: '40px' }}>로딩 중...</div>}>
        <AboutContent />
      </Suspense>

      {/* Footer */}
      <Footer />
    </div>
  );
}
