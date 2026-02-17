# STUDIO KNOT CMS - 완전한 구현 계획 (Phase 1-5)

**작성일:** 2026-02-16
**상태:** 🔴 **Critical P0 - 즉시 구현 필요**
**총 소요 시간:** 약 2-3시간
**작성자:** Claude Code (완전 분석)

---

## 📋 Executive Summary

### 현재 상황
- ✅ CMS 모달 UI 완성 (3-panel 레이아웃)
- ✅ 공개 페이지 렌더링 기능 완성
- 🔴 **데이터 동기화 버그** - CMS 기능 완전 마비
- ❌ Studio Knot 블록 데이터 DB 미동기화

### 최종 목표
✅ 관리자가 CMS에서 Studio Knot 콘텐츠를 **완전히 편집/관리**할 수 있는 상태
✅ 공개 페이지에서 **DB 데이터 실시간 반영**
✅ 새 글 작성 및 배치 완전 자동화

### 구현 전략
1. **Phase 1:** useBlockEditor 동기화 버그 수정 (10분)
2. **Phase 2:** Studio Knot 블록 데이터 생성 (30분)
3. **Phase 3:** DB 마이그레이션 (15분)
4. **Phase 4:** CMS 기능 검증 (20분)
5. **Phase 5:** 공개 페이지 최적화 (15분)

---

## 🔴 Phase 1: 데이터 동기화 버그 수정

### 1-1. Problem Summary

**문제:** useBlockEditor 훅이 prop 변경을 감지하지 못함

```
Timeline:
┌─────────────────────────────────────────────────────────┐
│ Step 1: Modal 초기 렌더링                              │
│ ├─ editorContent = { blocks: [], ... }                 │
│ └─ useBlockEditor([]) → blocks state = []              │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ Step 2: project 로드 (useEffect)                        │
│ ├─ setEditorContent(project.content)                   │
│ │  └─ editorContent.blocks = [4개 블록] ✅             │
│ └─ ⚠️ useBlockEditor는 감지 못함!                      │
│    blocks는 여전히 []                                  │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ Step 3: UI 렌더링                                       │
│ ├─ BlockLayoutVisualizer: "4 rows / 0 blocks" ❌       │
│ ├─ BlockEditorPanel: "No Block Selected" ❌            │
│ └─ WorkDetailPreviewRenderer: 비어있음 ❌              │
└─────────────────────────────────────────────────────────┘
```

### 1-2. Root Cause

**파일:** `src/components/admin/shared/BlockEditor/useBlockEditor.ts` (Line 26-27)

```typescript
export function useBlockEditor(initialBlocks: Block[] = []) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  // ← useState는 첫 렌더링에만 initialBlocks 사용
  // ← 이후 prop 변경 감지 안 함!
}
```

### 1-3. Solution: Option A - resetBlocks() 메서드 추가

#### 1-3-1. useBlockEditor.ts 수정

**파일:** `src/components/admin/shared/BlockEditor/useBlockEditor.ts`

```typescript
export function useBlockEditor(initialBlocks: Block[] = []) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const reindex = (arr: Block[]): Block[] =>
    arr.map((block, idx) => withOrder(block, idx));

  // ✅ 새로 추가: 외부에서 블록 배열을 강제로 재설정
  const resetBlocks = useCallback((newBlocks: Block[]) => {
    console.log('[useBlockEditor] resetBlocks called with', newBlocks.length, 'blocks');
    setBlocks(reindex(newBlocks));
    setSelectedId(null);  // 선택 상태 초기화
  }, []);

  // ✅ 새로 추가: 현재 블록 개수 확인용
  const getBlockCount = useCallback(() => blocks.length, [blocks]);

  // ... 기존 addBlock, updateBlock, deleteBlock, reorderBlocks, getBlockById ...

  return {
    blocks,
    selectedId,
    setSelectedId,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    getBlockById,
    resetBlocks,        // ← 추가
    getBlockCount,      // ← 추가 (디버깅용)
  };
}
```

