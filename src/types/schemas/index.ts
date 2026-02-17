import { z } from "zod";

// Auth schemas
export const LoginSchema = z.object({
  email: z.string().email("유효한 이메일을 입력하세요"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// Page schemas
export const PageSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string().optional(),
  order: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Page = z.infer<typeof PageSchema>;

// Page request schemas
export const CreatePageSchema = z.object({
  slug: z.string().min(1, "슬러그는 필수입니다"),
  title: z.string().min(1, "제목은 필수입니다"),
  description: z.string().optional(),
});

export type CreatePageInput = z.infer<typeof CreatePageSchema>;

export const UpdatePageSchema = CreatePageSchema.partial();

export type UpdatePageInput = z.infer<typeof UpdatePageSchema>;

// Section schemas
export const SectionTypeSchema = z.enum([
  "HERO",
  "TEXT_BLOCK",
  "IMAGE_GALLERY",
  "TWO_COLUMN",
  "THREE_COLUMN",
  "TESTIMONIAL",
  "CTA_BUTTON",
  "VIDEO_EMBED",
  "ACCORDION",
  "STATS",
  "TEAM_GRID",
  "PORTFOLIO_GRID",
  "NEWS_GRID",
  "CURRICULUM_TABLE",
  "FACULTY_LIST",
  "HOME_ANIMATION",
  "WORK_PORTFOLIO",
  "EVENT_LIST",
  "CONTACT_FORM",
  "MAP",
  "CUSTOM_HTML",
  // About page types
  "ABOUT_INTRO",
  "ABOUT_VISION",
  "ABOUT_HISTORY",
  "ABOUT_PEOPLE",
  // Home page types
  "HOME_HERO",
  "EXHIBITION_SECTION",
  "HOME_ABOUT",
  // Curriculum page types
  "CURRICULUM_UNDERGRADUATE",
  "CURRICULUM_GRADUATE",
  // Work page types
  "WORK_ARCHIVE",
  "WORK_EXHIBITION",
  // News page types
  "NEWS_ARCHIVE",
]);

export const SectionSchema = z.object({
  id: z.string(),
  pageId: z.string(),
  type: SectionTypeSchema,
  title: z.string().nullable(),
  content: z.unknown().optional(),
  mediaIds: z.unknown().optional(),
  order: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Section = z.infer<typeof SectionSchema>;

// Section request schemas
export const CreateSectionSchema = z.object({
  pageId: z.string().min(1, "페이지 ID는 필수입니다"),
  type: SectionTypeSchema,
  title: z.string().nullable().optional(),
  content: z.unknown().optional(),
  mediaIds: z.unknown().optional(),
});

export type CreateSectionInput = z.infer<typeof CreateSectionSchema>;

export const UpdateSectionSchema = z.object({
  type: SectionTypeSchema.optional(),
  title: z.string().nullable().optional(),
  content: z.unknown().optional(),
  mediaIds: z.unknown().optional(),
});

export type UpdateSectionInput = z.infer<typeof UpdateSectionSchema>;

// Section reorder schema
export const SectionReorderItemSchema = z.object({
  id: z.string(),
  order: z.number().int().min(0),
});

export const SectionReorderSchema = z.object({
  pageId: z.string().min(1, "페이지 ID는 필수입니다"),
  sections: z.array(SectionReorderItemSchema).min(1, "최소 1개 이상의 섹션이 필요합니다"),
});

export type SectionReorderInput = z.infer<typeof SectionReorderSchema>;

// Media schemas
export const MediaSchema = z.object({
  id: z.string(),
  filename: z.string(),
  filepath: z.string(),
  mimeType: z.string(),
  size: z.number(),
  formats: z.record(z.string(), z.unknown()).optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  altText: z.string().optional(),
  uploadedAt: z.date(),
});

export type Media = z.infer<typeof MediaSchema>;

// Media upload request schema
export const CreateMediaSchema = z.object({
  altText: z.string().optional(),
});

export type CreateMediaInput = z.infer<typeof CreateMediaSchema>;

// Navigation schemas
export const NavigationItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
  order: z.number(),
  isActive: z.boolean(),
  parentId: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type NavigationItem = z.infer<typeof NavigationItemSchema>;

export const CreateNavigationSchema = z.object({
  label: z.string().min(1, "메뉴 이름은 필수입니다"),
  href: z.string().min(1, "href는 필수입니다"),
  parentId: z.string().optional(),
});

export type CreateNavigationInput = z.infer<typeof CreateNavigationSchema>;

export const UpdateNavigationSchema = CreateNavigationSchema.partial().extend({
  parentId: z.string().nullable().optional(),
});

export type UpdateNavigationInput = z.infer<typeof UpdateNavigationSchema>;

export const ReorderNavigationSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number().int().min(0),
    })
  ).min(1, "최소 1개 이상의 항목이 필요합니다"),
});

export type ReorderNavigationInput = z.infer<typeof ReorderNavigationSchema>;

// Legacy aliases (하위 호환성 유지)
export const CreateNavigationItemSchema = CreateNavigationSchema;
export type CreateNavigationItemInput = CreateNavigationInput;
export const UpdateNavigationItemSchema = UpdateNavigationSchema;
export type UpdateNavigationItemInput = UpdateNavigationInput;

// Footer schemas
export const SOCIAL_PLATFORMS = ['instagram', 'youtube', 'facebook', 'twitter', 'linkedin'] as const;
export type SocialPlatform = typeof SOCIAL_PLATFORMS[number];

export const PlatformSchema = z.enum(SOCIAL_PLATFORMS);

export const SocialLinkItemSchema = z.object({
  url: z.string(),
  isActive: z.boolean(),
});

export type SocialLinkItem = z.infer<typeof SocialLinkItemSchema>;

export const SocialLinksMapSchema = z.record(
  PlatformSchema,
  SocialLinkItemSchema
);

export const FooterSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  socialLinks: SocialLinksMapSchema.nullable().optional(),
  copyright: z.string().nullable(),
  updatedAt: z.date(),
});

export type Footer = z.infer<typeof FooterSchema>;

export const UpdateFooterSchema = z.object({
  title: z.string().optional(),
  description: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  copyright: z.string().nullable().optional(),
  // socialLinks는 /api/admin/footer/social-links/:platform 경로로 관리되지만,
  // 공개 API(/api/footer) 하위 호환성을 위해 유지
  socialLinks: z.array(z.object({ text: z.string(), href: z.string() })).optional(),
});

export type UpdateFooterInput = z.infer<typeof UpdateFooterSchema>;

export const AddSocialLinkSchema = z.object({
  url: z.string().url('유효한 URL이어야 합니다'),
  isActive: z.boolean().default(true),
});

export type AddSocialLinkInput = z.infer<typeof AddSocialLinkSchema>;

// Header config schemas
export const HeaderConfigSchema = z.object({
  id: z.string(),
  logoImageId: z.string().nullable(),
  logoImage: MediaSchema.nullable().optional(),
  faviconImageId: z.string().nullable(),
  faviconImage: MediaSchema.nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type HeaderConfig = z.infer<typeof HeaderConfigSchema>;

export const UpdateHeaderConfigSchema = z.object({
  logoImageId: z.string().nullable().optional(),
  faviconImageId: z.string().nullable().optional(),
});

export type UpdateHeaderConfigInput = z.infer<typeof UpdateHeaderConfigSchema>;

// API response schemas
export const ApiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const ApiSuccessSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  message: z.string().optional(),
});

export type ApiSuccess = z.infer<typeof ApiSuccessSchema>;
