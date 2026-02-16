# CMS 모달 본문 내용 통합 분석 리포트

**작성일**: 2026-02-16
**상태**: ✅ 빌드 성공 (모든 이미지 파일 존재, TypeScript 0 에러)

---

## 1️⃣ 현재 상태 분석

### 빌드 결과
```
✅ Next.js 16.1.6 Turbopack 빌드 성공
✅ 모든 경로 생성 완료 (46개 정적/동적 페이지)
✅ TypeScript 0 에러
✅ API 라우트 32개 정상 작동
```

### 이미지 파일 상태
```
✅ /public/images/work/knot/hero.png
✅ /public/images/work/knot/gallery-1.png ~ gallery-9.png (9개)
✅ /public/images/work/knot/text-below.png
→ 총 11개 이미지 파일 모두 존재
```

---

## 2️⃣ 현재 데이터 흐름 분석

### 데이터베이스 저장 구조 (WorkProject)
```typescript
// DB Schema (Prisma)
model WorkProject {
  id: String
  title: String                    // "STUDIO KNOT"
  subtitle: String                 // "노하린, 2025"
  category: String                 // "UX/UI" 등
  description: String              // ⚠️ 현재: JSON serialized BlogContent
  heroImage: String                // "/images/work/knot/hero.png"
  content: Json                    // ✅ 신규: BlogContent 객체 (블록 형식)
  galleryImages: Json              // 갤러리 이미지 배열
  published: Boolean
}

// DB 현재 STUDIO KNOT 데이터
{
  description: "(JSON 문자열 또는 마크다운 텍스트)",
  content: {
    version: "1.0",
    blocks: [
      { type: "hero-image", ... },
      { type: "work-title", ... },
      { type: "text", ... },
      { type: "work-gallery", ... }
    ],
    rowConfig: [
      { layout: 1, blockCount: 1 },
      { layout: 2, blockCount: 2 },
      { layout: 1, blockCount: 1 }
    ]
  }
}
```

### 공개 페이지 렌더링 흐름 (`/work/9`)

```
1. 사용자가 /work/9 방문
   ↓
2. getProjectFromDB() 호출
   - DB에서 workProject 조회 (slug 또는 id로)
   - project.content 추출 (BlogContent)
   ↓
3. WorkDetailPage 컴포넌트 렌더링
   - parseBlockContent() 함수로 content 파싱
     • hero-image 블록 → hero URL 추출
     • work-title 블록 → 좌측 타이틀/저자 정보
     • text 블록 → 우측 본문 내용
     • work-gallery 블록 → 갤러리 이미지 배열
   ↓
4. 최종 HTML 렌더링
   - 2칼럼 레이아웃 (좌: 제목, 우: 본문)
   - 갤러리 섹션 (9개 이미지)
```

**현재 공개 페이지 렌더링 예시**:
```
┌─────────────────────────────────────┐
│  STUDIO KNOT Hero Image             │
├─────────────────┬─────────────────┤
│ Title: STUDIO   │ 본문: STUDIO    │
│ KNOT (60px)     │ KNOT는 입지     │
│ Author:         │ 않는 옷에...    │
│ 노하린          │ (18px 텍스트)   │
│ Email: ...      │                 │
├─────────────────┴─────────────────┤
│  갤러리 (2칼럼, 9개 이미지)       │
├─────────────────────────────────────┤
│ gallery-1.png | gallery-2.png       │
│ gallery-3.png | gallery-4.png       │
│ ... (총 9개)                        │
└─────────────────────────────────────┘
```

### CMS 모달 편집 흐름 (WorkBlogModal)

```
1. 관리자가 "Edit" 클릭
   ↓
2. WorkBlogModal isOpen=true
   - project 데이터 로드
   - editorContent state 설정
   ↓
3. 두 가지 탭 표시:

   [Info 탭] → 기본 정보 입력
   - title, subtitle, category, tags
   - author, email, year
   - thumbnailImage

   [Content 탭] → 블록 편집기
   - BlockEditor (3-패널 구조)
   - 블록 선택/추가/수정/삭제
   - 드래그앤드롭 순서 변경
   - rowConfig 레이아웃 조정

   ↓
4. 저장 시
   - Zod 검증 → 기본 정보 검증
   - content (BlogContent) 직렬화
   - API POST/PUT 호출
   - DB 저장 (content 필드 업데이트)
```

