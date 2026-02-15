import { prisma } from '@/lib/db';
import {
  Header,
  VideoHero,
  ExhibitionSection,
  AboutSection,
  WorkSection,
  Footer,
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
          include: {
            exhibitionItems: {
              orderBy: { order: 'asc' },
              include: { media: true },
            },
            workPortfolios: {
              orderBy: { order: 'asc' },
              include: { media: true },
            },
          },
        },
      },
    });

    // Extract sections
    const exhibitionSection = page?.sections.find(
      (s) => s.type === 'EXHIBITION_SECTION'
    );
    const workSection = page?.sections.find(
      (s) => s.type === 'WORK_PORTFOLIO'
    );
    const aboutSection = page?.sections.find(
      (s) => s.type === 'HOME_ABOUT'
    );

    // Map exhibition items to component props
    const exhibitionItems = exhibitionSection?.exhibitionItems?.map((item) => ({
      year: item.year,
      src: item.media?.filepath || '',
      alt: item.media?.filename || `${item.year} exhibition`,
    })) || [];

    // Map work portfolios to component props
    const workItems = workSection?.workPortfolios?.map((item) => ({
      src: item.media?.filepath || '',
      alt: item.media?.filename || item.title,
      title: item.title,
      category: item.category,
    })) || [];

    // Extract about content
    const aboutContent = typeof aboutSection?.content === 'object' && aboutSection?.content
      ? (aboutSection.content as any)?.description || ''
      : '';

    return (
      <div>
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
          <ExhibitionSection items={exhibitionItems} />
        </div>

        {/* About Section (Full Width) */}
        <AboutSection content={aboutContent} />

        {/* Work Section (Full Width) */}
        <WorkSection items={workItems} />

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
          <ExhibitionSection items={[]} />
        </div>
        <AboutSection />
        <WorkSection items={[]} />
        <Footer />
      </div>
    );
  }
}
