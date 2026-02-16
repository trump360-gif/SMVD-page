import { z } from 'zod';

// ============================================================
// WorkBlogModal Validation Schema
// ============================================================

/** Zod schema for Work portfolio project input validation */
export const workBlogInputSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  subtitle: z.string().min(1, 'Subtitle is required').max(200),
  category: z.string().min(1, 'Category is required'),
  author: z.string().min(1, 'Author is required').max(100),
  email: z.string().email('Invalid email address'),
  year: z.string().optional(),
  thumbnailImage: z.string().optional(),
});

export type WorkBlogInput = z.infer<typeof workBlogInputSchema>;

// ============================================================
// NewsBlogModal Validation Schema
// ============================================================

/** Zod schema for News article input validation */
export const newsArticleInputSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  category: z.string().min(1, 'Category is required'),
  excerpt: z.string().max(500).optional(),
  publishedAt: z.string().optional(),
  thumbnailImage: z.string().optional(),
  attachments: z.unknown().optional(), // Attachments validated at runtime
});

export type NewsArticleInput = z.infer<typeof newsArticleInputSchema>;

// ============================================================
// Utilities
// ============================================================

/**
 * Extract the first human-readable error message from a ZodError.
 * Falls back to a generic message when no specific error is found.
 */
export function formatValidationError(error: z.ZodError<unknown>): string {
  return error.issues[0]?.message || 'Validation failed';
}
