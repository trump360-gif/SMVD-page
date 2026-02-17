# PHASE 1 상세 실행 계획 - Code Quality Improvement

**문서 작성일**: 2026-02-17
**목표 기간**: 1-2주 (30-35시간)
**현재 점수**: 4.2/5 → **목표 점수**: 4.5/5

---

## 📋 핵심 원칙 (Context 보존 전략)

### 1. 컨텍스트 압축 방지
✅ 모든 작업은 이 문서에 기록
✅ 각 변경사항은 명확한 커밋으로 기록
✅ 매 단계마다 빌드 및 타입 검증
✅ 롤백 가능한 원자적 커밋 생성

### 2. 코드 보호
✅ **API 변경 없음**: 모든 엔드포인트 동작 동일
✅ **타입 보호**: 기존 타입 제거 금지 (추가만)
✅ **DB 스키마 무변경**: Prisma 스키마 그대로
✅ **Import/Export 호환성**: 모든 기존 코드 작동

### 3. 검증 프로토콜
✅ 작업 전: TypeScript 0 errors, Build 57/57 pages
✅ 작업 중: 매 커밋마다 검증
✅ 작업 후: 최종 대비 검증
✅ 배포 전: 전체 통합 테스트

---

## 🎯 Phase 1 작업 분해 (4개 주요 작업)

### TASK 1: 파일 분할 (500줄+ 5개 파일)
**예상 시간**: 8-10시간
**우선순위**: 🔴 높음 (모듈화)
**대담당**: 모든 분할 작업

#### Task 1.1: ProfessorDetailPage 분할 (770줄)

**현재 구조**:
```
src/components/public/people/ProfessorDetailPage.tsx (770줄)
├── 헤더 영역 (교수 기본정보, 배지) ~100줄
├── 정보 영역 (연락처, 사무실) ~120줄
├── 과목 테이블 (학사/석사) ~150줄
└── 약력 영역 (CV, 직책, 학력, 경력) ~150줄
```

**목표 구조**:
```
src/components/public/people/
├── ProfessorDetailPage.tsx (150줄) - 메인 컨테이너
├── ProfessorHeader.tsx (100줄) - 헤더
├── ProfessorInfo.tsx (120줄) - 정보
├── ProfessorCourses.tsx (150줄) - 과목 테이블
├── ProfessorBiography.tsx (150줄) - 약력
└── types.ts (50줄) - 타입 정의
```

**변경 없는 것들** ✅
- Props 인터페이스: ProfessorDetailPageProps 동일
- Return 타입: JSX.Element 동일
- 라우트: /professor/[id] 동일
- 렌더링 결과: 4명 교수 모두 동일하게 표시

**작업 체크리스트**:
```
□ 1-1-1: 기존 ProfessorDetailPage.tsx 읽기 (분석용)
□ 1-1-2: types.ts 생성 (ProfessorData, 교수 정보 타입)
□ 1-1-3: ProfessorHeader.tsx 생성 (이름, 배지, 기본 정보)
□ 1-1-4: ProfessorInfo.tsx 생성 (연락처, 사무실)
□ 1-1-5: ProfessorCourses.tsx 생성 (학사/석사 과목 테이블)
□ 1-1-6: ProfessorBiography.tsx 생성 (CV, 직책, 학력, 경력)
□ 1-1-7: ProfessorDetailPage.tsx 리팩토링 (컨테이너만)
□ 1-1-8: 모든 새 컴포넌트 imports 확인
□ 1-1-9: npm run dev → http://localhost:3000/professor/yun (테스트)
□ 1-1-10: 4명 교수 모두 렌더링 확인 (yun, kim, lee, na)
□ 1-1-11: npm run build → 57/57 pages 확인
□ 1-1-12: npx tsc --noEmit → 0 errors 확인
□ 1-1-13: git commit -m "refactor: Split ProfessorDetailPage into 5 components"
```

**검증 기준**:
- ✅ ProfessorDetailPage.tsx: 100-180줄 (이전 770줄)
- ✅ 4개 신규 컴포넌트 각각: 100-150줄
- ✅ console에 에러 없음
- ✅ 페이지 렌더링: 이전과 완전 동일
- ✅ 모바일 뷰: 동일하게 작동

**롤백 전략**:
```bash
# 실패 시
git reset --hard HEAD~1
```

---

#### Task 1.2: NewsBlogModal 분할 (720줄)

**현재 구조**:
```
src/components/admin/news/NewsBlogModal.tsx (720줄)
├── 폼 영역 (제목, 부제, 이미지) ~200줄
├── 블록 에디터 영역 ~200줄
├── 미리보기 영역 ~200줄
└── 모달 로직 ~120줄
```

