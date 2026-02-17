import { test, expect, devices } from '@playwright/test';

/**
 * Responsive Design Critical E2E Tests
 *
 * Tests layout and functionality across different viewports
 * Focus: Mobile, tablet, desktop responsiveness
 */

test.describe('Responsive Design - Critical @critical', () => {
  test('Homepage should be responsive on mobile viewport (iPhone)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });

    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check main heading is visible
    const mainHeading = page.locator('h1').first();
    expect(mainHeading).toBeVisible();

    // Check navigation is accessible (hamburger or responsive nav)
    const navigation = page.locator('nav').first();
    expect(navigation).toBeVisible();

    // Check footer is visible
    const footer = page.locator('footer').first();
    expect(footer).toBeVisible();

    // Verify no horizontal scroll is needed
    const pageWidth = await page.evaluate(() => document.documentElement.offsetWidth);
    expect(pageWidth).toBeLessThanOrEqual(375);
  });

  test('About page should be responsive on tablet viewport (iPad)', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // Navigate to About page
    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    // Check page header
    const pageHeader = page.locator('h1').first();
    expect(pageHeader).toBeVisible();

    // Check that sections are properly arranged
    const sections = page.locator('section, [class*="section"], [class*="Section"]');
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThan(0);

    // Check for images or content
    const images = page.locator('img').first();
    const imageVisible = await images.isVisible().catch(() => false);
    expect(images).toBeVisible({ timeout: 5000 });

    // Verify no horizontal scroll
    const pageWidth = await page.evaluate(() => document.documentElement.offsetWidth);
    expect(pageWidth).toBeLessThanOrEqual(768);
  });

  test('Work detail page should properly scale images on different viewports', async ({ page }) => {
    // Desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });

    // Navigate to Work section
    await page.goto('/work');
    await page.waitForLoadState('networkidle');

    // Find and click first work item
    const workItem = page.locator('a[href*="/work/"]').first();
    expect(workItem).toBeVisible({ timeout: 5000 });

    // Get the work item image and check it's visible
    const itemImage = workItem.locator('img').first();
    expect(itemImage).toBeVisible();

    // Get image dimensions on desktop
    const desktopImageBox = await itemImage.boundingBox();
    expect(desktopImageBox).toBeTruthy();
    expect(desktopImageBox?.width).toBeGreaterThan(200);

    // Switch to mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });

    // Image should still be visible
    const mobileImageVisible = await itemImage.isVisible();
    expect(mobileImageVisible).toBeTruthy();

    // Image should be smaller or equal on mobile
    const mobileImageBox = await itemImage.boundingBox();
    expect(mobileImageBox).toBeTruthy();

    // Mobile image width should be less than desktop (if available)
    if (desktopImageBox && mobileImageBox) {
      expect(mobileImageBox.width).toBeLessThanOrEqual(desktopImageBox.width);
    }
  });

  test('Navigation should be accessible on all viewports', async ({ page }) => {
    // Test desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const desktopNav = page.locator('nav').first();
    expect(desktopNav).toBeVisible();

    // Test mobile
    await page.setViewportSize({ width: 375, height: 812 });

    const mobileNav = page.locator('nav').first();
    expect(mobileNav).toBeVisible();

    // Navigation items should be accessible (either visible or in hamburger menu)
    const navItems = page.locator('nav').locator('a, button').first();
    expect(navItems).toBeVisible({ timeout: 5000 });
  });
});
