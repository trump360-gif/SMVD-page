# LayoutRowBlockEditor 코드 분석 리포트
**작성일**: 2026-02-16 | **상태**: P0 분석 완료

---

## 🚨 핵심 발견사항

### 문제 1: "2 Cols / 3 Cols" 버튼이 회색(비활성)인 이유

#### 📍 코드 위치
[LayoutRowBlockEditor.tsx:217-238](src/components/admin/shared/BlockEditor/blocks/LayoutRowBlockEditor.tsx#L217-L238)

```typescript
// 버튼 상태 판단 로직 (220-224줄)
className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
  block.columns === 2                           // ← 현재 columns 값이 2인지 확인
    ? 'bg-blue-500 text-white'                  // ✅ 활성 (파란색)
    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'  // ❌ 비활성 (회색)
}`}
```

#### 🔍 근본 원인

| 버튼 상태 | 조건 | 의미 |
|----------|------|------|
| 🔵 파란색 (활성) | `block.columns === 2` OR `block.columns === 3` | 현재 선택된 상태 |
| ⚪ 회색 (비활성) | `block.columns` 값이 다름 | 다른 레이아웃 상태 |

**✅ 정상 동작 확인:**
- Block 객체가 제대로 로드되면, `block.columns`는 2 또는 3의 값을 가져야 함
- 버튼을 클릭하면 `handleChangeColumns()` 함수가 실행되고, 상태가 변경되어야 함

**❌ 문제 시나리오:**
1. **DB 동기화 문제** (PHASE 2-10 버그):
   - `editorContent.blocks`는 4개 로드됨 ✅
   - 하지만 `useBlockEditor.blocks`는 0개 (동기화 안 됨) ❌
   - → `block` 객체 자체가 undefined 또는 columns 값이 없음
   - → 버튼이 회색으로 표시됨

2. **타입 정의 누락**:
   ```typescript
   type LayoutRowBlock = {
     id: string;
     type: 'layout-row';
     columns: 2 | 3;  // ← 반드시 2 또는 3이어야 함
     children: Block[][];
     // ...
   }
   ```

---

### 문제 2: UI 혼동 - 컨트롤 이름 중복

#### 📍 UI 구조
```
┌─────────────────────────────────────────┐
│ LayoutRowBlockEditor                    │
├─────────────────────────────────────────┤
│                                         │
│  ✅ Header (217-253줄)                  │
│  ┌─────────────────────────────────┐  │
│  │ Columns: [2 Cols] [3 Cols]      │  │  ← 컬럼 개수 선택
│  │                          ⚙️     │  │  ← 설정
│  └─────────────────────────────────┘  │
│                                         │
│  ✅ Column Tabs (323-339줄)             │
│  ┌─────────────────────────────────┐  │
│  │ Column 1 (0) Column 2 (0)       │  │  ← 컬럼 선택 (탭)
│  └─────────────────────────────────┘  │
│                                         │
│  ✅ Settings Panel (256-320줄)          │
│  ┌─────────────────────────────────┐  │
│  │ Distribution: [Select...]       │  │  ← 분배 모드
│  │ Column Gap: [24px]              │  │  ← 간격
│  │ Custom Widths: [%] [%] [%]      │  │  ← 커스텀 너비
│  └─────────────────────────────────┘  │
│                                         │
│  ✅ Block Content (342-358줄)           │
│  └─ BlockToolbar + BlockList            │
│                                         │
└─────────────────────────────────────────┘
```

#### 🔴 혼동점 분석

| 구간 | 기능 | 현재 라벨 | 혼동 원인 |
|------|------|---------|---------|
| Header | **컬럼 개수 결정** (2 vs 3) | "Columns: 2 Cols / 3 Cols" | ✅ 명확함 |
| Tabs | **선택할 컬럼** (1, 2, 3번) | "Column 1 / Column 2 / Column 3" | ⚠️ 모호함 |
| Settings | **컬럼 간 설정** (분배, 간격) | "Distribution / Column Gap" | ✅ 명확함 |

**사용자가 헷갈리는 이유:**
```
"Columns: 2 Cols" 선택
     ↓ (확인)
"Column 1", "Column 2" 탭 표시
     ↓ (사용자 생각)
