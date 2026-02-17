import { chromium, FullConfig } from '@playwright/test';
import path from 'path';

/**
 * Global setup for E2E tests
 *
 * This runs before all tests and:
 * 1. Performs admin login
 * 2. Saves authenticated state to .auth/admin.json
 * 3. This state can be reused by tests using storageState configuration
 */
async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;

  // Create auth directory if it doesn't exist
  const authDir = path.join(__dirname, '.auth');

  // Launch browser for authentication
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to login page
    await page.goto(`${baseURL}/admin/login`);

    // Fill in credentials
    await page.fill('input[type="email"]', 'admin@smvd.ac.kr');
    await page.fill('input[type="password"]', 'admin123');

    // Submit login form
    await page.click('button[type="submit"]');

    // Wait for successful login and redirect to dashboard
    await page.waitForURL(`${baseURL}/admin/dashboard`, { timeout: 10000 });

    // Optional: Wait for a few more elements to load to ensure full session is established
    await page.waitForLoadState('networkidle');

    // Save authenticated state for reuse in tests
    await page.context().storageState({ path: path.join(authDir, 'admin.json') });

    console.log('✅ Global setup: Admin authentication successful');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw new Error('Failed to authenticate admin user during global setup');
  } finally {
    // Close browser
    await browser.close();
  }
}

export default globalSetup;
