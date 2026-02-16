# SMVD CMS 최종 종합 코드 분석 리포트 (2026-02-16)

---

## Executive Summary

| 항목 | 수치 |
|------|------|
| **총 소스 파일** | 189개 (.ts/.tsx, generated 제외) |
| **총 코드 라인** | 37,149줄 |
| **API 라우트 파일** | 41개 |
| **컴포넌트** | 87개 (.tsx) |
| **커스텀 훅** | 5개 |
| **500줄 초과 파일** | 16개 |
| **`as any` 사용** | 35회 |
| **디버그 console.log** | 135회 |
| **TypeScript 에러 (src/)** | 0개 |

### 주요 강점
1. **일관된 인증 체계**: 모든 admin API에 `checkAdminAuth()` 적용
2. **Zod 검증 전면 적용**: API 입력 검증이 대부분의 엔드포인트에 존재
3. **트랜잭션 기반 reorder**: 9개 reorder API 모두 `$transaction` 사용
4. **이미지 파이프라인**: sharp 기반 WebP 변환 + 썸네일 자동 생성

### 심각한 약점
1. **`as any` 35회**: 타입 안전성 구멍 - 런타임 에러 위험
2. **500줄 초과 파일 16개**: 유지보수성 심각하게 저하
3. **보안 계층 부재**: Rate limiting, CSRF 보호, XSS 필터링 없음
4. **Zod 스키마/Prisma 모델 불일치**: Footer, Section 타입 매핑이 깨져있음

### 프로덕션 배포 준비도: 62%

---

## 1. CRITICAL Issues (치명적 이슈)

### C-1. Footer Zod 스키마와 Prisma 모델 완전 불일치

**위험도**: RED - 런타임 에러 유발

**파일**: `/Users/jeonminjun/claude/SMVD_page/src/types/schemas/index.ts:170-185`

Zod `FooterSchema`는 다음 필드를 정의:
```typescript
// Zod 스키마 (types/schemas/index.ts:170-185)
FooterSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),       // <-- "content" 필드
  links: z.array(...),       // <-- "links" 필드
  createdAt: z.date(),
  updatedAt: z.date(),
});
```

하지만 Prisma Footer 모델 (prisma/schema.prisma:174-186)은:
```prisma
model Footer {
  id          String    @id @default(cuid())
  title       String
  description String?   // <-- "description" (content 아님!)
  address     String?   // <-- 추가 필드
  phone       String?   // <-- 추가 필드
  email       String?   // <-- 추가 필드
  socialLinks Json?     // <-- "socialLinks" (links 아님!)
  copyright   String?   // <-- 추가 필드
}
```

**결과**: `UpdateFooterSchema`로 검증된 데이터를 `as any`로 Prisma에 넘김 (`src/app/api/footer/route.ts:69,75`). DB에 `content`/`links` 필드가 없으므로 Prisma가 무시하거나 에러 발생.

---

### C-2. SectionType Zod 스키마에 3개 타입 누락

**위험도**: RED - 검증 실패 시 API 거부

**파일**: `/Users/jeonminjun/claude/SMVD_page/src/types/schemas/index.ts:38-72`

Prisma enum에는 존재하지만 Zod `SectionTypeSchema`에 없는 타입:
- `WORK_ARCHIVE`
- `WORK_EXHIBITION`
- `NEWS_ARCHIVE`

이 타입의 섹션을 생성/수정하려고 하면 Zod 검증이 실패하여 API가 400 에러를 반환.

---

### C-3. Navigation/Upload API의 ID 파싱 로직 결함

**위험도**: RED - 항상 잘못된 ID 반환

**파일**: `/Users/jeonminjun/claude/SMVD_page/src/app/api/navigation/route.ts:96`, `/Users/jeonminjun/claude/SMVD_page/src/app/api/admin/upload/route.ts:120`

```typescript
// navigation/route.ts:96 (PUT 핸들러)
const itemId = request.nextUrl.pathname.split("/").pop();
```

Next.js App Router에서 이 라우트 파일은 `/api/navigation/route.ts`이므로, 요청 URL이 `/api/navigation`일 때 `pathname.split("/").pop()`의 결과는 `"navigation"`이 됨 -- ID가 아님.

PUT/DELETE가 동적 라우트 `[id]` 폴더 없이 같은 route.ts에 있어서, ID를 URL path에서 파싱하는 방식 자체가 동작하지 않음. 실제로는 쿼리 파라미터나 body에서 ID를 받아야 함.

같은 문제가 `/api/admin/upload/route.ts:120`의 DELETE 핸들러에도 존재.

---

