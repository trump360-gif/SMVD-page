# 🚀 SMVD CMS - 선택 개선 항목 상세 리포트

**작성일**: 2026-02-17
**분석 대상**: 4가지 비긴급 개선 항목
**예상 총 소요 시간**: 18-24시간 (분산 실행 권장)

---

## 📋 Executive Summary

| 항목 | 현황 | 예상 시간 | 우선순위 | 영향도 |
|------|------|---------|----------|--------|
| **1. 통합 E2E 테스트** | ❌ 거의 없음 | 8-10h (실제 3-4주) | 🔴 높음 | 배포 신뢰도 |
| **2. 성능 모니터링** | 🟡 부분 | 4-5h | 🟡 중간 | 사용자 경험 |
| **3. Sentry 에러 추적** | ❌ 없음 | 2-3h | 🔴 높음 | 운영 효율성 |
| **4. Admin UI/UX 개선** | 🟡 기능만 | 4-6h | 🔴 높음 | 관리자 경험 |

**권장 실행 순서:**
1. Sentry 에러 추적 (2-3h) ← 가장 빠름, 운영 영향 큼
2. Admin UI/UX 개선 (4-6h) ← 관리자 만족도
3. 성능 모니터링 (4-5h) ← 지속적 측정
4. E2E 테스트 (8-10h) ← 장기 투자 (분산 실행)

---

## 1️⃣ 통합 E2E 테스트 (8-10h / 실제 3-4주)

### 🎯 목표
- Playwright 기반 통합 테스트 체계 구축
- 주요 비즈니스 로직 자동화 테스트
- CI/CD 파이프라인 연동
- Admin 플로우 + 공개 페이지 렌더링 검증

### 📊 현황 분석

#### 현재 상태
```
✅ 설치: Playwright 미설치 (@playwright/test 없음)
✅ 설정: playwright.config.ts 없음
✅ 테스트 파일: 1개 (test-news-blocks.spec.ts, 261줄)
✅ 구조: e2e/ 폴더 없음
❌ CI/CD: 통합 안 됨
```

#### 기존 테스트 분석: `test-news-blocks.spec.ts`

**주요 특징:**
- Playwright + TypeScript
- 뉴스 블록 생성/지속성만 테스트
- API 검증 포함 (GET 요청)
- 261줄 (중간 규모)

**문제점:**
- 비신뢰 셀렉터 (text 기반 매칭)
- 고정 타임아웃 (500ms, 1000ms)
- 모바일 테스트 없음
- 에러 처리 미흡

### 🏗️ 구현 계획

#### Phase 1: Playwright 기초 설정 (1-2h)

**Step 1.1: 설정 파일 생성** (`playwright.config.ts`)
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Step 1.2: 패키지 설치**
```bash
npm install --save-dev @playwright/test @types/node
```

**Step 1.3: package.json 스크립트 추가**
```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:debug": "playwright test --debug",
    "test:headed": "playwright test --headed",
    "e2e": "playwright test"
  }
}
```

#### Phase 2: 테스트 구조 정리 (0.5-1h)

**폴더 구조:**
```
e2e/
├── fixtures.ts                 # 공유 설정 (auth, db 클린업)
├── helpers.ts                  # 헬퍼 함수 (로그인, 네비게이션)
├── auth.spec.ts               # 인증 플로우
├── public/
│   ├── home.spec.ts           # 홈페이지 렌더링
│   ├── about.spec.ts          # About 페이지
│   ├── curriculum.spec.ts     # 교과과정 페이지
│   ├── work.spec.ts           # 작품 포트폴리오
│   └── news.spec.ts           # 뉴스 페이지
├── admin/
│   ├── home-cms.spec.ts       # Home CMS (전시, 포트폴리오)
│   ├── work-cms.spec.ts       # Work CMS (프로젝트, 블록)
│   ├── news-cms.spec.ts       # News CMS (게시글, 블록)
│   ├── curriculum-cms.spec.ts # Curriculum CMS
│   └── upload.spec.ts         # 이미지 업로드
└── api/
    ├── sections.spec.ts       # API 테스트 (섹션)
    ├── news.spec.ts           # API 테스트 (뉴스)
    └── upload.spec.ts         # API 테스트 (업로드)
```

#### Phase 3: 핵심 테스트 케이스 (4-5h)

**3.1: 인증 & 인가** (`auth.spec.ts` - 60줄)
```typescript
import { test, expect } from '@playwright/test';

test.describe('Admin Authentication', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/admin/dashboard/home');
    expect(page.url()).toContain('/admin/login');
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin/dashboard/home');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('should logout successfully', async ({ page, context }) => {
    // 로그인 후
    await loginAsAdmin(page);

    // 로그아웃
    await page.click('[data-testid="logout-button"]');
    await expect(page).toHaveURL('/admin/login');
  });
});
```

