import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Custom fixture for authenticated admin pages
 *
 * Usage:
 * test('my admin test', async ({ authenticatedPage }) => {
 *   await authenticatedPage.goto('/admin/dashboard');
 *   // test code here
 * });
 */
type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Navigate to login page
    await page.goto('/admin/login');

    // Fill in credentials
    await page.fill('input[type="email"]', 'admin@smvd.ac.kr');
    await page.fill('input[type="password"]', 'admin123');

    // Submit login form
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard and verify login success
    await page.waitForURL('/admin/dashboard', { timeout: 10000 });

    // Verify that we can see the dashboard title
    await expect(page.locator('text=/관리자|Admin|대시보드/i')).toBeVisible({ timeout: 5000 });

    // Provide the authenticated page to the test
    await use(page);
  },
});

export { expect };
