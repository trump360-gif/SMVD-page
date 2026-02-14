import { Suspense } from 'react';
import { prisma } from '@/lib/db';
import {
  Header,
  VideoHero,
  ExhibitionSection,
  AboutSection,
  WorkSection,
  Footer,
  SectionScroller,
} from '@/components/public/home';

export const metadata = {
  title: '숙명여자대학교 시각영상디자인과',
  description: '숙명여자대학교 시각영상디자인과 공식 웹사이트',
};

export default async function HomePage() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'home' },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });

    // 각 섹션 데이터 추출
    const exhibitionSection = page?.sections.find(s => (s.type as any) === 'EXHIBITION_SECTION');
    const aboutSection = page?.sections.find(s => (s.type as any) === 'HOME_ABOUT');
    const workSection = page?.sections.find(s => (s.type as any) === 'WORK_PORTFOLIO');

    // Exhibition Items 조회
    const exhibitionItems = exhibitionSection
      ? await prisma.exhibitionItem.findMany({
          where: { sectionId: exhibitionSection.id },
          include: { media: true },
          orderBy: { order: 'asc' },
        })
      : [];

    // Work Portfolios 조회
    const workPortfolios = workSection
      ? await prisma.workPortfolio.findMany({
          where: { sectionId: workSection.id },
          include: { media: true },
          orderBy: { order: 'asc' },
        })
      : [];

    // Exhibition Items를 컴포넌트 포맷으로 변환
    const exhibitionData = exhibitionItems.map(item => ({
      year: item.year,
      src: item.media.filepath,
      alt: item.media.altText || `졸업전시회 ${item.year}`,
    }));

    // Work Portfolios를 컴포넌트 포맷으로 변환
    const workData = workPortfolios.map(item => ({
      src: item.media.filepath,
      alt: item.media.altText || item.title,
      title: item.title,
      category: item.category,
    }));

    // 카테고리 추출
    const categories = ['All', ...Array.from(new Set(workPortfolios.map(p => p.category)))];

    // About Section content
    const aboutSectionContent = aboutSection?.content as any;
    const aboutContent = {
      title: aboutSectionContent?.title || 'About SMVD',
      visionLines: aboutSectionContent?.visionLines || [
        'FROM VISUAL DELIVERY',
        'TO SYSTEMIC SOLUTIONS',
        'SOLVING PROBLEMS,',
        'SHAPING THE FUTURE OF VISUALS',
      ],
    };

    return (
      <div>
        {/* Section Scroller for CMS preview */}
        <Suspense fallback={null}>
          <SectionScroller />
        </Suspense>

        {/* Header */}
        <Header />

        {/* Video Hero */}
        <VideoHero />

        {/* Main Content Container */}
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            paddingLeft: '40px',
            paddingRight: '40px',
          }}
        >
          {/* Exhibition Section */}
          <section id="section-exhibition">
            <ExhibitionSection items={exhibitionData} />
          </section>
        </div>

        {/* About Section (Full Width) */}
        <section id="section-about">
          <AboutSection content={aboutContent} />
        </section>

        {/* Work Section (Full Width) */}
        <section id="section-work">
          <WorkSection items={workData} categories={categories} />
        </section>

        {/* Footer */}
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Home page load error:', error);

    return (
      <div>
        <Header />
        <VideoHero />
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            paddingLeft: '40px',
            paddingRight: '40px',
          }}
        >
          <ExhibitionSection />
        </div>
        <AboutSection />
        <WorkSection />
        <Footer />
      </div>
    );
  }
}
