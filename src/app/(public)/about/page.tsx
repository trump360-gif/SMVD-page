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

        {/* About Major Header Section */}
        <div
          style={{
            width: '100%',
            paddingTop: '60px',
            paddingBottom: '0px',
            paddingLeft: '40px',
            paddingRight: '40px',
            backgroundColor: '#ffffffff',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#141414ff',
                fontFamily: 'Inter',
                margin: '0',
                letterSpacing: '0.0703125px',
                lineHeight: 1.5,
              }}
            >
              About Major
            </h1>
            <div
              style={{
                height: '1px',
                backgroundColor: '#141414ff',
                width: '100%',
              }}
            />
          </div>
        </div>

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

        {/* About Major Header Section */}
        <div
          style={{
            width: '100%',
            paddingTop: '60px',
            paddingBottom: '0px',
            paddingLeft: '40px',
            paddingRight: '40px',
            backgroundColor: '#ffffffff',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#141414ff',
                fontFamily: 'Inter',
                margin: '0',
                letterSpacing: '0.0703125px',
                lineHeight: 1.5,
              }}
            >
              About Major
            </h1>
            <div
              style={{
                height: '1px',
                backgroundColor: '#141414ff',
                width: '100%',
              }}
            />
          </div>
        </div>

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