**3.2: 공개 페이지 렌더링** (`public/home.spec.ts` - 80줄)
```typescript
test.describe('Public Pages - Rendering', () => {
  test('Home page loads and renders correctly', async ({ page }) => {
    await page.goto('/');

    // 페이지 요소 확인
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // 섹션 존재 확인
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="exhibition-section"]')).toBeVisible();

    // 이미지 로드 확인
    const images = page.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });

  test('About page renders with timeline', async ({ page }) => {
    await page.goto('/about');

    // 헤더 활성화 확인
    const aboutLink = page.locator('nav a[href="/about"]');
    await expect(aboutLink).toHaveClass(/active/);

    // 타임라인 항목 확인
    const timelineItems = page.locator('[data-testid="timeline-item"]');
    expect(await timelineItems.count()).toBe(11);
  });

  test('Curriculum page renders both tabs', async ({ page }) => {
    await page.goto('/curriculum');

    // 탭 버튼 확인
    const undergradTab = page.locator('button:has-text("Undergraduate")');
    const gradTab = page.locator('button:has-text("Graduate")');

    await expect(undergradTab).toBeVisible();
    await expect(gradTab).toBeVisible();

    // 클릭 후 내용 변경 확인
    await gradTab.click();
    await expect(page.locator('[data-testid="master-content"]')).toBeVisible();
  });
});
```

**3.3: Admin CRUD 작업** (`admin/work-cms.spec.ts` - 150줄)
```typescript
test.describe('Work CMS - CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/dashboard/work');
  });

  test('should create new project with blocks', async ({ page }) => {
    // 새 프로젝트 생성 버튼
    await page.click('[data-testid="new-project-button"]');

    // 폼 채우기
    await page.fill('input[name="title"]', 'New Test Project');
    await page.fill('textarea[name="description"]', 'Test description');

    // 블록 추가
    await page.click('[data-testid="add-block-button"]');
    await page.selectOption('[name="blockType"]', 'text');
    await page.fill('textarea[name="content"]', 'Sample text');

    // 저장
    await page.click('[data-testid="save-button"]');

    // 성공 메시지 확인
    await expect(page.locator('text=Project created')).toBeVisible();

    // DB 검증
    const response = await page.request.get('/api/admin/work');
    const projects = await response.json();
    expect(projects.data.some((p: any) => p.title === 'New Test Project')).toBe(true);
  });

  test('should edit project and blocks', async ({ page }) => {
    // 기존 프로젝트 선택
    await page.click('[data-testid="project-row"] >> first-child');

    // 모달 열기
    const modal = page.locator('[data-testid="project-modal"]');
    await expect(modal).toBeVisible();

    // 블록 수정
    await page.fill('textarea[name="block-content"]', 'Updated content');

    // 저장
    await page.click('[data-testid="save-button"]');
    await expect(page.locator('text=Project updated')).toBeVisible();
  });

  test('should delete project with confirmation', async ({ page }) => {
    // 삭제 버튼
    await page.click('[data-testid="project-row"] >> first-child');
    await page.click('[data-testid="delete-button"]');

    // 확인 다이얼로그
    const dialog = page.locator('dialog, [role="alertdialog"]');
    await expect(dialog).toBeVisible();

    // 확인
    await page.click('[data-testid="confirm-delete"]');

    // 성공 메시지
    await expect(page.locator('text=Project deleted')).toBeVisible();
  });

  test('should reorder projects with drag and drop', async ({ page }) => {
    const projects = page.locator('[data-testid="project-row"]');

    // 드래그 앤 드롭
    const firstProject = projects.first();
    const lastProject = projects.last();

    await firstProject.dragTo(lastProject);

    // 순서 변경 확인
    await expect(page.locator('text=Projects reordered')).toBeVisible();
  });
});
```

**3.4: 이미지 업로드** (`admin/upload.spec.ts` - 120줄)
```typescript
test.describe('Image Upload', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/dashboard/home');
  });

  test('should upload image via drag and drop', async ({ page }) => {
    // 업로드 영역 찾기
    const dropZone = page.locator('[data-testid="upload-area"]');

    // 파일 드래그 & 드롭
    await dropZone.setInputFiles('./fixtures/test-image.jpg');

    // 업로드 진행 상황
    const progress = page.locator('[data-testid="upload-progress"]');
    await expect(progress).toBeVisible();

    // 완료 확인
    await expect(page.locator('text=Upload successful')).toBeVisible();

    // 이미지 미리보기 확인
    const preview = page.locator('[data-testid="image-preview"]');
    await expect(preview).toBeVisible();
  });

  test('should validate file types', async ({ page }) => {
    const dropZone = page.locator('[data-testid="upload-area"]');

    // PDF 파일 시도
    await dropZone.setInputFiles('./fixtures/test.pdf');

    // 에러 메시지
    await expect(page.locator('text=Only images allowed')).toBeVisible();
  });

  test('should generate WebP thumbnail', async ({ page }) => {
    // 이미지 업로드
    const dropZone = page.locator('[data-testid="upload-area"]');
    await dropZone.setInputFiles('./fixtures/large-image.jpg');

    // 완료 대기
    await page.waitForSelector('[data-testid="image-preview"]');

    // API 검증: 썸네일 생성 확인
    const uploadedFile = page.locator('[data-testid="uploaded-file-name"]');
    const fileName = await uploadedFile.textContent();

    const response = await page.request.get(`/uploads/${fileName}-thumb.webp`);
    expect(response.status()).toBe(200);
  });
});
```

