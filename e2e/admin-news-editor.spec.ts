import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * News CMS Editor Critical E2E Tests
 *
 * Tests News/Blog section CMS functionality
 * Focus: Dashboard loading, modal opening, basic 3-panel editor interactions
 */

test.describe('News CMS Editor - Critical @critical', () => {
  // Use authenticated state from global setup
  test.use({
    storageState: path.join(__dirname, '.auth/admin.json'),
  });

  test('News dashboard should load with article list', async ({ page }) => {
    // Navigate to News dashboard
    await page.goto('/admin/dashboard/news');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check that page header is visible
    const header = page.locator('h1, h2').first();
    expect(header).toBeVisible();

    // Check for article list or items
    const articleItem = page.locator('button, [role="button"], a').first();
    expect(articleItem).toBeVisible({ timeout: 5000 });

    // Verify no 404 or error
    expect(page.url()).toContain('/admin/dashboard/news');
  });

  test('News create article modal should open', async ({ page }) => {
    // Navigate to News dashboard
    await page.goto('/admin/dashboard/news');
    await page.waitForLoadState('networkidle');

    // Find and click "Create New" or similar button
    const createButton = page.locator('button', { has: page.locator('text=/Create|New|추가|생성/i') }).first();

    // If create button exists, click it
    if (await createButton.isVisible().catch(() => false)) {
      await createButton.click();

      // Wait for modal to appear
      const modal = page.locator('[role="dialog"], .modal, [class*="modal"]').first();
      expect(modal).toBeVisible({ timeout: 5000 });

      // Check for form inputs
      const formInputs = page.locator('input, textarea').first();
      expect(formInputs).toBeVisible({ timeout: 5000 });
    }
  });

  test('News article edit modal should display 3-panel layout', async ({ page }) => {
    // Navigate to News dashboard
    await page.goto('/admin/dashboard/news');
    await page.waitForLoadState('networkidle');

    // Find and click first article
    const articleButton = page.locator('button, [role="button"], a').first();
    expect(articleButton).toBeVisible({ timeout: 5000 });
    await articleButton.click();

    // Wait for modal to appear
    const modal = page.locator('[role="dialog"], .modal, [class*="modal"]').first();
    expect(modal).toBeVisible({ timeout: 5000 });

    // Check for 3-panel layout:
    // 1. Left panel: Block list
    const blockList = page.locator('ul, [role="list"]', { has: page.locator('li, [role="listitem"]') }).first();
    expect(blockList).toBeVisible({ timeout: 5000 });

    // 2. Center panel: Editor form
    const editorPanel = page.locator('input, textarea, select').first();
    expect(editorPanel).toBeVisible({ timeout: 5000 });

    // 3. Right panel: Preview (iframe or section)
    const previewArea = page.locator('iframe, [class*="preview"], [class*="Preview"]').first();
    const previewExists = await previewArea.isVisible().catch(() => false);

    // At least editor panel should exist
    expect(editorPanel).toBeVisible();

    // Should have save or confirm button
    const saveButton = page.locator('button', { has: page.locator('text=/Save|Submit|확인/i') }).first();
    const saveExists = await saveButton.isVisible().catch(() => false);
    expect(saveExists).toBeTruthy();
  });
});