#### 1-3-2. WorkBlogModal.tsx 수정

**파일:** `src/components/admin/work/WorkBlogModal.tsx`

**변경 1:** useBlockEditor 호출 (Line 76-84)

```typescript
const {
  blocks,
  selectedId,
  setSelectedId,
  addBlock,
  updateBlock,
  deleteBlock,
  reorderBlocks,
  resetBlocks,         // ← 추가
  getBlockCount,       // ← 추가 (선택)
} = useBlockEditor(editorContent.blocks);
```

**변경 2:** 동기화 useEffect 추가 (Line 92-94 수정)

```typescript
// 원본 (Line 92-94)
useEffect(() => {
  setEditorContent((prev) => ({ ...prev, blocks, rowConfig }));
}, [blocks, rowConfig]);

// 수정본: editorContent.blocks 변경 감지 → useBlockEditor 동기화
useEffect(() => {
  if (editorContent.blocks && editorContent.blocks.length > 0) {
    console.log('[WorkBlogModal] Syncing blocks from editorContent:', editorContent.blocks.length);
    resetBlocks(editorContent.blocks);
  }
}, [editorContent.blocks, resetBlocks]);
```

### 1-4. 검증 체크리스트

**After Phase 1-3 수정:**

```
□ npm run build
  ✅ TypeScript 0 에러
  ✅ 29/29 페이지 성공

□ npm run dev
  ✅ 개발 서버 시작

□ http://localhost:3000/admin/dashboard/work 접속

□ STUDIO KNOT 프로젝트 "수정" 클릭
  ✅ 모달 열림
  ✅ BlockLayoutVisualizer: "4 rows / 4 blocks" 표시 (이전: "4 rows / 0 blocks")
  ✅ 각 블록 타입 표시됨:
     - [Row 1] Hero Image (hero-image)
     - [Row 2] Work Title (work-title)
     - [Row 3] Text (text)
     - [Row 4] Work Gallery (work-gallery)

□ 블록 클릭 테스트
  ✅ 어떤 블록이든 클릭 → BlockEditorPanel에 선택된 블록 표시
  ✅ 제목 "Edit [Block Type]" 변함

□ 미리보기 테스트
  ✅ WorkDetailPreviewRenderer (우측)에 모든 블록 렌더링 표시
```

---

## 🟡 Phase 2: Studio Knot 블록 데이터 생성

### 2-1. 데이터 분석

**STUDIO KNOT 기본 정보 (from work-details.ts):**

```typescript
'9': {
  id: '9',
  title: 'STUDIO KNOT',
  subtitle: '노하린, 2025',
  category: 'Branding',
  tags: ['UX/UI', 'Graphic', 'Editorial', 'Illustration', 'Branding', 'CM/CF', 'Game'],
  author: '노하린',
  email: 'havein6@gmail.com',
  description: '...(277자)...',
  heroImage: '/images/work/knot/hero.png',
  galleryImages: [
    '/images/work/knot/gallery-1.png',
    '/images/work/knot/gallery-2.png',
    '/images/work/knot/gallery-3.png',
    '/images/work/knot/gallery-4.png',
    '/images/work/knot/gallery-5.png',
    '/images/work/knot/gallery-6.png',
    '/images/work/knot/gallery-7.png',
    '/images/work/knot/gallery-8.png',
  ]
}
```

### 2-2. 블록 매핑 계획

| 순서 | 요소 | 블록 타입 | 데이터 소스 |
|------|------|---------|-----------|
| **0** | 히어로 이미지 | `hero-image` | heroImage |
| **1** | 제목 + 작가 정보 | `work-title` | title, author, email, subtitle |
| **2** | 프로젝트 설명 | `text` | description (277자) |
| **3** | 갤러리 (8개 이미지) | `work-gallery` | galleryImages[0-7] |

### 2-3. BlogContent JSON 생성 (Manual)