---

## 3️⃣ "본문 내용을 CMS 모달에 옮기기" - 의도 분석 및 가능한 해석

### 🤔 가능한 해석들

| 해석 | 의미 | 현재 상태 | 가능성 |
|------|------|---------|--------|
| **A** | "Content" 탭에 공개 페이지와 동일한 미리보기 표시 | 미리보기는 별도 iframe에서만 제공 | ✅ 가능 (권장) |
| **B** | text 블록의 본문 내용을 전용 편집기로 표시 | 현재는 BlockEditor에 통합 | ✅ 가능 (부분) |
| **C** | description 필드를 별도로 관리하는 "본문" 탭 추가 | description은 현재 사용 X | ✅ 가능 (신규) |
| **D** | 공개 페이지 HTML을 모달 내에 렌더링 | 별도 페이지에서만 볼 수 있음 | ✅ 가능 (복잡) |

---

## 4️⃣ 현재 코드 구조 상세 분석

### WorkBlogModal 구조 (src/components/admin/work/WorkBlogModal.tsx)

```typescript
// 상태 관리 구조
const [activeTab, setActiveTab] = useState<'info' | 'content'>('info');

// 기본 정보
const [title, setTitle] = useState('');
const [subtitle, setSubtitle] = useState('');
const [category, setCategory] = useState('');
const [author, setAuthor] = useState('');
const [email, setEmail] = useState('');

// BlockEditor 통합
const [editorContent, setEditorContent] = useState<BlogContent>({
  blocks: [],
  version: '1.0',
});

// useBlockEditor 훅 (블록 상태 관리)
const {
  blocks,
  selectedId,
  resetBlocks,
  addBlock,
  updateBlock,
  deleteBlock,
  reorderBlocks,
  getBlockCount,
} = useBlockEditor(editorContent.blocks);

// rowConfig (행 레이아웃 설정)
const [rowConfig, setRowConfig] = useState<RowConfig[]>(
  editorContent.rowConfig || []
);
```

### 동기화 메커니즘

```typescript
// 1️⃣ 블록 배열이 변경되면 editorContent 업데이트
useEffect(() => {
  setEditorContent((prev) => ({ ...prev, blocks, rowConfig }));
}, [blocks, rowConfig]);

// 2️⃣ editorContent.blocks가 로드되면 useBlockEditor와 동기화
useEffect(() => {
  if (editorContent.blocks && editorContent.blocks.length > 0) {
    console.log('[WorkBlogModal] Syncing blocks from editorContent:',
                editorContent.blocks.length);
    resetBlocks(editorContent.blocks);
  }
}, [editorContent.blocks, resetBlocks]);

// 3️⃣ 프로젝트 로드 시 모든 상태 초기화
useEffect(() => {
  if (isOpen) {
    if (project) {
      setTitle(project.title);
      setSubtitle(project.subtitle);

      // 우선순위: project.content (신규 블록 형식)
      if (project.content && typeof project.content === 'object' && 'blocks' in project.content) {
        const content = project.content as BlogContent;
        setEditorContent(content);
        setRowConfig(content.rowConfig || []);
      } else {
        // 폴백: 레거시 description → BlogContent 변환
        setEditorContent(
          parseWorkProjectContent(
            project.description,
            project.galleryImages as string[] | undefined,
            project.heroImage,
            project.title,
            project.author,
            project.email
          )
        );
      }
    }
  }
}, [isOpen, project]);
```

### 저장 로직

