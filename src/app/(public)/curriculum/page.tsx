'use client';

import {
  Header,
  Footer,
} from '@/components/public/home';
import { CurriculumTab } from '@/components/public/curriculum';

export default function CurriculumPage() {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Main Content Container */}
      <div
        style={{
          width: '100%',
          paddingTop: '80px',
          paddingBottom: '61px',
          paddingLeft: '40px',
          paddingRight: '40px',
          backgroundColor: '#ffffffff',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '100px',
          }}
        >
          {/* Curriculum Tab Component */}
          <CurriculumTab />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