**구조 (최종 형식):**

```typescript
const studioKnotContent: BlogContent = {
  version: "1.0",
  blocks: [
    // Block 0: Hero Image
    {
      id: "block-hero-knot-1",
      type: "hero-image",
      order: 0,
      url: "/images/work/knot/hero.png",
      alt: "STUDIO KNOT - Hero Image",
      height: 600,
      objectFit: "cover"
    },

    // Block 1: Work Title
    {
      id: "block-title-knot-1",
      type: "work-title",
      order: 1,
      title: "STUDIO KNOT",
      subtitle: "노하린, 2025",
      author: "노하린",
      email: "havein6@gmail.com",
      titleFontSize: 60,
      titleFontWeight: "700",
      titleColor: "#1b1d1f",
      subtitleFontSize: 14,
      subtitleFontWeight: "500",
      subtitleColor: "#7b828e",
      authorFontSize: 14,
      authorFontWeight: "500",
      authorColor: "#1b1d1f",
      emailFontSize: 12,
      emailFontWeight: "400",
      emailColor: "#7b828e",
      gap: 24
    },

    // Block 2: Description Text
    {
      id: "block-text-knot-1",
      type: "text",
      order: 2,
      content: "STUDIO KNOT는 입지 않는 옷에 새로운 쓰임을 더해 반려견 장난감으로 재탄생시키는 업사이클링 터그 토이 브랜드입니다. 쉽게 버려지는 의류와 빠르게 닳는 반려견 장난감의 순환 구조를 개선하며, 보호자의 체취가 남은 옷으로 만든 토이는 정서적 가치를 담은 지속가능한 대안을 제시합니다.",
      fontSize: 18,
      fontWeight: "400",
      fontFamily: "Pretendard",
      color: "#1b1d1f",
      lineHeight: 1.8,
      letterSpacing: 0.5
    },

    // Block 3: Work Gallery (8 이미지)
    {
      id: "block-gallery-knot-1",
      type: "work-gallery",
      order: 3,
      images: [
        { id: "img-1", url: "/images/work/knot/gallery-1.png", alt: "Gallery 1" },
        { id: "img-2", url: "/images/work/knot/gallery-2.png", alt: "Gallery 2" },
        { id: "img-3", url: "/images/work/knot/gallery-3.png", alt: "Gallery 3" },
        { id: "img-4", url: "/images/work/knot/gallery-4.png", alt: "Gallery 4" },
        { id: "img-5", url: "/images/work/knot/gallery-5.png", alt: "Gallery 5" },
        { id: "img-6", url: "/images/work/knot/gallery-6.png", alt: "Gallery 6" },
        { id: "img-7", url: "/images/work/knot/gallery-7.png", alt: "Gallery 7" },
        { id: "img-8", url: "/images/work/knot/gallery-8.png", alt: "Gallery 8" }
      ],
      imageLayout: 2,  // 2-column layout
      gap: 16,
      minImageHeight: 300
    }
  ],
  rowConfig: [
    { layout: 1, blockCount: 1 },  // Row 0: Hero (1개)
    { layout: 1, blockCount: 1 },  // Row 1: Title (1개)
    { layout: 1, blockCount: 1 },  // Row 2: Text (1개)
    { layout: 1, blockCount: 1 }   // Row 3: Gallery (1개)
  ]
};
```

### 2-4. 구현 방법 (2가지 옵션)

#### Option A: Admin API를 통한 직접 업데이트 (권장)