"Column 1"을 선택 = 개수를 1로 줄이는 건가? 아니면 그냥 보기만 하는 건가?
```

**✅ 개선 방안:**
```
Header: "Layout Mode: [2 Column] [3 Column]"  ← "개수"를 명확히
Tabs:   "Column: [#1] [#2] [#3]"               ← "선택"을 명확히
        또는 "Active: Column 1", "Column 2", "Column 3"
```

---

### 문제 3: "가운데 col" (Column 2) 기능 분석

#### 📍 코드 구조

```typescript
// 3 Cols 모드일 때의 탭 생성 로직 (324-338줄)
{block.children.map((colBlocks, idx) => (
  <button key={idx} onClick={() => setSelectedColumnIdx(idx)}>
    Column {idx + 1}        // ← Column 1, Column 2, Column 3
    <span>({colBlocks.length})</span>
  </button>
))}

// 각 컬럼별 블록 관리 (342-358줄)
{selectedColumnBlocks.length === 0 ? (
  <div>No blocks in this column...</div>
) : (
  <BlockList blocks={selectedColumnBlocks} ... />
)}
```

#### 🔍 "가운데 col" 의미 분석

**해석 1: Column 2 탭 자체 삭제?**
```typescript
// 현재 코드 (idx = 1일 때 Column 2 생성)
// 변경 후: idx를 스킵?
block.children.map((colBlocks, idx) => {
  if (idx === 1 && block.columns === 3) return null; // Column 2 스킵?
  return <button>Column {idx + 1}</button>;
})
```
❌ 이렇게 하면 데이터 구조와 맞지 않음 (children은 배열이므로 인덱스가 필요)

**해석 2: 3 Cols 기능 자체 제거?**
```typescript
// 변경 후: 3 Cols 버튼 숨기기
{block.columns === 2 && (
  <button onClick={() => handleChangeColumns(3)}>3 Cols</button>
)}
```
❌ 이렇게 하면 LayoutRowBlock의 columns: 3이 불가능해짐

**해석 3: Column 2의 "가운데 정렬" 또는 "배치" 기능 개선?**
```typescript
// 분배 모드에서 "center" 또는 "golden-center" 추가?
<option value="equal">Equal Width</option>
<option value="golden-left">Golden Ratio (wider left)</option>
<option value="golden-right">Golden Ratio (wider right)</option>
<option value="golden-center">Golden Ratio (wider center)</option>  ← 추가
<option value="custom">Custom Widths</option>
```
✅ 이것이 더 합리적인 해석

---

### 문제 4: 이미지 배치 기능 보완 필요

#### 📍 현재 상태

**BlockToolbar.tsx 에서 제공하는 블록 타입:**

```typescript
// 일반 블록 (34-43줄)
const GENERIC_BLOCK_OPTIONS = [
  { type: 'text', ... },
  { type: 'heading', ... },
  { type: 'image', ... },         // ← 단일 이미지
  { type: 'gallery', ... },       // ← 갤러리
  { type: 'spacer', ... },
  { type: 'divider', ... },
  { type: 'layout-row', ... },    // ← 레이아웃
  { type: 'layout-grid', ... },   // ← 레이아웃
];

