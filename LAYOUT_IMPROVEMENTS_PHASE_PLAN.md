# LayoutRow/Grid 개선 - Phase별 상세 계획
**작성일**: 2026-02-16 | **우선순위**: P0-P1 | **총 예상 시간**: 2시간

---

## 🎯 최종 결정사항 확정

| 항목 | 결정 |
|------|------|
| **"가운데 col" 기능** | ✅ **해석 3번**: `golden-center` 배치 모드 추가 |
| **이미지 배치 기능** | ✅ **옵션 1**: 이미지 전용 블록 타입 추가 (image-row, image-grid) |

---

## 📋 Phase 1: 데이터 동기화 버그 수정
**예상 시간**: 10분 | **우선순위**: 🔴 P0 (즉시)

### 현재 상황
- ✅ `resetBlocks()` 메서드: 이미 구현됨 (useBlockEditor.ts:121-128)
- ✅ `undo/redo` 기능: 이미 구현됨 (히스토리 추가됨)
- ❌ **호출 누락**: WorkBlogModal에서 project 로드 시 resetBlocks 호출 안 함

### 수정 대상 파일
**파일**: `src/app/admin/dashboard/work/page.tsx`

### 🔧 구현 계획

#### Step 1: resetBlocks 임포트 확인
```typescript
// WorkBlogModal 컴포넌트에서
const { blocks, resetBlocks } = useBlockEditor();
```

#### Step 2: useEffect에서 동기화
```typescript
// Project 로드 시 항상 블록 리셋
useEffect(() => {
  if (selectedProject?.content?.blocks) {
    console.log('[Sync] Loading blocks:', selectedProject.content.blocks.length);
    resetBlocks(selectedProject.content.blocks);  // ← 이 줄 추가
  }
}, [selectedProject, resetBlocks]);
```

#### Step 3: 콘솔 검증 포인트
```
Before: [useBlockEditor] getBlockCount = 0
        editorContent.blocks = 4
        UI: "4 rows / 0 blocks" ❌

After:  [useBlockEditor] resetBlocks called with 4 blocks
        blocks.length = 4
        UI: "4 rows / 4 blocks" ✅
```

### 📊 예상 결과
```
DB: 4개 블록 ✅
useBlockEditor.blocks: 0개 ❌ → 4개 ✅
UI: 블록 타입 표시 ❌ → 표시 ✅
편집 기능: 작동 안 함 ❌ → 작동 ✅
```

---

## 📋 Phase 2: LayoutRowBlockEditor UI 개선
**예상 시간**: 5분 | **우선순위**: 🟡 P1 (사용성)

### 문제
- "Columns:" vs "Column 1" 라벨이 혼동스러움
- 사용자가 기능 의도를 파악하기 어려움

### 수정 대상 파일
**파일**: `src/components/admin/shared/BlockEditor/blocks/LayoutRowBlockEditor.tsx`

### 🔧 구현 계획

#### Step 1: Header 라벨 변경 (214-215줄)
```typescript
// Before
<span className="text-xs font-semibold text-gray-700">Columns:</span>

// After
<span className="text-xs font-semibold text-gray-700">Layout Mode:</span>
```

#### Step 2: 컬럼 탭 라벨 개선 (334-335줄)
```typescript
// Before
Column {idx + 1}
<span className="ml-1 text-gray-400">({colBlocks.length})</span>

// After
{idx === 0 ? 'Left' : idx === 1 ? 'Center' : 'Right'} Column
<span className="ml-1 text-gray-400">({colBlocks.length} blocks)</span>

// 또는 더 간단하게
Column {idx + 1}
<span className="ml-1 text-[10px] text-gray-400">edit</span>
```

#### Step 3: Settings 패널 헤더 추가 (258-260줄)
```typescript
// Before
<div>
  <label className="block text-xs font-medium text-gray-700 mb-1">
    Distribution
  </label>

// After
<div>
  <div className="text-xs font-semibold text-gray-700 mb-2">
    Column Distribution & Spacing
  </div>
  <label className="block text-xs font-medium text-gray-700 mb-1">
    Distribution
  </label>
```

### 📊 예상 결과
```
Before:
┌─ Columns: [2 Cols] [3 Cols]
├─ [Column 1 (0)] [Column 2 (0)]
└─ Distribution: [Select...]

After:
┌─ Layout Mode: [2 Cols] [3 Cols]
├─ [Left Column (0 blocks)] [Center Column (0 blocks)]
├─ Column Distribution & Spacing:
└─ Distribution: [Select...]
```

---