```bash
# 1단계: Studio Knot 프로젝트 ID 확인
curl http://localhost:3000/api/admin/work/projects \
  -H "Authorization: Bearer YOUR_TOKEN"

# 응답에서 찾기 (예시):
# {
#   "projects": [
#     {
#       "id": "clxxx123yyy",
#       "title": "STUDIO KNOT",
#       ...
#     }
#   ]
# }

# 2단계: Content 필드 업데이트
curl -X PUT http://localhost:3000/api/admin/work/projects/clxxx123yyy \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "STUDIO KNOT",
    "subtitle": "노하린, 2025",
    "category": "Branding",
    "tags": ["UX/UI", "Graphic", "Editorial", "Illustration", "Branding", "CM/CF", "Game"],
    "author": "노하린",
    "email": "havein6@gmail.com",
    "published": true,
    "content": {
      "version": "1.0",
      "blocks": [
        {
          "id": "block-hero-knot-1",
          "type": "hero-image",
          "order": 0,
          "url": "/images/work/knot/hero.png",
          "alt": "STUDIO KNOT - Hero Image",
          "height": 600,
          "objectFit": "cover"
        },
        {
          "id": "block-title-knot-1",
          "type": "work-title",
          "order": 1,
          "title": "STUDIO KNOT",
          "subtitle": "노하린, 2025",
          "author": "노하린",
          "email": "havein6@gmail.com",
          "titleFontSize": 60,
          "titleFontWeight": "700",
          "titleColor": "#1b1d1f",
          "subtitleFontSize": 14,
          "subtitleFontWeight": "500",
          "subtitleColor": "#7b828e",
          "authorFontSize": 14,
          "authorFontWeight": "500",
          "authorColor": "#1b1d1f",
          "emailFontSize": 12,
          "emailFontWeight": "400",
          "emailColor": "#7b828e",
          "gap": 24
        },
        {
          "id": "block-text-knot-1",
          "type": "text",
          "order": 2,
          "content": "STUDIO KNOT는 입지 않는 옷에 새로운 쓰임을 더해 반려견 장난감으로 재탄생시키는 업사이클링 터그 토이 브랜드입니다. 쉽게 버려지는 의류와 빠르게 닳는 반려견 장난감의 순환 구조를 개선하며, 보호자의 체취가 남은 옷으로 만든 토이는 정서적 가치를 담은 지속가능한 대안을 제시합니다.",
          "fontSize": 18,
          "fontWeight": "400",
          "fontFamily": "Pretendard",
          "color": "#1b1d1f",
          "lineHeight": 1.8,
          "letterSpacing": 0.5
        },
        {
          "id": "block-gallery-knot-1",
          "type": "work-gallery",
          "order": 3,
          "images": [
            { "id": "img-1", "url": "/images/work/knot/gallery-1.png", "alt": "Gallery 1" },
            { "id": "img-2", "url": "/images/work/knot/gallery-2.png", "alt": "Gallery 2" },
            { "id": "img-3", "url": "/images/work/knot/gallery-3.png", "alt": "Gallery 3" },
            { "id": "img-4", "url": "/images/work/knot/gallery-4.png", "alt": "Gallery 4" },
            { "id": "img-5", "url": "/images/work/knot/gallery-5.png", "alt": "Gallery 5" },
            { "id": "img-6", "url": "/images/work/knot/gallery-6.png", "alt": "Gallery 6" },
            { "id": "img-7", "url": "/images/work/knot/gallery-7.png", "alt": "Gallery 7" },
            { "id": "img-8", "url": "/images/work/knot/gallery-8.png", "alt": "Gallery 8" }
          ],
          "imageLayout": 2,
          "gap": 16,
          "minImageHeight": 300
        }
      ],
      "rowConfig": [
        { "layout": 1, "blockCount": 1 },
        { "layout": 1, "blockCount": 1 },
        { "layout": 1, "blockCount": 1 },
        { "layout": 1, "blockCount": 1 }
      ]
    }
  }'
```

#### Option B: Admin CMS UI 통한 수동 생성 (대체안)

```
1. /admin/dashboard/work 접속
2. "STUDIO KNOT" 프로젝트의 "수정" 클릭
3. 모달의 "Content" 탭 클릭
4. "+ Add Block" 버튼으로 4개 블록 추가:
   - Block 0: Hero Image → /images/work/knot/hero.png 선택
   - Block 1: Work Title → 제목, 작가, 이메일 입력
   - Block 2: Text → 설명 텍스트 입력 (277자)
   - Block 3: Work Gallery → 8개 이미지 모두 선택
5. "Save Changes" 클릭
```