```typescript
const handleSubmit = async () => {
  // 1️⃣ Zod 검증 (기본 정보)
  const result = workBlogInputSchema.safeParse({
    title: title.trim(),
    subtitle: subtitle.trim(),
    category,
    author: author.trim(),
    email: email.trim(),
    year,
  });

  // 2️⃣ heroImage 추출
  const heroBlock = editorContent.blocks.find(
    (b) => b.type === 'hero-image' || b.type === 'hero-section'
  ) as (HeroImageBlock | HeroSectionBlock) | undefined;
  const extractedHeroImage = heroBlock?.url ?? '';

  // 3️⃣ description 직렬화 (레거시 호환성)
  const data: CreateProjectInput = {
    title: title.trim(),
    subtitle: subtitle.trim(),
    category,
    tags: parsedTags,
    author: author.trim(),
    email: email.trim(),
    description: serializeContent(editorContent),  // ⚠️ 블록을 JSON으로 변환
    heroImage: extractedHeroImage,
    thumbnailImage: thumbnailImage.trim(),
    published,
    content: editorContent,  // ✅ 신규: 블록 객체 직접 저장
  };

  // 4️⃣ API 호출
  await onSubmit(data);
};
```

---

## 5️⃣ 본문 내용 통합 구현 옵션 분석

### 🟢 Option A: "미리보기 패널" 추가 (BEST - 권장)

**목표**: Content 탭에 좌측(편집기) + 우측(미리보기)의 2-패널 레이아웃

**구현 방식**:
```typescript
// WorkBlogModal.tsx 수정
const [contentLayout, setContentLayout] = useState<'editor-only' | 'editor-preview'>('editor-only');

return (
  <>
    {/* Content 탭: 2-패널 레이아웃 */}
    {activeTab === 'content' && contentLayout === 'editor-preview' && (
      <div className="flex gap-4 h-full p-6">
        {/* 좌측: BlockEditor */}
        <div className="flex-1 overflow-auto">
          <BlockEditorPanel {...editorProps} />
        </div>

        {/* 우측: 실시간 미리보기 */}
        <div className="flex-1 overflow-auto border-l bg-gray-50 p-4">
          <WorkDetailPreviewRenderer
            content={editorContent}
            rowConfig={rowConfig}
          />
        </div>
      </div>
    )}
  </>
);
```

**장점**:
- ✅ 공개 페이지와 동일한 렌더링 확인 가능
- ✅ 실시간 미리보기 (블록 추가/수정 즉시 반영)
- ✅ UI 친화적 (전문 CMS 같은 모습)
- ✅ 사용자 체험 향상

**구현 시간**: ~30분
**복잡도**: 중간 (미리보기 패널 추가만 하면 됨)

**필요한 수정**:
1. WorkBlogModal.tsx에 우측 패널 추가
2. BlockEditorPanel 크기 조정 (flex-1)
3. WorkDetailPreviewRenderer props 확인
4. 토글 버튼 추가 (전체/분할 보기)

---

### 🟡 Option B: "본문 편집 탭" 추가 (ALTERNATIVE)

**목표**: text 블록의 내용만 별도 탭에서 WYSIWYG 편집

**구현 방식**:
```typescript
// 새로운 탭 추가
const tabs = [
  { key: 'info' as const, label: 'Basic Info' },
  { key: 'content' as const, label: 'Content (Blocks)' },
  { key: 'description' as const, label: 'Body Text' },  // ← 신규
];

// description 탭 내용
{activeTab === 'description' && (
  <div className="space-y-4 max-w-3xl p-6">
    <label className="block text-sm font-medium text-gray-700">
      Main Body Text (displayed in right column on public page)
    </label>

    <textarea
      value={mainBodyText}
      onChange={(e) => setMainBodyText(e.target.value)}
      className="w-full h-96 p-4 border rounded-lg font-mono text-sm"
      placeholder="Enter the main body text that appears in the right column..."
    />

    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
      <p className="text-sm text-blue-800 font-medium mb-2">Preview:</p>
      <div className="bg-white p-4 rounded border border-blue-100 text-sm whitespace-pre-wrap">
        {mainBodyText || '(Empty)'}
      </div>
    </div>
  </div>
)}
```

**장점**:
- ✅ 본문만 따로 편집 가능
- ✅ 간단한 UI
- ✅ 마크다운 지원 가능

