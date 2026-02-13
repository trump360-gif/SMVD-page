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
        },
      },
    });

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
          <ExhibitionSection />
        </div>

        {/* About Section (Full Width) */}
        <AboutSection />

        {/* Work Section (Full Width) */}
        <WorkSection />

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
