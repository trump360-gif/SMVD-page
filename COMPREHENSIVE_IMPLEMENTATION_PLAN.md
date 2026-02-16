# 🚀 SMVD CMS 종합 구현 계획서 (마스터 문서)

**작성일:** 2026-02-17
**최종 업데이트:** 2026-02-17
**프로젝트:** 숙명여자대학교 시각영상디자인과 웹사이트 CMS
**총 소요 시간:** 42-45시간 (6-7일)

---

## 📋 목차

1. [Executive Summary](#executive-summary)
2. [Phase 1: 코드 리뷰 필수 개선 (7-8h)](#phase-1)
3. [Phase 2: 홈페이지 반응형 구현 (16.5h)](#phase-2)
4. [Phase 3: 선택 개선 항목 (18-24h)](#phase-3)
5. [컨텍스트 압축 방지 전략](#컨텍스트-압축-방지-전략)
6. [변형 방지 검증 체크리스트](#변형-방지-검증-체크리스트)

---

## Executive Summary

### 🎯 목표
3개 Phase를 순차적으로 진행하여 프로젝트의 **안정성, 반응형 지원, 운영성을 동시에 개선**

### 📊 전체 구성

```
Phase 1 (7-8h):   코드 리뷰 필수 개선
  └─ Critical 오류 수정 (2h)
  └─ High 우선순위 구조 개선 (6h)

Phase 2 (16.5h):  홈페이지 반응형 구현
  └─ Git conflict 해결 & 기초 (1.25h)
  └─ 공통 컴포넌트 반응형 (2h)
  └─ 섹션별 반응형 (2.5h)
  └─ 테스트 & 최적화 (2h)

Phase 3 (18-24h): 선택 개선 항목
  └─ Sentry 에러 추적 (2-3h)
  └─ Admin UI/UX 개선 (4-6h)
  └─ 성능 모니터링 (4-5h)
  └─ E2E 테스트 (8-10h)

━━━━━━━━━━━━━━━━━━━━
총계: 42-45시간
```

### ⚠️ 중요: 변형 방지 규칙

이 문서는 **컨텍스트 압축으로 인한 내용 축소/변형을 방지**하기 위해 작성되었습니다.

**필독 규칙:**
1. 각 작업의 "변형 방지 체크리스트" 필독
2. 코드 예시는 **정확히 그대로 사용** (수정 금지)
3. 파일 경로/라인 번호 변경 시 먼저 파일 읽기
4. API 응답 포맷 변경 금지
5. 타입 정의 추가/삭제 금지
6. Prisma 스키마 변경 금지

---

# Phase 1: 코드 리뷰 필수 개선 (7-8시간)

## 개요

코드 리뷰 결과 발견된 **필수 개선 사항**. 버그 수정 및 구조 정리로 코드 품질을 72/100에서 80+/100으로 향상.

**시간: 7-8시간**
**우선순위: 🔴 높음 (Phase 2 전에 완료)**
**의존성: 없음 (독립적)**

---

## 1.1 Critical 오류 수정 (2시간)

### 1.1.1 debug console.log 제거 (10분)

**파일:** `src/app/api/admin/news/articles/[id]/route.ts`

**현재 상태:**
```typescript
// Line ~130
console.log('[news] Content validation...'); // ❌ 제거할 것
```

**작업:**
1. 파일 열기: `src/app/api/admin/news/articles/[id]/route.ts`
2. Line 130 근처에서 `console.log` 검색
3. 다음 라인 제거:
   ```typescript
   console.log('[news] Content validation...');
   ```
4. 테스트: `npm run dev` → 로그 확인

**검증:**
```bash
grep -n "console.log" src/app/api/admin/news/articles/[id]/route.ts
# 결과: (없음)
```

**변형 방지:** ✅ 로그만 제거, 로직 변경 없음

---

### 1.1.2 복잡한 검증 로직 함수화 (30분)

**파일:** `src/app/api/admin/news/articles/[id]/route.ts`

**현재 상태 (Line 140-150):**
```typescript
if (content && typeof content === 'object' && JSON.stringify(content) === '{}') {
  // 빈 객체 처리
  newContent = Prisma.JsonNull;
}
```

**문제점:**
- 가독성 낮음
- `JSON.stringify` 성능 미흡
- 재사용 불가능

**개선 방안:**

1. **유틸리티 함수 추가** (파일 상단에)
```typescript
// src/app/api/admin/news/articles/[id]/route.ts 상단에 추가

/**
 * 객체가 비어있는지 확인
 * @param obj - 확인할 객체
 * @returns true if object is empty
 */
const isEmpty = (obj: unknown): obj is Record<string, never> =>
  obj !== null && typeof obj === 'object' && Object.keys(obj).length === 0;
```

2. **기존 코드 수정** (Line 140-150)
```typescript
// Before:
if (content && typeof content === 'object' && JSON.stringify(content) === '{}') {
  newContent = Prisma.JsonNull;
}

// After:
if (isEmpty(content)) {
  newContent = Prisma.JsonNull;
}
```

**검증:**
```bash
npm run build  # TypeScript 컴파일 성공 확인
npm run dev    # 뉴스 수정 API 테스트
```

**변형 방지:**
- ✅ 로직 동일 (최적화만)
- ✅ 반환값 동일 (Prisma.JsonNull)
- ✅ 타입 변경 없음

---

### 1.1.3 Record<string, any> → 명시적 타입 (20분)

**파일:** `src/hooks/useWorkEditor.ts`

**현재 상태 (Line 23):**
```typescript
interface BlogEditorState {
  id?: string;
  title: string;
  category: string;
  description: string;
  content?: Record<string, any>;  // ❌ any 타입
  // ...
}
```

**찾기:**
```bash
grep -n "Record<string, any>" src/hooks/useWorkEditor.ts
# 결과: 23:  content?: Record<string, any>;
```

**개선 방안:**

1. **BlogContent 타입 확인**
```bash
grep -n "type BlogContent" src/types/
# 찾은 경로: src/types/api/blog.types.ts 또는 schemas/
```

2. **코드 수정**
```typescript
// Before:
content?: Record<string, any>;

// After:
content?: BlogContent;
```

3. **Import 확인**
```typescript
// 파일 상단에 있는지 확인:
import { BlogContent } from '@/types/...' // BlogContent import 있는지 확인
```

**TypeScript 검증:**
```bash
npx tsc --noEmit
# 결과: No errors
```

**변형 방지:**
- ✅ 타입만 명시적으로 변경
- ✅ 로직 변경 없음
- ✅ API 응답 포맷 변경 없음

---

### 1.1.4 XSS 방지 (ReactMarkdown) (45분)

**대상:** ReactMarkdown 사용하는 모든 컴포넌트

**찾기:**
```bash
grep -r "ReactMarkdown" src/components/public/ --include="*.tsx"
# 결과를 파악하고 각 파일 확인
```

**개선 방안:**

1. **패키지 설치**
```bash
npm install sanitize-html @types/sanitize-html
```

2. **유틸리티 함수 생성**
```typescript
// src/lib/sanitize.ts (새 파일)

import DOMPurify from 'isomorphic-dompurify';

/**
 * Markdown 콘텐츠에서 XSS 위험 제거
 * @param content - Markdown 텍스트
 * @returns 안전한 HTML
 */
export const sanitizeMarkdown = (content: string): string => {
  if (!content) return '';

  // DOMPurify로 HTML 태그 정제
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
};
```

3. **컴포넌트에서 사용**
```typescript
import { sanitizeMarkdown } from '@/lib/sanitize';

// Before:
<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {block.content}
</ReactMarkdown>

// After:
<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {sanitizeMarkdown(block.content)}
</ReactMarkdown>
```

**검증:**
```bash
npm run build  # 성공 확인
npm run dev    # 마크다운 렌더링 확인
```

**변형 방지:**
- ✅ 허용된 태그만 렌더링
- ✅ 기존 스타일 유지
- ✅ 콘텐츠 내용 변경 없음

---

## 1.2 High 우선순위 구조 개선 (6시간)

### 1.2.1 src/lib 폴더 구조 정리 (1시간)

**현재 구조:**
```
src/lib/
├── api-response.ts
├── auth.ts
├── cache.ts
├── db.ts
├── image/
│   ├── process.ts
│   └── validate.ts
├── logger.ts
├── upload.ts
└── validation.ts
```

**개선 후:**
```
src/lib/
├── auth/
│   ├── auth.ts         (기존 auth.ts 이동)
│   └── check.ts        (인증 체크 함수)
├── cache/
│   └── cache.ts        (기존 cache.ts 이동)
├── image/
│   ├── process.ts      (기존)
│   └── validate.ts     (기존)
├── validation/
│   ├── schemas.ts      (validation.ts 이동)
│   └── file.ts         (파일 검증)
├── utils/
│   ├── api-response.ts (기존 이동)
│   └── logger.ts       (기존 이동)
└── db.ts               (그대로)
```

**작업 단계:**

1. **폴더 생성**
```bash
mkdir -p src/lib/auth src/lib/cache src/lib/validation src/lib/utils
```

2. **파일 이동**
```bash
# auth 폴더
mv src/lib/auth.ts src/lib/auth/auth.ts

# validation 폴더
mv src/lib/validation.ts src/lib/validation/schemas.ts

# utils 폴더
mv src/lib/api-response.ts src/lib/utils/api-response.ts
mv src/lib/logger.ts src/lib/utils/logger.ts

# cache 폴더
mv src/lib/cache.ts src/lib/cache/cache.ts
```

3. **Import 경로 업데이트**

**영향받는 파일들:**
```bash
grep -r "from '@/lib/" src/ --include="*.ts" --include="*.tsx" | grep -E "(api-response|logger|auth|validation)" | cut -d: -f1 | sort -u
```

예상 파일:
- src/app/api/**/*.ts (모든 API 라우트)
- src/components/admin/**/*.tsx
- src/hooks/*.ts

**구체적인 업데이트:**
```typescript
// Before:
import { successResponse } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { checkAdminAuth } from '@/lib/auth';

// After:
import { successResponse } from '@/lib/utils/api-response';
import { logger } from '@/lib/utils/logger';
import { checkAdminAuth } from '@/lib/auth/auth';
```

4. **인덱스 파일 생성 (선택사항)**
```typescript
// src/lib/auth/index.ts
export { checkAdminAuth } from './auth';

// src/lib/utils/index.ts
export { successResponse, errorResponse } from './api-response';
export { logger } from './logger';
```

**검증:**
```bash
npm run build  # TypeScript 컴파일 성공 확인
npm run dev    # 모든 API 작동 확인
```

**변형 방지:**
- ✅ 폴더 구조만 변경 (파일 내용 무변)
- ✅ Import 경로 모두 업데이트 필수
- ✅ API 응답 포맷 변경 없음

---

### 1.2.2 모달 컴포넌트 분리 (2시간)

**대상:**
- `src/components/admin/news/NewsBlogModal.tsx` (719줄)
- `src/components/admin/work/WorkBlogModal.tsx` (650줄)

#### WorkBlogModal 예시 (모두 동일 방식)

**현재 구조 (WorkBlogModal.tsx - 650줄):**
```typescript
export function WorkBlogModal({ isOpen, onClose, onSubmit, project }: Props) {
  // State: projectData, blocks, activeTab
  // Handlers: 50줄
  // UI: 600줄
  //   - InfoTab 영역
  //   - ContentTab 영역 (블록 에디터)
  //   - AttachmentsTab 영역
}
```

**목표 구조:**
```
src/components/admin/work/
├── WorkBlogModal/
│   ├── index.tsx           (상태 + 탭 관리, ~150줄)
│   ├── InfoTab.tsx         (기본 정보 폼, ~100줄)
│   ├── ContentTab.tsx      (블록 에디터, ~250줄)
│   └── AttachmentsTab.tsx  (파일 관리, ~100줄)
```

**작업 단계:**

1. **폴더 생성**
```bash
mkdir -p src/components/admin/work/WorkBlogModal
mkdir -p src/components/admin/news/NewsBlogModal
```

2. **InfoTab 추출** (새 파일)
```typescript
// src/components/admin/work/WorkBlogModal/InfoTab.tsx

interface InfoTabProps {
  projectData: {
    title: string;
    category: string;
    description: string;
    // ...
  };
  onChange: (field: string, value: any) => void;
}

export function InfoTab({ projectData, onChange }: InfoTabProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* 제목 입력 */}
      <div>
        <label className="text-sm font-medium">제목</label>
        <input
          type="text"
          value={projectData.title}
          onChange={(e) => onChange('title', e.target.value)}
        />
      </div>

      {/* 카테고리 선택 */}
      <div>
        <label className="text-sm font-medium">카테고리</label>
        <select value={projectData.category} onChange={(e) => onChange('category', e.target.value)}>
          <option>UX/UI</option>
          <option>Graphic</option>
          {/* ... */}
        </select>
      </div>

      {/* 설명 입력 */}
      <div>
        <label className="text-sm font-medium">설명</label>
        <textarea
          value={projectData.description}
          onChange={(e) => onChange('description', e.target.value)}
        />
      </div>
    </div>
  );
}
```

3. **ContentTab 추출** (기존 블록 에디터 로직)
```typescript
// src/components/admin/work/WorkBlogModal/ContentTab.tsx

interface ContentTabProps {
  blocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
  // ...
}

export function ContentTab({ blocks, onBlocksChange }: ContentTabProps) {
  // 기존 블록 에디터 UI
  return (
    <div className="flex gap-4 h-full">
      {/* BlockLayoutVisualizer */}
      {/* BlockEditorPanel */}
      {/* Preview */}
    </div>
  );
}
```

4. **AttachmentsTab 추출**
```typescript
// src/components/admin/work/WorkBlogModal/AttachmentsTab.tsx

interface AttachmentsTabProps {
  attachments: Attachment[];
  onAttachmentsChange: (attachments: Attachment[]) => void;
}

export function AttachmentsTab({ attachments, onAttachmentsChange }: AttachmentsTabProps) {
  // 파일 관리 UI
  return (
    <div className="flex flex-col gap-4">
      {/* 파일 업로드 */}
      {/* 파일 목록 */}
    </div>
  );
}
```

5. **index.tsx에서 합성**
```typescript
// src/components/admin/work/WorkBlogModal/index.tsx

interface WorkBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProjectInput) => Promise<void>;
  project?: WorkProject;
}

export function WorkBlogModal({ isOpen, onClose, onSubmit, project }: WorkBlogModalProps) {
  const [projectData, setProjectData] = useState({...});
  const [blocks, setBlocks] = useState<Block[]>([...]);
  const [attachments, setAttachments] = useState<Attachment[]>([...]);
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'attachments'>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit({ projectData, blocks, attachments });
      onClose();
    } catch (error) {
      console.error('Submit failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-96">
        <div className="flex flex-col gap-4">
          {/* 탭 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('info')}
              className={activeTab === 'info' ? 'active' : ''}
            >
              기본 정보
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={activeTab === 'content' ? 'active' : ''}
            >
              콘텐츠
            </button>
            <button
              onClick={() => setActiveTab('attachments')}
              className={activeTab === 'attachments' ? 'active' : ''}
            >
              파일
            </button>
          </div>

          {/* 탭 내용 */}
          {activeTab === 'info' && (
            <InfoTab
              projectData={projectData}
              onChange={(field, value) => setProjectData({ ...projectData, [field]: value })}
            />
          )}
          {activeTab === 'content' && (
            <ContentTab
              blocks={blocks}
              onBlocksChange={setBlocks}
            />
          )}
          {activeTab === 'attachments' && (
            <AttachmentsTab
              attachments={attachments}
              onAttachmentsChange={setAttachments}
            />
          )}

          {/* 제출 버튼 */}
          <div className="flex gap-2 justify-end">
            <button onClick={onClose}>취소</button>
            <button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default WorkBlogModal;
```

6. **기존 import 경로 업데이트**
```bash
# 검색: WorkBlogModal를 사용하는 모든 파일
grep -r "WorkBlogModal" src/ --include="*.tsx" | grep -v "WorkBlogModal.tsx"

# 결과 파일들의 import 경로 업데이트:
// Before:
import WorkBlogModal from '@/components/admin/work/WorkBlogModal';

// After:
import WorkBlogModal from '@/components/admin/work/WorkBlogModal';
// (폴더 구조로 자동 인식)
```

**검증:**
```bash
npm run build  # 컴파일 성공 확인
npm run dev    # Work CMS 모달 테스트 - 모든 탭 클릭 확인
```

**변형 방지:**
- ✅ 기존 로직 변경 없음
- ✅ Props 인터페이스 동일
- ✅ API 호출 방식 변경 없음
- ✅ 데이터 구조 변경 없음

---

### 1.2.3 logger 사용 확대 (1시간)

**목표:** 현재 50% → 100% 모든 API에 logger 적용

**현황 분석:**
```bash
# logger 사용하는 API 수 확인
grep -r "logger\." src/app/api/ --include="*.ts" | wc -l
# 현재: ~20개

# 전체 API 수
ls src/app/api/admin/**/route.ts | wc -l
# 전체: ~40개
```

**작업:**

1. **logger 패턴 정의**
```typescript
// 각 API의 다음 위치에서:

// 1. 요청 시작 (optional)
logger.debug({ context: 'GET /api/work' }, 'Request received');

// 2. 처리 성공
logger.info({ context: 'GET /api/work' }, 'Projects fetched successfully');

// 3. 처리 실패
logger.error({ err: error, context: 'GET /api/work' }, 'Failed to fetch projects');
```

2. **미적용된 API 찾기**
```bash
grep -L "logger\." src/app/api/**/*.ts > /tmp/missing-logger.txt
cat /tmp/missing-logger.txt
```

3. **각 API에 logger 추가**

예시:
```typescript
// src/app/api/admin/sections/route.ts

export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.authenticated) return authResult.error;

    // ✅ 추가
    logger.info({ context: 'GET /api/admin/sections' }, 'Fetching all sections');

    const sections = await prisma.section.findMany({
      include: { exhibitionItems: true, workPortfolios: true },
    });

    // ✅ 추가
    logger.info({ context: 'GET /api/admin/sections', count: sections.length }, 'Sections fetched');

    return successResponse(sections);
  } catch (error) {
    // ✅ 추가
    logger.error({ err: error, context: 'GET /api/admin/sections' }, 'Failed to fetch sections');

    return errorResponse('Failed to fetch sections', 'FETCH_ERROR', 500);
  }
}
```

**검증:**
```bash
npm run dev
# 개발 서버 실행 후 콘솔에서 로그 확인:
# [INFO] [GET /api/admin/sections] Fetching all sections
# [INFO] [GET /api/admin/sections] Sections fetched
```

**변형 방지:**
- ✅ 로직 변경 없음 (로그만 추가)
- ✅ API 응답 변경 없음
- ✅ 기존 에러 처리 동일

---

### 1.2.4 파일 검증 강화 (0.75시간)

**파일:** `src/app/api/admin/upload/route.ts`

**현재 상태:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return errorResponse('No file provided', 'NO_FILE', 400);
    }

    // ❌ MIME 타입 검증 없음
    // ❌ 파일 크기 검증 없음
  } catch (error) {
    // ...
  }
}
```

