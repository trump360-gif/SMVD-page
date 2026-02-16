# 🎯 STUDIO KNOT CMS - 최종 명세서 (B-1 Basic)

**작성일:** 2026-02-16 (재정리)
**상태:** 🚨 **Critical P0 - 즉시 구현**
**총 소요 시간:** 약 2시간
**방식:** B-1 (Basic) - 최종 확정

---

## 📋 Executive Summary

### 최종 구조 (확정)

```
Studio Knot (/work/9) CMS 페이지
├─ Row 0 (layout=1): Hero Image                    [1블록]
├─ Row 1 (layout=2): Work Title (좌) | Text (우)  [2블록]
└─ Row 2 (layout=1): Work Gallery (9개 이미지)     [1블록]

총: 4개 블록, 3개 행
```

### rowConfig 구조

```typescript
rowConfig = [
  { layout: 1, blockCount: 1 },  // Row 0: Hero
  { layout: 2, blockCount: 2 },  // Row 1: Title | Description
  { layout: 1, blockCount: 1 }   // Row 2: Gallery
]
```

### blocks 플랫 배열

```typescript
blocks = [
  Block 0: hero-image (url 1개),
  Block 1: work-title (메타데이터),
  Block 2: text (277자),
  Block 3: work-gallery (내부 9개 이미지)
]
```

---

## 🎨 **페이지 시각화**

### 공개 페이지 (/work/9)

```
┌──────────────────────────────────────────┐
│                                          │
│  Hero Image (1200x600px)                 │
│  /images/work/knot/hero.png              │
│                                          │
├────────────────────┬─────────────────────┤
│                    │                     │
│  Title: STUDIO     │  Description Text   │
│  KNOT              │  (277 characters)   │
│                    │  Lorem ipsum...     │
│  Author:           │                     │
│  노하린            │                     │
│                    │                     │
│  Email:            │                     │
│  havein6@...       │                     │
│                    │                     │
├──────────────────────────────────────────┤
│  Gallery Images (2-Column Layout)        │
│  ┌────────────┬────────────┐             │
│  │ gallery-1  │ gallery-2  │             │
│  ├────────────┼────────────┤             │
│  │ gallery-3  │ gallery-4  │             │
│  ├────────────┼────────────┤             │
│  │ gallery-5  │ gallery-6  │             │
│  ├────────────┼────────────┤             │
│  │ gallery-7  │ gallery-8  │             │
│  └────────────┴────────────┘             │
│  (9번째 이미지는 아래에)                 │
│  ┌────────────┐                          │
│  │ gallery-9  │                          │
│  └────────────┘                          │
│                                          │
└──────────────────────────────────────────┘
```

---

## 🔧 **BlogContent JSON 최종 형식**

```typescript
{
  version: "1.0",

  blocks: [
    // Block 0: Hero Image
    {
      id: "block-hero-knot-1",
      type: "hero-image",
      order: 0,
      url: "/images/work/knot/hero.png",
      alt: "STUDIO KNOT Hero Image",
      height: 600,
      objectFit: "cover"
    },

    // Block 1: Work Title (좌측)
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

    // Block 2: Text Description (우측)
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

    // Block 3: Work Gallery (9개 이미지, 배치는 내부에서 관리)
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
        { id: "img-8", url: "/images/work/knot/gallery-8.png", alt: "Gallery 8" },
        { id: "img-9", url: "/images/work/knot/gallery-9.png", alt: "Gallery 9" }
      ],
      imageLayout: 2,      // ← 1=세로, 2=2열, 3=3열 (관리자가 변경 가능)
      gap: 16,
      minImageHeight: 300
    }
  ],

  // Row 기반 배치 설정
  rowConfig: [
    { layout: 1, blockCount: 1 },  // Row 0: Block 0 (Hero)
    { layout: 2, blockCount: 2 },  // Row 1: Block 1, 2 (Title | Text)
    { layout: 1, blockCount: 1 }   // Row 2: Block 3 (Gallery)
  ]
}
```

---

## 📊 **CMS 모달 구조 (3-Panel)**

### 좌측 패널 (BlockLayoutVisualizer) - 25%

