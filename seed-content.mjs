import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

const pageContent = {
  about: [
    {
      type: 'HERO',
      title: '학과소개',
      order: 1,
      content: {
        title: '숙명여자대학교',
        subtitle: '시각영상디자인과',
        description: '디지털 시대의 창의적 시각 표현을 주도하는 학과',
        backgroundImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1440&h=600&fit=crop',
      },
    },
    {
      type: 'TEXT_BLOCK',
      title: '학과소개',
      order: 2,
      content: {
        heading: '숙명여자대학교 시각영상디자인과',
        description: '시각영상디자인과는 디지털 미디어 시대에 필요한 창의적 시각표현 능력을 갖춘 전문 인재를 양성하는 학과입니다.',
        body: '우리 학과는 그래픽 디자인, 영상 제작, 웹 디자인, UI/UX 디자인 등 다양한 분야의 교육을 제공하며, 학생들이 이론과 실무를 겸비한 전문가로 성장할 수 있도록 지원합니다.',
      },
    },
    {
      type: 'THREE_COLUMN',
      title: '학과 특징',
      order: 3,
      content: {
        items: [
          {
            icon: '🎨',
            title: '창의적 교육',
            description: '최신 디자인 트렌드와 기술을 반영한 커리큘럼',
          },
          {
            icon: '💻',
            title: '실무 중심',
            description: '산업계와 연계한 프로젝트 기반 학습',
          },
          {
            icon: '🌟',
            title: '국제화',
            description: '국제 교류 프로그램 및 글로벌 네트워크',
          },
        ],
      },
    },
  ],
  curriculum: [
    {
      type: 'HERO',
      title: '교과과정',
      order: 1,
      content: {
        title: '교과과정',
        subtitle: '다양한 교육과정을 통해 전문가를 양성합니다',
      },
    },
    {
      type: 'CURRICULUM_TABLE',
      title: '1학년',
      order: 2,
      content: {
        year: 1,
        semesters: {
          spring: [
            { code: 'VD101', name: '디자인기초', credits: 3, type: '필수' },
            { code: 'VD102', name: '드로잉', credits: 3, type: '필수' },
            { code: 'VD103', name: '색채론', credits: 3, type: '필수' },
          ],
          fall: [
            { code: 'VD104', name: '타이포그래피', credits: 3, type: '필수' },
            { code: 'VD105', name: '컴퓨터그래픽스기초', credits: 3, type: '필수' },
            { code: 'VD106', name: '사진', credits: 3, type: '필수' },
          ],
        },
      },
    },
    {
      type: 'CURRICULUM_TABLE',
      title: '2학년',
      order: 3,
      content: {
        year: 2,
        semesters: {
          spring: [
            { code: 'VD201', name: '그래픽디자인1', credits: 3, type: '필수' },
            { code: 'VD202', name: '영상제작기초', credits: 3, type: '필수' },
            { code: 'VD203', name: '웹디자인', credits: 3, type: '선택' },
          ],
          fall: [
            { code: 'VD204', name: '그래픽디자인2', credits: 3, type: '필수' },
            { code: 'VD205', name: '영상제작심화', credits: 3, type: '필수' },
            { code: 'VD206', name: '인터랙션디자인', credits: 3, type: '선택' },
          ],
        },
      },
    },
  ],
  people: [
    {
      type: 'HERO',
      title: '교수진',
      order: 1,
      content: {
        title: '교수진',
        subtitle: '경험 많은 전문 교수진이 함께합니다',
      },
    },
    {
      type: 'FACULTY_LIST',
      title: '교수진 소개',
      order: 2,
      content: {
        faculty: [
          {
            name: '김영미 교수',
            title: '학과장',
            email: 'kim.youngmi@smvd.ac.kr',
            bio: '그래픽 디자인 전공, 20년 경력',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
          },
          {
            name: '이준호 교수',
            title: '부학과장',
            email: 'lee.junho@smvd.ac.kr',
            bio: '영상 제작 전공, 15년 경력',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
          },
          {
            name: '박지은 교수',
            title: '교수',
            email: 'park.jieun@smvd.ac.kr',
            bio: 'UI/UX 디자인 전공, 10년 경력',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
          },
        ],
      },
    },
  ],
  work: [
    {
      type: 'HERO',
      title: '포트폴리오',
      order: 1,
      content: {
        title: '학생 포트폴리오',
        subtitle: '창의적인 작품들을 감상해보세요',
      },
    },
    {
      type: 'PORTFOLIO_GRID',
      title: '작품 갤러리',
      order: 2,
      content: {
        items: [
          {
            title: '캠페인 디자인',
            category: '그래픽 디자인',
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=400&fit=crop',
            link: '#',
          },
          {
            title: '브랜딩 프로젝트',
            category: '브랜드 아이덴티티',
            image: 'https://images.unsplash.com/photo-1561443887-8f73fba93b97?w=500&h=400&fit=crop',
            link: '#',
          },
          {
            title: '웹사이트 디자인',
            category: '웹 디자인',
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=400&fit=crop',
            link: '#',
          },
          {
            title: '영상 작품',
            category: '영상 제작',
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop',
            link: '#',
          },
          {
            title: 'UI/UX 프로토타입',
            category: 'UI/UX 디자인',
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=400&fit=crop',
            link: '#',
          },
          {
            title: '책자 디자인',
            category: '편집 디자인',
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=400&fit=crop',
            link: '#',
          },
        ],
      },
    },
  ],
  news: [
    {
      type: 'HERO',
      title: '뉴스&이벤트',
      order: 1,
      content: {
        title: '뉴스 & 이벤트',
        subtitle: '최신 소식과 행사 정보를 확인하세요',
      },
    },
    {
      type: 'NEWS_GRID',
      title: '뉴스',
      order: 2,
      content: {
        items: [
          {
            title: '2026년 봄학기 신입생 모집 안내',
            category: '공지',
            date: '2026-02-12',
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
            excerpt: '2026학년도 봄학기 신입생 모집을 시작합니다.',
            link: '#',
          },
          {
            title: '학생 작품 전시회 개최',
            category: '행사',
            date: '2026-02-10',
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
            excerpt: '우리 학과 학생들의 우수 작품 전시회가 개최됩니다.',
            link: '#',
          },
          {
            title: '국제 교류 프로그램 참가자 모집',
            category: '공지',
            date: '2026-02-08',
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
            excerpt: '해외 대학 교류 프로그램에 참가할 학생을 모집합니다.',
            link: '#',
          },
          {
            title: '산업체 특강 및 네트워킹',
            category: '강연',
            date: '2026-02-05',
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
            excerpt: '업계 전문가를 초청한 특강과 네트워킹 세션이 진행됩니다.',
            link: '#',
          },
        ],
      },
    },
    {
      type: 'EVENT_LIST',
      title: '행사',
      order: 3,
      content: {
        items: [
          {
            title: '학위수여식',
            date: '2026-02-20',
            time: '14:00',
            location: '학생회관 대강당',
            category: '행사',
          },
          {
            title: '신입생 오리엔테이션',
            date: '2026-03-02',
            time: '10:00',
            location: '학과 강의실',
            category: '행사',
          },
          {
            title: '봄 축제',
            date: '2026-05-15',
            time: '12:00',
            location: '캠퍼스 전역',
            category: '축제',
          },
        ],
      },
    },
  ],
};

async function seedContent() {
  try {
    console.log('🌱 콘텐츠 시드 시작...');

    const pageMap = {
      about: 'page-002',
      curriculum: 'page-003',
      people: 'page-004',
      work: 'page-005',
      news: 'page-006',
    };

    for (const [pageKey, pageId] of Object.entries(pageMap)) {
      console.log(`\n📄 ${pageKey} 페이지 섹션 추가 중...`);

      // 기존 섹션 삭제
      await prisma.section.deleteMany({
        where: { pageId },
      });

      const sections = pageContent[pageKey];

      for (const section of sections) {
        const created = await prisma.section.create({
          data: {
            pageId,
            type: section.type,
            title: section.title,
            content: section.content,
            order: section.order,
          },
        });
        console.log(`  ✅ ${section.type}: ${section.title}`);
      }
    }

    console.log('\n✅ 콘텐츠 시드 완료!');
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seedContent();
