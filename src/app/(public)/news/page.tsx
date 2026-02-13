'use client';

import {
  Header,
  Footer,
} from '@/components/public/home';
import { NewsEventArchive } from '@/components/public/news';

export default function NewsPage() {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Main Content Container */}
      <div
        style={{
          width: '100%',
          paddingTop: '0px',
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
          {/* News&Event Archive Component */}
          <NewsEventArchive />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