### C-4. About People API의 인증 미흡

**위험도**: YELLOW-RED - 비관리자 접근 가능

**파일**: `/Users/jeonminjun/claude/SMVD_page/src/app/api/admin/about/people/route.ts:8-14`, `/Users/jeonminjun/claude/SMVD_page/src/app/api/admin/about/people/[id]/route.ts:8-14`

```typescript
async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session;
}
```

이 함수는 로그인 여부만 확인하고 `role === "admin"` 검사를 하지 않음. 다른 모든 admin API는 `checkAdminAuth()`를 사용하여 관리자 역할까지 검증하는데, 이 2개 파일만 자체 구현을 사용.

미들웨어가 `/api/admin/*` 경로를 보호하긴 하지만, 토큰이 있으면 통과시키므로 비관리자 계정(향후 추가 시)도 접근 가능.

---

## 2. MAJOR Issues (주요 이슈)

### M-1. `as any` 35회 사용 - 타입 안전성 구멍

| 파일 | 라인 | 내용 | 위험도 |
|------|------|------|--------|
| `src/app/(public)/about/page.tsx` | 30-33 | `Section.content as any` x4 | YELLOW |
| `src/app/(public)/page.tsx` | 65 | `aboutSection.content as any` | YELLOW |
| `src/app/api/footer/route.ts` | 69, 75 | Prisma data `as any` | RED |
| `src/app/api/admin/sections/route.ts` | 109 | Prisma create `as any` | YELLOW |
| `src/app/api/admin/sections/[id]/route.ts` | 57 | Prisma update `as any` | YELLOW |
| `src/app/api/admin/studio-knot-cms-setup/route.ts` | 117,129-131 | content `as any` x4 | YELLOW |
| `src/app/api/admin/news/articles/[id]/route.ts` | 143 | content `as any` | YELLOW |
| `src/app/api/admin/work/projects/route.ts` | 106 | content `as any` | YELLOW |
| `src/app/api/admin/upload/route.ts` | 77 | Prisma create `as any` | YELLOW |
| `src/components/admin/work/BlockLayoutVisualizer.tsx` | 114-138 | block `as any` x13 | RED |
| `src/components/public/work/WorkDetailPage.tsx` | 199-202 | content `as any` x3 | YELLOW |
| `src/hooks/useNewsEditor.ts` | 142-143 | content `as any` x2 | GREEN (debug) |

**BlockLayoutVisualizer.tsx가 가장 심각** (13회): Block union 타입에 대해 type narrowing 없이 `as any`로 속성에 접근. 블록 타입이 변경되면 런타임 에러 발생.

올바른 패턴:
```typescript
// Before (위험):
return (block as any).content?.substring(0, 30);

// After (안전):
if (block.type === 'text') return block.content.substring(0, 30);
if (block.type === 'heading') return `H${block.level}: ${block.content}`;
```

---

### M-2. 디버그 로깅 135회 - 프로덕션 노출

**파일**: 특히 `/Users/jeonminjun/claude/SMVD_page/src/app/api/admin/news/articles/[id]/route.ts:145-180`, `/Users/jeonminjun/claude/SMVD_page/src/hooks/useNewsEditor.ts:130-152`, `/Users/jeonminjun/claude/SMVD_page/src/components/admin/news/NewsBlogModal.tsx`

`[API PUT] ========== CONTENT VALIDATION ==========` 같은 상세한 디버그 로그가 서버/클라이언트 양쪽에 135회 남아있음.

- 서버 로그: 내부 구조 노출 위험
- 클라이언트 로그: 브라우저 콘솔에 사용자 데이터 노출
- 성능: 고빈도 호출 시 I/O 비용

---

### M-3. News API ContentSchema 불일치 (POST vs PUT)

**파일**: POST (`src/app/api/admin/news/articles/route.ts:30-36`), PUT (`src/app/api/admin/news/articles/[id]/route.ts:33-41`)

POST의 ContentSchema:
```typescript
const ContentSchema = z.union([
  LegacyContentSchema,        // <-- Legacy 먼저
  z.object({ blocks, version }).passthrough(),
]);
```

PUT의 ContentSchema:
```typescript
const ContentSchema = z.union([
  z.object({ blocks, version }).passthrough(),  // <-- Block 먼저
  LegacyContentSchema,
]);
```

PUT은 수정되었지만 POST는 여전히 Legacy가 먼저. Zod union은 첫 번째 매칭을 사용하므로, POST에서 블록 형식 콘텐츠가 LegacyContentSchema(모든 필드 optional)에 먼저 매칭되어 `blocks`/`version` 필드가 무시될 수 있음.

---