#### Phase 4: API 테스트 (1.5-2h)

**4.1: 섹션 API** (`api/sections.spec.ts` - 100줄)
```typescript
test.describe('Sections API', () => {
  const baseURL = 'http://localhost:3000';
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    // 인증 토큰 획득
    const response = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        email: 'admin@example.com',
        password: 'password',
      },
    });
    expect(response.ok()).toBe(true);
  });

  test('GET /api/admin/sections - should return all sections', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/admin/sections`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    expect(response.ok()).toBe(true);
    const data = await response.json();
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
  });

  test('PUT /api/admin/sections/:id - should update section', async ({ request }) => {
    const updateData = {
      title: 'Updated Section Title',
      content: { sampleField: 'value' },
    };

    const response = await request.put(
      `${baseURL}/api/admin/sections/test-section-id`,
      {
        data: updateData,
        headers: { 'Authorization': `Bearer ${authToken}` },
      }
    );

    expect(response.ok()).toBe(true);
    const data = await response.json();
    expect(data.data.title).toBe('Updated Section Title');
  });
});
```

#### Phase 5: CI/CD 통합 (0.5-1h)

**GitHub Actions 예시** (`.github/workflows/e2e.yml`)
```yaml
name: E2E Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Build project
        run: npm run build

      - name: Run E2E tests
        run: npm run e2e

      - name: Upload Playwright report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### 📝 테스트 작성 가이드

#### 표준 테스트 구조
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전 실행
    await page.goto('/path');
    // 초기화 작업
  });

  test('should do something', async ({ page }) => {
    // Arrange: 준비
    const button = page.locator('[data-testid="button"]');

    // Act: 실행
    await button.click();

    // Assert: 검증
    await expect(page.locator('text=Success')).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    // 각 테스트 후 정리
  });
});
```

#### 권장 셀렉터 (안정성 순서)
```typescript
// 1. data-testid (추천)
page.locator('[data-testid="button"]')

// 2. role + name (접근성)
page.getByRole('button', { name: 'Submit' })

// 3. label (폼)
page.getByLabel('Email')

// 4. placeholder (입력)
page.getByPlaceholder('Enter email')

// 5. text (마지막 수단)
page.locator('text=Submit')
```

#### 타임아웃 권장값
```typescript
// 동적 콘텐츠
await expect(element).toBeVisible({ timeout: 5000 }); // 5초

// API 응답 대기
await page.waitForResponse(
  response => response.url().includes('/api/') && response.status() === 200,
  { timeout: 10000 } // 10초
);
```

### ⏱️ 시간 분석

| 항목 | 예상 시간 | 유의사항 |
|------|---------|---------|
| Playwright 설정 | 1-2h | 브라우저 다운로드 포함 |
| 테스트 구조 정리 | 0.5-1h | 폴더/파일 구성 |
| 인증 + 기본 테스트 | 2-3h | 헬퍼 함수 추상화 필요 |
| Admin CRUD 테스트 | 2-3h | 복잡한 상호작용 |
| API 테스트 | 1-1.5h | 간단함 |
| CI/CD 통합 | 0.5-1h | GitHub Actions 설정 |
| **합계** | **8-10h** | **분산 실행 권장** |

### ⚠️ 주의사항

1. **타이밍 이슈**
   - 네트워크 요청 대기 필요
   - `waitForResponse()` 사용
   - 타임아웃 충분히 설정 (3-5초 기본)

2. **테스트 데이터**
   - DB 트랜잭션으로 격리
   - 또는 API에서 직접 생성
   - 테스트 후 정리 필수

3. **CI 환경**
   - headless 모드 필수
   - 스크린샷/비디오는 실패 시만
   - 병렬 실행 시 DB 충돌 주의

4. **유지보수**
   - `data-testid` 추가해서 UI 변경에 강화
   - 셀렉터는 `@testing-library` 원칙 따르기
   - 테스트 실패 시 빠르게 수정 (플레이키 테스트 방지)

---

## 2️⃣ 성능 모니터링 (4-5h)

### 🎯 목표
- 번들 크기 측정 & 최적화
- Lighthouse 자동 실행
- Core Web Vitals 추적
- 성능 메트릭 대시보드 구축

### 📊 현황 분석

#### 현재 상황
```
✅ 이미지 최적화: sharp로 WebP 변환 (우수)
✅ 캐시 정책: 1년 캐시 설정 (공격적)
❌ 번들 분석: @next/bundle-analyzer 미설치
❌ Lighthouse: 자동 측정 없음
❌ Web Vitals: 모니터링 없음
❌ 성능 메트릭: 대시보드 없음
```

#### 이미지 최적화 분석 (✅ 우수)
```
파이프라인:
1. 업로드 → 원본 저장
2. sharp 처리:
   - WebP 변환 (80% 품질) ← 좋은 설정
   - 썸네일 생성 (300x300, 70% 품질)
