import { prisma } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth-check';
import { successResponse, errorResponse } from '@/lib/api-response';
import { workDetails } from '@/constants/work-details';
import { logger } from "@/lib/logger";

// Hardcoded exhibition data (from WorkArchive.tsx)
const defaultExhibitions = [
  {
    title: 'Vora',
    subtitle: '권나연 외 3명, 2025',
    artist: 'Voice Out Recovery Assistant',
    image: '/images/exhibition/Rectangle 45-5.png',
    year: '2025',
  },
  {
    title: 'Mindit',
    subtitle: '도인영 외 3명, 2025',
    artist: '도민앱 외 3명',
    image: '/images/exhibition/Rectangle 45-4.png',
    year: '2025',
  },
  {
    title: 'MIST AWAY',
    subtitle: '신예지, 2025',
    artist: '신예지',
    image: '/images/exhibition/Rectangle 45-3.png',
    year: '2025',
  },
  {
    title: 'GALJIDO (갈지도)',
    subtitle: '조혜원, 2025',
    artist: '조혜원',
    image: '/images/exhibition/Rectangle 45-2.png',
    year: '2025',
  },
  {
    title: 'Callmate',
    subtitle: '고은빈, 2025',
    artist: '고은빈',
    image: '/images/exhibition/Rectangle 45-1.png',
    year: '2025',
  },
  {
    title: 'MOA',
    subtitle: '강세정 외 2명, 2025',
    artist: '강세정',
    image: '/images/exhibition/Rectangle 45.png',
    year: '2025',
  },
];

// Portfolio items mapped from WorkArchive.tsx
const defaultPortfolioItems = [
  { slug: '1', title: 'Vora', subtitle: '권나연 외 3명, 2025', category: 'UX/UI', thumbnailImage: '/images/work/portfolio-12.png' },
  { slug: '2', title: 'Mindit', subtitle: '도인영 외 3명, 2025', category: 'UX/UI', thumbnailImage: '/images/work/portfolio-10.png' },
  { slug: '3', title: 'StarNew Valley', subtitle: '안시현 외 3명, 2025', category: 'Game', thumbnailImage: '/images/work/portfolio-9.png' },
  { slug: '4', title: 'Pave', subtitle: '박지우 외 2명, 2025', category: 'UX/UI', thumbnailImage: '/images/work/portfolio-11.png' },
  { slug: '5', title: 'Bolio', subtitle: '박근영, 2025', category: 'UX/UI', thumbnailImage: '/images/work/portfolio-7.png' },
  { slug: '6', title: 'MIST AWAY', subtitle: '신예지, 2025', category: 'UX/UI', thumbnailImage: '/images/work/portfolio-6.png' },
  { slug: '7', title: 'BICHAE', subtitle: '최은정, 2025', category: 'Branding', thumbnailImage: '/images/work/portfolio-5.png' },
  { slug: '8', title: 'Morae', subtitle: '고은서, 2023', category: 'UX/UI', thumbnailImage: '/images/work/portfolio-4.png' },
  { slug: '9', title: 'STUDIO KNOT', subtitle: '노하린, 2025', category: 'Branding', thumbnailImage: '/images/work/portfolio-3.png' },
  { slug: '10', title: 'BLOME', subtitle: '김진아 외 1명, 2025', category: 'Branding', thumbnailImage: '/images/work/portfolio-8.png' },
  { slug: '11', title: 'alors: romanticize your life, every...', subtitle: '정유진, 2025', category: 'Motion', thumbnailImage: '/images/work/portfolio-2.png' },
  { slug: '12', title: '고군분투', subtitle: '한다인, 2025', category: 'Motion', thumbnailImage: '/images/work/portfolio-1.png' },
];

/**
 * POST /api/admin/work/init
 * Work CMS 데이터 초기화 (12개 프로젝트 + 6개 전시)
 */
export async function POST() {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    // Check if data already exists
    const existingProjects = await prisma.workProject.count();
    const existingExhibitions = await prisma.workExhibition.count();

    if (existingProjects > 0 || existingExhibitions > 0) {
      return errorResponse(
        `이미 데이터가 존재합니다 (프로젝트: ${existingProjects}개, 전시: ${existingExhibitions}개). 초기화를 건너뜁니다.`,
        'ALREADY_INITIALIZED',
        409
      );
    }

    // Create projects from workDetails constant
    const createdProjects = [];
    for (let i = 0; i < defaultPortfolioItems.length; i++) {
      const item = defaultPortfolioItems[i];
      const detail = workDetails[item.slug];

      const project = await prisma.workProject.create({
        data: {
          slug: item.slug,
          title: item.title,
          subtitle: item.subtitle,
          category: item.category,
          tags: detail?.tags || [item.category],
          author: detail?.author || '',
          email: detail?.email || '',
          description: detail?.description || '',
          year: detail?.subtitle?.match(/\d{4}/)?.[0] || '2025',
          heroImage: detail?.heroImage || '',
          thumbnailImage: item.thumbnailImage,
          galleryImages: detail?.galleryImages || [],
          order: i,
          published: true,
        },
      });
      createdProjects.push(project);
    }

    // Create exhibitions
    const createdExhibitions = [];
    for (let i = 0; i < defaultExhibitions.length; i++) {
      const item = defaultExhibitions[i];
      const exhibition = await prisma.workExhibition.create({
        data: {
          title: item.title,
          subtitle: item.subtitle,
          artist: item.artist,
          image: item.image,
          year: item.year,
          order: i,
          published: true,
        },
      });
      createdExhibitions.push(exhibition);
    }

    return successResponse(
      {
        projects: createdProjects.length,
        exhibitions: createdExhibitions.length,
      },
      `초기화 완료: 프로젝트 ${createdProjects.length}개, 전시 ${createdExhibitions.length}개 생성`,
      201
    );
  } catch (error) {
    console.error('Work 초기화 오류:', error);
    return errorResponse('초기화 중 오류가 발생했습니다', 'INIT_ERROR', 500);
  }
}