**목표 구조**:
```
src/components/admin/news/
├── NewsBlogModal.tsx (150줄) - 모달 래퍼
├── ArticleForm.tsx (200줄) - 폼
├── BlockEditorPanel.tsx (180줄) - 블록 에디터
├── ArticlePreview.tsx (170줄) - 미리보기
└── types.ts (50줄) - 타입
```

**변경 없는 것들** ✅
- Props: NewsBlogModalProps 동일
- State 관리: useNewsEditor 훅 동일
- API 호출: 모두 동일
- 제출 로직: 완전히 동일

**작업 체크리스트**:
```
□ 1-2-1: 기존 NewsBlogModal.tsx 읽기
□ 1-2-2: types.ts 생성 (ArticleFormData, 모달 props)
□ 1-2-3: ArticleForm.tsx 생성
□ 1-2-4: BlockEditorPanel.tsx 생성
□ 1-2-5: ArticlePreview.tsx 생성
□ 1-2-6: NewsBlogModal.tsx 리팩토링 (모달 래퍼)
□ 1-2-7: 모든 imports 확인
□ 1-2-8: Admin 로그인 → 뉴스 에디터 열기
□ 1-2-9: 폼 제출 테스트 (모든 필드)
□ 1-2-10: 블록 추가/삭제 테스트
□ 1-2-11: 미리보기 실시간 업데이트 테스트
□ 1-2-12: npm run build → 57/57 pages
□ 1-2-13: npx tsc --noEmit → 0 errors
□ 1-2-14: git commit -m "refactor: Split NewsBlogModal into 4 components"
```

**검증 기준**:
- ✅ 각 컴포넌트: 150-200줄
- ✅ 폼 제출: 이전과 동일
- ✅ 미리보기: 실시간 동기화
- ✅ 에러 처리: 동일하게 작동
- ✅ 상태 관리: 훅이 모든 것 제어

---

#### Task 1.3: WorkDetailPreviewRenderer 분할 (707줄)

**현재 구조**:
```
src/components/admin/shared/BlockEditor/renderers/WorkDetailPreviewRenderer.tsx (707줄)
├── TextBlock 렌더러 ~80줄
├── ImageBlock 렌더러 ~120줄
├── LayoutRow 렌더러 ~110줄
├── ImageGrid 렌더러 ~100줄
└── 메인 렌더러 ~200줄
```

**목표 구조**:
```
src/components/admin/shared/BlockEditor/renderers/
├── work-detail-preview/
│   ├── index.ts (진입점)
│   ├── TextBlockPreview.tsx (80줄)
│   ├── ImageBlockPreview.tsx (120줄)
│   ├── LayoutRowPreview.tsx (110줄)
│   └── ImageGridPreview.tsx (100줄)
└── WorkDetailPreviewRenderer.tsx (150줄) - 디스패처
```

**변경 없는 것들** ✅
- Export: WorkDetailPreviewRenderer 동일
- Props: 모두 호환
- Render 결과: 완전히 동일

**작업 체크리스트**:
```
□ 1-3-1: work-detail-preview/ 디렉토리 생성
□ 1-3-2: TextBlockPreview.tsx 생성 및 이동
□ 1-3-3: ImageBlockPreview.tsx 생성 및 이동
□ 1-3-4: LayoutRowPreview.tsx 생성 및 이동
□ 1-3-5: ImageGridPreview.tsx 생성 및 이동
□ 1-3-6: index.ts 생성 (re-exports)
□ 1-3-7: WorkDetailPreviewRenderer.tsx 리팩토링 (디스패처)
□ 1-3-8: 모든 imports 확인
□ 1-3-9: Admin 로그인 → Work 에디터 열기
□ 1-3-10: 모든 블록 타입 미리보기 테스트
□ 1-3-11: npm run build → 57/57 pages
□ 1-3-12: npx tsc --noEmit → 0 errors
□ 1-3-13: git commit -m "refactor: Extract WorkDetailPreviewRenderer block types"
```

**검증 기준**:
- ✅ 각 블록 렌더러: 80-120줄
- ✅ 메인: 150줄
- ✅ 모든 미리보기 표시: 이전과 동일
- ✅ 드래그앤드롭: 동일하게 작동

---

#### Task 1.4: WorkDetailPage 분할 (613줄)