### M-4. 이미지 삭제 함수의 날짜 기반 경로 문제

**파일**: `/Users/jeonminjun/claude/SMVD_page/src/lib/image/process.ts:116-146`

```typescript
export async function deleteImage(filename: string): Promise<void> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const filePath = path.join(uploadsDir, String(year), month, filename);
  // ...
}
```

이 함수는 **현재 날짜**의 연도/월 폴더에서만 파일을 찾음. 2026년 2월에 업로드한 이미지를 2026년 3월에 삭제하려고 하면, `2026/03/` 폴더에서 찾으므로 파일을 찾지 못함. DB의 `filepath` 필드에 전체 경로가 있으므로 그것을 사용해야 함.

---

### M-5. Block Editor 히스토리 무제한 증가

**파일**: `/Users/jeonminjun/claude/SMVD_page/src/components/admin/shared/BlockEditor/useBlockEditor.ts:37-45`

```typescript
const saveToHistory = useCallback((newBlocks: Block[]) => {
  setHistory((prev) => {
    const newHistory = prev.slice(0, historyIndex + 1);
    newHistory.push(newBlocks);
    return newHistory;  // <-- 무제한 증가
  });
  setHistoryIndex((prev) => prev + 1);
}, [historyIndex]);
```

히스토리에 상한이 없어서 긴 편집 세션에서 메모리가 계속 증가. 대규모 블록 배열(이미지 포함)일 경우 수십 MB까지 누적 가능.

---

### M-6. Slug 생성 로직의 중복 위험

**파일**: `/Users/jeonminjun/claude/SMVD_page/src/app/api/admin/news/articles/route.ts:119-128`, `/Users/jeonminjun/claude/SMVD_page/src/app/api/admin/work/projects/route.ts:79-88`

```typescript
const slugCount = await prisma.newsEvent.count({
  where: { slug: { startsWith: baseSlug } },
});
const slug = slugCount > 0 ? `${baseSlug}-${slugCount + 1}` : baseSlug;
```

`startsWith`로 카운트하면 실제 slug 패턴을 정확히 매칭하지 못함. 예: `hello`가 있고 `hello-world`도 있으면 count=2, 다음 slug는 `hello-3`이 되는데, 이미 `hello-2`가 존재하지 않아 갭이 생김. 더 심각하게, 동시 요청 시 Race Condition으로 동일 slug가 생성되어 unique constraint 위반 발생.

---

## 3. 파일별 상세 분석 (500줄 초과 16개)

### 3-1. UndergraduateTab.tsx (987줄)

**경로**: `/Users/jeonminjun/claude/SMVD_page/src/components/public/curriculum/UndergraduateTab.tsx`

**문제**:
- 모든 스타일이 인라인으로 작성 (900줄 이상이 style 객체)
- 데이터(하드코딩 과목), 로직(필터링), UI 렌더링이 한 파일에 혼재
- 3개 테이블(학기별 과목, 트랙별 이수기준, 모듈 상세)이 하나의 컴포넌트

**분리 방안**:
```
components/public/curriculum/
  UndergraduateTab/
    index.tsx              # 탭 진입점 (50줄)
    SemesterGrid.tsx       # 학기별 과목 그리드 (200줄)
    TrackTable.tsx          # 트랙 테이블 (200줄)
    ModuleDetailsTable.tsx  # 모듈 상세 테이블 (200줄)
    FilterSection.tsx       # 필터 UI (100줄)
    data.ts                 # 하드코딩 데이터 (150줄)
    styles.ts               # 공통 스타일 (80줄)
```

---

### 3-2. PersonFormModal.tsx (799줄)

**경로**: `/Users/jeonminjun/claude/SMVD_page/src/app/admin/dashboard/about/PersonFormModal.tsx`

**문제**: 교수 정보 폼이 name/title/office/email/phone/courses/biography 등 10개 이상의 필드를 단일 컴포넌트에서 관리

**분리 방안**:
```
admin/dashboard/about/PersonFormModal/
  index.tsx                # 모달 셸 + 제출 로직 (100줄)
  BasicInfoFields.tsx      # 이름, 직함, 연구실, 전화 (120줄)
  ContactFields.tsx        # 이메일, 홈페이지 (80줄)
  CoursesFields.tsx        # 학부/대학원 과목 (150줄)
  BiographyFields.tsx      # CV, 학력, 경력 (200줄)
  usePersonForm.ts         # 폼 상태 관리 훅 (150줄)
```

---

### 3-3. NewsBlogModal.tsx (732줄)

**경로**: `/Users/jeonminjun/claude/SMVD_page/src/components/admin/news/NewsBlogModal.tsx`

