import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAdminAuthFast } from '@/lib/auth-check';
import z from 'zod';
import { invalidateAbout } from '@/lib/cache';
import { logger } from "@/lib/logger";

// About 섹션 내용 스키마
const AboutIntroSchema = z.object({
  title: z.string(),
  description: z.string(),
  imageSrc: z.string().optional(),
});

const AboutVisionSchema = z.object({
  title: z.string(),
  content: z.string(),
  chips: z.array(z.string()),
});

const AboutHistorySchema = z.object({
  title: z.string(),
  introText: z.string(),
  timelineItems: z.array(z.object({
    year: z.string(),
    description: z.string(),
  })),
});

const AboutPeopleSchema = z.object({
  professors: z.array(z.object({
    id: z.string(),
    name: z.string(),
    title: z.string(),
  })).optional(),
  instructors: z.array(z.object({
    id: z.string(),
    name: z.string(),
    specialty: z.string(),
  })).optional(),
});

// GET: About 페이지의 모든 섹션 조회
export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAdminAuthFast(request);
    if (!authResult.authenticated) return authResult.error;

    const aboutPage = await prisma.page.findUnique({
      where: { slug: 'about' },
      include: {
        sections: {
          where: {
            type: {
              in: [
                'ABOUT_INTRO',
                'ABOUT_VISION',
                'ABOUT_HISTORY',
                'ABOUT_PEOPLE',
              ] as const,
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!aboutPage) {
      return NextResponse.json({ error: 'About page not found' }, { status: 404 });
    }

    return NextResponse.json({ sections: aboutPage.sections });
  } catch (error) {
    logger.error({ err: error, context: 'GET /api/admin/about/sections' }, 'GET About sections error');
    return NextResponse.json(
      { error: 'Failed to fetch About sections' },
      { status: 500 }
    );
  }
}

// PUT: About 섹션 수정
export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuthFast(request);
    if (!authResult.authenticated) return authResult.error;

    const body = await request.json();
    const { sectionId, type, title, content } = body;

    if (!sectionId || !type || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 섹션 타입에 따라 content 검증
    let validatedContent;
    switch (type) {
      case 'ABOUT_INTRO':
        validatedContent = AboutIntroSchema.parse(content);
        break;
      case 'ABOUT_VISION':
        validatedContent = AboutVisionSchema.parse(content);
        break;
      case 'ABOUT_HISTORY':
        validatedContent = AboutHistorySchema.parse(content);
        break;
      case 'ABOUT_PEOPLE':
        validatedContent = AboutPeopleSchema.parse(content);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid section type' },
          { status: 400 }
        );
    }

    const updatedSection = await prisma.section.update({
      where: { id: sectionId },
      data: {
        title,
        content: validatedContent,
      },
    });

    // Invalidate ISR caches
    invalidateAbout();

    return NextResponse.json({ section: updatedSection });
  } catch (error) {
    logger.error({ err: error, context: 'PUT /api/admin/about/sections' }, 'PUT About section error');
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid content format', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update About section' },
      { status: 500 }
    );
  }
}
