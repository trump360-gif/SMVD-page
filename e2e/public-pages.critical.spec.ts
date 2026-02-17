import { test, expect } from '@playwright/test';

/**
 * Public Pages Critical E2E Tests
 *
 * Tests core rendering and functionality of public-facing pages
 * Focus: Page load, navigation, content visibility
 */

test.describe('Public Pages - Critical @critical', () => {
  test('Homepage should load and display main sections', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Check hero section
    expect(await page.locator('h1').first()).toBeVisible();

    // Check that we can see key sections
    const exhibitionSection = page.locator('text=/Exhibition|전시/i').first();
    expect(exhibitionSection).toBeVisible({ timeout: 5000 });

    // Check navigation header
    const navigation = page.locator('nav').first();
    expect(navigation).toBeVisible();

    // Check footer exists
    const footer = page.locator('footer').first();
    expect(footer).toBeVisible();
  });

  test('About Major page should load with content', async ({ page }) => {
    // Navigate to About page
    await page.goto('/about');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check page title
    const pageTitle = page.locator('h1').first();
    expect(pageTitle).toBeVisible();

    // Check that About section is visible
    const aboutSection = page.locator('text=/About|소개/i').first();
    expect(aboutSection).toBeVisible({ timeout: 5000 });

    // Check for main image or section
    const imageOrSection = page.locator('img, [style*="background-image"]').first();
    expect(imageOrSection).toBeVisible({ timeout: 5000 });
  });

  test('Work Archive page should display portfolio items', async ({ page }) => {
    // Navigate to Work page
    await page.goto('/work');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check page header
    const header = page.locator('h1, h2').first();
    expect(header).toBeVisible();

    // Check that portfolio items are visible
    const portfolioItems = page.locator('[href*="/work/"]').first();
    expect(portfolioItems).toBeVisible({ timeout: 5000 });

    // Check that we can see category filters
    const categoryFilter = page.locator('button, [role="tab"]').first();
    expect(categoryFilter).toBeVisible();
  });

  test('News & Events page should display articles', async ({ page }) => {
    // Navigate to News page
    await page.goto('/news-and-events');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check page header
    const header = page.locator('h1, h2').first();
    expect(header).toBeVisible();

    // Check that news articles are visible
    const newsArticles = page.locator('[href*="/news/"]').first();
    expect(newsArticles).toBeVisible({ timeout: 5000 });

    // Verify page is responding correctly (200)
    const response = await page.request.get('/news-and-events');
    expect(response.status()).toBe(200);
  });

  test('Professor detail page should load with information', async ({ page }) => {
    // First navigate to People page to get a professor link
    await page.goto('/people');
    await page.waitForLoadState('networkidle');

    // Find first professor link
    const professorLink = page.locator('[href*="/professor/"]').first();
    expect(professorLink).toBeVisible({ timeout: 5000 });

    // Get the href and navigate to professor detail page
    const href = await professorLink.getAttribute('href');
    expect(href).toBeTruthy();

    // Navigate to professor detail page
    await page.goto(href!);
    await page.waitForLoadState('networkidle');

    // Check professor name or title
    const professorName = page.locator('h1, h2').first();
    expect(professorName).toBeVisible();

    // Check that contact info is visible
    const contactInfo = page.locator('text=/Email|office|phone/i').first();
    expect(contactInfo).toBeVisible({ timeout: 5000 });
  });
});