**개선 방안:**

1. **검증 상수 추가** (파일 상단)
```typescript
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
```

2. **검증 함수 추가**
```typescript
/**
 * 파일이 유효한지 검증
 */
function validateFile(file: File): { valid: boolean; error?: string } {
  // MIME 타입 검증
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid MIME type: ${file.type}. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
    };
  }

  // 파일 크기 검증
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max: 10MB`,
    };
  }

  // 확장자 검증 (이중 검증)
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file extension: ${ext}. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  return { valid: true };
}
```

3. **API에서 사용**
```typescript
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return errorResponse('No file provided', 'NO_FILE', 400);
    }

    // ✅ 검증 추가
    const validation = validateFile(file);
    if (!validation.valid) {
      return errorResponse(
        validation.error || 'File validation failed',
        'INVALID_FILE',
        400
      );
    }

    // 기존 처리 계속...
    const processedImage = await processImage(await file.arrayBuffer());
    // ...
  } catch (error) {
    logger.error({ err: error, context: 'POST /api/admin/upload' }, 'Upload failed');
    return errorResponse('Upload failed', 'UPLOAD_ERROR', 500);
  }
}
```

**검증:**
```bash
# Test 1: 유효한 이미지 업로드 (성공)
curl -X POST http://localhost:3000/api/admin/upload \
  -F "file=@test.jpg"
