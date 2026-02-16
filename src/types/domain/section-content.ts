/**
 * Section content types for each SectionType.
 * These define the shape of the JSON `content` field in the Section model.
 */

export interface AboutIntroContent {
  title?: string;
  description?: string;
  imageSrc?: string;
}

export interface AboutVisionContent {
  title?: string;
  content?: string;
  chips?: string[];
}

export interface AboutHistoryContent {
  title?: string;
  introText?: string;
  timelineItems?: Array<{ year: string; description: string }>;
}

export interface AboutPeopleContent {
  professors?: Array<{
    id: string;
    name: string;
    title: string;
    office?: string;
    email: string[];
    phone?: string;
    badge?: string;
    courses?: {
      undergraduate: string[];
      graduate: string[];
    };
  }>;
  instructors?: Array<{
    name: string;
    specialty: string;
  }>;
}

export interface HomeAboutContent {
  description?: string;
}

/**
 * Safely cast a Prisma Json value to a specific type.
 * Returns undefined if the value is null/undefined.
 */
export function asSectionContent<T>(value: unknown): T | undefined {
  if (value === null || value === undefined) return undefined;
  return value as T;
}
