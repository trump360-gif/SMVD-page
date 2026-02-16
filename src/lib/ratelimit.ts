/**
 * Rate Limiting Module
 *
 * In-memory sliding window rate limiter.
 * Designed with a provider interface so it can be swapped to Upstash Redis
 * in production without changing call sites.
 *
 * Usage:
 *   import { publicRatelimit, loginRatelimit, adminRatelimit } from '@/lib/ratelimit';
 *
 *   const { success, remaining } = await loginRatelimit.limit(identifier);
 *   if (!success) return errorResponse('Too many requests', 'RATE_LIMIT_EXCEEDED', 429);
 */

// ---------------------------------------------------------------------------
// Core types
// ---------------------------------------------------------------------------

export interface RateLimitResult {
  /** Whether the request is allowed */
  success: boolean;
  /** How many requests remain in the current window */
  remaining: number;
  /** Unix timestamp (ms) when the window resets */
  reset: number;
}

interface SlidingWindowEntry {
  timestamps: number[];
}

// ---------------------------------------------------------------------------
// In-memory sliding window implementation
// ---------------------------------------------------------------------------

class InMemoryRateLimiter {
  private store = new Map<string, SlidingWindowEntry>();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly prefix: string;

  /** Clean up expired entries every 60 seconds */
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(opts: {
    maxRequests: number;
    windowMs: number;
    prefix?: string;
  }) {
    this.maxRequests = opts.maxRequests;
    this.windowMs = opts.windowMs;
    this.prefix = opts.prefix ?? 'rl';

    // Periodic cleanup to prevent memory leak (server-side only)
    if (typeof globalThis !== 'undefined' && !this.cleanupInterval) {
      this.cleanupInterval = setInterval(() => this.cleanup(), 60_000);
      // Allow Node to exit even if this timer is running
      if (this.cleanupInterval && typeof this.cleanupInterval === 'object' && 'unref' in this.cleanupInterval) {
        (this.cleanupInterval as NodeJS.Timeout).unref();
      }
    }
  }

  async limit(identifier: string): Promise<RateLimitResult> {
    const key = `${this.prefix}:${identifier}`;
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let entry = this.store.get(key);
    if (!entry) {
      entry = { timestamps: [] };
      this.store.set(key, entry);
    }

    // Remove timestamps outside the sliding window
    entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);

    const remaining = Math.max(0, this.maxRequests - entry.timestamps.length);
    const reset = entry.timestamps.length > 0
      ? entry.timestamps[0] + this.windowMs
      : now + this.windowMs;

    if (entry.timestamps.length >= this.maxRequests) {
      return { success: false, remaining: 0, reset };
    }

    entry.timestamps.push(now);
    return { success: true, remaining: remaining - 1, reset };
  }

  /** Reset a specific identifier (e.g. after successful login) */
  async reset(identifier: string): Promise<void> {
    const key = `${this.prefix}:${identifier}`;
    this.store.delete(key);
  }

  /** Evict expired entries to prevent unbounded memory growth */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      entry.timestamps = entry.timestamps.filter(
        (ts) => ts > now - this.windowMs
      );
      if (entry.timestamps.length === 0) {
        this.store.delete(key);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Pre-configured limiters
// ---------------------------------------------------------------------------

/**
 * Public API rate limit: 1000 requests per hour per IP.
 * Protects public-facing endpoints from abuse.
 */
export const publicRatelimit = new InMemoryRateLimiter({
  maxRequests: 1000,
  windowMs: 60 * 60 * 1000, // 1 hour
  prefix: 'ratelimit:public',
});

/**
 * Login brute-force protection: 5 attempts per 15 minutes per IP.
 * Call .reset(ip) on successful login.
 */
export const loginRatelimit = new InMemoryRateLimiter({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  prefix: 'ratelimit:login',
});

/**
 * Admin API rate limit: 200 requests per hour per IP.
 * Stricter than public but allows normal CMS usage.
 */
export const adminRatelimit = new InMemoryRateLimiter({
  maxRequests: 200,
  windowMs: 60 * 60 * 1000, // 1 hour
  prefix: 'ratelimit:admin',
});

// ---------------------------------------------------------------------------
// Helper to extract client IP from request headers
// ---------------------------------------------------------------------------

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs; the first is the client
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}