**현재 구조**:
```
src/components/public/work/WorkDetailPage.tsx (613줄)
├── 헤더/메타 ~100줄
├── 본문 콘텐츠 ~200줄
├── 관련 작품 ~150줄
└── 사이드바 ~100줄
```

**목표 구조**:
```
src/components/public/work/
├── WorkDetailPage.tsx (150줄) - 메인
├── WorkProjectHeader.tsx (100줄) - 헤더
├── WorkProjectContent.tsx (150줄) - 본문
├── WorkProjectRelated.tsx (130줄) - 관련 작품
└── types.ts (40줄) - 타입
```

**변경 없는 것들** ✅
- Route: /work/[id] 동일
- Props 타입: 호환
- 렌더링: 완전히 동일

**작업 체크리스트**:
```
□ 1-4-1: types.ts 생성
□ 1-4-2: WorkProjectHeader.tsx 생성
□ 1-4-3: WorkProjectContent.tsx 생성
□ 1-4-4: WorkProjectRelated.tsx 생성
□ 1-4-5: WorkDetailPage.tsx 리팩토링
□ 1-4-6: 모든 imports 확인
□ 1-4-7: npm run dev → /work/[id] 페이지 테스트
□ 1-4-8: 모든 작품 상세 페이지 확인
□ 1-4-9: npm run build → 57/57 pages
□ 1-4-10: npx tsc --noEmit → 0 errors
□ 1-4-11: git commit -m "refactor: Split WorkDetailPage into 4 sections"
```

---

#### Task 1.5: BlockListRenderer 분할 (596줄)

**현재 구조**:
```
src/components/admin/shared/BlockEditor/BlockListRenderer.tsx (596줄)
├── ImageGrid 렌더 ~100줄
├── TextBlock 렌더 ~80줄
├── HeroImage 렌더 ~90줄
├── LayoutRow 렌더 ~100줄
└── 나머지 타입들 ~120줄
```

**목표 구조**:
```
src/components/admin/shared/BlockEditor/block-type-renderers/
├── ImageGridRenderer.tsx (100줄)
├── TextBlockRenderer.tsx (80줄)
├── HeroImageRenderer.tsx (90줄)
├── LayoutRowRenderer.tsx (100줄)
└── index.ts (re-export)

src/components/admin/shared/BlockEditor/BlockListRenderer.tsx (180줄) - 디스패처
```

**변경 없는 것들** ✅
- BlockListRenderer export 동일
- 렌더 결과: 완전히 동일
- Props 인터페이스: 호환

**작업 체크리스트**:
```
□ 1-5-1: block-type-renderers/ 디렉토리 생성
□ 1-5-2: ImageGridRenderer.tsx 생성
□ 1-5-3: TextBlockRenderer.tsx 생성
□ 1-5-4: HeroImageRenderer.tsx 생성
□ 1-5-5: LayoutRowRenderer.tsx 생성
□ 1-5-6: index.ts 생성
□ 1-5-7: BlockListRenderer.tsx 리팩토링 (디스패처)
□ 1-5-8: Admin 로그인 → 모든 페이지 에디터 테스트
□ 1-5-9: 모든 블록 타입 렌더링 확인
□ 1-5-10: npm run build → 57/57 pages
□ 1-5-11: npx tsc --noEmit → 0 errors
□ 1-5-12: git commit -m "refactor: Extract BlockListRenderer type renderers"
```

---

#### Task 1.6: Task 1 최종 검증

**전체 빌드 검증**:
```bash
□ npm run build
  Expected: 57/57 pages successfully generated

□ npx tsc --noEmit
  Expected: 0 errors, 0 warnings

□ npm run dev
  - 공개 페이지 모두 테스트
  - 관리자 페이지 모두 테스트
  - 콘솔 에러 확인
```

**파일 검증**:
```
□ Task 1.1 commit 확인
  Files changed: 7 (5 new, 2 modified)
  Lines: ~600 changed

□ Task 1.2 commit 확인
  Files changed: 6 (4 new, 1 modified)
  Lines: ~500 changed

□ Task 1.3 commit 확인
  Files changed: 6 (5 new, 1 modified)
  Lines: ~400 changed

□ Task 1.4 commit 확인
  Files changed: 5 (4 new, 1 modified)
  Lines: ~300 changed

□ Task 1.5 commit 확인
  Files changed: 6 (5 new, 1 modified)
  Lines: ~350 changed
```

**Task 1 결과**:
```
✅ 5개 파일 → 18개 컴포넌트 (분할)
✅ 평균 크기: 770줄 → 150-200줄
✅ 빌드: 57/57 pages (이전과 동일)
✅ TypeScript: 0 errors (이전과 동일)
✅ Commits: 5개 (각각 원자적)
✅ 모듈화 개선: 8/10 → 8.5/10
```