# 결과: 200 OK

# Test 2: 무효한 MIME 타입 (실패)
curl -X POST http://localhost:3000/api/admin/upload \
  -F "file=@test.pdf"
# 결과: 400 Bad Request - Invalid MIME type

# Test 3: 너무 큰 파일 (실패)
# 10MB 이상 파일 업로드 시도
# 결과: 400 Bad Request - File too large
```

**변형 방지:**
- ✅ 기존 이미지 처리 로직 변경 없음
- ✅ API 응답 구조 동일
- ✅ 데이터 저장 방식 변경 없음

---

### 1.2.5 useMemo 추가 (1.25시간)

**대상 파일들 (성능 최적화):**

1. **BlockRenderer.tsx**
```typescript
// 현재:
const widths = calculateRowWidths(rowBlock);

// 개선:
const widths = useMemo(() => calculateRowWidths(rowBlock), [rowBlock]);
```

2. **CourseTable.tsx**
```typescript
// 현재:
const coursesByYear = courses.reduce((acc, course) => {
  // 계산 로직
  return acc;
}, {});

// 개선:
const coursesByYear = useMemo(() => {
  return courses.reduce((acc, course) => {
    // 계산 로직
    return acc;
  }, {});
}, [courses]);
```

3. **WorkSection.tsx**
```typescript
// 현재:
const filteredProjects = projects.filter(p =>
  selectedCategory === 'All' || p.category === selectedCategory
);

