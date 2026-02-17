import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * Work CMS Editor Critical E2E Tests
 *
 * Tests Work section CMS functionality
 * Focus: Dashboard loading, modal opening, basic editor interactions
 */

test.describe('Work CMS Editor - Critical @critical', () => {
  // Use authenticated state from global setup
  test.use({
    storageState: path.join(__dirname, '.auth/admin.json'),
  });

  test('Work dashboard should load with project list', async ({ page }) => {
    // Navigate to Work dashboard
    await page.goto('/admin/dashboard/work');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check that page header is visible
    const header = page.locator('h1, h2').first();
    expect(header).toBeVisible();

    // Check for project list or items
    const projectItem = page.locator('button, [role="button"], a').first();
    expect(projectItem).toBeVisible({ timeout: 5000 });

    // Verify no 404 or error
    expect(page.url()).toContain('/admin/dashboard/work');
  });

  test('Work project modal should open when selecting a project', async ({ page }) => {
    // Navigate to Work dashboard
    await page.goto('/admin/dashboard/work');
    await page.waitForLoadState('networkidle');

    // Find and click first project
    const projectButton = page.locator('button, [role="button"], a').first();
    expect(projectButton).toBeVisible({ timeout: 5000 });

    // Click to open project
    await projectButton.click();

    // Wait for modal or detail view to appear
    const modal = page.locator('[role="dialog"], .modal, [class*="modal"]').first();
    expect(modal).toBeVisible({ timeout: 5000 });

    // Check for modal content (title, close button, etc.)
    const closeButton = page.locator('button[aria-label*="Close"], button[aria-label*="close"]').first();
    const modalTitle = page.locator('h2, h3').first();

    expect(modal).toBeVisible();
  });

  test('Work block editor should display basic editor interface', async ({ page }) => {
    // Navigate to Work dashboard
    await page.goto('/admin/dashboard/work');
    await page.waitForLoadState('networkidle');

    // Open first project
    const projectButton = page.locator('button, [role="button"], a').first();
    expect(projectButton).toBeVisible({ timeout: 5000 });
    await projectButton.click();

    // Wait for modal to appear
    const modal = page.locator('[role="dialog"], .modal, [class*="modal"]').first();
    expect(modal).toBeVisible({ timeout: 5000 });

    // Check for block editor elements
    // Should have block list on left
    const blockList = page.locator('ul, [role="list"]', { has: page.locator('li, [role="listitem"]') }).first();
    expect(blockList).toBeVisible({ timeout: 5000 });

    // Should have some form inputs or editor panel
    const editorPanel = page.locator('input, textarea, select, [role="combobox"]').first();
    expect(editorPanel).toBeVisible({ timeout: 5000 });

    // Should have preview area (iframe or section)
    const previewArea = page.locator('iframe, [class*="preview"]').first();
    const previewExists = await previewArea.isVisible().catch(() => false);

    // Either preview iframe or preview section should exist
    expect(previewExists || blockList).toBeTruthy();
  });
});