---

### TASK 2: XSS 방지 강화 (DOMPurify 통합)
**예상 시간**: 4-5시간
**우선순위**: 🔴 높음 (보안)

#### Task 2.1: DOMPurify 설치 및 설정

**설치**:
```bash
□ npm install isomorphic-dompurify
□ npm install --save-dev @types/dompurify
□ npm list | grep dompurify (확인)
```

**설정 파일 생성** (`src/lib/sanitize-config.ts`):
```typescript
□ ALLOWED_TAGS 정의:
  - 텍스트: 'p', 'br', 'strong', 'em', 'u'
  - 제목: 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
  - 리스트: 'ul', 'ol', 'li'
  - 기타: 'a', 'img', 'blockquote', 'code', 'pre'

□ ALLOWED_ATTRIBUTES 정의:
  - 링크: 'href'
  - 이미지: 'src', 'alt', 'title'
  - 클래스: 'class', 'id'

□ 옵션 설정:
  - KEEP_CONTENT: true (태그 제거 시 텍스트 유지)
  - RETURN_DOM: false
  - RETURN_DOM_FRAGMENT: false
  - RETURN_DOM_IMPORT: false
```

**검증**:
```bash
□ npm run build (빌드 성공)
□ npx tsc --noEmit (타입 체크)
```

---

#### Task 2.2: sanitize.ts 업데이트

**변경 전** (`src/lib/sanitize.ts`):
```typescript
export const sanitizeContent = (content: string | null | undefined): string => {
  if (!content) return '';
  let sanitized = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  return sanitized;
};
```

**변경 후** (`src/lib/sanitize.ts`):
```typescript
import DOMPurify from 'isomorphic-dompurify';
import { SANITIZE_CONFIG } from './sanitize-config';

export const sanitizeContent = (content: string | null | undefined): string => {
  if (!content) return '';
  return DOMPurify.sanitize(content, SANITIZE_CONFIG);
};

// 이 함수의 서명은 변경 없음!
// input: string | null | undefined
// output: string
// → 모든 기존 코드 호환!
```

**검증**:
```
□ 함수 서명 변경 없음 (backward compatible)
□ Export 이름 동일
□ Import 경로 동일
□ Return 타입 동일
```

---

#### Task 2.3-2.10: 8개 컴포넌트 업데이트

**Task 2.3**: WorkDetailPage.tsx (2 instances)
```typescript
□ Line ~234: <ReactMarkdown>{sanitizeContent(...)}</ReactMarkdown>
□ Line ~412: <ReactMarkdown>{sanitizeContent(...)}</ReactMarkdown>
□ Test: /work/[id] 페이지 렌더링 확인
□ Verify: 콘텐츠 마크다운 이전과 동일
```

**Task 2.4**: NewsEventDetailContent.tsx (1 instance)
```typescript
□ Update: sanitizeContent 호출
□ Test: 뉴스 상세 페이지 렌더링
□ Verify: 콘텐츠 표시 동일
```

**Task 2.5**: NewsBlockRenderer.tsx (1 instance)
```typescript
□ Update: 블록 렌더링 시 sanitize
□ Test: Admin 뉴스 에디터 미리보기
```

**Task 2.6**: BlockRenderer.tsx (1 instance)
```typescript
□ Update: 블록 렌더링
□ Test: Work 에디터 미리보기
```

**Task 2.7**: TextBlockRenderer.tsx (1 instance)
```typescript
□ Update: 텍스트 블록
□ Test: Admin 텍스트 블록 표시
```

**Task 2.8**: WorkDetailPreviewRenderer.tsx (3 instances)
```typescript
□ Line ~154: Update
□ Line ~289: Update
□ Line ~412: Update
□ Test: Work 에디터 3중화면 모달
```

**Task 2.9**: NewsDetailPreviewRenderer.tsx (2 instances)
```typescript
□ Line ~167: Update
□ Line ~318: Update
□ Test: News 에디터 미리보기
```

**Task 2.10**: MarkdownEditor.tsx (1 instance)
```typescript
□ Update: 마크다운 에디터
□ Test: 에디터 입력 및 미리보기
```

---

#### Task 2.11: 보안 테스트

**XSS 공격 테스트** (브라우저 DevTools):
```
□ Test 1: <script>alert('XSS')</script>
  Expected: 스크립트 실행 안 됨

□ Test 2: <img src=x onerror="alert('XSS')">
  Expected: 이벤트 핸들러 제거됨

□ Test 3: <svg onload="alert('XSS')">
  Expected: SVG 이벤트 제거됨

□ Test 4: 정상 마크다운 [link](url)
  Expected: 정상 렌더링
```