// 개선:
const filteredProjects = useMemo(() =>
  projects.filter(p =>
    selectedCategory === 'All' || p.category === selectedCategory
  ),
  [projects, selectedCategory]
);
```

**작업:**

1. **파일별로 성능 이슈 확인**
```bash
# BlockRenderer.tsx에서 계산 비용 높은 부분 찾기
grep -n "calculateRowWidths\|computeGridLayout" src/components/admin/shared/BlockEditor/BlockRenderer.tsx
```

2. **각 계산을 useMemo로 감싸기**
   - useMemo import 확인
   - dependency array 정확히 설정
   - 테스트

**검증:**
```bash
npm run build  # 컴파일 성공
npm run dev    # React DevTools Profiler에서 렌더링 횟수 확인
# 렌더링 횟수 감소 확인
```

**변형 방지:**
- ✅ 계산 결과 동일
- ✅ 렌더링 로직 변경 없음
- ✅ UI 표시 변경 없음

---

## Phase 1 검증 체크리스트

작업 완료 후 다음을 확인:

```
[ ] TypeScript 컴파일: npm run build
    결과: 0 errors

[ ] 개발 서버: npm run dev
    결과: 정상 시작

[ ] Critical 오류 수정 (1.1)
    [ ] console.log 제거 확인
    [ ] isEmpty() 함수 동작 확인
    [ ] Record<string, any> → BlogContent 변경 확인
    [ ] XSS 방지 적용 확인