## 📋 Phase 3: 3 Cols 배치 모드 추가 (golden-center)
**예상 시간**: 15분 | **우선순위**: 🟡 P1 (기능)

### 목표
- 3 Cols 모드에서 가운데 열을 더 넓게 배치 가능
- 분배 모드: equal, golden-left, **golden-center** (새), golden-right, custom

### 수정 대상 파일
**파일**:
- `src/components/admin/shared/BlockEditor/blocks/LayoutRowBlockEditor.tsx`
- `src/components/admin/shared/BlockEditor/renderers/BlockRenderer.tsx`
- `src/types/` (타입 정의)

### 🔧 구현 계획

#### Step 1: 타입 정의 업데이트
**파일**: `src/components/admin/shared/BlockEditor/types.ts`

```typescript
// Before
type LayoutRowBlock = {
  // ...
  distribution?: 'equal' | 'golden-left' | 'golden-right' | 'custom';
};

// After
type LayoutRowBlock = {
  // ...
  distribution?: 'equal' | 'golden-left' | 'golden-center' | 'golden-right' | 'custom';
};
```

#### Step 2: Editor에 옵션 추가
**파일**: `LayoutRowBlockEditor.tsx` (262-275줄)

```typescript
// 현재
<select
  value={block.distribution || 'equal'}
  onChange={(e) =>
    onChange({
      distribution: e.target.value as LayoutRowBlock['distribution'],
    })
  }
  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded bg-white"
>
  <option value="equal">Equal Width</option>
  <option value="golden-left">Golden Ratio (wider left)</option>
  <option value="golden-right">Golden Ratio (wider right)</option>
  <option value="custom">Custom Widths</option>
</select>

// 수정: golden-center 추가
<select
  value={block.distribution || 'equal'}
  onChange={(e) =>
    onChange({
      distribution: e.target.value as LayoutRowBlock['distribution'],
    })
  }
  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded bg-white"
>
  <option value="equal">Equal Width (1:1:1)</option>
  <option value="golden-left">Golden Left (1.618:1:1)</option>
  <option value="golden-center">Golden Center (1:1.618:1)</option>
  <option value="golden-right">Golden Right (1:1:1.618)</option>
  <option value="custom">Custom Widths</option>
</select>
```

#### Step 3: Renderer에 렌더링 로직 추가
**파일**: `BlockRenderer.tsx` (LayoutRowBlockRenderer 함수)

```typescript
// 현재 구조 (간략)
function LayoutRowBlockRenderer({ block, onEditBlock }: Props) {
  let widths: number[];

  switch (block.distribution) {
    case 'equal':
      widths = [1, 1, 1];
      break;
    case 'golden-left':
      widths = [1.618, 1, 1];
      break;
    case 'golden-right':
      widths = [1, 1, 1.618];
      break;
    case 'custom':
      widths = block.customWidths || [1, 1, 1];
      break;
    default:
      widths = [1, 1, 1];
  }
}

// 수정: golden-center 추가
switch (block.distribution) {
  case 'equal':
    widths = [1, 1, 1];
    break;
  case 'golden-left':
    widths = [1.618, 1, 1];
    break;
  case 'golden-center':
    widths = [1, 1.618, 1];  // ← 새로 추가
    break;
  case 'golden-right':
    widths = [1, 1, 1.618];
    break;
  case 'custom':
    widths = block.customWidths || [1, 1, 1];
    break;
  default:
    widths = [1, 1, 1];
}
```

#### Step 4: 비율 계산 함수
```typescript
// Golden Ratio를 실제 픽셀로 변환
const totalRatio = widths.reduce((a, b) => a + b, 0);  // 1 + 1.618 + 1 = 3.618
const columnWidths = widths.map(w => (w / totalRatio) * 100);  // [27.6%, 44.7%, 27.6%]

// 렌더링
<div style={{ display: 'flex', gap: block.columnGap || 24 }}>
  {block.children.map((colBlocks, idx) => (
    <div style={{ width: `${columnWidths[idx]}%` }} key={idx}>
      {/* 블록 렌더링 */}
    </div>
  ))}
</div>
```

### 📊 예상 결과

```
Distribution: Equal Width
[Column 1] [Column 2] [Column 3]
33.3%      33.3%      33.3%

Distribution: Golden Left
[Column 1      ] [Column 2] [Column 3]
61.8%          19.1%      19.1%

Distribution: Golden Center (새로 추가) ✅
[Column 1] [Column 2      ] [Column 3]
27.6%      44.7%          27.6%

Distribution: Golden Right
[Column 1] [Column 2] [Column 3      ]
19.1%      19.1%      61.8%
```