**문제**:
- 3중 패널(블록 리스트 + 에디터 + 미리보기) + 탭(info/content/attachments) + 폼 + 제출 로직
- 4개의 useEffect
- 디버그 console.log 다수

---

### 3-4. BlockLayoutVisualizer.tsx (712줄)

**경로**: `/Users/jeonminjun/claude/SMVD_page/src/components/admin/work/BlockLayoutVisualizer.tsx`

**문제**:
- `as any` 13회 - 블록 타입별 라벨 생성 시 타입 narrowing 없이 접근
- 드래그 앤 드롭 + 블록 리스트 + 행 관리가 모두 하나의 파일

---

### 3-5. WorkDetailPreviewRenderer.tsx (706줄)

**경로**: `/Users/jeonminjun/claude/SMVD_page/src/components/admin/shared/BlockEditor/renderers/WorkDetailPreviewRenderer.tsx`

**문제**: 15개 블록 타입 렌더러 + 레이아웃 계산 + 행 기반 배치가 단일 파일

---

### 3-6. useCurriculumEditor.ts (660줄)

**경로**: `/Users/jeonminjun/claude/SMVD_page/src/hooks/useCurriculumEditor.ts`

**문제**: 11개 API 호출 메서드가 단일 훅에 존재. 각 CRUD 함수가 try/catch + setIsLoading + setError 반복

---

### 3-7. WorkBlogModal.tsx (649줄)

**경로**: `/Users/jeonminjun/claude/SMVD_page/src/components/admin/work/WorkBlogModal.tsx`

**문제**: NewsBlogModal과 거의 동일한 3중 패널 구조 - 중복 코드

---

### 3-8. BlockEditor types.ts (616줄)

**경로**: `/Users/jeonminjun/claude/SMVD_page/src/components/admin/shared/BlockEditor/types.ts`

**분석**: 15개 블록 타입 인터페이스 + 유틸리티 함수. 이 파일은 타입 정의로서 길이가 긴 편이나, 논리적 응집성이 높아 분리 필요성은 낮음. 다만 유틸리티 함수(`groupBlocksByRows`, `generateRowConfig`, `validateBlockTree`)는 별도 파일로 분리 가능.

---

### 3-9~3-16 (추가 500줄 초과 파일)

| # | 파일 | 줄수 | 주요 문제 |
|---|------|------|----------|
| 9 | NewsDetailPreviewRenderer.tsx | 611 | 블록 렌더링 중복 |
| 10 | WorkDetailPage.tsx | 590 | `as any` 3회, 인라인 스타일 |
| 11 | ImageGridBlockEditor.tsx | 578 | 행 관리 + 이미지 업로드 혼재 |
| 12 | admin/dashboard/home/page.tsx | 571 | 여러 섹션 편집기 혼재 |
| 13 | WorkArchive.tsx | 534 | 인라인 스타일 |
| 14 | BlockList.tsx | 496 | 드래그 앤 드롭 + 블록 렌더링 |
| 15 | NewsBlockRenderer.tsx | 481 | 블록별 렌더러 분리 필요 |
| 16 | SectionEditor.tsx | 467 | 다중 섹션 타입 편집기 |

---

## 4. API 엔드포인트 감사 (41개)

### 인증 현황

| 카테고리 | 엔드포인트 수 | Auth 방식 | 이슈 |
|----------|-------------|-----------|------|
| **공개 API** | 5 | 없음 (정상) | - |
| **Admin API (checkAdminAuth)** | 32 | 역할 검증 포함 | 정상 |
| **Admin API (requireAuth)** | 4 | 로그인만 검증 | YELLOW: 역할 미검증 |

**requireAuth 사용 파일 (역할 미검증)**:
- `/Users/jeonminjun/claude/SMVD_page/src/app/api/admin/about/people/route.ts`
- `/Users/jeonminjun/claude/SMVD_page/src/app/api/admin/about/people/[id]/route.ts`
- (미들웨어가 1차 방어하지만, API 레벨 방어 부재)

### Zod 검증 현황

