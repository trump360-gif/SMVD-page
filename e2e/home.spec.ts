import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render hero section with title', async ({ page }) => {
    // VideoHero 컴포넌트 검증
    await page.waitForTimeout(2000);

    // 비디오 또는 히어로 영역이 있는지 확인 (hidden 제외)
    const heroSection = page.locator('video, h1, header').first();
    await expect(heroSection).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to About page via header', async ({ page }) => {
    // Header의 About 링크 클릭
    const aboutLink = page.locator('a[href="/about"]').first();
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();

    // URL 변경 확인
    await expect(page).toHaveURL('/about');
  });

  test('should display vision section', async ({ page }) => {
    // VisionSection 컴포넌트 검증
    const visionSection = page.locator('text=/시각|영상|디자인/').first();
    await expect(visionSection).toBeVisible({ timeout: 10000 });
  });

  test('should render exhibition section with images', async ({ page }) => {
    // ExhibitionSection 이미지 검증
    await page.waitForLoadState('networkidle');
    const images = page.locator('img');
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(0);
  });

  test('should display info navigation section', async ({ page }) => {
    // InfoSection 검증
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const infoSection = page.locator('text=/About|Curriculum|People|Work|News/').first();
    await expect(infoSection).toBeVisible();
  });

  test('should have working header navigation', async ({ page }) => {
    // Header의 모든 메뉴 링크 확인
    const menuLinks = page.locator('header a');
    const count = await menuLinks.count();
    expect(count).toBeGreaterThanOrEqual(5); // Home, About, Curriculum, People, Work, News
  });

  test('should have footer with contact information', async ({ page }) => {
    // Footer 검증
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