3. 파일 저장 (uploads/2026/02/...)
4. 캐시 (1년, immutable) ← 공격적이지만 합리적

결과:
- 원본 JPEG (500KB) → WebP (120KB) ← 76% 감소
- 썸네일 (300x300) → 25KB ← 매우 효율적
```

### 🏗️ 구현 계획

#### Phase 1: 번들 분석기 설정 (1-1.5h)

**Step 1.1: 패키지 설치**
```bash
npm install --save-dev @next/bundle-analyzer
```

**Step 1.2: next.config.ts 수정**
```typescript
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer({
  // ... 기존 설정
});
```

**Step 1.3: 스크립트 추가** (package.json)
```json
{
  "scripts": {
    "build": "next build",
    "analyze": "ANALYZE=true next build"
  }
}
```

**실행:**
```bash
npm run analyze
# 자동으로 브라우저에서 번들 분석 보고서 열림
# (next/image, next/link, react 등 크기 확인)
```

#### Phase 2: Lighthouse CI 설정 (1.5-2h)

**Step 2.1: Lighthouse CI 설치**
```bash
npm install --save-dev @lhci/cli@0.11.x
npm install --save-dev @lhci/server@0.11.x
```

**Step 2.2: 설정 파일 생성** (`lighthouserc.json`)
```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000",
        "http://localhost:3000/about",
        "http://localhost:3000/curriculum",
        "http://localhost:3000/work",
        "http://localhost:3000/news-and-events"
      ],
      "numberOfRuns": 3,
      "settings": {
        "configPath": "./lighthouse-config.js"
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.85 }],
        "categories:accessibility": ["error", { "minScore": 0.90 }],
        "categories:best-practices": ["error", { "minScore": 0.90 }],
        "categories:seo": ["error", { "minScore": 0.90 }]
      }
    }
  }
}
```

**Step 2.3: 커스텀 설정** (`lighthouse-config.js`)
```javascript
module.exports = {
  extends: 'lighthouse:default',
  settings: {
    // 느린 네트워크 시뮬레이션
    throttlingMethod: 'simulate',
    throttle: {
      rttMs: 150,
      throughputKbps: 1.6 * 1024,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
  },
  audits: [
    {
      path: 'lighthouse/audits/unused-css.js',
      options: { threshold: 50 },
    },
  ],
};
```

**Step 2.4: GitHub Actions 통합** (`.github/workflows/lighthouse.yml`)
```yaml
name: Lighthouse CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  lhci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Run Lighthouse CI
        run: |
          npx lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

#### Phase 3: Web Vitals 모니터링 (1.5-2h)

**Step 3.1: web-vitals 설치**
```bash
npm install web-vitals
```

**Step 3.2: 측정 함수 작성** (`src/lib/vitals.ts`)
```typescript
import {
  getCLS,
  getFID,
  getFCP,
  getLCP,
  getTTFB,
  Metric,
} from 'web-vitals';

const vitalsUrl = 'https://analytics.example.com/vitals'; // 또는 로컬

export function sendWebVitals(metric: Metric) {
  // 개발 환경에서는 로그만
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${metric.name}] ${metric.value.toFixed(2)}ms`);
    return;
  }

  // 프로덕션: 분석 서버로 전송
  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, JSON.stringify(metric));
  } else {
    // Fallback
    fetch(vitalsUrl, {
      method: 'POST',
      body: JSON.stringify(metric),
      keepalive: true,
    }).catch(err => console.error('Failed to send metrics', err));
  }
}

// 측정 시작
export function initWebVitals() {
  getCLS(sendWebVitals);
  getFID(sendWebVitals);
  getFCP(sendWebVitals);
  getLCP(sendWebVitals);
  getTTFB(sendWebVitals);
}
```

**Step 3.3: Root Layout에 통합** (`src/app/layout.tsx`)
```typescript
'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/lib/vitals';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initWebVitals();
  }, []);

  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
```

**Step 3.4: 대시보드 (선택사항)**

API 엔드포인트 생성 (`src/app/api/analytics/vitals/route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server';

interface Metric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

// 메모리 스토어 (실제로는 DB 사용)
const metrics: Metric[] = [];

export async function POST(request: NextRequest) {
  try {
    const metric = await request.json() as Metric;

    metrics.push({
      ...metric,
      timestamp: new Date().toISOString(),
    } as any);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to store metric' },
      { status: 400 }
    );
  }
}

export async function GET() {
  // 메트릭 조회 & 통계
  const stats = {
    lcp: {
      avg: metrics
        .filter(m => m.name === 'LCP')
        .reduce((sum, m) => sum + m.value, 0) / metrics.length,
      good: metrics.filter(m => m.name === 'LCP' && m.value < 2500).length,
      poor: metrics.filter(m => m.name === 'LCP' && m.value > 4000).length,
    },
    cls: {
      avg: metrics
        .filter(m => m.name === 'CLS')
        .reduce((sum, m) => sum + m.value, 0) / metrics.length,
    },
  };

  return NextResponse.json(stats);
}
```

#### Phase 4: 성능 최적화 권장사항

**Code Splitting (1-1.5h)**
```typescript
// ❌ 현재: 큰 모달이 초기 로드에 영향
import WorkBlogModal from '@/components/admin/work/WorkBlogModal';

