/**
 * Server-side data fetching functions for CMS admin pages.
 * These run in server components to eliminate client-side API waterfall.
 * Data is fetched directly from Prisma (no API round-trip).
 */
import { prisma } from '@/lib/db';
import { normalizeMediaUrl } from '@/lib/media-url';
import type { Section } from '@/hooks/home';

/** Serialize Prisma objects to plain JSON (removes Date objects, etc.) */
function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

/** Home page: pageId + sections with exhibition items & work portfolios */
export async function getHomePageData() {
  const homePage = await prisma.page.findUnique({
    where: { slug: 'home' },
    select: { id: true },
  });

  if (!homePage) return { pageId: '', sections: [] };

  const sections = await prisma.section.findMany({
    where: { pageId: homePage.id },
    orderBy: { order: 'asc' },
    include: {
      exhibitionItems: {
        include: { media: true },
        orderBy: { order: 'asc' },
      },
      workPortfolios: {
        include: { media: true },
        orderBy: { order: 'asc' },
      },
    },
  });

  const normalized = sections.map((section) => ({
    id: section.id,
    pageId: section.pageId,
    type: section.type as string,
    title: section.title ?? '',
    content: section.content as Record<string, unknown> | null,
    order: section.order,
    exhibitionItems: section.exhibitionItems.map((item) => ({
      id: item.id,
      sectionId: item.sectionId,
      year: item.year,
      mediaId: item.mediaId,
      order: item.order,
      media: item.media
        ? {
            id: item.media.id,
            filename: item.media.filename,
            filepath: normalizeMediaUrl(item.media.filepath) ?? item.media.filepath,
          }
        : undefined,
    })),
    workPortfolios: section.workPortfolios.map((item) => ({
      id: item.id,
      sectionId: item.sectionId,
      title: item.title,
      category: item.category,
      mediaId: item.mediaId,
      order: item.order,
      media: item.media
        ? {
            id: item.media.id,
            filename: item.media.filename,
            filepath: normalizeMediaUrl(item.media.filepath) ?? item.media.filepath,
          }
        : undefined,
    })),
  }));

  return { pageId: homePage.id, sections: serialize(normalized) as Section[] };
}

/** About page: sections + people */
export async function getAboutPageData() {
  const [aboutPage, people] = await Promise.all([
    prisma.page.findUnique({
      where: { slug: 'about' },
      include: {
        sections: {
          where: {
            type: {
              in: ['ABOUT_INTRO', 'ABOUT_VISION', 'ABOUT_HISTORY', 'ABOUT_PEOPLE'],
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    }),
    prisma.people.findMany({
      where: { archivedAt: null },
      select: {
        id: true,
        name: true,
        title: true,
        role: true,
        office: true,
        email: true,
        phone: true,
        major: true,
        specialty: true,
        badge: true,
        profileImage: true,
        courses: true,
        biography: true,
        mediaId: true,
        media: {
          select: {
            id: true,
            filename: true,
            filepath: true,
            mimeType: true,
            altText: true,
            width: true,
            height: true,
          },
        },
        order: true,
      },
      orderBy: { order: 'asc' },
    }),
  ]);

  return {
    sections: serialize(aboutPage?.sections || []),
    people: serialize(people),
  };
}

/** Work page: projects + exhibitions */
export async function getWorkPageData() {
  const [projects, exhibitions] = await Promise.all([
    prisma.workProject.findMany({ orderBy: { order: 'asc' } }),
    prisma.workExhibition.findMany({ orderBy: { order: 'asc' } }),
  ]);

  return {
    projects: serialize(projects),
    exhibitions: serialize(exhibitions),
  };
}

/** News page: articles */
export async function getNewsPageData() {
  const articles = await prisma.newsEvent.findMany({
    orderBy: { order: 'asc' },
  });

  return { articles: serialize(articles) };
}

/** Curriculum page: sections */
export async function getCurriculumPageData() {
  const curriculumPage = await prisma.page.findUnique({
    where: { slug: 'curriculum' },
    include: {
      sections: {
        where: {
          type: { in: ['CURRICULUM_UNDERGRADUATE', 'CURRICULUM_GRADUATE'] },
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  return {
    sections: serialize(curriculumPage?.sections || []),
  };
}
