import { prisma } from '@/lib/db';
import {
  Header,
  Footer,
} from '@/components/public/home';
import {
  AboutPageIntro,
  AboutPageVision,
  AboutPageHistory,
} from '@/components/public/about';

export const metadata = {
  title: 'About SMVD | 숙명여자대학교 시각영상디자인과',
  description: '숙명여자대학교 시각영상디자인과에 대해 알아보세요',
};

export default async function AboutPage() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'about' },
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

        {/* Main Content Container */}
        <div
          style={{
            width: '100%',
            paddingTop: '81px',
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
              gap: '40px',
            }}
          >
            {/* Intro Section with image 32 */}
            <AboutPageIntro />

            {/* Vision Section */}
            <AboutPageVision />

            {/* History Section */}
            <AboutPageHistory />
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('About page load error:', error);

    return (
      <div>
        <Header />
        <div
          style={{
            width: '100%',
            paddingTop: '81px',
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
              gap: '40px',
            }}
          >
            <AboutPageIntro />
            <AboutPageVision />
            <AboutPageHistory />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