### 2-5. 검증 체크리스트

```
□ Studio Knot 프로젝트 ID 확인됨
□ Content 필드 업데이트 완료
  ✅ DB 저장 확인 (HTTP 200)

□ /admin/dashboard/work 접속
  ✅ STUDIO KNOT 프로젝트 "수정" 클릭
  ✅ 모달 Content 탭에 4개 블록 표시
     - Hero Image 블록
     - Work Title 블록
     - Text 블록
     - Work Gallery 블록 (8개 이미지)
```

---

## 🟢 Phase 3: CMS 기능 검증

### 3-1. 블록 선택 및 편집

**테스트 시나리오:**

```
1. STUDIO KNOT 수정 클릭 → 모달 열림
2. 좌측 패널에서 각 블록 클릭
   ✅ Block 1 (Hero Image) 클릭
      → 중앙 패널: HeroImageBlockEditor 표시
      → 우측 패널: 미리보기 즉시 업데이트
   ✅ Block 2 (Work Title) 클릭
      → 중앙 패널: WorkTitleBlockEditor 표시
      → 필드: title, author, email, 폰트 설정 등
   ✅ Block 3 (Text) 클릭
      → 중앙 패널: TextBlockEditor 표시
      → 텍스트 콘텐츠, 폰트 크기, 색상 편집 가능
   ✅ Block 4 (Work Gallery) 클릭
      → 중앙 패널: WorkGalleryBlockEditor 표시
      → 이미지 추가/삭제, 순서 변경 가능
```

### 3-2. 드래그 앤 드롭

**테스트 시나리오:**

```
1. 좌측 패널의 Block 3 (Text) 드래그
   ✅ Block 4 (Gallery) 위로 드래그
      → 순서 변경됨: [Hero, Title, Gallery, Text]
      → 우측 미리보기 즉시 반영
   ✅ 원래 순서로 드래그 원상복귀
```

### 3-3. 블록 추가/삭제

**테스트 시나리오:**

```
1. "+ Add Block" 버튼 클릭
   ✅ 14가지 블록 타입 목록 표시
   ✅ 특정 블록 타입 선택
      → 블록 추가됨 (5번째)
      → "5 rows / 5 blocks" 표시
      → 우측 미리보기에 새 블록 렌더링

2. Block 3 (Text) 오른쪽의 삭제 버튼 클릭
   ✅ 확인 다이얼로그 표시
   ✅ "Delete" 버튼 클릭
      → 블록 삭제됨
      → "4 rows / 4 blocks" 표시
      → 우측 미리보기에서 해당 블록 제거
```

### 3-4. 콘텐츠 수정

**테스트 시나리오:**

```
1. Block 3 (Text) 선택
2. 중앙 패널의 텍스트 편집 (예: 처음 50자 삭제)
   ✅ 우측 미리보기에 즉시 반영
   ✅ "Unsaved changes" 표시 (또는 저장 대기 표시)

3. 다시 원문으로 복구
   ✅ 미리보기 즉시 복구

4. "Save Changes" 버튼 클릭
   ✅ API 호출: PUT /api/admin/work/projects/[id]
   ✅ HTTP 200 응답
   ✅ 성공 메시지 표시
```

---

## 🔵 Phase 4: 공개 페이지 동기화 검증

### 4-1. 공개 페이지 DB 데이터 렌더링

**테스트 시나리오:**