**유효한 콘텐츠 테스트**:
```
□ 마크다운 헤더: # Title → <h1> 렌더링
□ 볼드: **bold** → <strong> 렌더링
□ 링크: [text](url) → <a> 렌더링
□ 이미지: ![alt](src) → <img> 렌더링
□ 리스트: - item → <ul><li> 렌더링
```

---

#### Task 2.12: 최종 검증

```bash
□ npm run build → 57/57 pages
□ npx tsc --noEmit → 0 errors
□ npm run dev
  - 공개 페이지 마크다운 콘텐츠 확인
  - Admin 에디터 미리보기 확인
  - 콘솔 에러 없음
□ git commit -m "security: Strengthen XSS prevention with DOMPurify"
```

**Task 2 결과**:
```
✅ DOMPurify 설치 (enterprise-grade XSS protection)
✅ 8 컴포넌트 업데이트
✅ 모든 기존 기능 보존
✅ XSS 벡터 차단 확인
✅ 보안: 4.0/5 → 4.5/5 (+0.5)
✅ 마크다운 렌더링: 동일
```

---

### TASK 3: any 타입 제거 (8 instances)
**예상 시간**: 2-3시간
**우선순위**: 🟡 중간

#### Task 3.1: any 타입 감시

**위치 확인**:
```
□ Grep: grep -r " any" src/
  Results:
  1. home/page.tsx:45
  2. BlockEditor.tsx:120
  3. BlockEditor.tsx:135
  4. BlockEditor.tsx:145
  5. NewsBlogModal.tsx:240
  6. useAboutEditor.ts:85
  7-8. 기타 (minor)
```

---

#### Task 3.2: 타입 정의 생성

**파일**: `src/types/events.ts`
```typescript
□ React.DragEvent<HTMLDivElement> 타입 정의
□ DataTransfer 타입
□ DragEventHandler 타입
```

**파일**: `src/types/content.ts`
```typescript
□ BlogContent 타입 (기존에서 가져오기)
□ AboutSectionContent 타입
□ 다른 content 타입들
```

**파일**: `src/types/uploads.ts`
```typescript
□ UploadedAttachment 인터페이스
□ UploadResponse 인터페이스
```

---

#### Task 3.3-3.8: 각 any 타입 수정

**Task 3.3**: home/page.tsx (Line 45)
```typescript
Before: let content: any = {};
After:  let content: BlogContent = { blocks: [], metadata: {} };

□ 변경 후 테스트: Home 페이지 렌더링
□ TypeScript 에러 확인
```

**Task 3.4**: BlockEditor.tsx (Lines 120, 135, 145)
```typescript
Before: const handleDragOver = (event: any) => { ... }
After:  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => { ... }

Before: const data: any = event.dataTransfer;
After:  const data: DataTransfer | null = event.dataTransfer;

□ 변경 후 테스트: 드래그앤드롭
□ TypeScript 에러 확인
```

**Task 3.5**: NewsBlogModal.tsx (Line 240)
```typescript
Before: let uploadedAttachments: any[] = [];
After:  let uploadedAttachments: UploadedAttachment[] = [];

□ 변경 후 테스트: News 에디터 업로드
```

**Task 3.6**: useAboutEditor.ts (Line 85)
```typescript
Before: let content: any = initialContent;
After:  let content: AboutSectionContent = initialContent;

□ 변경 후 테스트: About 섹션 편집
```

---

#### Task 3.7: 최종 타입 검증

```bash
□ npx tsc --noEmit
  Expected: 0 errors (any 8개 모두 제거됨)

□ npm run build → 57/57 pages

□ 런타임 테스트:
  - Home 페이지
  - Work 상세 페이지
  - Admin BlockEditor
  - News CMS
```

---

#### Task 3.8: 커밋

```bash
□ git add src/types/events.ts src/types/content.ts src/types/uploads.ts
□ git add src/components/admin/shared/BlockEditor/BlockEditor.tsx
□ git add src/app/home/page.tsx
□ git add src/components/admin/news/NewsBlogModal.tsx
□ git add src/hooks/useAboutEditor.ts
□ git commit -m "refactor: Remove any types, replace with concrete types"
```

**Task 3 결과**:
```
✅ 8 any 타입 제거
✅ 구체적 타입 정의
✅ TypeScript: 4.7/5 → 5.0/5 (+0.3)
✅ 타입 안전성 향상
```

