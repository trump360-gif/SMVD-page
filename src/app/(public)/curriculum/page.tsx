import {
  Header,
  Footer,
} from '@/components/public/home';
import { CurriculumTab } from '@/components/public/curriculum';
import { prisma } from '@/lib/db';
import { SectionType } from '@/generated/prisma';
import type { UndergraduateContent, GraduateContent } from '@/lib/validation/curriculum';

export const dynamic = 'force-dynamic';

async function getCurriculumData() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'curriculum' },
      include: {
        sections: {
          where: {
            type: {
              in: [SectionType.CURRICULUM_UNDERGRADUATE, SectionType.CURRICULUM_GRADUATE],
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!page) return { undergraduate: null, graduate: null };

    let undergraduate: UndergraduateContent | null = null;
    let graduate: GraduateContent | null = null;

    for (const section of page.sections) {
      if (section.type === 'CURRICULUM_UNDERGRADUATE' && section.content) {
        undergraduate = section.content as unknown as UndergraduateContent;
      } else if (section.type === 'CURRICULUM_GRADUATE' && section.content) {
        graduate = section.content as unknown as GraduateContent;
      }
    }

    return { undergraduate, graduate };
  } catch (error) {
    console.error('Failed to fetch curriculum data:', error);
    return { undergraduate: null, graduate: null };
  }
}

export default async function CurriculumPage() {
  const { undergraduate, graduate } = await getCurriculumData();

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
          <CurriculumTab
            undergraduateContent={undergraduate}
            graduateContent={graduate}
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
