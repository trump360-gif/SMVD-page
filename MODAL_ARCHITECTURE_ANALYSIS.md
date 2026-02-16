# 관리자 CMS: Work vs News&Event 모달 아키텍처 분석 리포트

**작성일:** 2026-02-16
**분석 대상:** Work 섹션 vs News&Event 섹션의 상세페이지 모달
**결론:** ✅ **완전히 분리된 각각의 모달** (약 95% 코드 중복)

---

## 📊 1. 파일 구조 & 위치

### Work 섹션
```
src/components/admin/work/
├── WorkBlogModal.tsx          ← 상세페이지 모달 (860줄)
├── WorkProjectModal.tsx       ← 아이템 생성/편집
├── WorkExhibitionModal.tsx    ← 전시 모달
├── BlockLayoutVisualizer.tsx  ← 공유 컴포넌트
├── BlockEditorPanel.tsx       ← 공유 컴포넌트
└── index.ts
```

### News&Event 섹션
```
src/components/admin/news/
├── NewsBlogModal.tsx          ← 상세페이지 모달 (847줄)
├── NewsArticleModal.tsx       ← 아이템 생성/편집
└── index.ts
```

---

## ✅ 결론: **완전히 분리된 2개의 독립 모달**

### 현황 분석

| 항목 | Work | News&Event | 공유 여부 |
|------|------|----------|---------|
| **모달 컴포넌트** | WorkBlogModal.tsx | NewsBlogModal.tsx | ❌ 분리됨 |
| **폴더 위치** | /admin/work/ | /admin/news/ | ❌ 분리됨 |
| **기본 구조** | 3탭 + 3중 에디터 | 3탭 + 3중 에디터 | ✅ 동일 |
| **블록 에디터 인프라** | useBlockEditor() | useBlockEditor() | ✅ 공유 |
| **컴포넌트 재사용** | BlockLayoutVisualizer | BlockLayoutVisualizer | ✅ 공유 |
| **프리뷰 렌더러** | WorkDetailPreviewRenderer | NewsDetailPreviewRenderer | ❌ 분리됨 |
| **상태 관리** | 각각 독립 | 각각 독립 | ❌ 분리됨 |

---

## 📄 2. 상세 구조 분석

### WorkBlogModal.tsx (860줄)

**구성:**
```typescript
interface WorkBlogModalProps {
  isOpen: boolean;
  project?: WorkProjectData | null;
  onClose: () => void;
  onSubmit: (data: CreateProjectInput | UpdateProjectInput) => Promise<void>;
}

// State (기본 정보)
- title, subtitle, category, tags, author, email, year, published, thumbnailImage
- editorContent (BlogContent)
- isSubmitting, error

// Block Editor Hook
- useBlockEditor(editorContent.blocks)
- blocks, selectedId, addBlock, updateBlock, deleteBlock, reorderBlocks
- undo, redo, canUndo, canRedo
- rowConfig (RowConfig[])

// Row Management Callbacks
- handleRowLayoutChange()         // 1/2/3 컬럼 변경
- handleAddRow()                  // 행 추가
- handleDeleteRow()               // 행 삭제
- handleAddBlockToRow()           // 행에 블록 추가
- handleDeleteBlock()             // 블록 삭제
- handleMoveBlockToRow()          // 행 간 블록 이동
- handleReorderRows()             // 행 순서 변경

// 3중 패널 레이아웃
┌─────────────────────────────────────────┐
│ Left 25%        │ Center 40%   │ Right 35%  │
├─────────────────────────────────────────┤
│BlockLayout      │BlockEditor   │ Live Preview│
│Visualizer       │Panel         │(Work)       │
│(row/block 리스) │(에디터)      │             │
└─────────────────────────────────────────┘
```

**탭 구조:**
```
Tab 1: Basic Info (타이틀, 카테고리, 태그, 작가, 이메일, 연도, 썸네일)
Tab 2: Content (Blocks) ← 3중 레이아웃
```

**주요 기능:**
- ✅ Undo/Redo (Ctrl+Z / Ctrl+Y)
- ✅ 블록 드래그 앤 드롭
- ✅ Row 레이아웃 관리 (1/2/3 컬럼)
- ✅ 실시간 미리보기 (WorkDetailPreviewRenderer)

