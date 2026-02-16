import { Suspense } from 'react';
import { prisma } from '@/lib/db';
import {
  Header,
  Footer,
} from '@/components/public/home';
import AboutContent from './content';
import {
  asSectionContent,
  type AboutIntroContent,
  type AboutVisionContent,
  type AboutHistoryContent,
  type AboutPeopleContent,
} from '@/types/domain/section-content';

// ISR: regenerate every 5 minutes. About page changes infrequently.
export const revalidate = 300;

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
  const peopleSection = page?.sections.find(
    (s) => s.type === 'ABOUT_PEOPLE'
  );

  // Extract data from sections with proper types
  const introData = asSectionContent<AboutIntroContent>(introSection?.content);
  const visionData = asSectionContent<AboutVisionContent>(visionSection?.content);
  const historyData = asSectionContent<AboutHistoryContent>(historySection?.content);
  const peopleData = asSectionContent<AboutPeopleContent>(peopleSection?.content);

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
          peopleData={peopleData}
        />
      </Suspense>

      {/* Footer */}
      <Footer />
    </div>
  );
}