[ ] 구조 개선 (1.2)
    [ ] lib 폴더 구조 정리 완료
    [ ] 모든 import 경로 업데이트 확인
    [ ] 모달 분리 완료
    [ ] logger 100% 적용 확인
    [ ] 파일 검증 강화 확인
    [ ] useMemo 추가 확인

[ ] 성능 측정
    [ ] Lighthouse 점수 (이전 대비)
    [ ] 빌드 시간 (변경 없어야 함)

[ ] Git 커밋
    git add .
    git commit -m "fix: Phase 1 - Code review improvements"
    git log --oneline -1  # 커밋 확인
```

---

# Phase 2: 홈페이지 반응형 구현 (16.5시간)

**시간: 16.5시간**
**의존성: Phase 1 완료 필요**
**우선순위: 🔴 높음**

## 개요

메인페이지의 모든 섹션을 모바일/태블릿/데스크톱에 맞게 반응형 적용.

**현재 상태:** 모바일 사용성 0%
**목표 상태:** 모바일/태블릿/데스크톱 완벽 지원

### Breakpoint 정의

```javascript
// src/constants/responsive.ts (새 파일)

export const BREAKPOINTS = {
  mobile: 640,    // 320px ~ 640px
  tablet: 768,    // 640px ~ 1024px
  desktop: 1024,  // 1024px+
  wide: 1440,     // 1440px+
};

export const PADDING = {
  mobile: 16,
  tablet: 24,
  desktop: 40,
};

export const GAP = {
  mobile: 20,
  tablet: 24,
  desktop: 40,
};
```

---

## 2.1 Git Conflict 해결 & 기초 인프라 (1.25시간)

### 2.1.1 Git Merge Conflict 해결 (15분)

**상태 확인:**
```bash
git status  # conflict 파일 확인
```

**예상 conflict 파일:**
- `src/app/(public)/page.tsx`
- `src/components/public/home/AboutSection.tsx`
- `src/components/public/home/WorkSection.tsx`

**해결 방법:**

각 파일을 열고:
1. `<<<<<<<` ~ `=======` 부분 검토
2. `=======` ~ `>>>>>>>` 부분 검토
3. 유지할 부분 선택 (일반적으로 HEAD 유지)

```bash
# 각 파일에서 conflict 해결 후:
git add src/app/(public)/page.tsx
git add src/components/public/home/AboutSection.tsx
git add src/components/public/home/WorkSection.tsx

# 커밋
git commit -m "chore: resolve merge conflicts before responsive implementation"
```

### 2.1.2 반응형 유틸리티 생성 (30분)

**파일:** `src/lib/responsive.ts` (새 파일)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '@/constants/responsive';

/**
 * 반응형 상태를 관리하는 훅
 * @returns {Object} { isMobile, isTablet, isDesktop }
 */
export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // SSR 시 에러 방지
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < BREAKPOINTS.mobile);
      setIsTablet(width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop);
      setIsDesktop(width >= BREAKPOINTS.desktop);
    };

    // 초기값 설정
    handleResize();

    // 리스너 등록
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, isTablet, isDesktop };
};

/**
 * CSS @media 쿼리 문자열 생성
 */
export const media = {
  mobile: '@media (max-width: 640px)',
  tablet: '@media (min-width: 640px) and (max-width: 1024px)',
  desktop: '@media (min-width: 1024px)',
};
```

**테스트:**
```bash
npm run dev
# 브라우저에서 페이지 열기
# DevTools에서 창 크기 조절하며 상태 변경 확인
```

### 2.1.3 Breakpoint 상수 정의 (15분)

**파일:** `src/constants/responsive.ts` (새 파일)