```
┌─────────────────────────────────────┐
│  STUDIO KNOT (Block 관리)            │
├─────────────────────────────────────┤
│  3 rows / 4 blocks                  │
│                                     │
├─ Row 0 [layout: 1] ─────────────────┤
│  [●] Hero Image                     │
│  ├─ ID: block-hero-knot-1          │
│  ├─ URL: /images/work/knot/hero... │
│  └─ Actions: [Edit] [Delete] [⋮]   │
│  + Add Block                        │
│                                     │
├─ Row 1 [layout: 2] ─────────────────┤
│  [●] Work Title | [●] Text          │
│  ├─ 좌: Work Title                  │
│  │  └─ title: STUDIO KNOT           │
│  ├─ 우: Text                        │
│  │  └─ content: "STUDIO KNOT는..."  │
│  + Add Block                        │
│                                     │
├─ Row 2 [layout: 1] ─────────────────┤
│  [●] Work Gallery (9 images)        │
│  ├─ imageLayout: 2-column          │
│  ├─ gap: 16px                      │
│  └─ images: [img-1, img-2, ...]    │
│  + Add Block                        │
│                                     │
├─ + Add Row                          │
│  (1 Col / 2 Col / 3 Col)            │
└─────────────────────────────────────┘
```

### 중앙 패널 (BlockEditorPanel) - 40%

#### Block 0 (Hero Image) 선택 시
```
┌─────────────────────────────────────┐
│ Edit Hero Image            [×]      │
├─────────────────────────────────────┤
│ Current Image:                      │
│ /images/work/knot/hero.png          │
│                                     │
│ [Upload New] [Select from Library]  │
│                                     │
│ Alt Text: [STUDIO KNOT Hero Image] │
│                                     │
│ Height: [600] px                    │
│ Object Fit: [cover] ▼               │
│                                     │
│ [Delete Block]                      │
└─────────────────────────────────────┘
```

#### Block 1 (Work Title) 선택 시
```
┌─────────────────────────────────────┐
│ Edit Work Title            [×]      │
├─────────────────────────────────────┤
│ Title: [STUDIO KNOT]                │
│ Subtitle: [노하린, 2025]             │
│ Author: [노하린]                     │
│ Email: [havein6@gmail.com]          │
│                                     │
│ ─ Title Style ─                     │
│ Font Size: [60] px                  │
│ Font Weight: [700] ▼                │
│ Color: [#1b1d1f] ◆                  │
│                                     │
│ ─ Author Style ─                    │
│ Font Size: [14] px                  │
│ Font Weight: [500] ▼                │
│                                     │
│ Gap: [24] px                        │
│                                     │
│ [Delete Block]                      │
└─────────────────────────────────────┘
```

#### Block 2 (Text) 선택 시
```
┌─────────────────────────────────────┐
│ Edit Text                 [×]       │
├─────────────────────────────────────┤
│ Content:                            │
│ ┌──────────────────────────────────┐│
│ │STUDIO KNOT는 입지 않는 옷에...   ││
│ │(277 characters)                  ││
│ └──────────────────────────────────┘│
│                                     │
│ Font Size: [18] px                  │
│ Font Weight: [400] ▼                │
│ Color: [#1b1d1f] ◆                  │
│ Line Height: [1.8]                  │
│                                     │
│ [Delete Block]                      │
└─────────────────────────────────────┘
```

#### Block 3 (Work Gallery) 선택 시 ⭐ **핵심**
```
┌─────────────────────────────────────┐
│ Edit Work Gallery          [×]      │
├─────────────────────────────────────┤
│ ─ Gallery Settings ─                │
│ Image Layout: [2-Column  ▼]         │
│   (1-Column / 2-Column / 3-Column)  │
│ Gap: [16] px                        │
│ Min Height: [300] px                │
│                                     │
│ ─ Images (9 total) ─                │
│                                     │
│ [1] gallery-1.png [Edit] [Del] [↑↓]│
│ [2] gallery-2.png [Edit] [Del] [↑↓]│
│ [3] gallery-3.png [Edit] [Del] [↑↓]│
│ [4] gallery-4.png [Edit] [Del] [↑↓]│
│ [5] gallery-5.png [Edit] [Del] [↑↓]│
│ [6] gallery-6.png [Edit] [Del] [↑↓]│
│ [7] gallery-7.png [Edit] [Del] [↑↓]│
│ [8] gallery-8.png [Edit] [Del] [↑↓]│
│ [9] gallery-9.png [Edit] [Del] [↑↓]│
│                                     │
│ [+ Add Image]                       │
│                                     │
│ [Delete Block]                      │
└─────────────────────────────────────┘
```

