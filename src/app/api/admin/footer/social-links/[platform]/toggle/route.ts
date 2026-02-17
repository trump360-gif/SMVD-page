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
import { PlatformSchema, SocialPlatform } from '@/types/schemas';

type SocialLinksMap = Record<SocialPlatform, { url: string; isActive: boolean }>;

function parseSocialLinks(raw: unknown): SocialLinksMap {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {} as SocialLinksMap;
  }
  return raw as SocialLinksMap;
}

/**
 * PATCH /api/admin/footer/social-links/:platform/toggle
 * SNS 링크 활성화/비활성화 토글
 * - 해당 platform이 없으면 404
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

    const updatedLinks: SocialLinksMap = {
      ...currentLinks,
      [platform]: {
        ...currentLinks[platform],
        isActive: !currentLinks[platform].isActive,
      },
    };

    const updated = await prisma.footer.update({
      where: { id: footer.id },
      data: { socialLinks: updatedLinks as unknown as Prisma.InputJsonValue },
    });

    const state = updatedLinks[platform].isActive ? '활성화' : '비활성화';
    logger.info(
      { context: `PATCH /api/admin/footer/social-links/${platform}/toggle` },
      `SNS 링크 ${state}: ${platform}`
    );
    return successResponse(updated, `${platform} 링크가 ${state}되었습니다`);
  } catch (error) {
    logger.error(
      { err: error, context: 'PATCH /api/admin/footer/social-links/:platform/toggle' },
      'SNS 링크 토글 오류'
    );
    return errorResponse('SNS 링크 상태를 변경하는 중 오류가 발생했습니다', 'UPDATE_ERROR', 500);
  }
}