```typescript
export const BREAKPOINTS = {
  mobile: 640,    // 소형 폰
  tablet: 768,    // 태블릿
  desktop: 1024,  // 데스크톱
  wide: 1440,     // 와이드 데스크톱
};

// 각 breakpoint별 padding
export const PADDING = {
  mobile: 16,     // 모바일: 16px
  tablet: 24,     // 태블릿: 24px
  desktop: 40,    // 데스크톱: 40px
};

// 각 breakpoint별 gap
export const GAP = {
  mobile: 20,
  tablet: 24,
  desktop: 40,
};

// 각 breakpoint별 fontSize
export const FONT_SIZE = {
  mobile: {
    h1: 20,
    h2: 18,
    body: 14,
  },
  tablet: {
    h1: 28,
    h2: 24,
    body: 15,
  },
  desktop: {
    h1: 40,
    h2: 32,
    body: 16,
  },
};
```

**테스트:**
```bash
grep -n "BREAKPOINTS\|PADDING\|GAP" src/constants/responsive.ts
# 모두 정의되어 있는지 확인
```

### 2.1.4 성능 기준선 측정 (30분)

```bash
# 1. 빌드 성공 확인
npm run build
# 결과: 성공

# 2. 개발 서버 실행
npm run dev
# http://localhost:3000 접속

# 3. Lighthouse 측정
npx lighthouse http://localhost:3000 --output-path=/tmp/lighthouse-baseline.html --output-format json > /tmp/lighthouse-baseline.json

# 4. 점수 기록
cat /tmp/lighthouse-baseline.json | jq '.categories | {performance: .performance.score, accessibility: .accessibility.score, best_practices: .best-practices.score, seo: .seo.score}'
```

**기록할 값:**
```
현재 성능 점수 (반응형 작업 전):
- Performance: __/100
- Accessibility: __/100
- Best Practices: __/100
- SEO: __/100
```

---

## 2.2 공통 컴포넌트 반응형 (2시간)

(Header, VideoHero, Footer - 상세 구현은 문서 길이 제약으로 요약)

### 핵심 패턴:

**Header:**
```typescript
const headerStyle = {
  height: isMobile ? '64px' : isTablet ? '72px' : '80px',
  paddingLeft: isMobile ? '16px' : isTablet ? '24px' : '55.5px',
  paddingRight: isMobile ? '16px' : isTablet ? '24px' : '55.5px',
  gap: isMobile ? '12px' : isTablet ? '14px' : '18px',
};
```

**VideoHero:**
```typescript
const heroStyle = {
  height: isMobile ? '40vh' : isTablet ? '50vh' : '949px',
  marginBottom: isMobile ? '24px' : isTablet ? '32px' : '40px',
};
```

**Footer:**
```typescript
const footerStyle = {
  padding: isMobile ? '32px 16px' : isTablet ? '48px 24px' : '81px 40px',
  fontSize: isMobile ? '14px' : isTablet ? '15px' : '16px',
};
```

---

## 2.3 섹션별 반응형 (2.5시간)

### ExhibitionSection:
```typescript
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
  gap: isMobile ? '20px' : isTablet ? '24px' : '40px',
};
```

### AboutSection:
```typescript
const fontSize = isMobile ? '20px' : isTablet ? '28px' : '40px';
const svgSize = isMobile ? '24px' : isTablet ? '28px' : '36px';
```

### WorkSection (가장 복잡):
```typescript
const containerStyle = {
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  gap: isMobile ? '24px' : isTablet ? '32px' : '60px',
};

const sidebarStyle = {
  width: isMobile ? '100%' : isTablet ? '120px' : '200px',
  flexShrink: 0,
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
  gap: isMobile ? '20px' : '60px',
};
```

---

## 2.4 테스트 & 최적화 (2시간)

### 테스트 체크리스트:

```
[ ] 모바일 테스트 (375px - iPhone SE)
    [ ] Header 레이아웃 확인
    [ ] VideoHero 높이 적절한지 확인
    [ ] ExhibitionSection 1컬럼으로 보이는지 확인
    [ ] 텍스트 가독성 확인
    [ ] 이미지 비율 유지되는지 확인
    [ ] 터치 인터랙션 작동 확인

[ ] 태블릿 테스트 (768px - iPad)
    [ ] ExhibitionSection 2컬럼 확인
    [ ] WorkSection 사이드바 레이아웃 확인
    [ ] 텍스트 크기 적절한지 확인

[ ] 데스크톱 테스트 (1440px)
    [ ] 기존 상태와 동일한지 확인
    [ ] 레이아웃 변경 없음 확인

[ ] Lighthouse 최종 측정
    npm run build
    npx lighthouse http://localhost:3000 --output-json > /tmp/lighthouse-final.json

[ ] 성능 비교
    반응형 전: Performance __/100
    반응형 후: Performance __/100
    (동일하거나 향상되어야 함)
```

---

## Phase 2 검증 체크리스트

```
[ ] Git conflict 해결 완료
[ ] 반응형 유틸리티 생성 확인
[ ] Breakpoint 상수 정의 확인
[ ] 모든 섹션 반응형 적용 완료
[ ] 모바일/태블릿/데스크톱 테스트 완료
[ ] TypeScript 컴파일: npm run build (0 errors)
[ ] Lighthouse 점수 측정 완료
[ ] Git 커밋: git commit -m "feat: Add responsive design to homepage"
```

---

# Phase 3: 선택 개선 항목 (18-24시간)

## 개요

4가지 선택 개선 항목을 순차적으로 진행.

---

## 3.1 Sentry 에러 추적 (2-3시간)

(OPTIONAL_IMPROVEMENTS_REPORT.md 참조 - Phase 3 3번째 항목)

