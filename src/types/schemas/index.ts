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
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type NavigationItem = z.infer<typeof NavigationItemSchema>;

export const CreateNavigationItemSchema = z.object({
  label: z.string().min(1, "메뉴 이름은 필수입니다"),
  href: z.string().url("유효한 URL을 입력하세요"),
  isActive: z.boolean().default(true),
});

export type CreateNavigationItemInput = z.infer<typeof CreateNavigationItemSchema>;

export const UpdateNavigationItemSchema = CreateNavigationItemSchema.partial();

export type UpdateNavigationItemInput = z.infer<typeof UpdateNavigationItemSchema>;

// Footer schemas
export const FooterSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  socialLinks: z.array(z.object({ text: z.string(), href: z.string() })).optional(),
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
  socialLinks: z.array(z.object({ text: z.string(), href: z.string() })).optional(),
  copyright: z.string().nullable().optional(),
});

export type UpdateFooterInput = z.infer<typeof UpdateFooterSchema>;

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