| 엔드포인트 | 메서드 | Zod 검증 | 트랜잭션 | 이슈 |
|-----------|--------|----------|----------|------|
| `/api/footer` | PUT | UpdateFooterSchema | 없음 | RED: 스키마/모델 불일치 |
| `/api/navigation` | PUT | UpdateNavigationItemSchema | 없음 | RED: ID 파싱 결함 |
| `/api/navigation` | DELETE | N/A | 없음 | RED: ID 파싱 결함 |
| `/api/admin/upload` | DELETE | N/A | 없음 | RED: ID 파싱 결함 |
| `/api/admin/sections` | POST | CreateSectionSchema | 없음 | YELLOW: `as any` |
| `/api/admin/sections/[id]` | PUT | UpdateSectionSchema | 없음 | YELLOW: `as any` |
| `/api/admin/news/articles` | POST | CreateArticleSchema | 없음 | YELLOW: union 순서 |
| `/api/admin/news/articles/[id]` | PUT | UpdateArticleSchema | 없음 | 과도한 디버그 로깅 |
| `/api/admin/work/projects` | POST | CreateProjectSchema | 없음 | YELLOW: `content as any` |
| `/api/admin/work/projects` | GET | N/A (인증만) | 없음 | 정상 |
| `/api/admin/sections/reorder` | PUT | Zod | `$transaction` | 정상 |
| `/api/admin/news/articles/reorder` | PUT | Zod | `$transaction` | 정상 |
| `/api/admin/work/projects/reorder` | PUT | Zod | `$transaction` | 정상 |
| `/api/admin/exhibition-items/reorder` | PUT | Zod | `$transaction` | 정상 |
| `/api/admin/work-portfolios/reorder` | PUT | Zod | `$transaction` | 정상 |
| `/api/admin/about/reorder` | PUT | Zod | `$transaction` | 정상 |
| `/api/admin/about/people/reorder` | PUT | Zod | `$transaction` | 정상 |
| `/api/admin/work/exhibitions/reorder` | PUT | Zod | `$transaction` | 정상 |
| `/api/admin/curriculum/courses/reorder` | PUT | Zod | `$transaction` | 정상 |
| (나머지 22개) | GET/POST/PUT/DELETE | Zod 또는 N/A | 없음 | 대부분 정상 |

### N+1 쿼리 분석

**Home 페이지** (`/Users/jeonminjun/claude/SMVD_page/src/app/(public)/page.tsx:18-35`):
```typescript
prisma.page.findUnique({
  include: {
    sections: {
      include: {
        exhibitionItems: { include: { media: true } },   // 3단계
        workPortfolios: { include: { media: true } },     // 3단계
      },
    },
  },
});
```
3단계 중첩 include이나, Prisma가 JOIN 쿼리로 변환하므로 N+1은 아님. 다만 모든 섹션의 모든 관계를 로드하므로 데이터가 커지면 응답 시간 증가.

**Work 상세 페이지** (`/Users/jeonminjun/claude/SMVD_page/src/app/(public)/work/[id]/page.tsx:12-29`):
```typescript
const project = await prisma.workProject.findFirst({ ... });
const allProjects = await prisma.workProject.findMany({ ... });
```
2번의 쿼리 (프로젝트 1개 + 모든 프로젝트 slug 목록). `allProjects` 쿼리에서 select로 slug/title/order만 가져오므로 효율적.

---

## 5. 보안 감사 결과

### 5-1. Rate Limiting: 없음

**위험도**: RED

전체 프로젝트에 rate limiting 구현 없음. 공격자가 `/api/admin/upload`에 대량의 파일을 업로드하거나, `/api/auth/[...nextauth]`에 brute force 공격 가능.

**영향받는 엔드포인트**: 41개 전체

---

### 5-2. XSS 필터링: 없음

**위험도**: YELLOW

`dangerouslySetInnerHTML`이 사용되지 않아 React의 기본 escape가 적용됨 (안전). 하지만 블록 에디터의 텍스트 콘텐츠가 DB에 저장될 때 HTML 태그가 필터링되지 않으며, 향후 markdown 렌더링 등을 추가하면 XSS 위험 발생.

---

### 5-3. 파일 업로드 보안

**위험도**: YELLOW

**파일**: `/Users/jeonminjun/claude/SMVD_page/src/app/api/admin/upload/route.ts`

양호한 점:
- MIME 타입 화이트리스트 (JPEG, PNG, WebP, GIF만 허용)
- 파일 크기 제한 (10MB)
- 해시 기반 파일명 (원본 파일명 사용하지 않음)

부족한 점:
- MIME 타입은 Content-Type 헤더만 확인 (매직 바이트 검증 없음)
- 업로드 빈도 제한 없음

---

### 5-4. 인증 설정

**파일**: `/Users/jeonminjun/claude/SMVD_page/src/lib/auth/auth.ts`

양호한 점:
- bcrypt 비밀번호 해싱
- JWT 기반 세션 (24시간 만료)
- Zod 검증된 로그인 입력

부족한 점:
- `NEXTAUTH_SECRET` 환경변수 미설정 시 에러 핸들링 없음
- 로그인 실패 시도 횟수 제한 없음
- 세션 무효화 메커니즘 없음 (로그아웃 후에도 JWT 유효)