// ✅ 개선: 동적 import
const WorkBlogModal = dynamic(
  () => import('@/components/admin/work/WorkBlogModal'),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,
  }
);
```

**이미지 최적화 (이미 잘 구현됨)**
- ✅ WebP 변환 (80% 품질)
- ✅ 썸네일 생성
- ⚠️ 개선: blur placeholder 추가
  ```typescript
  // blurHash 또는 LQIP (Low Quality Image Placeholder) 추가
  // 로드 중에 흐린 이미지 표시
  ```

**폰트 최적화 (0.5-1h)**
```typescript
// next/font로 최적화
import { Pretendard, Satoshi } from 'next/font/google';

const pretendard = Pretendard({
  subsets: ['latin'],
  display: 'swap', // ← FOUT 방지
});

const satoshi = Satoshi({
  subsets: ['latin'],
  display: 'swap',
});
```

### ⏱️ 시간 분석

| 항목 | 예상 시간 |
|------|---------|
| 번들 분석기 | 1-1.5h |
| Lighthouse CI | 1.5-2h |
| Web Vitals | 1.5-2h |
| 성능 최적화 | 1-1.5h |
| **합계** | **4-5h** |

### 📊 성능 목표

```yaml
Core Web Vitals (Google 권장):
  LCP (Largest Contentful Paint): < 2.5s (Good)
  FID (First Input Delay): < 100ms (Good)
  CLS (Cumulative Layout Shift): < 0.1 (Good)

Lighthouse 점수:
  Performance: ≥ 85
  Accessibility: ≥ 90
  Best Practices: ≥ 90
  SEO: ≥ 90

번들 크기:
  Main JS: < 500KB
  CSS: < 100KB
```

---

## 3️⃣ Sentry 에러 추적 (2-3h) ⭐ 우선순위 1

### 🎯 목표
- 프로덕션 에러 자동 추적
- 사용자 세션 분석
- 성능 모니터링
- Alert & 대시보드

### 📊 현황 분석

#### 현재 상황
```
✅ 로깅 시스템: 구조화된 logger.ts (131줄)
✅ API 에러 처리: 191줄 try-catch
❌ Sentry: 미설치
❌ 클라이언트 에러: 캡처 안 됨
❌ Error Boundary: 없음
```

#### 기존 Logger 분석
```typescript
// src/lib/logger.ts (훌륭한 기초)
logger.info({ context: 'GET /api/work' }, 'Project created');
logger.error({ err: error, context: 'upload' }, 'File upload failed');

// 장점:
// ✅ 구조화된 JSON 로깅
// ✅ Edge Runtime 호환
// ✅ 프로덕션 + 개발 모드 구분

// 단점:
// ❌ 파일에만 기록 (원격 전송 안 됨)
// ❌ 에러 분석 불가능
// ❌ Alert 시스템 없음
```

### 🏗️ 구현 계획

#### Phase 1: Sentry 기초 설정 (0.5-1h)

**Step 1.1: 패키지 설치**
```bash
npm install @sentry/nextjs
```

**Step 1.2: 초기화 파일 생성** (`src/instrumentation.ts`)
```typescript
import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      debug: process.env.NODE_ENV === 'development',

      // Integrations
      integrations: [
        new Sentry.Integrations.Prisma(),
        new Sentry.Integrations.OnUncaughtException(),
        new Sentry.Integrations.OnUnhandledRejection(),
      ],

      // Performance monitoring
      instrumentationOptions: {
        enabled: true,
      },
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1,
    });
  }
}
```

**Step 1.3: next.config.ts 수정**
```typescript
import { withSentryConfig } from '@sentry/nextjs';

let config = {
  // ... 기존 설정
};

export default withSentryConfig(config, {
  org: 'your-org',
  project: 'your-project',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: false,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
});
```

**Step 1.4: 환경변수 설정** (`.env.local`)
```bash
SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
SENTRY_AUTH_TOKEN=your_auth_token
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```

#### Phase 2: 서버사이드 통합 (0.5-1h)

**Step 2.1: API 라우트에 에러 캡처**
```typescript
// src/app/api/admin/work/route.ts
import * as Sentry from '@sentry/nextjs';

