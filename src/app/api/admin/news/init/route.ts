import { prisma } from '@/lib/db';
import { Prisma } from '@/generated/prisma';
import { checkAdminAuth } from '@/lib/auth-check';
import { successResponse, errorResponse } from '@/lib/api-response';
import { logger } from "@/lib/logger";

// 10 default news items from NewsEventArchive.tsx (hardcoded data)
const defaultNewsItems = [
  {
    slug: '1',
    title: '미술대학 2024년도 학생경비 집행내역 공개',
    category: 'Notice',
    excerpt: '',
    thumbnailImage: '/Group-27.svg',
    content: null,
    publishedAt: new Date('2025-01-05'),
  },
  {
    slug: '2',
    title: '디자인학과(박사) 2024년도 학생경비 집행내역 공개',
    category: 'Notice',
    excerpt: '',
    thumbnailImage: '/Group-27.svg',
    content: null,
    publishedAt: new Date('2025-01-05'),
  },
  {
    slug: '3',
    title: '시각영상디자인학과(석사) 2024년도 학생경비 집행내역 공개',
    category: 'Notice',
    excerpt: '',
    thumbnailImage: '/Group-27.svg',
    content: null,
    publishedAt: new Date('2025-01-05'),
  },
  {
    slug: '4',
    title: '시각영상디자인학과 2024년도 학생경비 집행내역 공개',
    category: 'Notice',
    excerpt: '',
    thumbnailImage: '/Group-27.svg',
    content: null,
    publishedAt: new Date('2025-01-05'),
  },
  {
    slug: '5',
    title: '2024 시각\u00b7영상디자인과 졸업전시회',
    category: 'Event',
    excerpt: '이번 전시 주제인 "Ready, Set, Go!" KICK OFF는 들을 제기 한전을 넘어 새로운 도약을 준비하는 결심을 담고 있습니다...',
    thumbnailImage: '/images/news/Image-1.png',
    content: {
      introTitle: '2024 시각영상디자인과 졸업전시회',
      introText: "이번 전시 주제인 'Ready, Set, Go!' KICK OFF는 틀을 깨고 한계를 넘어 새로운 도약을 준비하는 결심을 담아 진행되었습니다.\n필드를 넘어서 더 넓은 세계로 나아가는 여정을 함께해주신 교수님들과 관객 분들께 감사 인사를 전합니다.",
      gallery: {
        main: '/images/work-detail/Rectangle 240652481.png',
        layout: '1+2+3',
        centerLeft: '/images/work-detail/Rectangle 240652482.png',
        centerRight: '/images/work-detail/Rectangle 240652483.png',
        bottomLeft: '/images/work-detail/Rectangle 240652486.png',
        bottomCenter: '/images/work-detail/Rectangle 240652485.png',
        bottomRight: '/images/work-detail/Rectangle 240652484.png',
      },
    },
    publishedAt: new Date('2025-01-05'),
  },
  {
    slug: '6',
    title: '2024 시각\u00b7영상디자인과 동문의 밤',
    category: 'Event',
    excerpt: '2024년 10월 28일, 백주년기념관 한상은 라운지에서 2024 시각\u00b7영상디자인과 동문의 밤 행사를 진행했습니다. 1부에는 동문 특강을, 2부에는 황순선 교수님의 서프라이즈 퇴임식을 진행했습니다...',
    thumbnailImage: '/images/news/Image.png',
    content: null,
    publishedAt: new Date('2025-01-05'),
  },
  {
    slug: '7',
    title: '학생경비 집행 내역',
    category: 'Notice',
    excerpt: '',
    thumbnailImage: '/Group-27.svg',
    content: null,
    publishedAt: new Date('2025-01-05'),
  },
  {
    slug: '8',
    title: '[ 시각영상디자인과(박사) 2023 학생경비 집행내역 공개 ]',
    category: 'Notice',
    excerpt: '',
    thumbnailImage: '/Group-27.svg',
    content: null,
    publishedAt: new Date('2025-01-05'),
  },
  {
    slug: '9',
    title: '[ 시각영상디자인과(석사) 2023 학생경비 집행내역 공개 ]',
    category: 'Notice',
    excerpt: '',
    thumbnailImage: '/Group-27.svg',
    content: null,
    publishedAt: new Date('2025-01-05'),
  },
  {
    slug: '10',
    title: '[졸업] 재학생 졸업학점 이수완환 확인 및 과목 정리 실시',
    category: 'Notice',
    excerpt: '',
    thumbnailImage: '/Group-27.svg',
    content: null,
    publishedAt: new Date('2025-01-05'),
  },
];

/**
 * POST /api/admin/news/init
 * News CMS 데이터 초기화 (10개 뉴스)
 */
export async function POST() {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    // Check if data already exists
    const existingCount = await prisma.newsEvent.count();

    if (existingCount > 0) {
      return errorResponse(
        `이미 데이터가 존재합니다 (뉴스: ${existingCount}개). 초기화를 건너뜁니다.`,
        'ALREADY_INITIALIZED',
        409
      );
    }

    // Create news items
    const createdArticles = [];
    for (let i = 0; i < defaultNewsItems.length; i++) {
      const item = defaultNewsItems[i];
      const article = await prisma.newsEvent.create({
        data: {
          slug: item.slug,
          title: item.title,
          category: item.category,
          excerpt: item.excerpt || null,
          thumbnailImage: item.thumbnailImage,
          content: item.content ?? Prisma.JsonNull,
          publishedAt: item.publishedAt,
          published: true,
          order: i,
        },
      });
      createdArticles.push(article);
    }

    return successResponse(
      {
        articles: createdArticles.length,
      },
      `초기화 완료: 뉴스 ${createdArticles.length}개 생성`,
      201
    );
  } catch (error) {
    console.error('News 초기화 오류:', error);
    return errorResponse('초기화 중 오류가 발생했습니다', 'INIT_ERROR', 500);
  }
}