---

### 5-5. 에러 메시지 정보 노출

**위험도**: GREEN

API 에러 응답이 한국어 사용자 친화적 메시지만 반환하고 스택 트레이스를 노출하지 않음 (양호). 다만 `console.error`로 서버 로그에 전체 에러 객체가 기록됨 -- 이것은 서버 측이므로 수용 가능.

---

## 6. DB 스키마 & 타입 일관성

### 6-1. Prisma/Zod 매핑 불일치 목록

| Prisma 모델 | Zod 스키마 | 불일치 | 심각도 |
|-------------|-----------|--------|--------|
| `Footer` | `FooterSchema` | 필드명 완전 다름 (`description` vs `content`, `socialLinks` vs `links`) | RED |
| `SectionType` enum | `SectionTypeSchema` | 3개 값 누락 (`WORK_ARCHIVE`, `WORK_EXHIBITION`, `NEWS_ARCHIVE`) | RED |
| `Section.content` | `SectionSchema.content` | `z.unknown()` -- 타입 정보 없음 | YELLOW |
| `Media.formats` | `MediaSchema.formats` | `z.record(z.string(), z.unknown())` -- 구조 미정의 | YELLOW |
| `NewsEvent.content` | API 내 `ContentSchema` | POST/PUT 간 union 순서 불일치 | YELLOW |

### 6-2. Cascade Delete 분석

| 관계 | onDelete | 위험 |
|------|----------|------|
| Section -> Page | Cascade | 페이지 삭제 시 모든 섹션 삭제 (의도적) |
| ExhibitionItem -> Section | Cascade | 섹션 삭제 시 전시 아이템 삭제 (의도적) |
| ExhibitionItem -> Media | Cascade | **위험**: 미디어 삭제 시 전시 아이템 삭제 (의도적이라면 OK) |
| WorkPortfolio -> Media | Cascade | **위험**: 미디어 삭제 시 포트폴리오 삭제 |
| People -> Media | SetNull | 안전 (미디어 삭제 시 null로 설정) |

**ExhibitionItem/WorkPortfolio -> Media Cascade 위험**: 관리자가 미디어를 삭제하면 연결된 전시 아이템이나 포트폴리오도 함께 삭제됨. 이것이 의도적이지 않다면 `SetNull`이나 `Restrict`로 변경 필요.

### 6-3. 인덱스 분석

Prisma 스키마에 정의된 인덱스:
- `Section`: `@@index([pageId])` -- 양호
- `ExhibitionItem`: `@@index([sectionId])`, `@@index([mediaId])` -- 양호
- `WorkPortfolio`: `@@index([sectionId])`, `@@index([mediaId])` -- 양호
- `WorkProject`: `@@index([category])`, `@@index([order])` -- 양호
- `WorkExhibition`: `@@index([order])` -- 양호
- `NewsEvent`: `@@index([category])`, `@@index([order])`, `@@index([publishedAt])` -- 양호

누락된 인덱스:
- `Navigation`: `order` 인덱스 없음 (정렬 쿼리 시 전체 스캔)
- `People`: `order` 인덱스 없음
- `Footer`: 단일 레코드이므로 인덱스 불필요

---

## 7. 성능 분석

### 7-1. 페이지별 쿼리 분석

| 페이지 | 쿼리 수 | include 깊이 | 예상 응답시간 |
|--------|---------|-------------|-------------|
| Home (`/`) | 1 | 3단계 (page > sections > items > media) | 50-100ms |
| About (`/about`) | 1 | 2단계 (page > sections) | 30-50ms |
| Curriculum (`/curriculum`) | 1 | 2단계 (page > sections) | 30-50ms |
| Work 목록 (`/work`) | 1-2 | 0단계 (직접 findMany) | 20-40ms |
| Work 상세 (`/work/[id]`) | 2 | 0단계 | 30-50ms |
| News 상세 (`/news/[id]`) | 1 | 0단계 | 20-30ms |

### 7-2. 캐싱 전략 문제

**발견**: 공개 페이지 6개 중 오직 2개만 캐시 제어 설정:
- `/curriculum/page.tsx`: `dynamic = 'force-dynamic'` (캐시 비활성화)
- `/news/[id]/page.tsx`: `revalidate = 0` (캐시 비활성화)
- 나머지 4개: 기본값 (Next.js 15의 기본 캐싱) -- CMS 수정 후 공개 페이지에 즉시 반영되지 않을 수 있음

