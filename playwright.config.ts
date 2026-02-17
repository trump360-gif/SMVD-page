import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration for SMVD CMS
 *
 * Test Coverage:
 * - Public pages (8): Home, About, Curriculum, People, Work, News, Professor details
 * - Admin CMS (Critical flows): Login, Work editor, News editor
 * - API validation
 * - Responsive design (Desktop, Tablet, Mobile)
 */
export default defineConfig({
  testDir: './e2e',

  // Global setup
  globalSetup: require.resolve('./e2e/global-setup.ts'),

  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['list'], // Console output
  ],

  // Global test settings
  use: {
    // Base URL for all tests
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

    // Capture screenshots on failure
    screenshot: 'only-on-failure',

    // Record video on retry
    video: 'retain-on-failure',

    // Trace on first retry
    trace: 'on-first-retry',

    // Timeouts
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  // Test projects for different browsers/viewports
  projects: [
    // Desktop - Chrome (Primary)
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },

    // Desktop - Firefox (Critical paths only)
    {
      name: 'firefox-desktop',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1440, height: 900 },
      },
      testMatch: /.*\.critical\.spec\.ts/, // Only critical tests
    },

    // Tablet - iPad
    {
      name: 'tablet-ipad',
      use: {
        ...devices['iPad Pro'],
      },
      testMatch: /.*\.(public|responsive)\.spec\.ts/, // Public pages only
    },

    // Mobile - iPhone
    {
      name: 'mobile-iphone',
      use: {
        ...devices['iPhone 14 Pro'],
      },
      testMatch: /.*\.(public|responsive)\.spec\.ts/, // Public pages only
    },
  ],

  // Development server (auto-start for local tests)
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/smvd_test',
      NEXTAUTH_URL: 'http://localhost:3000',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'test-secret-key-minimum-32-characters-long-xyz',
    },
  },

  // Global timeout (30 minutes for full suite)
  globalTimeout: 30 * 60 * 1000,

  // Test timeout (2 minutes per test)
  timeout: 2 * 60 * 1000,

  // Expect timeout
  expect: {
    timeout: 10000,
  },
});