```
1. /work/9 접속 (공개 페이지)
   ✅ Hero 이미지 표시
      - 경로: /images/work/knot/hero.png
      - 크기: 1200x600px 확인

   ✅ 제목 + 작가 정보 표시
      - 제목: "STUDIO KNOT" (좌측 상단)
      - 작가: "노하린"
      - 이메일: "havein6@gmail.com"
      - 폰트: 60px, 700 weight (정렬 일치)

   ✅ 설명 텍스트 표시 (우측)
      - 전체 277자 표시
      - 폰트: 18px, 400 weight
      - 라인 높이: 1.8

   ✅ 갤러리 (8개 이미지)
      - 2-column 레이아웃
      - gallery-1.png ~ gallery-8.png 모두 표시
      - 이미지 간격: 16px
```

### 4-2. CMS 수정 후 공개 페이지 반영

**테스트 시나리오:**

```
1. Admin CMS에서 Block 3 (Text) 수정
   - 첫 50자 삭제 (예: "STUDIO KNOT는..." → "...입지 않는 옷에...")

2. "Save Changes" 클릭
   ✅ HTTP 200 응답

3. /work/9 새로고침 (F5)
   ✅ 수정된 텍스트 표시됨
   ✅ 이전 상태는 더 이상 표시 안 됨

4. Admin CMS에서 Block 1 (Title) 수정
   - author: "노하린" → "노하린 & Team"

5. /work/9 새로고침
   ✅ 수정된 작가명 표시됨
```

---

## 🟣 Phase 5: 완전한 기능 체크리스트

### 5-1. CMS 기능 (완전성 검증)

| 기능 | 상태 | 검증 |
|------|------|------|
| **블록 선택** | ✅ | 모든 4개 블록 클릭 가능 |
| **블록 편집** | ✅ | 각 블록 타입별 에디터 작동 |
| **블록 삭제** | ✅ | 확인 후 삭제 완료 |
| **블록 추가** | ✅ | 14가지 타입 모두 추가 가능 |
| **드래그 앤 드롭** | ✅ | 순서 변경 가능 |
| **다중 열 레이아웃** | ✅ | 레이아웃 변경 (1→2→3 column) |
| **행 추가** | ✅ | "+ Add Row" 버튼 작동 |
| **행 삭제** | ✅ | 행 삭제 후 다시 그룹핑 |
| **미리보기** | ✅ | 우측 패널 실시간 업데이트 |
| **저장** | ✅ | DB 저장 확인 |
| **재로드** | ✅ | 저장 후 재로드 시 데이터 유지 |

### 5-2. 공개 페이지 기능 (완전성 검증)

| 기능 | 상태 | 검증 |
|------|------|------|
| **Hero 이미지** | ✅ | 경로, 크기, 렌더링 확인 |
| **제목/작가 정보** | ✅ | 폰트, 색상, 간격 일치 |
| **설명 텍스트** | ✅ | 전체 텍스트, 폰트, 라인 높이 |
| **갤러리** | ✅ | 8개 이미지, 2-column 레이아웃 |
| **반응형 디자인** | ✅ | Mobile/Tablet/Desktop 확인 |
| **SEO 최적화** | ⏳ | next/image, alt 텍스트 |
| **성능** | ⏳ | Lighthouse 점수 |

### 5-3. 데이터 무결성 (완전성 검증)

| 항목 | 상태 | 검증 |
|------|------|------|
| **DB 저장** | ✅ | WorkProject.content 필드 JSON |
| **블록 ID 유니크** | ✅ | 모든 block.id 고유함 |
| **Order 정렬** | ✅ | 블록 order = 0, 1, 2, 3 |
| **RowConfig** | ✅ | 4개 행 설정 저장됨 |
| **이미지 경로** | ✅ | 모든 이미지 경로 존재 |
| **타입 검증** | ✅ | BlogContent 타입 준수 |

---

## 📊 전체 구현 Roadmap