---

### NewsBlogModal.tsx (847줄)

**구성:**
```typescript
interface NewsBlogModalProps {
  isOpen: boolean;
  article?: NewsArticleData | null;
  onClose: () => void;
  onSubmit: (data: CreateArticleInput | UpdateArticleInput) => Promise<void>;
}

// State (기본 정보)
- title, category, excerpt, publishedAt, published, thumbnailImage
- editorContent (BlogContent)
- isSubmitting, error
- isLoaded (추가: 데이터 로드 추적용)

// Block Editor Hook (WorkBlogModal과 동일)
- useBlockEditor(editorContent.blocks)
- blocks, selectedId, addBlock, updateBlock, deleteBlock, reorderBlocks
- undo, redo, canUndo, canRedo
- rowConfig (RowConfig[])

// Row Management Callbacks (WorkBlogModal과 동일)
- handleRowLayoutChange()
- handleAddRow()
- handleDeleteRow()
- handleAddBlockToRow()
- handleDeleteBlock()
- handleMoveBlockToRow()
- handleReorderRows()

// 3중 패널 레이아웃 (WorkBlogModal과 동일)
┌─────────────────────────────────────────┐
│ Left 25%        │ Center 40%   │ Right 35%  │
├─────────────────────────────────────────┤
│BlockLayout      │BlockEditor   │ Live Preview│
│Visualizer       │Panel         │(News)      │
└─────────────────────────────────────────┘
```

**탭 구조:**
```
Tab 1: Basic Info (타이틀, 카테고리, 요약, 발행일, 썸네일)
Tab 2: Content (Blocks) ← 3중 레이아웃
```

**주요 기능:**
- ✅ Undo/Redo (동일)
- ✅ 블록 드래그 앤 드롭 (동일)
- ✅ Row 레이아웃 관리 (동일)
- ✅ 실시간 미리보기 (NewsDetailPreviewRenderer)

---

## 🔄 3. 코드 중복 분석

### 거의 동일한 부분 (95% 일치)

| 코드 섹션 | 일치도 | 위치 |
|----------|-------|------|
| useBlockEditor Hook | 100% | Line 76-90 (Work) vs Line 67-81 (News) |
| handleRowLayoutChange | 100% | Line 106-117 vs Line 98-109 |
| handleAddRow | 100% | Line 120-122 vs Line 111-113 |
| handleDeleteRow | 100% | Line 125-143 vs Line 115-132 |
| handleAddBlockToRow | 100% | Line 146-179 vs Line 134-162 |
| handleDeleteBlock | 100% | Line 182-223 vs Line 164-201 |
| handleMoveBlockToRow | 100% | Line 226-283 vs Line 203-253 |
| handleReorderRows | 100% | Line 286-330 vs Line 255-299 |
| Keyboard Shortcuts | 100% | Line 422-437 vs Line 412-425 |
| 3중 레이아웃 JSX | 99% | Line 746-831 vs Line 735-818 |
| BlockLayoutVisualizer 호출 | 100% | Line 778-791 vs Line 767-780 |
| BlockEditorPanel 호출 | 100% | Line 797-805 vs Line 786-794 |
| Undo/Redo 버튼 UI | 100% | Line 750-771 vs Line 739-760 |

### 다른 부분 (차이점)

| 항목 | Work | News&Event |
|-----|------|----------|
| **State 필드** | title, subtitle, category, tags, author, email, year, thumbnailImage | title, category, excerpt, publishedAt, thumbnailImage |
| **Preview Renderer** | WorkDetailPreviewRenderer | NewsDetailPreviewRenderer |
| **Props Context** | WorkProjectContext | NewsArticleContext |
| **데이터 추적 Flag** | 없음 | isLoaded (Line 87) |
| **Sync 로직** | 단순 (Line 99-101) | 조건부 (Line 91-94) |
| **카테고리** | ['UX/UI', 'Motion', 'Branding', 'Game', 'Graphics'] | ['Notice', 'Event', 'Awards', 'Recruiting'] |

---

## 🏗️ 4. 공유되는 컴포넌트 & 훅

### 블록 에디터 인프라 (공유됨)