---

### TASK 4: DB 쿼리 최적화 (N+1 제거)
**예상 시간**: 6-8시간
**우선순위**: 🟡 중간

#### Task 4.1: findMany 쿼리 분석

```typescript
□ API 라우트 모두 검색:
  grep -r "findMany" src/app/api/

□ 결과 분류:
  - Work 프로젝트: 3개
  - News 기사: 4개
  - Curriculum: 5개
  - Navigation: 2개
  - Footer: 1개
  - 기타: 미디어, 섹션 등

Total findMany: ~20개
With include: ~5개 (25%)
Target: 18개 이상 (90%+)
```

---

#### Task 4.2: Work 쿼리 최적화

**파일**: `src/app/api/admin/work/projects/route.ts`

```typescript
// Before (N+1 위험)
const projects = await prisma.workProject.findMany({
  orderBy: { order: 'asc' },
});
// → 이후 project.media 접근 시 추가 쿼리 필요

// After (최적화)
const projects = await prisma.workProject.findMany({
  orderBy: { order: 'asc' },
  include: {
    media: true,
    sections: {
      include: {
        images: true
      }
    }
  }
});

□ 변경 후 테스트:
  - API 응답 동일한지 확인
  - 속도 향상 측정
  - 콘솔 쿼리 로그 비교
```

---

#### Task 4.3-4.6: 다른 도메인 최적화

**Task 4.3**: News 쿼리 (`src/app/api/admin/news/...`)
```typescript
□ newsArticle.findMany() → include: { media: true }
□ Test: News 에디터 로드 속도
```

**Task 4.4**: Curriculum 쿼리 (`src/app/api/admin/curriculum/...`)
```typescript
□ course.findMany() → include proper relations
□ Test: Curriculum 데이터 로드
```

**Task 4.5**: Navigation 쿼리 (`src/app/api/admin/navigation/...`)
```typescript
□ navigationItem.findMany() → include children if hierarchical
□ Test: 네비게이션 메뉴 로드
```

**Task 4.6**: Footer 쿼리 (`src/app/api/admin/footer/...`)
```typescript
□ footer query → include: { socialLinks: true }
□ Test: 푸터 데이터 로드
```

---

#### Task 4.7: 성능 측정

```typescript
□ Prisma 쿼리 로깅 활성화:
  DATABASE_URL에 ?logging=query 추가

□ Before metrics:
  - 작품 목록: N쿼리 (개수만큼)
  - 응답 시간: X ms

□ After metrics:
  - 작품 목록: 1 쿼리 (include로 한 번에)
  - 응답 시간: Y ms (빨라져야 함)

□ 개선율 계산:
  쿼리 감소: (N-1)/N * 100%
  시간 단축: (X-Y)/X * 100%
```

---

#### Task 4.8: API 응답 호환성 검증

```typescript
□ 각 API 엔드포인트 테스트:
  GET /api/admin/work/projects
    - Response 형식 동일
    - Data 구조 동일
    - 신규 include 데이터도 호환

□ Admin 페이지 테스트:
  - Work 에디터: 데이터 로드
  - News 에디터: 데이터 로드
  - Curriculum 에디터: 데이터 로드
  - Navigation 에디터: 데이터 로드
  - Footer 에디터: 데이터 로드

□ 프론트엔드 코드 변경 불필요 (API 구조 동일!)
```

---

#### Task 4.9: 최종 검증 및 커밋

```bash
□ npm run build → 57/57 pages

□ npx tsc --noEmit → 0 errors

□ 성능 테스트:
  - Admin 로그인
  - 모든 페이지 에디터 로드
  - 데이터 표시 확인
  - 콘솔 쿼리 로그 확인

□ git commit -m "perf: Add Prisma includes to eliminate N+1 queries"
```

**Task 4 결과**:
```
✅ include 비율: 25% → 90%+
✅ N+1 패턴 제거
✅ 성능: 3.8/5 → 4.2/5 (+0.4)
✅ API 응답: 100% 호환
✅ DB 쿼리 감소
```

---

### TASK 5: 최종 통합 검증 및 리포트
**예상 시간**: 2-3시간
**우선순위**: 🔴 높음

#### Task 5.1: 종합 빌드 및 타입 검증

```bash
□ npm run build
  Expected: 57/57 pages successfully generated
  Document: Build time, any warnings

□ npx tsc --noEmit
  Expected: 0 errors
  Document: Any type mismatches (none should exist)

□ npm run lint (if configured)
  Expected: 0 critical errors
```

