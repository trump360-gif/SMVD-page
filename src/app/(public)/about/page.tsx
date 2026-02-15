import { Suspense } from 'react';
import { prisma } from '@/lib/db';
import {
  Header,
  Footer,
} from '@/components/public/home';
import AboutContent from './content';

export default async function AboutPage() {
  const page = await prisma.page.findUnique({
    where: { slug: 'about' },
    include: {
      sections: {
        orderBy: { order: 'asc' },
      },
    },
  });

  // Extract sections
  const introSection = page?.sections.find((s) => s.type === 'ABOUT_INTRO');
  const visionSection = page?.sections.find((s) => s.type === 'ABOUT_VISION');
  const historySection = page?.sections.find(
    (s) => s.type === 'ABOUT_HISTORY'
  );

  // Extract data from sections
  const introData = introSection?.content as any;
  const visionData = visionSection?.content as any;
  const historyData = historySection?.content as any;

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Content with Suspense */}
      <Suspense fallback={<div style={{ padding: '40px' }}>로딩 중...</div>}>
        <AboutContent
          introData={introData}
          visionData={visionData}
          historyData={historyData}
        />
      </Suspense>

      {/* Footer */}
      <Footer />
    </div>
  );
}