// Work 특화 블록 (45-52줄)
const WORK_BLOCK_OPTIONS = [
  { type: 'hero-image', ... },    // ← 860px 히어로
  { type: 'hero-section', ... },  // ← 히어로 섹션
  { type: 'work-gallery', ... },  // ← 작품 갤러리
  // ...
];
```

#### 🔍 LayoutRowBlockEditor에서의 사용

```typescript
// 343줄
<BlockToolbar onAddBlock={handleAddBlock} showWorkBlocks={false} />
//                                                     ↑ 항상 false
```

**문제:**
- `showWorkBlocks={false}`로 고정되어 있음
- → Work 특화 이미지 블록(hero-image, work-gallery)을 사용할 수 없음
- → LayoutRow 컨테이너 내에서는 일반 'image', 'gallery'만 사용 가능

#### ✅ 기능 보완 아이디어

**1. LayoutRow 내 이미지 배치 패턴 추가**
```typescript
// 새로운 블록 타입
type 'image-row' = {  // 2-3개 이미지를 행으로 배치
  id: string;
  type: 'image-row';
  images: ImageData[];  // 1-3개 이미지
  distribution: 'equal' | 'golden-left' | 'golden-right';
  imageHeight: number;  // 이미지 높이 (px)
}
```

**2. LayoutGrid 내 이미지 갤러리 개선**
```typescript
// 개선된 블록 타입
type 'image-grid' = {  // 그리드로 이미지 배치
  id: string;
  type: 'image-grid';
  template: '2x2' | '3x3' | '2x3' | 'masonry';
  images: ImageData[];
  gap: number;
  aspectRatio: number;  // 1 | 1.5 | 2
}
```

**3. 드래그앤드롭으로 이미지 정렬**
```typescript
// LayoutRow/Grid 내에서 이미지 순서 변경
// 현재는 블록 단위로만 가능 → 이미지 단위로 가능하도록
```

---

## 📊 코드 품질 평가

### ✅ 강점
- **타입 안전성**: 완벽한 TypeScript 구현 (discriminated union)
- **상태 관리**: useBlockEditor hook으로 중앙화된 상태 관리
- **확장성**: 새로운 블록 타입 추가가 용이한 구조
- **접근성**: 키보드 네비게이션, Escape 닫기 지원
- **드래그앤드롭**: @dnd-kit 통합으로 부드러운 UX

### ⚠️ 개선 필요 영역
| 항목 | 현재 상태 | 개선 방향 |
|------|---------|---------|
| **UI 라벨링** | 모호함 | "Layout Mode" vs "Select Column" 명확히 구분 |
| **이미지 배치** | 제한적 | 이미지 전용 블록 타입 추가 (image-row, image-grid) |
| **3 Cols 기능** | 미완성 | 가운데 정렬(golden-center) 배치 모드 추가 |
| **동기화** | 버그 있음 | useBlockEditor.resetBlocks() 필수 (Phase 1 수정 필요) |

---

## 🔧 추천 수정 순서

### Phase 1: 동기화 버그 수정 (긴급)
**파일**: `WorkBlogModal.tsx` (또는 프로젝트 로드 로직)
```typescript
// useBlockEditor에 resetBlocks 메서드 있음 (확인됨)
const { blocks, resetBlocks } = useBlockEditor();

// Project 로드 시 동기화
useEffect(() => {
  if (editorContent?.blocks) {
    resetBlocks(editorContent.blocks);  // ← 추가 필요
  }
}, [editorContent, resetBlocks]);
```

### Phase 2: UI 라벨 개선 (사용성)
**파일**: `LayoutRowBlockEditor.tsx:216-239`
- Header "Columns:" → "Layout Mode:"로 변경
- Tabs 라벨 정렬

### Phase 3: 3 Cols 배치 모드 추가 (기능)
**파일**: `LayoutRowBlockEditor.tsx:262-276`
- `golden-center` 분배 모드 추가

### Phase 4: 이미지 블록 개선 (고급)
**파일**: `BlockToolbar.tsx` + 새 블록 타입
- `image-row`, `image-grid` 블록 타입 추가
- LayoutRow/Grid 내에서 이미지 전용 배치 옵션

---

## 📋 체크리스트

### 즉시 수정 (P0)
- [ ] Phase 1: 동기화 버그 (resetBlocks 호출)
- [ ] Phase 2: UI 라벨 명확화

### 단기 개선 (P1)
- [ ] Phase 3: 3 Cols 배치 모드
- [ ] Phase 4: 이미지 배치 기능

### 장기 계획 (P2)
- [ ] 이미지 특화 블록 타입 (image-row, image-grid)
- [ ] 마스터리 갤러리 지원
- [ ] 이미지 캐러셀 블록

---

## 🎯 결론

**주요 발견:**
1. ✅ 코드는 정상 구조 (버튼 클래스/로직 모두 올바름)
2. ⚠️ **실제 문제는 데이터 동기화 버그** (PHASE 2-10)
3. 🔴 UI 라벨 혼동으로 사용성 저하
4. 📊 이미지 배치 기능 제한적

**다음 액션:**
1. PHASE 2-10 버그 수정 (resetBlocks 호출)
2. LayoutRowBlockEditor UI 개선
3. 이미지 배치 기능 보완