---

#### Task 5.2: 개발 서버 검증

```bash
□ npm run dev

□ 공개 페이지 (6개):
  ✅ / (Home)
  ✅ /about
  ✅ /curriculum
  ✅ /people
  ✅ /work
  ✅ /news-and-events

□ 상세 페이지:
  ✅ /work/[id] - 4개 프로젝트 모두
  ✅ /professor/[id] - 4명 교수 모두
  ✅ /news/[id] - 뉴스 아티클

□ 콘솔 확인:
  - 에러 없음
  - 경고 최소
  - 성능 로그 확인 (쿼리 감소)
```

---

#### Task 5.3: Admin CMS 기능 검증

```bash
□ 로그인: /admin/login

□ 각 CMS 에디터:
  ✅ Dashboard: /admin/dashboard
  ✅ Work: /admin/dashboard/work
  ✅ News: /admin/dashboard/news
  ✅ Curriculum: /admin/dashboard/curriculum
  ✅ Navigation: /admin/navigation
  ✅ Footer: /admin/footer
  ✅ Home (if separate): /admin/dashboard/home

□ 기능 테스트:
  - Create/Read/Update/Delete
  - Drag & Drop (reorder)
  - Upload (images)
  - Preview (real-time)
  - Save & validation
```

---

#### Task 5.4: 보안 검증

```
□ XSS 테스트 (DevTools 콘솔):
  script<img src=x onerror="alert('XSS')">
  → 실행 안 됨 (DOMPurify 적용)

□ 인증 검증:
  - Admin 페이지 미인증 접근: 403
  - /admin/* 무단 접근 불가

□ 입력 검증:
  - 빈 필드 제출: 에러 메시지
  - 잘못된 타입: 에러 메시지
  - SQL injection 방지: 정상 작동
```

---

#### Task 5.5: 성능 지표 수집

```
현재 (Before):
- DB 쿼리 (Work projects): ~12 개 (N+1)
- API 응답 시간: ~150ms
- TypeScript 컴파일: X ms

개선 (After):
- DB 쿼리 (Work projects): ~1-2 개 (include)
- API 응답 시간: ~80ms (개선율: 47%)
- TypeScript 컴파일: Y ms
- 모듈화 개선: 파일 분할로 유지보수성 ↑

Document:
□ 성능 개선 리포트 작성
□ 지표 비교 표 생성
```

---

#### Task 5.6: Git 히스토리 검증

```bash
□ git log --oneline (Phase 1 커밋 확인)
  Expected commits:
  1. refactor: Split ProfessorDetailPage into 5 components
  2. refactor: Split NewsBlogModal into 4 components
  3. refactor: Extract WorkDetailPreviewRenderer block types
  4. refactor: Split WorkDetailPage into 4 sections
  5. refactor: Extract BlockListRenderer type renderers
  6. security: Strengthen XSS prevention with DOMPurify
  7. refactor: Remove any types, replace with concrete types
  8. perf: Add Prisma includes to eliminate N+1 queries

□ 각 커밋 상세 확인:
  git show <commit-hash>
  - Files 변경사항 적절
  - 라인 수 합리적
  - 코드 변경 의도 명확

□ 머지 전 리뷰:
  git diff main..HEAD (또는 current branch)
```

---

#### Task 5.7: 최종 통합 테스트

```
□ Cold build (clean):
  rm -rf .next node_modules/.cache
  npm run build
  → 성공 확인

□ Production build 시뮬레이션:
  npm run build
  npm start (if available)
  → 모든 페이지 접근 가능

□ 멀티 페이지 동시 로드:
  - 5개 탭 동시에 로드
  - 각 탭에서 상호작용
  - 메모리 누수 확인 (DevTools)

□ 다양한 브라우저/디바이스:
  - Chrome (desktop)
  - Firefox (desktop)
  - Safari (if available)
  - Mobile view (DevTools)
```

---

#### Task 5.8: 코드 품질 최종 검증

```
TypeScript:
✅ 0 errors (as required)
✅ 0 warnings (ideally)
✅ all any types removed (Task 3)

Build:
✅ 57/57 pages generated
✅ 0 build warnings
✅ Build time < X seconds

Performance:
✅ Database queries optimized
✅ API response times improved
✅ No console errors in dev

Security:
✅ XSS prevention working
✅ XSS vectors blocked
✅ Auth working properly

Documentation:
✅ Commit messages clear
✅ Code changes logical
✅ No commented-out code
```

---

#### Task 5.9: PHASE_1_COMPLETION_REPORT.md 작성

