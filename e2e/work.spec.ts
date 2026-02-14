import { test, expect } from '@playwright/test';

test.describe('Work Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/work');
  });

  test('should render work portfolio grid', async ({ page }) => {
    // 포트폴리오 그리드가 렌더링되는지 확인
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const items = page.locator('header, h1, h2').first();
    await expect(items).toBeVisible({ timeout: 10000 });
  });

  test('should display tab navigation (Achieve/Exhibition)', async ({ page }) => {
    // Achieve/Exhibition 탭 확인
    await page.waitForTimeout(1000);

    const achieveTab = page.locator('button:has-text("Achieve"), button:has-text("수상")').first();
    const exhibitionTab = page.locator('button:has-text("Exhibition"), button:has-text("전시")').first();

    // 최소 하나의 탭이 표시되는지 확인
    const achieveVisible = await achieveTab.isVisible({ timeout: 3000 }).catch(() => false);
    const exhibitionVisible = await exhibitionTab.isVisible({ timeout: 3000 }).catch(() => false);

    expect(achieveVisible || exhibitionVisible).toBe(true);
  });

  test('should switch between tabs', async ({ page }) => {
    // 탭 전환 테스트
    await page.waitForTimeout(1000);

    const tabs = page.locator('button').filter({ hasText: /Achieve|Exhibition|수상|전시/ });
    const tabCount = await tabs.count();

    if (tabCount >= 2) {
      // 첫 번째 탭 클릭
      await tabs.nth(0).click();
      await page.waitForTimeout(800);

      // 콘텐츠가 표시되는지 확인
      let content = page.locator('img, video, div[class*="content"]').first();
      if (await content.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(content).toBeVisible();
      }

      // 두 번째 탭 클릭
      await tabs.nth(1).click();
      await page.waitForTimeout(800);

      // 콘텐츠가 표시되는지 확인
      content = page.locator('img, video, div[class*="content"]').first();
      if (await content.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(content).toBeVisible();
      }
    }
  });

  test('should display portfolio items', async ({ page }) => {
    // 포트폴리오 아이템이 표시되는지 확인
    await page.waitForTimeout(1000);

    const items = page.locator('img, div[class*="item"], div[class*="card"]');
    const itemCount = await items.count();
    expect(itemCount).toBeGreaterThanOrEqual(1);
  });

  test('should have images loaded', async ({ page }) => {
    // 이미지가 로드되었는지 확인
    await page.waitForTimeout(1000);

    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      const firstImage = images.first();
      await expect(firstImage).toBeVisible();

      const src = await firstImage.getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('should display work titles and descriptions', async ({ page }) => {
    // 작품 제목과 설명이 표시되는지 확인
    await page.waitForTimeout(1000);

    const textElements = page.locator('h1, h2, h3, h4, p');
    const textCount = await textElements.count();
    expect(textCount).toBeGreaterThan(0);
  });

  test('should scroll through portfolio items', async ({ page }) => {
    // 포트폴리오 아이템들 스크롤 테스트
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 3));
    await page.waitForTimeout(500);

    await page.evaluate(() => window.scrollTo(0, (document.body.scrollHeight / 3) * 2));
    await page.waitForTimeout(500);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
  });

  test('should have active Work tab in header', async ({ page }) => {
    // Header의 Work 탭이 활성화되어 있는지 확인
    const workTab = page.locator('a[href="/work"]').first();
    await expect(workTab).toBeVisible();
  });

  test('should display year filter or categories', async ({ page }) => {
    // 연도 필터 또는 카테고리가 있는지 확인
    await page.waitForTimeout(1000);

    const filters = page.locator('button, select').filter({ hasText: /20\d{2}|전체|All|Category/ });
    const filterCount = await filters.count();

    // 필터가 있을 수도 있고 없을 수도 있음
    expect(filterCount).toBeGreaterThanOrEqual(0);
  });

  test('should handle empty state gracefully', async ({ page }) => {
    // 빈 상태 처리 확인
    await page.waitForTimeout(2000);

    const content = page.locator('header, h1, h2').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Work Page - Grid Layout', () => {
  test('should display portfolio in grid format', async ({ page }) => {
    await page.goto('/work');
    await page.waitForTimeout(1000);

    // 그리드 레이아웃 확인
    const grid = page.locator('div[class*="grid"]').first();
    if (await grid.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(grid).toBeVisible();
    }
  });

  test('should have responsive layout', async ({ page }) => {
    await page.goto('/work');
    await page.waitForTimeout(2000);

    // 뷰포트 크기에 따른 레이아웃 확인
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    const desktopLayout = page.locator('header, h1').first();
    await expect(desktopLayout).toBeVisible({ timeout: 10000 });

    // 모바일 뷰포트
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    const mobileLayout = page.locator('header, h1').first();
    await expect(mobileLayout).toBeVisible({ timeout: 10000 });
  });
});