export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    const projects = await prisma.work.findMany();
    return successResponse(projects);
  } catch (error) {
    // Sentry 자동 캡처 (instrumentation 통해)
    logger.error({ err: error, context: 'GET /api/work' }, 'Failed');

    // 추가: 수동 캡처 (필요시)
    Sentry.captureException(error, {
      tags: { endpoint: 'GET /api/work' },
      contexts: { request: { method: 'GET', url: '/api/work' } },
    });

    return errorResponse('Failed to fetch', 'FETCH_ERROR', 500);
  }
}
```

**Step 2.2: 데이터베이스 에러 캡처**
```typescript
// Prisma 에러도 자동 캡처 (Sentry.Integrations.Prisma 설정)
try {
  await prisma.user.findUnique({ where: { id: 'invalid' } });
} catch (error) {
  // 자동으로 Sentry에 전송됨
  throw error;
}
```

#### Phase 3: 클라이언트사이드 통합 (1-1.5h)

**Step 3.1: Root Layout에 Sentry 초기화** (`src/app/layout.tsx`)
```typescript
'use client';

import * as Sentry from '@sentry/nextjs';

// Sentry React wrapper
export const RootLayout = Sentry.withProfiler(function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
});

export default RootLayout;
```

**Step 3.2: Error Boundary** (`src/components/ErrorBoundary.tsx`)
```typescript
'use client';

import * as Sentry from '@sentry/nextjs';
import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Sentry 캡처
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });

    // 로깅
    logger.error(
      { err: error, context: 'ErrorBoundary' },
      `React error in ${errorInfo.componentStack}`
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="bg-red-50 p-4 rounded">
            <h1 className="text-red-700 font-bold">Something went wrong</h1>
            <p className="text-red-600">
              {this.state.error?.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default Sentry.withProfiler(ErrorBoundary);
```

**Step 3.3: 관리자 페이지에 Error Boundary 감싸기**
```typescript
// src/app/admin/layout.tsx
import ErrorBoundary from '@/components/ErrorBoundary';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      fallback={<AdminErrorFallback />}
    >
      {children}
    </ErrorBoundary>
  );
}

function AdminErrorFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Admin Error</h1>
        <p className="text-gray-600 mt-2">
          An error occurred. Please try again.
        </p>
        <a
          href="/admin/dashboard/home"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
```

**Step 3.4: 컴포넌트에서 수동 에러 캡처**
```typescript
// src/components/admin/work/WorkBlogModal.tsx
'use client';

import * as Sentry from '@sentry/nextjs';