```
┌─────────────────────────────────────────────────────────────────┐
│ Phase 1: 데이터 동기화 버그 수정 (10분)                         │
│ ├─ useBlockEditor.ts 수정: resetBlocks() 메서드 추가           │
│ └─ WorkBlogModal.tsx 수정: 동기화 useEffect 추가              │
│    ↓ Result: "4 rows / 4 blocks" 표시 ✅                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Phase 2: Studio Knot 블록 데이터 생성 (30분)                   │
│ ├─ Option A: API를 통한 Content 필드 업데이트                 │
│ └─ Option B: Admin CMS UI 통한 수동 생성                       │
│    ↓ Result: DB에 4개 블록 저장됨 ✅                           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Phase 3: CMS 기능 검증 (20분)                                   │
│ ├─ 블록 선택/편집/삭제 테스트                                   │
│ ├─ 드래그 앤 드롭 테스트                                        │
│ ├─ 행 추가/삭제 테스트                                          │
│ └─ 미리보기 실시간 업데이트 테스트                              │
│    ↓ Result: 모든 CMS 기능 작동 ✅                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Phase 4: 공개 페이지 동기화 검증 (15분)                        │
│ ├─ /work/9 DB 데이터 렌더링 확인                               │
│ ├─ CMS 수정 후 공개 페이지 반영 확인                           │
│ └─ 이미지, 텍스트, 레이아웃 모두 일치 확인                      │
│    ↓ Result: 공개 페이지 완전히 동기화됨 ✅                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Phase 5: 완전한 기능 체크리스트 & 최종 검증 (10분)              │
│ ├─ CMS 기능 11가지 확인                                        │
│ ├─ 공개 페이지 기능 7가지 확인                                  │
│ └─ 데이터 무결성 6가지 확인                                     │
│    ↓ Result: 모든 기능 작동 확인됨 ✅                           │
└─────────────────────────────────────────────────────────────────┘

총 소요 시간: 85분 ≈ 1.5시간
```

---

## 🎯 최종 상태 (완료 후)

### 관리자 경험

```
1. /admin/dashboard/work 접속
2. "STUDIO KNOT" 수정 클릭
3. 3-panel 모달 열림:
   ✅ 좌측: 4개 블록 시각화 ("4 rows / 4 blocks")
   ✅ 중앙: 선택된 블록 상세 에디터
   ✅ 우측: 실시간 미리보기
4. 각 블록 선택 → 편집 → 저장
5. 새로운 블록 추가/삭제/순서 변경 가능
```

### 사용자 경험

```
1. /work/9 접속
2. Hero 이미지, 제목, 설명, 갤러리 모두 표시
3. Admin에서 수정 → /work/9 새로고침 → 즉시 반영
```

---

## ⚠️ 주의사항

1. **Phase 1 완료 후 Phase 2 진행**
   - Phase 1 없이 Phase 2 진행하면 데이터가 표시되지 않음

2. **Image URL 확인**
   - `/images/work/knot/` 폴더에 hero.png, gallery-1~8.png 존재 확인

3. **Block ID 유니크 확인**
   - 각 block.id는 전체에서 유니크해야 함 (예: "block-hero-knot-1")

4. **순서 유지**
   - rowConfig와 blocks 배열의 blockCount 합이 일치해야 함

5. **다른 프로젝트 영향 없음**
   - Studio Knot만 수정 (ID '9' 또는 UUID)
   - 다른 12개 프로젝트는 기존 하드코딩 유지

---

## 📝 실행 명령어 요약

```bash
# Phase 1: 버그 수정 완료 후 빌드 및 테스트
npm run build          # ✅ 0 에러 확인
npm run dev            # ✅ 개발 서버 시작

# Phase 2: Studio Knot 블록 데이터 DB 업데이트 (Option A)
# curl 명령어로 PUT 요청 실행 (위의 2-4 참고)

# Phase 3-5: Admin CMS 및 공개 페이지에서 직접 테스트
# http://localhost:3000/admin/dashboard/work
# http://localhost:3000/work/9
```

---

**마지막 업데이트:** 2026-02-16
**상태:** 🔴 **즉시 구현 필요**
**예상 완료:** 2026-02-16 (오늘)
