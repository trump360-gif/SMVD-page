/**
 * Cache Invalidation Helpers
 *
 * Centralized cache invalidation for ISR pages.
 * Called from admin API routes after successful mutations.
 */
import { revalidatePath } from 'next/cache';

/**
 * Invalidate the Home page cache.
 * Call after modifying home sections, exhibition items, or work portfolios.
 */
export function invalidateHome(): void {
  revalidatePath('/');
}

/**
 * Invalidate About page caches.
 * Call after modifying about sections or people data.
 */
export function invalidateAbout(): void {
  revalidatePath('/about');
}

/**
 * Invalidate Work page caches.
 * Call after modifying work projects or exhibitions.
 */
export function invalidateWork(): void {
  revalidatePath('/work');
  // Also invalidate individual work detail pages
  revalidatePath('/work/[id]', 'page');
}

/**
 * Invalidate Curriculum page cache.
 * Call after modifying curriculum sections.
 */
export function invalidateCurriculum(): void {
  revalidatePath('/curriculum');
}

/**
 * Invalidate News page caches.
 * Call after modifying news articles.
 */
export function invalidateNews(): void {
  revalidatePath('/news');
  // Also invalidate individual news detail pages
  revalidatePath('/news/[id]', 'page');
}

/**
 * Invalidate all public page caches.
 * Use sparingly - only for broad changes like navigation or footer.
 */
export function invalidateAll(): void {
  invalidateHome();
  invalidateAbout();
  invalidateWork();
  invalidateCurriculum();
  invalidateNews();
}