**주요 작업:**
- Sentry DSN 설정
- 서버/클라이언트 통합
- Error Boundary 추가
- Alert 규칙 설정

---

## 3.2 Admin UI/UX 개선 (4-6시간)

(OPTIONAL_IMPROVEMENTS_REPORT.md 참조 - Phase 3 4번째 항목)

**주요 작업:**
- Toast 시스템
- 에러 메시지 표시
- 로딩 스피너
- 접근성 개선

---

## 3.3 성능 모니터링 (4-5시간)

(OPTIONAL_IMPROVEMENTS_REPORT.md 참조 - Phase 3 2번째 항목)

**주요 작업:**
- 번들 분석기
- Lighthouse CI
- Web Vitals

---

## 3.4 E2E 테스트 (8-10시간)

(OPTIONAL_IMPROVEMENTS_REPORT.md 참조 - Phase 3 1번째 항목)

**주요 작업:**
- Playwright 설정
- 인증 테스트
- 공개 페이지 테스트
- Admin CRUD 테스트

---

# 컨텍스트 압축 방지 전략

## 문제 상황

대규모 작업을 진행하다보면 다음 문제가 발생합니다:

```
┌─────────────────────────────────┐
│ 처음 계획:                       │
│ Phase 1 (7-8h) +                │
│ Phase 2 (16.5h) +               │
│ Phase 3 (18-24h)                │
│ = 42-45시간                     │
└─────────────────────────────────┘
             ↓ 세션 진행
┌─────────────────────────────────┐
│ 컨텍스트 압축으로 인한 축소:    │
│ Phase 1 (완료) → 요약만 유지    │
│ Phase 2 (진행 중) → 일부만 유지 │
│ Phase 3 (미시작) → 상세 손실    │
│                                 │
│ ⚠️ 원래 계획 훼손 위험!         │
└─────────────────────────────────┘
```

## 해결책

### 1. 문서 분리 전략

**이 문서 (마스터 문서):**
- 전체 개요 + 각 Phase 요약
- 변형 방지 체크리스트
- 파일 경로 + 라인 번호 (정확한 위치)

**링크된 상세 문서:**
- `OPTIONAL_IMPROVEMENTS_REPORT.md` (Phase 3 상세)
- `CODE_REVIEW_ANALYSIS.md` (분석 결과)
- TaskMaster (진행 상황 추적)

### 2. 진행 상황 추적

**TaskMaster 사용:**
```bash
# 작업 상태 확인
tm status

# 특정 작업 보기
tm get 1  # Phase 1

# 진행률 확인
tm progress
```

**매 세션 시작마다:**
```bash
# 어디까지 했는지 확인
tm get-tasks --status in-progress

# 다음 할 일 확인
tm next-task
```

### 3. 세션별 체크포인트

**세션 1 (6시간):**
```
[ ] Phase 1 작업 1.1 완료 → TaskMaster status: done
[ ] Phase 1 작업 1.2 완료 → TaskMaster status: done
[ ] git commit "Phase 1 complete"
```

**세션 2 (6시간):**
```
[ ] 이전 진행 상황 TaskMaster로 확인
[ ] Phase 2 작업 2.1 완료 → TaskMaster status: done
[ ] Phase 2 작업 2.2-2.4 진행 → TaskMaster status: in-progress
[ ] git commit "Phase 2 in progress"
```

### 4. 컨텍스트 축약 방지 (중요!)

**각 작업 시작 전:**
```
1. 해당 Phase의 마스터 문서 해당 섹션 읽기
2. 변형 방지 체크리스트 확인
3. 파일 경로 + 라인 번호 정확히 확인
4. 코드 예시는 그대로 복사 (수정 금지)
5. TaskMaster status 업데이트
```

**작업 완료 후:**
```
1. 모든 파일 변경 로그 기록
2. 변형 방지 체크리스트 재확인
3. git diff로 변경 사항 확인
4. git commit (상세한 메시지)
5. TaskMaster status: done으로 표기
```

---

# 변형 방지 검증 체크리스트

작업할 때마다 **반드시** 확인할 체크리스트:

## Phase 1: 코드 리뷰 필수 개선

### Critical 오류 (1.1)
```
1.1.1 console.log 제거
[ ] 파일 경로 정확함: src/app/api/admin/news/articles/[id]/route.ts
[ ] 라인 번호 근처 확인 (Line ~130)
[ ] console.log 제거 후 로직 미변
[ ] 다른 console.log는 없는지 확인

1.1.2 isEmpty() 함수화
[ ] 파일 경로 정확함
[ ] isEmpty() 함수 타입 정확함 (type guard)
[ ] 기존 로직과 결과 동일한지 확인
[ ] JSON.stringify 제거 (성능)

1.1.3 Record<string, any> 제거
[ ] useWorkEditor.ts Line 23 정확한지 확인
[ ] BlogContent 타입 import 있는지 확인
[ ] 타입 변경 후 컴파일 성공 (npx tsc --noEmit)
[ ] API 응답 변경 없음

1.1.4 XSS 방지
[ ] sanitize-html 패키지 설치 확인
[ ] DOMPurify import 정확함
[ ] ALLOWED_TAGS, ALLOWED_ATTR 설정 검토
[ ] ReactMarkdown 사용처 모두 적용
[ ] npm run build 성공
```