##### 이미지 Edit 모달 (Block 3 내 이미지 클릭)
```
┌─────────────────────────────────────┐
│ Edit Image #3                [×]    │
├─────────────────────────────────────┤
│ Current: gallery-3.png              │
│                                     │
│ [Change Image]                      │
│ ├─ [Upload New]                     │
│ └─ [Select from Library]            │
│                                     │
│ Alt Text: [Gallery 3        ]      │
│                                     │
│ [Save] [Cancel]                     │
└─────────────────────────────────────┘
```

### 우측 패널 (WorkDetailPreviewRenderer) - 35%

```
┌─────────────────────────────────────┐
│  Preview                            │
├─────────────────────────────────────┤
│                                     │
│  [Hero Image 표시]                  │
│                                     │
│  ┌────────────────┬────────────────┐│
│  │  STUDIO KNOT   │Description...  ││
│  │  노하린        │               ││
│  │  havein6@...   │               ││
│  └────────────────┴────────────────┘│
│                                     │
│  Gallery Images:                    │
│  [img1] [img2]                      │
│  [img3] [img4]                      │
│  [img5] [img6]                      │
│  [img7] [img8]                      │
│  [img9]                             │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔴 Phase 1: 데이터 동기화 버그 수정 (10분)

### 파일 2개 수정

**1️⃣ useBlockEditor.ts 수정**

추가할 메서드:
```typescript
const resetBlocks = useCallback((newBlocks: Block[]) => {
  setBlocks(reindex(newBlocks));
  setSelectedId(null);
}, []);

const getBlockCount = useCallback(() => blocks.length, [blocks]);

// return에 추가
return {
  // ... 기존
  resetBlocks,
  getBlockCount
};
```

**2️⃣ WorkBlogModal.tsx 수정**

```typescript
// Line 76-84 수정
const {
  blocks,
  selectedId,
  setSelectedId,
  addBlock,
  updateBlock,
  deleteBlock,
  reorderBlocks,
  resetBlocks,        // ← 추가
  getBlockCount       // ← 추가 (선택)
} = useBlockEditor(editorContent.blocks);

// Line 92-94 다음 추가
// 동기화: editorContent.blocks가 변경되면 useBlockEditor 업데이트
useEffect(() => {
  if (editorContent.blocks && editorContent.blocks.length > 0) {
    console.log('[WorkBlogModal] Syncing blocks:', editorContent.blocks.length);
    resetBlocks(editorContent.blocks);
  }
}, [editorContent.blocks, resetBlocks]);
```

### 검증
```
✅ npm run build → TypeScript 0 에러
✅ STUDIO KNOT 수정 → "3 rows / 4 blocks" 표시
```

---

## 🟡 Phase 2: Studio Knot 블록 데이터 생성 & DB 저장 (30분)

### 데이터 준비

위의 **BlogContent JSON** 완성본 사용 (위 문서에 기재됨)

### 저장 방법 2가지

**Option A: API 호출 (권장)**
```bash
curl -X PUT http://localhost:3000/api/admin/work/projects/<UUID> \
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
    "content": { ... BlogContent JSON ... }
  }'
```

**Option B: Admin CMS UI 수동 입력**
- /admin/dashboard/work 접속
- STUDIO KNOT 수정
- Content 탭에서 "+ Add Block" 클릭
- 4개 블록 순서대로 추가:
  1. Hero Image (url)
  2. Work Title (메타데이터)
  3. Text (277자)
  4. Work Gallery (9개 이미지 추가)

### 검증
```
✅ DB에 저장됨 (HTTP 200)
✅ /admin/dashboard/work에서 STUDIO KNOT 수정 → 4개 블록 표시
```

---

## 🟢 Phase 3: CMS 기능 검증 (20분)

### 체크리스트

```
□ 블록 선택
  ✅ Block 0 (Hero) 클릭 → 중앙에 HeroImageBlockEditor 표시
  ✅ Block 1 (Title) 클릭 → 중앙에 WorkTitleBlockEditor 표시
  ✅ Block 2 (Text) 클릭 → 중앙에 TextBlockEditor 표시
  ✅ Block 3 (Gallery) 클릭 → 중앙에 WorkGalleryBlockEditor 표시