---

## 📋 Phase 4: 이미지 블록 타입 추가
**예상 시간**: 45분 | **우선순위**: 🟢 P2 (고급)

### 목표
- `image-row` 블록: 2-3개 이미지를 행으로 배치
- `image-grid` 블록: 2x2, 3x3 등으로 배치
- LayoutRow/Grid 내에서도 이미지 전용 배치 가능

### 수정 대상 파일
**파일**:
- `src/components/admin/shared/BlockEditor/types.ts` (타입)
- `src/components/admin/shared/BlockEditor/blocks/ImageRowBlockEditor.tsx` (새 파일)
- `src/components/admin/shared/BlockEditor/blocks/ImageGridBlockEditor.tsx` (새 파일)
- `src/components/admin/shared/BlockEditor/renderers/BlockRenderer.tsx` (렌더러)
- `src/components/admin/shared/BlockEditor/BlockToolbar.tsx` (옵션 추가)

### 🔧 구현 계획

#### Step 1: 타입 정의
**파일**: `types.ts`

```typescript
// image-row: 2-3개 이미지를 행으로 배치
export type ImageRowBlock = {
  id: string;
  type: 'image-row';
  images: ImageData[];  // 1-3개
  distribution: 'equal' | 'golden-left' | 'golden-center' | 'golden-right';
  imageHeight: number;  // 고정 높이 (px), 기본값: 300
  gap: number;          // 이미지 간 간격, 기본값: 24
  order: number;
};

// image-grid: 그리드로 배치
export type ImageGridBlock = {
  id: string;
  type: 'image-grid';
  images: ImageData[];  // N개
  template: '2x2' | '3x3' | '2x3' | '3x2';
  gap: number;          // 셀 간격, 기본값: 16
  aspectRatio: 1 | 1.5 | 2;  // 이미지 종횡비
  order: number;
};

// BlockType union에 추가
export type BlockType =
  | 'text' | 'heading' | 'image' | 'gallery' | 'spacer' | 'divider'
  | 'layout-row' | 'layout-grid'
  | 'image-row' | 'image-grid'  // ← 새로 추가
  | 'hero-image' | 'hero-section' | 'work-title' | 'work-metadata'
  | 'work-layout-config' | 'work-gallery';
```

#### Step 2: 에디터 컴포넌트 구현
**파일**: `ImageRowBlockEditor.tsx` (새 파일, ~200줄)