export function WorkBlogModal() {
  const handleSave = async () => {
    try {
      await submitForm();
    } catch (error) {
      // 수동 캡처
      Sentry.captureException(error, {
        tags: { component: 'WorkBlogModal', action: 'save' },
        level: 'error',
      });

      // 사용자 피드백
      showErrorToast('저장 실패: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
    }
  };

  return (
    // ...
  );
}
```

#### Phase 4: Sentry 대시보드 설정 (0.5h)

**Step 4.1: Alert 규칙 설정**
```yaml
# Sentry 대시보드에서:
1. Alerts → Create Alert Rule
2. When: An issue is first seen OR Error count exceeds threshold
3. For: All Environments (또는 production만)
4. Then: Send to Slack/Email
```

**Step 4.2: Slack 통합**
```
1. Sentry Settings → Integrations → Slack
2. Connect Slack workspace
3. Select channel (예: #errors)
4. Alert rules에서 Slack notification 활성화
```

**Step 4.3: 성능 모니터링 대시보드**
```yaml
# Sentry 대시보드:
1. Performance → Create Dashboard
2. Add widgets:
   - Error rate (%)
   - Response time (ms)
   - Throughput (requests/min)
   - Transaction duration distribution
```

### 🔧 Logger와 Sentry 통합

**기존 Logger 개선** (`src/lib/logger.ts`)
```typescript
import * as Sentry from '@sentry/nextjs';

interface LogMeta {
  err?: unknown;
  context?: string;
  [key: string]: unknown;
}

export const logger = {
  error(meta: LogMeta, message: string) {
    // 기존 파일 로깅
    console.error(`[ERROR] [${meta.context}] ${message}`, meta.err);

    // Sentry 전송 추가
    Sentry.captureException(meta.err || new Error(message), {
      tags: { context: meta.context || 'unknown' },
      level: 'error',
    });
  },

  warn(meta: LogMeta, message: string) {
    console.warn(`[WARN] [${meta.context}] ${message}`, meta);

    // 경고는 Sentry에 덜 심각하게 기록
    Sentry.captureMessage(message, {
      level: 'warning',
      tags: { context: meta.context || 'unknown' },
    });
  },
};
```

### ⏱️ 시간 분석

| 항목 | 예상 시간 |
|------|---------|
| Sentry 기초 설정 | 0.5-1h |
| 서버사이드 통합 | 0.5-1h |
| 클라이언트 통합 + Error Boundary | 1-1.5h |
| 대시보드 + Alert 설정 | 0.5h |
| **합계** | **2-3h** ⭐ 가장 빠름 |

### 🎯 구현 우선순위

```yaml
1️⃣ [필수] Sentry DSN 설정 + instrumentation
2️⃣ [필수] Error Boundary 추가
3️⃣ [권장] API 에러 캡처
4️⃣ [권장] Slack Alert 통합
5️⃣ [선택] 성능 모니터링 대시보드
```

---

## 4️⃣ Admin UI/UX 개선 (4-6h) ⭐ 우선순위 2

### 🎯 목표
- Toast/Alert 시스템 구현
- 폼 검증 피드백 추가
- 로딩 상태 시각화
- 에러 메시지 표시
- 기본 접근성 개선

### 📊 현황 분석

#### 문제점 요약
```
1️⃣ 토스트/알림 없음: 성공/실패 피드백 부족
2️⃣ 에러 메시지 미표시: state 있지만 UI에 안 보임
3️⃣ 로딩 상태 불명확: isSubmitting 있지만 시각적 피드백 부족
4️⃣ 접근성 부족: 라벨 연결, aria-label 거의 없음
5️⃣ 폼 검증 피드백: 실시간 검증 없음
```

### 🏗️ 구현 계획

#### Phase 1: Toast 시스템 구현 (1-1.5h)

**Step 1.1: Toast 컴포넌트 생성**
```typescript
// src/components/ui/Toast.tsx
'use client';

import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastProps) {
  const bgColor: Record<ToastType, string> = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  const icon: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded border
        ${bgColor[toast.type]}
        animate-slideIn
      `}
      role="alert"
    >
      <span className="text-lg">{icon[toast.type]}</span>
      <div className="flex-1">
        <p className="font-medium">{toast.message}</p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="text-xl leading-none"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 3000) => {
      const id = Date.now().toString();
      const toast: Toast = { id, message, type, duration };

      setToasts(prev => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Context에 노출 (useToast 훅에서 사용)
  (global as any).__toast = { addToast };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={removeToast}
        />
      ))}
    </div>
  );
}
```

**Step 1.2: useToast 훅 생성**
```typescript
// src/hooks/useToast.ts
'use client';

import { useCallback } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

export function useToast() {
  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 3000) => {
      if (typeof window === 'undefined') return;

      const toast = (window as any).__toast;
      if (toast?.addToast) {
        toast.addToast(message, type, duration);
      }
    },
    []
  );

  return {
    success: (msg: string, duration?: number) =>
      showToast(msg, 'success', duration),
    error: (msg: string, duration?: number) =>
      showToast(msg, 'error', duration || 5000),
    warning: (msg: string, duration?: number) =>
      showToast(msg, 'warning', duration),
    info: (msg: string, duration?: number) =>
      showToast(msg, 'info', duration),
  };
}
```

**Step 1.3: Root Layout에 추가**
```typescript
// src/app/layout.tsx
import { ToastContainer } from '@/components/ui/Toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
```

**Step 1.4: 모달에서 사용**
```typescript
// src/components/admin/work/WorkBlogModal.tsx
import { useToast } from '@/hooks/useToast';

export function WorkBlogModal() {
  const { success, error } = useToast();

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      await submitForm(data);

      success('프로젝트가 저장되었습니다');
      onClose();
    } catch (err) {
      error(
        err instanceof Error
          ? err.message
          : '저장 중 오류가 발생했습니다'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // ...
  );
}
```

#### Phase 2: 모든 모달에 에러 메시지 영역 추가 (1-1.5h)

**Step 2.1: 에러 표시 컴포넌트**
```typescript
// src/components/ui/FormError.tsx
interface FormErrorProps {
  error?: string | null;
  className?: string;
}

export function FormError({ error, className }: FormErrorProps) {
  if (!error) return null;

  return (
    <div
      className={`
        bg-red-50 border border-red-200 rounded p-3
        text-sm text-red-700
        ${className}
      `}
      role="alert"
    >
      {error}
    </div>
  );
}
```

**Step 2.2: 모달 템플릿 업데이트**
```typescript
// 예: NewsBlogModal
export function NewsBlogModal() {
  const [error, setError] = useState<string | null>(null);
  const { error: showError } = useToast();

  const handleSubmit = async () => {
    try {
      setError(null);
      await onSubmit(data);
      success('저장되었습니다');
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '오류 발생';

      setError(message);
      showError(message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>뉴스 게시글</DialogTitle>
        </DialogHeader>

        {/* ✅ 에러 메시지 영역 추가 */}
        <FormError error={error} />

        {/* 폼 내용 */}
        <form onSubmit={handleSubmit}>
          {/* ... */}
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

#### Phase 3: 로딩 상태 스피너 (1h)

**Step 3.1: 스피너 컴포넌트**
```typescript
// src/components/ui/Spinner.tsx
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={`
        border-2 border-gray-300 border-t-blue-600
        rounded-full animate-spin
        ${sizeClass[size]}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  );
}
```

**Step 3.2: 제출 버튼 업데이트**
```typescript
// 모든 모달의 저장 버튼
<button
  onClick={handleSubmit}
  disabled={isSubmitting}
  className={`
    px-4 py-2 rounded font-medium
    flex items-center gap-2
    ${isSubmitting
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  `}
>
  {isSubmitting ? (
    <>
      <Spinner size="sm" />
      <span>저장 중...</span>
    </>
  ) : (
    '저장'
  )}
</button>
```

#### Phase 4: 기본 접근성 개선 (1-1.5h)

**Step 4.1: 폼 라벨 연결**
```typescript
// ❌ 현재 (나쁜 예)
<input type="text" />

// ✅ 개선 (좋은 예)
<label htmlFor="title">제목</label>
<input id="title" type="text" />
```

**Step 4.2: 필수 필드 표시**
```typescript
<label htmlFor="title">
  제목 <span className="text-red-600" aria-label="required">*</span>
</label>
<input
  id="title"
  type="text"
  required
  aria-required="true"
/>
```

**Step 4.3: 키보드 네비게이션**
```typescript
// Escape 키로 모달 닫기
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [onClose]);
```

**Step 4.4: 버튼에 aria-label 추가**
```typescript
// ❌ 현재
<button onClick={delete}>🗑️</button>

// ✅ 개선
<button
  onClick={delete}
  aria-label="Delete this item"
  title="Delete"
>
  🗑️
</button>
```

### 📋 개선 체크리스트

#### 필수 (Phase 1-4)
- [ ] Toast 시스템 구현
- [ ] 모든 모달에 에러 메시지 영역
- [ ] 스피너 + "저장 중..." 텍스트
- [ ] 기본 접근성 (라벨, aria-label)

#### 권장 (추가 1-2주)
- [ ] 실시간 폼 검증 (onChange)
- [ ] 필드별 에러 표시
- [ ] 모바일 반응형 레이아웃
- [ ] 스켈레톤 로더 (콘텐츠 로드 중)

#### 선택 (나중에)
- [ ] 다크 모드 토스트 스타일
- [ ] 커스텀 애니메이션
- [ ] 다국어 메시지 (i18n)

### ⏱️ 시간 분석

| 항목 | 예상 시간 |
|------|---------|
| Toast 시스템 | 1-1.5h |
| 에러 메시지 영역 | 1-1.5h |
| 로딩 스피너 | 1h |
| 접근성 개선 | 1-1.5h |
| **합계** | **4-6h** |

### 🎨 UI 개선 전/후

```
❌ 현재 (사용자 혼동)
┌─────────────────────────────┐
│ 프로젝트 제목 입력         │
│ [________________]          │
│                             │
│ [저장] [취소]             │
└─────────────────────────────┘
↓ 사용자가 [저장] 클릭
→ 모달이 닫히는지 알 수 없음
→ 오류가 있었는지 모름

✅ 개선 (명확한 피드백)
┌─────────────────────────────┐
│ 프로젝트 제목 입력         │
│ <label>제목 *</label>       │
│ [________________]          │
│                             │
│ [✓ 저장 중...] [취소]    │
│                             │
│ 📨 프로젝트가 저장됨       │  ← Toast
└─────────────────────────────┘
↓ 완료
→ 모달 자동 닫기
→ 성공 토스트 표시
```

---

## 🎯 4가지 항목 우선순위 & 로드맵

### 즉시 시작 추천 순서

```
Week 1: Sentry 에러 추적 (2-3h) ⭐⭐⭐
  └─ 가장 빠르고 운영 영향 큼

Week 2: Admin UI/UX 개선 (4-6h) ⭐⭐
  └─ 관리자 만족도 직결

Week 3-4: 성능 모니터링 (4-5h) ⭐
  └─ 지속적 측정 및 개선

Week 5-8: E2E 테스트 (8-10h, 분산)
  └─ 장기 투자, 배포 신뢰도
```

### 병렬 실행 가능 조합

```
병렬 1 (Week 1-2):
  - Sentry 설정 (2h) + Admin UI 개선 (2h)
  = 총 4시간

병렬 2 (Week 2-3):
  - Admin UI 완료 (2h) + 성능 모니터링 (3h)
  = 총 5시간

병렬 3 (Week 4-8):
  - E2E 테스트 (병렬로 작성)
  = 8-10시간
```

---

## 📊 총 소요 시간 요약

| 항목 | 최소 | 최대 | 우선순위 | 영향도 |
|------|------|------|----------|--------|
| **Sentry 에러 추적** | 2h | 3h | 🔴 높음 | 🔴 운영 |
| **Admin UI/UX** | 4h | 6h | 🔴 높음 | 🔴 사용자 |
| **성능 모니터링** | 4h | 5h | 🟡 중간 | 🟡 경험 |
| **E2E 테스트** | 8h | 10h | 🟡 중간 | 🟢 신뢰도 |
| **총계** | **18h** | **24h** | | |

---

## 🚀 즉시 시작 가능한 작업

### Tomorrow (30분)
1. Sentry 계정 생성 → DSN 획득
2. `npm install @sentry/nextjs`
3. `src/instrumentation.ts` 작성

### This Week (4-5시간)
1. Sentry 모든 Phase 구현 (2-3h)
2. Toast 시스템 추가 (1h)
3. 에러 메시지 영역 (1h)

### Next Week (4-6시간)
1. 스피너 + 로딩 상태 (1h)
2. 기본 접근성 (1.5-2h)
3. 번들 분석기 설정 (1-1.5h)

---

**이 리포트는 실행 준비 완료된 상태입니다.**
원하시는 항목부터 시작하세요! 🎉