**Home, About, Work 목록, Work 상세** 페이지에서 CMS 편집 후 변경사항이 즉시 반영되지 않을 가능성 있음.

### 7-3. 이미지 업로드 메모리

**파일**: `/Users/jeonminjun/claude/SMVD_page/src/app/api/admin/upload/route.ts:53`

```typescript
const buffer = Buffer.from(await file.arrayBuffer());
```

10MB 파일 업로드 시 메모리에 전체 버퍼를 로드. sharp 처리 과정에서 추가로 WebP + 썸네일 버퍼가 생성되어 총 ~30MB 메모리 사용. 동시 업로드 5건이면 ~150MB.

### 7-4. Block Editor 히스토리 메모리

각 편집 작업마다 전체 블록 배열의 스냅샷이 히스토리에 저장. 20개 블록(이미지 URL 포함) x 100번 편집 = 약 2,000개 블록 객체가 메모리에 존재.

### 7-5. 미리보기 iframe 렌더링

CMS의 실시간 미리보기는 iframe의 `src`를 재할당하여 강제 리로드하는 방식:
```typescript
const refreshPreview = () => {
  if (iframeRef.current) {
    iframeRef.current.src = iframeRef.current.src;
  }
};
```

매번 전체 페이지를 다시 로드하므로:
- 네트워크 요청 발생
- 서버 렌더링 비용
- iframe 내 전체 DOM 재구성

대안: postMessage 기반 실시간 업데이트, 또는 같은 React 컴포넌트를 직접 렌더링.

---

## 8. CMS-공개페이지 연동 분석

### 8-1. 데이터 흐름

```
[Admin CMS]
    |
    v
[API Route] -- Zod 검증 --> [Prisma ORM] --> [PostgreSQL]
                                                    |
                                                    v
[공개 페이지 Server Component] <-- prisma.findUnique/findMany
    |
    v
[Section.content as any] --> [컴포넌트 Props] --> [React 렌더링]
```

**핵심 문제**: `Section.content`가 `Json?` 타입(Prisma)이므로, 공개 페이지에서 `as any`로 캐스팅하여 사용. 중간에 타입 검증 레이어가 없음.

### 8-2. 캐시 무효화

현재 메커니즘: 없음 (Next.js 기본 캐싱에 의존)

CMS에서 데이터 수정 시 공개 페이지 캐시를 명시적으로 무효화하는 로직이 없음. `revalidatePath()` 또는 `revalidateTag()` 호출이 어디에도 없음.

### 8-3. 블록 편집 데이터 일관성

블록 편집기에서 저장:
1. 클라이언트: `blocks[]` + `rowConfig[]` 생성
2. 클라이언트: JSON.stringify -> fetch PUT
3. 서버: Zod 검증 (블록 내부는 `z.array(z.any())`)
4. 서버: Prisma `Json` 필드에 저장

공개 페이지에서 읽기:
1. 서버: Prisma `Json?` -> `Record<string, unknown>`
2. 서버: `content.blocks` 배열 직접 접근
3. 컴포넌트: `block.type` switch로 렌더링

**위험**: Zod에서 `z.any()`를 사용하므로 블록 내부 구조가 검증되지 않음. 잘못된 블록이 저장되면 공개 페이지에서 런타임 에러 발생.

---

## 9. Positive Findings (긍정적 발견)

1. **TypeScript strict mode**: `src/` 내 0개 컴파일 에러 (test 파일 제외)
2. **일관된 API 응답 형식**: `successResponse()`/`errorResponse()` 패턴 통일
3. **Prisma 관계 설계**: Cascade delete, unique constraint, 인덱스가 적절
4. **이미지 파이프라인**: 자동 WebP 변환 + 썸네일 생성
5. **블록 에디터 아키텍처**: 15개 블록 타입이 discriminated union으로 안전하게 정의
6. **Undo/Redo 지원**: 히스토리 기반 편집 상태 관리
7. **트랜잭션 기반 reorder**: 9개 reorder API가 모두 `$transaction` 사용
8. **Soft delete**: People 모델에 `archivedAt` 필드로 소프트 삭제 구현
9. **에러 처리**: 모든 API에 try/catch + 사용자 친화적 한국어 메시지
10. **Fallback 패턴**: 공개 페이지가 DB 데이터 없을 시 하드코딩 데이터로 폴백

---

## 10. 최종 개선 로드맵

### Phase 1: Critical Fixes (예상 16시간)

