import { test, expect } from '@playwright/test';

/**
 * Admin Login Critical E2E Tests
 *
 * Tests authentication flows and access control
 * Focus: Login success, invalid credentials, protected routes, logout
 */

test.describe('Admin Authentication - Critical @critical', () => {
  test('Admin login should succeed with correct credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/admin/login');

    // Check login form is visible
    const emailInput = page.locator('input[type="email"]');
    expect(emailInput).toBeVisible();

    const passwordInput = page.locator('input[type="password"]');
    expect(passwordInput).toBeVisible();

    // Fill in credentials
    await emailInput.fill('admin@smvd.ac.kr');
    await passwordInput.fill('admin123');

    // Click submit button
    const submitButton = page.locator('button[type="submit"]');
    expect(submitButton).toBeVisible();
    await submitButton.click();

    // Wait for redirect to dashboard
    await page.waitForURL('/admin/dashboard', { timeout: 10000 });

    // Verify we're on dashboard
    const dashboardHeader = page.locator('h1, h2').first();
    expect(dashboardHeader).toBeVisible();

    // Verify response is 200
    const response = await page.request.get('/admin/dashboard');
    expect(response.status()).toBe(200);
  });

  test('Admin login should fail with incorrect password', async ({ page }) => {
    // Navigate to login page
    await page.goto('/admin/login');

    // Fill in credentials with wrong password
    await page.fill('input[type="email"]', 'admin@smvd.ac.kr');
    await page.fill('input[type="password"]', 'wrongpassword123');

    // Click submit button
    await page.click('button[type="submit"]');

    // Should NOT redirect to dashboard (stays on login or shows error)
    // Wait a moment to see if redirect happens
    await page.waitForTimeout(2000);

    // Check if we're still on login page or error is shown
    const currentUrl = page.url();
    const isLoginPage = currentUrl.includes('/admin/login') || currentUrl.includes('error');
    expect(isLoginPage).toBeTruthy();

    // Check for error message
    const errorMessage = page.locator('text=/Invalid|incorrect|failed/i');
    const isVisible = await errorMessage.isVisible().catch(() => false);

    // Either error message or still on login page
    expect(isLoginPage || isVisible).toBeTruthy();
  });

  test('Protected admin route should redirect to login when not authenticated', async ({ page }) => {
    // Try to access dashboard without logging in
    const response = await page.request.get('/admin/dashboard', { followRedirects: false });

    // Should get a 307 redirect status
    expect([307, 302]).toContain(response.status());

    // Navigate to dashboard (which will redirect)
    await page.goto('/admin/dashboard');

    // Should end up on login page
    await page.waitForURL('/admin/login', { timeout: 5000 });

    // Verify we see login form
    const loginForm = page.locator('form, [role="form"]').first();
    expect(loginForm).toBeVisible();
  });

  test('Admin logout should clear session and redirect to login', async ({ page, context }) => {
    // First, login to the system
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'admin@smvd.ac.kr');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Wait for successful login
    await page.waitForURL('/admin/dashboard', { timeout: 10000 });

    // Verify we're logged in by checking for logout button or menu
    const logoutButton = page.locator('button, a', { has: page.locator('text=/Logout|Sign out|로그아웃/i') }).first();

    // If logout button exists, click it
    if (await logoutButton.isVisible().catch(() => false)) {
      await logoutButton.click();
    } else {
      // Alternative: use NextAuth signout API
      await page.request.post('/api/auth/signout');
    }

    // Wait a moment for redirect
    await page.waitForTimeout(1000);

    // Should be redirected to login or home page
    const currentUrl = page.url();
    const isLoggedOut = !currentUrl.includes('/admin/dashboard');
    expect(isLoggedOut).toBeTruthy();
  });
});
