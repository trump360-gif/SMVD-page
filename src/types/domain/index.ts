/**
 * 도메인 타입 정의
 * Prisma 모델을 기반으로 한 프론트엔드 타입
 */

// Pages
export interface PageType {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Sections
export enum SectionTypeEnum {
  HERO = "HERO",
  TEXT_BLOCK = "TEXT_BLOCK",
  IMAGE_GALLERY = "IMAGE_GALLERY",
  TWO_COLUMN = "TWO_COLUMN",
  THREE_COLUMN = "THREE_COLUMN",
  TESTIMONIAL = "TESTIMONIAL",
  CTA_BUTTON = "CTA_BUTTON",
  VIDEO_EMBED = "VIDEO_EMBED",
  ACCORDION = "ACCORDION",
  STATS = "STATS",
  TEAM_GRID = "TEAM_GRID",
  PORTFOLIO_GRID = "PORTFOLIO_GRID",
  NEWS_GRID = "NEWS_GRID",
  CURRICULUM_TABLE = "CURRICULUM_TABLE",
  FACULTY_LIST = "FACULTY_LIST",
  HOME_ANIMATION = "HOME_ANIMATION",
  WORK_PORTFOLIO = "WORK_PORTFOLIO",
  EVENT_LIST = "EVENT_LIST",
  CONTACT_FORM = "CONTACT_FORM",
  MAP = "MAP",
  CUSTOM_HTML = "CUSTOM_HTML",
}

export interface SectionType {
  id: string;
  pageId: string;
  type: SectionTypeEnum;
  title: string | null;
  content: Record<string, any> | null;
  mediaIds: string[] | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Media
export interface MediaType {
  id: string;
  filename: string;
  filepath: string;
  mimeType: string;
  size: number;
  formats: Record<string, any> | null;
  width: number | null;
  height: number | null;
  altText: string | null;
  uploadedAt: Date;
}

// Navigation
export interface NavigationType {
  id: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Footer
export interface FooterType {
  id: string;
  title: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  socialLinks: Record<string, string> | null;
  copyright: string | null;
  updatedAt: Date;
}

// User (Admin)
export interface UserType {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