```typescript
// useBlockEditor.ts (공유)
// - blocks 상태 관리
// - addBlock, updateBlock, deleteBlock, reorderBlocks
// - undo, redo, canUndo, canRedo
// - resetBlocks (동기화용)

// BlockLayoutVisualizer.tsx (공유)
// - 블록 리스트 시각화
// - Row 관리 UI
// - 드래그 앤 드롭 처리
// - 양쪽 모달에서 동일하게 사용

// BlockEditorPanel.tsx (공유)
// - 선택된 블록의 속성 편집
// - 양쪽 모달에서 동일하게 사용
```

### Preview Renderer (분리됨)

```typescript
// WorkDetailPreviewRenderer.tsx
// - Work 페이지 스타일로 미리보기

// NewsDetailPreviewRenderer.tsx
// - News 페이지 스타일로 미리보기
```

---

## 💡 5. 아키텍처 평가

### ✅ 장점

1. **명확한 책임 분리**
   - Work와 News가 완전히 독립적으로 관리됨
   - 각 섹션의 특화된 UI/UX 가능
   - 한 섹션 변경이 다른 섹션에 영향 없음

2. **공유 인프라 활용**
   - useBlockEditor, BlockLayoutVisualizer, BlockEditorPanel 재사용
   - 블록 에디팅 로직 DRY (Don't Repeat Yourself)
   - 유지보수 용이

3. **섹션별 커스터마이제이션**
   - 다른 필드 (Work: tags, author / News: excerpt, publishedAt)
   - 다른 카테고리
   - 다른 Preview Renderer

### ⚠️ 문제점: 심각한 코드 중복

**현황:** 약 500줄 이상의 동일한 코드가 2곳에 존재

**중복 부분:**
```
- Row 관리 로직 (handleRowLayoutChange, handleAddRow, handleDeleteRow 등) 7개 함수
- 3중 레이아웃 JSX 구조
- Keyboard Shortcuts
- useBlockEditor 초기화
- Form 제출 로직 구조 (약간의 필드 차이만)
```

**위험성:**
- 🔴 버그 수정 시 2곳 모두 수정 필요
- 🔴 새 기능 추가 시 2곳에서 중복 구현
- 🔴 코드 리뷰 비용 2배
- 🔴 테스트 중복

---

## 🎯 6. 권장 사항

### Option 1: 현재 구조 유지 (최소 변경)

**언제:** 각 섹션의 특수성이 매우 클 때

**비용:**
- 구현: 최소 (이미 완료)
- 유지보수: 높음 (중복 관리)
- 확장성: 낮음

**상태:** ✅ 현재 상태

---

### Option 2: 공유 모달 컴포넌트로 통합 (권장)

**개념:**
```typescript
// 새 파일: src/components/admin/shared/BlogEditorModal.tsx
interface BlogEditorModalProps {
  isOpen: boolean;
  mode: 'work' | 'news';  // 섹션 모드
  item?: WorkProjectData | NewsArticleData | null;
  onClose: () => void;
  onSubmit: async (data: any) => Promise<void>;
  config: {
    fields: Field[],        // 기본 정보 필드들
    categories: string[],   // 섹션별 카테고리
    previewRenderer: React.Component,
  }
}

// Work & News 모달은 이 컴포넌트를 Wrapper로만 사용
const WorkBlogModal = (props) => (
  <BlogEditorModal mode="work" config={WORK_CONFIG} {...props} />
);

const NewsBlogModal = (props) => (
  <BlogEditorModal mode="news" config={NEWS_CONFIG} {...props} />
);
```

**장점:**
- ✅ 중복 제거 (약 500줄 감소)
- ✅ 한 곳에서 Row 관리 로직 유지보수
- ✅ 새 섹션 추가 시 쉬움
- ✅ 버그 수정 1회 = 모든 섹션 적용

**단점:**
- ❌ 초기 리팩토링 비용 (약 3-4시간)
- ❌ 구성이 복잡해질 수 있음

**구현 시간:** 3-4시간

---

### Option 3: 커스텀 Hooks로 Row 관리 로직 추출

**개념:**
```typescript
// src/components/admin/shared/BlockEditor/useRowManager.ts
function useRowManager(rowConfig: RowConfig[]) {
  return {
    handleRowLayoutChange,
    handleAddRow,
    handleDeleteRow,
    handleAddBlockToRow,
    handleDeleteBlock,
    handleMoveBlockToRow,
    handleReorderRows,
  }
}

// Work & News 모달에서 재사용
const { handleRowLayoutChange, handleAddRow, ... } = useRowManager(rowConfig);
```

**장점:**
- ✅ 현재 구조 유지 (최소 리팩토링)
- ✅ Row 로직만 중앙화
- ✅ 간단한 구현 (약 1-2시간)

**단점:**
- ⚠️ 나머지 중복 코드는 그대로 (3중 레이아웃, Keyboard Shortcuts 등)

**구현 시간:** 1-2시간

---

## 📊 7. 현재 상태 체크리스트

| 항목 | 상태 | 비고 |
|------|------|------|
| ✅ 두 모달 완전 분리 | 완료 | Work, News 각각 독립 관리 |
| ✅ 공유 인프라 활용 | 완료 | useBlockEditor, BlockLayoutVisualizer 재사용 |
| ✅ 3중 레이아웃 | 완료 | 양쪽 모두 구현됨 |
| ✅ Undo/Redo | 완료 | 양쪽 모두 구현됨 |
| ✅ Row 관리 | 완료 | 양쪽 모두 동일 로직 |
| ⚠️ 코드 중복 | 500줄+ | Row 관리 7개 함수, 3중 레이아웃 JSX |
| ⚠️ 테스트 중복 | 높음 | 같은 기능을 2곳에서 테스트해야 함 |

---

## 🎓 8. 코드 비교: 주요 차이점만

### 상태 필드 차이

```typescript
// WorkBlogModal
const [title, setTitle] = useState('');
const [subtitle, setSubtitle] = useState('');
const [category, setCategory] = useState('');
const [tags, setTags] = useState('');
const [author, setAuthor] = useState('');
const [email, setEmail] = useState('');
const [year, setYear] = useState('2025');
const [thumbnailImage, setThumbnailImage] = useState('');

// NewsBlogModal
const [title, setTitle] = useState('');
const [category, setCategory] = useState('Notice');
const [excerpt, setExcerpt] = useState('');
const [thumbnailImage, setThumbnailImage] = useState('/Group-27.svg');
const [publishedAt, setPublishedAt] = useState('');
```

### Preview Renderer 차이

```typescript
// WorkBlogModal (Line 816)
<WorkDetailPreviewRenderer
  blocks={blocks}
  rowConfig={rowConfig}
  projectContext={{
    title,
    author,
    email,
    heroImage: '',
    category,
  }}
/>

// NewsBlogModal (Line 805)
<NewsDetailPreviewRenderer
  blocks={blocks}
  rowConfig={rowConfig}
  articleContext={{
    title,
    category,
    publishedAt,
  }}
/>
```

### Sync 로직 차이

```typescript
// WorkBlogModal (항상 동기화)
useEffect(() => {
  setEditorContent((prev) => ({ ...prev, blocks, rowConfig }));
}, [blocks, rowConfig]);

// NewsBlogModal (조건부 동기화)
useEffect(() => {
  if (!isLoaded) return; // Skip during initial load
  setEditorContent((prev) => ({ ...prev, blocks, rowConfig }));
}, [blocks, rowConfig, isLoaded]);
```

---

## 📋 최종 요약

### 구조
- ✅ **완전히 분리된 2개의 모달** (각각 독립 관리)
- ✅ **공유하는 블록 에디터 인프라** (useBlockEditor, BlockLayoutVisualizer)
- ✅ **섹션별 Preview Renderer** (WorkDetailPreviewRenderer, NewsDetailPreviewRenderer)

### 코드 품질
- ⚠️ **약 500줄의 코드 중복** (Row 관리 로직, 3중 레이아웃)
- ⚠️ **버그 수정 시 2곳 수정 필요**
- ⚠️ **새 기능 추가 시 중복 구현**

### 추천 개선안
1. **즉시:** useRowManager Hook 추출 (1-2시간)
2. **중기:** BlogEditorModal 통합 (3-4시간, 선택사항)
3. **장기:** 테스트 커버리지 추가 (각 기능별)