**단점**:
- ❌ 블록 기반 구조와 분리됨
- ❌ 일관성 문제 (BlockEditor와 분리된 입력)

**구현 시간**: ~20분
**복잡도**: 낮음

---

### 🔴 Option C: "description 필드" 재활용 (NOT RECOMMENDED)

**목표**: 레거시 description 필드를 "본문" 필드로 명시적 관리

**문제점**:
- ❌ description은 이미 블록 JSON 직렬화로 사용 중
- ❌ 두 가지 용도로 사용하면 충돌 가능
- ❌ 향후 유지보수 복잡성 증대

**권장하지 않음** ❌

---

### 🔵 Option D: "공개 페이지 HTML 임베드" (ADVANCED)

**목표**: iframe으로 공개 페이지를 모달 내에 표시

**구현 방식**:
```typescript
// iframe으로 /work/[id] 페이지 렌더링
<div className="flex-1">
  <iframe
    src={`/work/${project?.slug || project?.id}`}
    className="w-full h-full border-0"
    title="Public page preview"
  />
</div>
```

**장점**:
- ✅ 100% 정확한 렌더링
- ✅ 공개 페이지와 완전히 동일

**단점**:
- ❌ 매우 무거움 (모달 내 iframe)
- ❌ 상호작용 불가 (클릭 등)
- ❌ CORS 문제 가능

**권장하지 않음** ❌ (너무 무겁고 불필요)

---

## 6️⃣ 최종 권장안: Option A 구현

### 📋 구현 계획 (30분)

**Phase 1: UI 레이아웃 수정 (10분)**
```typescript
// WorkBlogModal.tsx - content 탭 레이아웃 변경

{activeTab === 'content' && (
  <div className="flex gap-4 h-full p-6">
    {/* 좌측: 편집기 (원래대로) */}
    <div className="flex-1 flex flex-col overflow-hidden">
      <BlockLayoutVisualizer
        blocks={blocks}
        rowConfig={rowConfig}
        onSelectBlock={setSelectedId}
        selectedId={selectedId}
      />
      {/* ... BlockEditor 컴포넌트들 */}
    </div>

    {/* 우측: 미리보기 */}
    <div className="flex-1 flex flex-col overflow-hidden border-l bg-gray-50">
      <div className="px-4 py-2 text-xs font-medium text-gray-600 border-b">
        Live Preview
      </div>
      <div className="flex-1 overflow-auto p-4">
        <WorkDetailPreviewRenderer
          content={editorContent}
          rowConfig={rowConfig}
        />
      </div>
    </div>
  </div>
)}
```

**Phase 2: 토글 버튼 추가 (5분)**
```typescript
// Content 탭 헤더에 토글 버튼
<button
  onClick={() => setShowPreview(!showPreview)}
  className="ml-auto text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
>
  {showPreview ? '📖 Hide Preview' : '👁 Show Preview'}
</button>
```

**Phase 3: 스타일 최적화 (10분)**
- 패널 크기 조정
- 스크롤 동작 개선
- 반응형 (모바일에서는 탭으로)

**Phase 4: 테스트 (5분)**
- 블록 추가 시 미리보기 실시간 반영 확인
- 블록 수정 시 미리보기 즉시 업데이트 확인
- 드래그앤드롭 미리보기 동기화 확인

---

## 7️⃣ 현재 BlockEditor 컴포넌트 상태

### BlockEditorPanel 구조
```
src/components/admin/work/BlockEditorPanel.tsx
├─ BlockList (모든 블록 표시)
├─ BlockToolbar (블록 추가 버튼들)
├─ BlockEditor (선택된 블록 편집)
│  ├─ HeroImageBlockEditor
│  ├─ WorkTitleBlockEditor
│  ├─ TextBlockEditor
│  ├─ WorkGalleryBlockEditor
│  ├─ LayoutRowBlockEditor
│  └─ LayoutGridBlockEditor
└─ BlockLayoutVisualizer (행 기반 레이아웃)
```