### 구조 개선 (1.2)
```
1.2.1 lib 폴더 정리
[ ] 폴더 생성 완료: auth/, cache/, validation/, utils/
[ ] 파일 이동 완료
[ ] import 경로 모두 업데이트
[ ] npm run build 성공
[ ] npm run dev 정상 작동

1.2.2 모달 분리
[ ] 폴더 생성: WorkBlogModal/, NewsBlogModal/
[ ] 3개 탭 컴포넌트 파일 생성
[ ] index.tsx에서 합성
[ ] Props 인터페이스 동일함
[ ] npm run build 성공
[ ] 모달 테스트 (모든 탭 클릭)

1.2.3 logger 확대
[ ] 모든 API에 logger.info 적용
[ ] 모든 API에 logger.error 적용
[ ] 로그 형식 일관됨
[ ] npm run dev 콘솔 로그 확인

1.2.4 파일 검증 강화
[ ] ALLOWED_MIME_TYPES 상수 정의
[ ] MAX_FILE_SIZE 상수 정의 (10MB)
[ ] validateFile() 함수 작동
[ ] API에 검증 로직 추가
[ ] curl 테스트로 검증 확인

1.2.5 useMemo 추가
[ ] BlockRenderer.tsx에 useMemo 추가
[ ] CourseTable.tsx에 useMemo 추가
[ ] WorkSection.tsx에 useMemo 추가
[ ] dependency array 정확함
[ ] npm run build 성공
```

## Phase 2: 홈페이지 반응형

```
2.1 기초 인프라
[ ] Git conflict 해결 완료
[ ] src/lib/responsive.ts 생성
[ ] src/constants/responsive.ts 생성
[ ] useResponsive() 훅 테스트
[ ] Lighthouse 기준선 측정

2.2-2.4 반응형 구현
[ ] Header 반응형 완료
    [ ] 모바일 64px, 태블릿 72px, 데스크톱 80px
    [ ] padding 모두 조정
    [ ] 콘솔 에러 없음
[ ] VideoHero 반응형 완료
    [ ] 모바일 40vh, 태블릿 50vh, 데스크톱 949px
[ ] Footer 반응형 완료
[ ] ExhibitionSection 반응형 완료
    [ ] 모바일 1컬럼, 태블릿 2컬럼, 데스크톱 3컬럼
    [ ] 이미지 비율 유지됨
[ ] AboutSection 반응형 완료
    [ ] fontSize 조정 확인
    [ ] SVG 크기 조정 확인
[ ] WorkSection 반응형 완료
    [ ] 모바일 column layout
    [ ] 태블릿+ row layout
    [ ] 카테고리 버튼 크기 조정

모바일 테스트 (375px)
[ ] 모든 텍스트 읽을 수 있음
[ ] 이미지 비율 깨지지 않음
[ ] 버튼 터치 가능 (최소 44px)
[ ] 스크롤 부드러움

태블릿 테스트 (768px)
[ ] 레이아웃 2컬럼+ 확인
[ ] 텍스트 크기 적절함
[ ] 여백 균형잡혀 있음

데스크톱 테스트 (1440px)
[ ] 기존 상태와 동일
[ ] 레이아웃 변경 없음

최종 검증
[ ] npm run build 성공
[ ] Lighthouse 점수 동일 이상
[ ] git diff 확인 (예상된 변경만)
```

## Phase 3: 선택 개선 항목

```
3.1 Sentry
[ ] Sentry 계정 생성 (DSN 획득)
[ ] npm install @sentry/nextjs
[ ] src/instrumentation.ts 작성
[ ] Error Boundary 추가
[ ] Slack 알림 설정
[ ] npm run build 성공

3.2 Admin UI/UX
[ ] Toast 컴포넌트 생성
[ ] 모든 모달에 에러 메시지 영역 추가
[ ] 스피너 컴포넌트 생성
[ ] 접근성 개선 (라벨, aria-label)
[ ] npm run dev에서 UI 확인

3.3 성능 모니터링
[ ] 번들 분석기 설치
[ ] npm run analyze 실행
[ ] Lighthouse CI 설정
[ ] Web Vitals 구현
[ ] 메트릭 수집 확인

3.4 E2E 테스트
[ ] Playwright 설정
[ ] playwright.config.ts 생성
[ ] 테스트 파일 작성
[ ] npm run test 실행
[ ] 모든 테스트 통과
```

---

## 최종 검증 (모든 Phase 완료 후)

```
[ ] Git 로그 확인
    git log --oneline | head -20
    모든 Phase 커밋이 있는지 확인

[ ] 전체 빌드
    npm run build
    결과: 49/49 pages, 0 errors, 0 warnings

[ ] TypeScript
    npx tsc --noEmit
    결과: 0 errors

[ ] 성능 비교
    Phase 2 전 Lighthouse: Performance __/100
    Phase 2 후 Lighthouse: Performance __/100
    Phase 3 후 Lighthouse: Performance __/100

[ ] 문서 정리
    COMPREHENSIVE_IMPLEMENTATION_PLAN.md 최종 업데이트
    커밋 기록 완전함
    TaskMaster 모든 작업 done 표기
```

---

## 참고 자료

- **코드 리뷰 결과:** `CODE_REVIEW_ANALYSIS.md`
- **홈페이지 반응형:** 상기 Phase 2 섹션
- **선택 개선 상세:** `OPTIONAL_IMPROVEMENTS_REPORT.md`
- **작업 추적:** TaskMaster (`mcp__taskmaster__*` 명령어)

---

**이 문서는 컨텍스트 압축을 방지하기 위해 작성되었습니다.**
**각 작업 시작 전 해당 Phase의 체크리스트를 반드시 확인하세요.**

**작성:** 2026-02-17
**최종 검토:** 필요
**승인:** 대기 중
