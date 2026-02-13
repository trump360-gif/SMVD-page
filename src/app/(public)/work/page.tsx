'use client';

import {
  Header,
  Footer,
} from '@/components/public/home';
import { WorkArchive } from '@/components/public/work';

export default function WorkPage() {
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
          {/* Work Archive Component */}
          <WorkArchive />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