```markdown
□ 파일 생성: PHASE_1_COMPLETION_REPORT.md

내용:
- Executive Summary
  - 목표: 4.2/5 → 4.5/5
  - 달성: 4.2/5 → [실제 점수]

- 각 Task별 완료 현황
  - Task 1: 5개 파일 분할 완료
  - Task 2: DOMPurify 통합 완료
  - Task 3: 8 any 타입 제거 완료
  - Task 4: N+1 쿼리 최적화 완료

- 메트릭:
  - 파일 분할: 5개 → 18개 컴포넌트
  - 평균 크기: 770줄 → 150-200줄
  - DB 쿼리 include: 25% → 90%
  - XSS 방지: 기본 → Enterprise-grade
  - any 타입: 8개 → 0개

- 커밋 목록:
  1. ... (8개 모두 나열)

- 검증 결과:
  - Build: 57/57 ✅
  - TypeScript: 0 errors ✅
  - Performance: improved ✅
  - Security: enhanced ✅

- 다음 단계:
  - Phase 2: DB 쿼리 추가 최적화
  - Phase 3: 테스트 추가
```

---

#### Task 5.10: 최종 승인 및 배포 준비

```
□ 모든 변경사항 검토
□ Git 히스토리 최종 확인
□ 통합 테스트 최종 실행
□ 성능 메트릭 최종 기록

준비 상태:
✅ 코드 품질: 4.5/5
✅ 타입 안전: 5.0/5
✅ 보안: 4.5/5
✅ 성능: 4.2/5
✅ 모듈화: 8.5/10

배포 준비:
□ 모든 커밋 Push 준비
□ Pull Request 생성 (선택)
□ Production 환경 배포 준비
```

---

## 📊 Phase 1 진행 상황 추적

| Task | 예상 시간 | 상태 | 시작 | 완료 | 실제 시간 |
|------|---------|------|------|------|---------|
| Task 1: 파일 분할 | 8-10h | pending | - | - | - |
| Task 2: XSS 강화 | 4-5h | pending | - | - | - |
| Task 3: any 제거 | 2-3h | pending | - | - | - |
| Task 4: DB 최적화 | 6-8h | pending | - | - | - |
| Task 5: 최종 검증 | 2-3h | pending | - | - | - |
| **총계** | **30-35h** | pending | - | - | - |

---

## ✅ 컨텍스트 보존 체크리스트

### 세션이 바뀔 때마다 확인:

```
□ 이 문서 (PHASE_1_EXECUTION_PLAN.md) 열기
□ 현재 위치한 Task와 Subtask 확인
□ 마지막 git commit 메시지 확인
□ 현재 빌드 상태 확인 (npm run build)
□ 현재 TypeScript 상태 확인 (npx tsc --noEmit)
□ 다음 작업 Task/Subtask 읽기
□ 체크리스트 항목부터 시작
```

### 작업 중단 시:

```
□ 현재 진행 상황을 Task 체크리스트에 표시
□ git add (진행 중인 파일들)
□ git commit -m "WIP: [Task name] - [current subtask]"
□ PHASE_1_EXECUTION_PLAN.md 갱신 (진행률 표 업데이트)
```

### 작업 재개 시:

```
□ git log --oneline (마지막 커밋 확인)
□ npm run build (현재 상태 확인)
□ npx tsc --noEmit (타입 상태 확인)
□ 마지막 작업 Task의 다음 Subtask부터 시작
```

---

## 🎯 최종 목표

### Phase 1 완료 조건:

✅ **모든 변경사항 저장됨**
- 8개 커밋 생성
- 모든 코드 변경 Git에 기록
- 컨텍스트 손실 불가능

✅ **코드 품질 개선됨**
- 모듈화: 8/10 → 8.5/10
- 타입 안전: 4.7/5 → 5.0/5
- 보안: 4.0/5 → 4.5/5
- 성능: 3.8/5 → 4.2/5
- **종합: 4.2/5 → 4.5/5** 🎉

✅ **기존 코드 보호됨**
- 0 breaking changes
- 모든 API 동작 동일
- 모든 기능 100% 보존
- Build 57/57 pages (이전과 동일)
- TypeScript 0 errors (이전과 동일)

✅ **배포 준비 완료**
- 모든 테스트 통과
- 성능 개선 측정됨
- 보안 검증 완료
- 프로덕션 배포 가능

---

**이 문서는 컨텍스트 압축/손실을 방지하기 위한 마스터 계획입니다.**
**항상 이 문서를 참고하여 작업하세요.**