```typescript
'use client';

import React, { useState } from 'react';
import { Plus, X, Settings } from 'lucide-react';
import type { ImageRowBlock, ImageData } from '../types';

interface ImageRowBlockEditorProps {
  block: ImageRowBlock;
  onChange: (data: Partial<ImageRowBlock>) => void;
}

export default function ImageRowBlockEditor({
  block,
  onChange,
}: ImageRowBlockEditorProps) {
  const [showSettings, setShowSettings] = useState(false);

  const handleAddImage = () => {
    // 이미지 업로드 모달 표시
    // TODO: 이미지 선택 로직
  };

  const handleRemoveImage = (idx: number) => {
    const newImages = block.images.filter((_, i) => i !== idx);
    onChange({ images: newImages });
  };

  const handleReorderImage = (fromIdx: number, toIdx: number) => {
    const newImages = [...block.images];
    const [moved] = newImages.splice(fromIdx, 1);
    newImages.splice(toIdx, 0, moved);
    onChange({ images: newImages });
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-gray-700">
          Image Row ({block.images.length})
        </div>
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className={`p-1.5 rounded transition-colors ${
            showSettings
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Settings */}
      {showSettings && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Distribution
            </label>
            <select
              value={block.distribution}
              onChange={(e) =>
                onChange({
                  distribution: e.target.value as ImageRowBlock['distribution'],
                })
              }
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded"
            >
              <option value="equal">Equal Width</option>
              <option value="golden-left">Golden Left</option>
              <option value="golden-center">Golden Center</option>
              <option value="golden-right">Golden Right</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Image Height (px)
            </label>
            <input
              type="number"
              value={block.imageHeight ?? 300}
              onChange={(e) => onChange({ imageHeight: parseInt(e.target.value) || 300 })}
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded"
              min="100"
              max="800"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Gap (px)
            </label>
            <input
              type="number"
              value={block.gap ?? 24}
              onChange={(e) => onChange({ gap: parseInt(e.target.value) || 24 })}
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded"
              min="0"
              max="100"
            />
          </div>
        </div>
      )}

      {/* Image List */}
      <div className="space-y-2">
        {block.images.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-400 bg-gray-50 rounded">
            No images. Click "Add Image" to start.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {block.images.map((img, idx) => (
              <div
                key={idx}
                className="relative group bg-gray-100 rounded overflow-hidden aspect-video"
              >
                <img
                  src={img.url}
                  alt={img.altText}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-red-500 text-white rounded"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Button */}
      <button
        type="button"
        onClick={handleAddImage}
        className="w-full px-3 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center gap-1"
      >
        <Plus size={14} /> Add Image (max 3)
      </button>
    </div>
  );
}
```

**파일**: `ImageGridBlockEditor.tsx` (새 파일, ~220줄)
- ImageRowBlockEditor와 유사한 구조
- Grid 템플릿 선택 추가 (2x2, 3x3, 2x3, 3x2)
- 종횡비 선택 (1, 1.5, 2)

#### Step 3: 렌더러 추가
**파일**: `BlockRenderer.tsx`

```typescript
// Switch case에 추가
case 'image-row':
  return <ImageRowBlockRenderer block={block} onEditBlock={onEditBlock} />;
case 'image-grid':
  return <ImageGridBlockRenderer block={block} onEditBlock={onEditBlock} />;
```

#### Step 4: BlockToolbar에 옵션 추가
**파일**: `BlockToolbar.tsx`

```typescript
// GENERIC_BLOCK_OPTIONS에 추가
const GENERIC_BLOCK_OPTIONS: BlockOption[] = [
  { type: 'text', label: 'Text Block', icon: <Type size={14} /> },
  { type: 'heading', label: 'Heading Block', icon: <Heading2 size={14} /> },
  { type: 'image', label: 'Image Block', icon: <ImageIcon size={14} /> },
  { type: 'gallery', label: 'Gallery Block', icon: <Grid3X3 size={14} /> },
  { type: 'image-row', label: 'Image Row (1-3)', icon: <Columns3 size={14} /> },  // ← 새
  { type: 'image-grid', label: 'Image Grid', icon: <LayoutGrid size={14} /> },    // ← 새
  { type: 'spacer', label: 'Spacer', icon: <ArrowDownFromLine size={14} /> },
  { type: 'divider', label: 'Divider', icon: <Minus size={14} /> },
  { type: 'layout-row', label: 'Row Layout (2-3 cols)', icon: <Columns3 size={14} /> },
  { type: 'layout-grid', label: 'Grid Layout', icon: <LayoutGrid size={14} /> },
];
```

### 📊 예상 결과

```
BlockToolbar:
Generic Blocks:
┌──────────────────────────────┐
│ Text | Heading | Image       │
│ Gallery | Image Row | Image Grid │  ← 새로 추가
│ Spacer | Divider | Layout Row │
│ Layout Grid                  │
└──────────────────────────────┘

Editor:
┌─────────────────────────────┐
│ Image Row (2)               │
├─────────────────────────────┤
│ Distribution: Golden Center │
│ Height: 300px               │
│ Gap: 24px                   │
├─────────────────────────────┤
│ ┌─────────┐ ┌─────────────┐│
│ │  img1   │ │     img2     ││
│ │ (25.6%) │ │   (44.7%)    ││
│ └─────────┘ └─────────────┘│
└─────────────────────────────┘

Rendering:
[Image 1]  [Image 2 (wider)]
```

---

## 🚀 실행 순서 & 체크리스트

### Phase 1: 동기화 버그 수정
- [ ] WorkBlogModal에서 resetBlocks 호출 추가
- [ ] 콘솔에서 "[useBlockEditor] resetBlocks called with 4 blocks" 확인
- [ ] UI에서 "4 rows / 4 blocks" 표시 확인
- [ ] TypeScript 컴파일 에러 없음 확인
- [ ] Commit: `fix: Add resetBlocks call in WorkBlogModal (Phase 1)`

**예상 시간**: 10분

---

### Phase 2: UI 라벨 개선
- [ ] LayoutRowBlockEditor.tsx 수정:
  - [ ] "Columns:" → "Layout Mode:"
  - [ ] "Column 1/2/3" → "Left/Center/Right Column"
  - [ ] Settings 헤더 추가
- [ ] 개발 서버에서 시각 확인
- [ ] 라벨이 명확하게 구분되는지 확인
- [ ] TypeScript 에러 없음
- [ ] Commit: `refactor: Improve LayoutRowBlockEditor UI labels (Phase 2)`

**예상 시간**: 5분

---

### Phase 3: golden-center 배치 모드
- [ ] 타입 정의: `LayoutRowBlock['distribution']`에 'golden-center' 추가
- [ ] LayoutRowBlockEditor.tsx: select 옵션에 추가
- [ ] BlockRenderer.tsx: switch case에 'golden-center' 추가
- [ ] 비율 계산 확인: [1, 1.618, 1]
- [ ] 3 Cols 선택 → Distribution 변경 → 렌더링 확인
- [ ] TypeScript 에러 없음
- [ ] Commit: `feat: Add golden-center distribution mode for 3-column layout (Phase 3)`

**예상 시간**: 15분

---

### Phase 4: 이미지 블록 타입 추가
- [ ] 타입 정의:
  - [ ] `ImageRowBlock` 타입 정의
  - [ ] `ImageGridBlock` 타입 정의
  - [ ] `BlockType` union에 추가
- [ ] 에디터 컴포넌트:
  - [ ] `ImageRowBlockEditor.tsx` 작성
  - [ ] `ImageGridBlockEditor.tsx` 작성
- [ ] 렌더러:
  - [ ] `BlockRenderer.tsx`에 switch case 추가
  - [ ] `ImageRowBlockRenderer` 구현
  - [ ] `ImageGridBlockRenderer` 구현
- [ ] BlockToolbar:
  - [ ] 옵션 추가 ("Image Row", "Image Grid")
  - [ ] 아이콘 정의
- [ ] LayoutRow/Grid 내에서 사용 가능 확인
- [ ] 드래그앤드롭으로 순서 변경 확인
- [ ] TypeScript 에러 없음
- [ ] Build 성공 (모든 페이지 생성)
- [ ] Commit: `feat: Add image-row and image-grid block types (Phase 4)`

**예상 시간**: 45분

---

## 📊 전체 진행 현황

| Phase | 작업 | 시간 | 상태 |
|-------|------|------|------|
| 1 | 동기화 버그 수정 | 10분 | 🔴 준비중 |
| 2 | UI 라벨 개선 | 5분 | ⏳ Phase 1 완료 후 |
| 3 | golden-center 배치 | 15분 | ⏳ Phase 2 완료 후 |
| 4 | 이미지 블록 타입 | 45분 | ⏳ Phase 3 완료 후 |

**총 예상 시간**: 75분 (1시간 15분)

---

## ✅ 최종 검증 기준

### Phase 1 완료 시
```
✅ useBlockEditor.blocks = 4
✅ UI: "4 rows / 4 blocks"
✅ 블록 편집 기능 작동
✅ 저장 시 4개 블록 저장됨
```

### Phase 2 완료 시
```
✅ Header: "Layout Mode: [2 Cols] [3 Cols]"
✅ Tabs: "Left Column (0)" / "Center Column (0)" / "Right Column (0)"
✅ 사용자가 용도 명확하게 이해
```

### Phase 3 완료 시
```
✅ Distribution 옵션:
   - Equal (1:1:1)
   - Golden Left (1.618:1:1)
   - Golden Center (1:1.618:1) ← 새로 추가
   - Golden Right (1:1:1.618)
   - Custom
✅ 3 Cols + Golden Center 선택 시 가운데 열이 넓어짐
```

### Phase 4 완료 시
```
✅ BlockToolbar에 "Image Row", "Image Grid" 옵션 표시
✅ 이미지 1-3개를 행으로 배치 (image-row)
✅ 이미지 N개를 그리드로 배치 (image-grid)
✅ LayoutRow/Grid 내에서도 사용 가능
✅ Build: 모든 페이지 생성 성공
✅ TypeScript: 0 에러
```

---

## 🎯 추가 고려사항

### 이미지 업로드 통합
- `ImageRowBlockEditor`, `ImageGridBlockEditor`에서 이미지 선택 로직 필요
- 기존의 이미지 업로드 모달을 재사용할 수 있음

### 반응형 디자인
- Mobile에서 image-row는 1개씩 표시
- Tablet에서는 2개, Desktop에서는 설정된 대로

### 성능 최적화
- 이미지 lazy loading
- next/image 컴포넌트 사용

### 향후 개선
- 마스터리 갤러리 (이미지 크기 다양함)
- 이미지 캐러셀 (슬라이드)
- 라이트박스 (확대 보기)

---

## 📝 참고사항

### useBlockEditor 현황 (최신)
- ✅ resetBlocks() 메서드: 이미 구현됨
- ✅ undo/redo: 이미 구현됨
- ✅ 히스토리: 이미 구현됨

### 다음 세션 시 확인 필요
- Phase 1 시작 전에 WorkBlogModal 파일 위치 확인
- resetBlocks 호출 위치 정확히 파악
