import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@/generated/prisma';
import { checkAdminAuth } from '@/lib/auth-check';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { AddSocialLinkSchema, PlatformSchema, SocialPlatform } from '@/types/schemas';

type SocialLinksMap = Record<SocialPlatform, { url: string; isActive: boolean }>;

function parseSocialLinks(raw: unknown): SocialLinksMap {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {} as SocialLinksMap;
  }
  return raw as SocialLinksMap;
}

/**
 * PATCH /api/admin/footer/social-links/:platform
 * 특정 SNS 링크 추가 또는 수정
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { platform: rawPlatform } = await params;

    const platformValidation = PlatformSchema.safeParse(rawPlatform);
    if (!platformValidation.success) {
      return errorResponse(
        `지원하지 않는 플랫폼입니다. 허용된 플랫폼: instagram, youtube, facebook, twitter, linkedin`,
        'INVALID_PLATFORM',
        400
      );
    }
    const platform = platformValidation.data;

    const body = await request.json();
    const validation = AddSocialLinkSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return errorResponse(
        '입력값 검증 실패: ' +
          Object.entries(errors)
            .map(([k, v]) => `${k}: ${(v as string[])?.[0]}`)
            .join(', '),
        'VALIDATION_ERROR',
        400
      );
    }

    const { url, isActive } = validation.data;

    // Footer 조회 또는 생성
    let footer = await prisma.footer.findFirst();
    if (!footer) {
      footer = await prisma.footer.create({
        data: {
          title: '숙명여자대학교 시각영상디자인과',
          socialLinks: Prisma.JsonNull,
        },
      });
    }

    const currentLinks = parseSocialLinks(footer.socialLinks);
    const updatedLinks: SocialLinksMap = {
      ...currentLinks,
      [platform]: { url, isActive },
    };

    const updated = await prisma.footer.update({
      where: { id: footer.id },
      data: { socialLinks: updatedLinks as unknown as Prisma.InputJsonValue },
    });

    logger.info(
      { context: `PATCH /api/admin/footer/social-links/${platform}` },
      `SNS 링크 추가/수정: ${platform}`
    );
    return successResponse(updated, `${platform} 링크가 저장되었습니다`);
  } catch (error) {
    logger.error(
      { err: error, context: 'PATCH /api/admin/footer/social-links/:platform' },
      'SNS 링크 추가/수정 오류'
    );
    return errorResponse('SNS 링크를 저장하는 중 오류가 발생했습니다', 'UPDATE_ERROR', 500);
  }
}

/**
 * DELETE /api/admin/footer/social-links/:platform
 * 특정 SNS 링크 삭제
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const { platform: rawPlatform } = await params;

    const platformValidation = PlatformSchema.safeParse(rawPlatform);
    if (!platformValidation.success) {
      return errorResponse(
        `지원하지 않는 플랫폼입니다. 허용된 플랫폼: instagram, youtube, facebook, twitter, linkedin`,
        'INVALID_PLATFORM',
        400
      );
    }
    const platform = platformValidation.data;

    const footer = await prisma.footer.findFirst();
    if (!footer) {
      return notFoundResponse('Footer');
    }

    const currentLinks = parseSocialLinks(footer.socialLinks);

    if (!currentLinks[platform]) {
      return errorResponse(
        `${platform} 링크를 찾을 수 없습니다`,
        'SOCIAL_LINK_NOT_FOUND',
        404
      );
    }

    const { [platform]: _removed, ...remainingLinks } = currentLinks;

    const updated = await prisma.footer.update({
      where: { id: footer.id },
      data: {
        socialLinks:
          Object.keys(remainingLinks).length > 0
            ? (remainingLinks as unknown as Prisma.InputJsonValue)
            : Prisma.JsonNull,
      },
    });

    logger.info(
      { context: `DELETE /api/admin/footer/social-links/${platform}` },
      `SNS 링크 삭제: ${platform}`
    );
    return successResponse(updated, `${platform} 링크가 삭제되었습니다`);
  } catch (error) {
    logger.error(
      { err: error, context: 'DELETE /api/admin/footer/social-links/:platform' },
      'SNS 링크 삭제 오류'
    );
    return errorResponse('SNS 링크를 삭제하는 중 오류가 발생했습니다', 'UPDATE_ERROR', 500);
  }
}