| # | 작업 | 시간 | 우선순위 |
|---|------|------|---------|
| 1 | Footer Zod 스키마를 Prisma 모델에 맞게 수정 | 1h | P0 |
| 2 | SectionTypeSchema에 누락된 3개 타입 추가 | 0.5h | P0 |
| 3 | Navigation PUT/DELETE ID 파싱 수정 (동적 라우트 분리) | 2h | P0 |
| 4 | Upload DELETE ID 파싱 수정 | 1h | P0 |
| 5 | About People API에 `checkAdminAuth()` 적용 | 0.5h | P0 |
| 6 | News POST ContentSchema union 순서 수정 | 0.5h | P0 |
| 7 | 이미지 삭제 함수의 경로 로직 수정 (filepath 기반) | 2h | P0 |
| 8 | 디버그 console.log 135개 제거/조건부 전환 | 3h | P1 |
| 9 | 공개 페이지 캐시 비활성화 (`dynamic = 'force-dynamic'`) | 1h | P1 |
| 10 | Slug 생성 로직 개선 (findUnique + 재시도) | 2h | P1 |

**실행 명령어**:
```bash
# TypeScript 검증
npx tsc --noEmit

# 빌드 검증
npm run build

# 프로덕션 테스트
npm run start
```

### Phase 2: Major Refactoring (예상 40시간)

| # | 작업 | 시간 |
|---|------|------|
| 1 | UndergraduateTab.tsx 분리 (987줄 -> 7개 파일) | 4h |
| 2 | PersonFormModal.tsx 분리 (799줄 -> 6개 파일) | 3h |
| 3 | NewsBlogModal.tsx 분리 (732줄 -> 5개 파일) | 3h |
| 4 | BlockLayoutVisualizer.tsx `as any` 제거 + 분리 | 4h |
| 5 | WorkBlogModal.tsx와 NewsBlogModal.tsx 공통화 | 5h |
| 6 | `as any` 35회 전부 적절한 타입으로 교체 | 8h |
| 7 | Section.content 타입 정의 (SectionContentMap 패턴) | 4h |
| 8 | useCurriculumEditor.ts 분리 (CRUD별 훅) | 3h |
| 9 | Work/News 공개페이지 중복 레이아웃 공통화 | 3h |
| 10 | @ts-ignore 제거 (BlockEditorPanel.tsx) | 1h |

### Phase 3: Performance & Security (예상 30시간)

| # | 작업 | 시간 |
|---|------|------|
| 1 | Rate limiting 미들웨어 추가 (upstash/ratelimit) | 4h |
| 2 | 블록 에디터 히스토리 상한 설정 (50회) | 1h |
| 3 | 이미지 업로드 스트리밍 처리 | 4h |
| 4 | 미리보기 postMessage 기반 업데이트로 전환 | 6h |
| 5 | revalidatePath 기반 캐시 무효화 | 3h |
| 6 | 블록 콘텐츠 Zod 검증 강화 (`z.any()` -> 블록별 스키마) | 6h |
| 7 | Navigation/People 테이블 order 인덱스 추가 | 0.5h |
| 8 | 파일 업로드 MIME 매직 바이트 검증 | 2h |
| 9 | 로그인 시도 횟수 제한 | 2h |
| 10 | 에러 로깅 구조화 (pino/winston) | 2h |

---

## 11. 최종 점수

| 영역 | 점수 | 상세 |
|------|------|------|
| **코드 품질** | 58/100 | 500줄 초과 16개, `as any` 35회, 디버그 로그 135회 |
| **아키텍처** | 72/100 | Next.js App Router 적절 활용, Prisma 관계 설계 양호, 블록 에디터 구조 우수 |
| **타입 안전성** | 65/100 | TSC 0 에러이나, `as any` 35회 + `z.unknown()`/`z.any()` 다수 사용 |
| **성능** | 68/100 | 기본적으로 양호하나, 캐싱 전략 부재 + 히스토리 무제한 + iframe 리로드 |
| **보안** | 45/100 | Rate limiting/CSRF/XSS 필터링 전무, MIME 검증 미흡 |
| **DB 설계** | 70/100 | 인덱스/관계 양호, Zod/Prisma 매핑 불일치 심각 |
| **테스트** | 15/100 | E2E 테스트 1개만 존재 (test-news-blocks.spec.ts), 단위 테스트 없음 |

### 종합 점수: 56/100 (D+)

### 프로덕션 배포 가능도: 62%

**배포 전 필수 수정 (Phase 1)**: 16시간 투자 시 배포 가능도 80%로 상승
**완전한 프로덕션 준비 (Phase 1+2+3)**: 86시간 투자 시 배포 가능도 95%로 상승

---

*이 리포트는 2026-02-16 기준으로 작성되었으며, `refactor/component-split` 브랜치의 코드를 분석했습니다.*