□ 블록 편집
  ✅ Block 1의 author 값 변경 → 우측 미리보기 즉시 업데이트
  ✅ Block 3의 imageLayout 변경 (1→2→3) → 우측 갤러리 배치 즉시 변경

□ 갤러리 이미지 관리
  ✅ Block 3에서 이미지 순서 드래그 변경 → 우측 미리보기 반영
  ✅ Block 3에서 [+ Add Image] → 9번째 이미지 추가
  ✅ Block 3에서 [Edit] 클릭 → 이미지 상세 편집 모달

□ 저장
  ✅ [Save Changes] 클릭 → API 호출 (HTTP 200)
  ✅ 모달 닫고 다시 열기 → 저장된 데이터 표시됨
```

---

## 🔵 Phase 4: 공개 페이지 동기화 검증 (15분)

### 테스트

```
□ /work/9 접속
  ✅ Hero 이미지 표시 (600px height)
  ✅ 제목 "STUDIO KNOT" 표시 (60px, 700 weight)
  ✅ 작가 "노하린" 표시
  ✅ 설명 텍스트 전체 277자 표시 (18px, 1.8 line-height)
  ✅ 갤러리 9개 이미지 모두 표시 (2-column 배치)

□ CMS에서 수정 후 반영 확인
  ✅ Block 1의 author "노하린" → "노하린 & Team" 변경
  ✅ /work/9 새로고침 → 변경된 작가명 표시
  ✅ Block 3의 imageLayout 2 → 3으로 변경
  ✅ /work/9 새로고침 → 3-column 갤러리 표시
```

---

## ✅ Phase 5: 최종 검증 (10분)

### 완전성 체크리스트

| 항목 | 상태 | 검증 |
|------|------|------|
| **CMS 기능** | | |
| 블록 선택/편집 | ✅ | 모든 4개 블록 클릭 가능 |
| 드래그 순서 변경 | ✅ | gallery 내 이미지 순서 변경 |
| 이미지 추가/삭제 | ✅ | Block 3에서 가능 |
| 미리보기 실시간 | ✅ | 우측 패널 즉시 업데이트 |
| 저장 | ✅ | DB 저장 확인 |
| **공개 페이지** | | |
| Hero 이미지 | ✅ | 600x정상 표시 |
| 제목/작가 정보 | ✅ | 좌측 정상 배치 |
| 설명 텍스트 | ✅ | 우측 정상 표시 |
| 갤러리 이미지 | ✅ | 9개 모두 표시 |
| 레이아웃 동적 변경 | ✅ | 1/2/3-column 전환 가능 |
| **데이터 무결성** | | |
| DB 저장 | ✅ | WorkProject.content 필드 |
| Block ID 유니크 | ✅ | 4개 모두 고유함 |
| Order 정렬 | ✅ | 0, 1, 2, 3 |
| rowConfig | ✅ | 3개 행 설정 |
| Image 경로 | ✅ | 모두 존재 |

---

## ⚠️ Critical Warnings

1. ❌ **Phase 1 없이 Phase 2 진행 금지** → 데이터 표시 안 됨
2. ❌ **이미지 경로 검증** → `/public/images/work/knot/` 모두 존재?
3. ❌ **Block ID 유니크** → 중복 없는지 확인
4. ❌ **rowConfig.blockCount 합 = blocks.length** → 1+2+1=4 ✅
5. ❌ **다른 프로젝트 건드리지 말 것** → Studio Knot만

---

## 📝 실행 순서

```
1️⃣ Phase 1: useBlockEditor 수정 + npm run build
   ↓ (10분)
2️⃣ Phase 2: BlogContent JSON 생성 + DB 저장
   ↓ (30분)
3️⃣ Phase 3: CMS 테스트 (중앙 패널 기능)
   ↓ (20분)
4️⃣ Phase 4: 공개 페이지 테스트
   ↓ (15분)
5️⃣ Phase 5: 최종 체크리스트
   (10분)

총: 85분 ≈ 1.5시간
```

---

**확정:** B-1 (Basic) 방식으로 4개 블록, 3개 행 구조
**다음:** Phase 1 구현 시작