### WorkDetailPreviewRenderer 상태
```
렌더링 로직 ✅:
- hero-image → <img>
- work-title → 좌측 타이틀/저자 정보
- text → 우측 본문
- work-gallery → 갤러리 그리드
- 2칼럼 레이아웃 ✅
- rowConfig 기반 배치 ✅
```

---

## 8️⃣ 코드 변경 요약

### 수정할 파일
1. **src/components/admin/work/WorkBlogModal.tsx**
   - activeTab에 'content' 유지 (기존 그대로)
   - content 탭 렌더링 시 2-패널 레이아웃 추가
   - showPreview state 추가

2. **styles/tailwind (필요시)**
   - 패널 너비 조정
   - 스크롤 스타일 개선

### 생성할 파일
- 없음 (기존 컴포넌트 재사용)

### 의존성 변경
- 없음 (모든 컴포넌트 이미 존재)

---

## 9️⃣ 기술 리스크 및 해결책

| 리스크 | 확률 | 해결책 |
|--------|------|--------|
| 미리보기 성능 저하 | 낮음 | useMemo로 WorkDetailPreviewRenderer 메모이제이션 |
| 스크롤 동기화 문제 | 낮음 | 각 패널 독립적 스크롤 (현재 구조 유지) |
| 모바일 레이아웃 | 중간 | CSS `hidden md:flex` 로 반응형 처리 |
| 블록 동기화 실패 | 매우낮음 | resetBlocks() 이미 구현됨 |

---

## 🔟 예상 결과

### Before (현재)
```
┌─────────────────────┐
│   Info Tab          │ ← Basic Info 입력
├─────────────────────┤
│   Content Tab       │
│ ┌─────────────────┐ │
│ │ BlockEditor     │ │  ← 블록 편집만 가능
│ │ (전체 화면)     │ │
│ └─────────────────┘ │
└─────────────────────┘
```

### After (개선)
```
┌──────────────────────────────────────┐
│   Info Tab                           │ ← Basic Info 입력
├──────────────────────────────────────┤
│   Content Tab         [👁 Hide Preview]
│ ┌──────────────────┬──────────────────┐
│ │ BlockEditor      │ WorkDetail Preview│
│ │ (좌측)           │ (우측)           │
│ │                  │                  │
│ │ • 블록 추가      │ • 실시간 렌더링  │
│ │ • 블록 편집      │ • 레이아웃 확인  │
│ │ • 드래그앤드롭   │ • 본문 미리보기  │
│ │                  │ • 갤러리 확인    │
│ │                  │                  │
│ └──────────────────┴──────────────────┘
└──────────────────────────────────────┘
```

### 사용자 경험 향상 포인트
- ✅ WYSIWYG 편집 경험 (What You See Is What You Get)
- ✅ 실시간 피드백
- ✅ 공개 페이지와 동일한 뷰
- ✅ 블록 배치 시각화

---

## 실행 단계

```
1단계: ✅ 빌드 성공 확인
   → npm run build 완료

2단계: 📋 코드 분석 (이 문서)
   → Option A 권장

3단계: 🔧 Option A 구현 (예정)
   → WorkBlogModal.tsx 수정 (30분)
   → 2-패널 레이아웃 추가
   → 토글 버튼 추가
   → 테스트 및 검증

4단계: ✅ 최종 빌드
   → npm run build
   → 배포 준비
```

---

## 결론

| 항목 | 상태 |
|-----|------|
| **현재 이미지** | ✅ 모두 존재 (11개) |
| **빌드 상태** | ✅ 성공 (0 에러) |
| **본문 통합 가능성** | ✅ 가능 (권장: Option A) |
| **예상 구현 시간** | ⏱️ 30분 |
| **복잡도** | 🟡 중간 (기존 컴포넌트 재사용) |
| **위험도** | 🟢 낮음 (이미 검증된 구조) |

**최종 권장사항**: Option A ("미리보기 패널")를 구현하면 CMS 사용성이 크게 향상됩니다. 공개 페이지와 동일한 렌더링을 실시간으로 확인하면서 편집할 수 있어 전문성 있는 CMS 시스템이 됩니다.

