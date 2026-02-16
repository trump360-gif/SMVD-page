# Phase별 실행 계획 - 최종 요약
**작성일**: 2026-02-16 | **상태**: 🚀 실행 준비 완료

---

## 🎯 최종 결정 재확인

✅ **"가운데 col"**: `golden-center` 배치 모드 추가 (해석 3번)
✅ **이미지 배치**: 이미지 전용 블록 타입 (image-row, image-grid)

---

## 📊 Phase별 작업량 요약

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: 동기화 버그 수정                    10분 🔴 긴급    │
│ └─ WorkBlogModal에서 resetBlocks() 호출 추가               │
│                                                             │
│ PHASE 2: UI 라벨 개선                        5분 🟡 사용성   │
│ └─ "Columns:" → "Layout Mode:"                            │
│ └─ "Column 1/2/3" → "Left/Center/Right Column"           │
│                                                             │
│ PHASE 3: golden-center 배치 모드             15분 🟡 기능    │
│ └─ 3 Cols에서 가운데 열을 더 넓게 배치                     │
│ └─ Distribution: equal, golden-left, golden-center(new),  │
│    golden-right, custom                                   │
│                                                             │
│ PHASE 4: 이미지 블록 타입                   45분 🟢 고급    │
│ └─ ImageRowBlock: 1-3개 이미지를 행으로                    │
│ └─ ImageGridBlock: N개 이미지를 그리드로                   │
│ └─ BlockToolbar에 옵션 추가                                │
│                                                             │
│ 총 예상 시간: 75분 (1시간 15분)                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔴 Phase 1: 동기화 버그 수정 (10분) - 즉시 실행!

### 상황
- DB에 4개 블록 저장됨 ✅
- useBlockEditor.blocks: 0개 (동기화 안 됨) ❌
- 결과: CMS 기능 완전 마비

### 해결책
**파일**: `src/app/admin/dashboard/work/page.tsx` (WorkBlogModal)

**수정 내용**:
```typescript
// useBlockEditor에서 resetBlocks 메서드 추출
const { blocks, resetBlocks } = useBlockEditor();

// Project 로드 시 동기화
useEffect(() => {
  if (selectedProject?.content?.blocks) {
    resetBlocks(selectedProject.content.blocks);  // ← 추가
  }
}, [selectedProject, resetBlocks]);
```

### 검증
```
콘솔:  [useBlockEditor] resetBlocks called with 4 blocks
UI:    "4 rows / 4 blocks" ✅
편집:  블록 선택 가능 ✅
```

---

## 🟡 Phase 2: UI 라벨 개선 (5분)

### 문제
```
현재:
┌─ Columns: [2 Cols] [3 Cols]
├─ [Column 1] [Column 2] [Column 3]
└─ Distribution: ...

혼동: "Columns를 선택" vs "Column을 선택" → 뭐가 뭐지?
```

### 개선
```
수정 후:
┌─ Layout Mode: [2 Cols] [3 Cols]
├─ [Left Column] [Center Column] [Right Column]
└─ Column Distribution & Spacing:
    Distribution: ...
```

**파일**: `src/components/admin/shared/BlockEditor/blocks/LayoutRowBlockEditor.tsx`

**변경 3줄**:
1. Line 214: "Columns:" → "Layout Mode:"
2. Line 335: "Column {idx + 1}" → "Left/Center/Right Column"
3. Line 258: Settings 헤더 추가

---

## 🟡 Phase 3: golden-center 배치 모드 (15분)

### 목표
3 Cols 모드에서 가운데 열을 더 넓게 배치 가능

### 구현
```
┌─ 타입 정의
│  BlockType: 'equal' | 'golden-left' | 'golden-center' | 'golden-right' | 'custom'
│
├─ Editor (LayoutRowBlockEditor.tsx)
│  <select>
│    <option value="equal">Equal Width (1:1:1)</option>
│    <option value="golden-left">Golden Left (1.618:1:1)</option>
│    <option value="golden-center">Golden Center (1:1.618:1) ← NEW</option>
│    <option value="golden-right">Golden Right (1:1:1.618)</option>
│    <option value="custom">Custom Widths</option>
│  </select>
│
└─ Renderer (BlockRenderer.tsx)
   case 'golden-center':
     widths = [1, 1.618, 1];  // 가운데 열이 1.618배 넓음
```

### 렌더링 예시
```
Distribution: Golden Center
┌──────┬──────────────┬──────┐
│ 27.6%│    44.7%     │27.6% │
│ Col1 │  Col2 (wider)│ Col3 │
└──────┴──────────────┴──────┘
```

---

## 🟢 Phase 4: 이미지 블록 타입 (45분) - 고급

### 목표
LayoutRow/Grid 내에서 이미지를 전용 블록으로 배치

### 1️⃣ ImageRowBlock (1-3개 이미지를 행으로)

```typescript
type ImageRowBlock = {
  type: 'image-row';
  images: ImageData[];          // 1-3개
  distribution: 'equal' | 'golden-left' | 'golden-center' | 'golden-right';
  imageHeight: 300;             // 고정 높이
  gap: 24;                      // 간격
};
```

**UI**:
```
Image Row (2)
Distribution: Golden Center
Height: 300px
Gap: 24px
┌─────────┐ ┌──────────────┐
│ Image 1 │ │  Image 2 (w) │
│(25.6%)  │ │   (44.7%)    │
└─────────┘ └──────────────┘
```

### 2️⃣ ImageGridBlock (N개 이미지를 그리드로)

```typescript
type ImageGridBlock = {
  type: 'image-grid';
  images: ImageData[];          // N개
  template: '2x2' | '3x3' | '2x3' | '3x2';
  gap: 16;                      // 셀 간격
  aspectRatio: 1 | 1.5 | 2;    // 종횡비
};
```

**UI**:
```
Image Grid (4)
Template: 2x2
Aspect Ratio: 1 (정사각형)
Gap: 16px
┌────────┬────────┐
│Image 1 │Image 2 │
├────────┼────────┤
│Image 3 │Image 4 │
└────────┴────────┘
```

### 3️⃣ BlockToolbar 옵션 추가

```typescript
GENERIC_BLOCK_OPTIONS: [
  ...
  { type: 'image-row', label: 'Image Row (1-3)', icon: <Columns3 /> },  // ← NEW
  { type: 'image-grid', label: 'Image Grid', icon: <LayoutGrid /> },    // ← NEW
  ...
]
```

### 파일 생성/수정

**새로 생성**:
- `ImageRowBlockEditor.tsx` (~200줄)
- `ImageGridBlockRenderer.tsx` (~150줄)

**수정**:
- `types.ts`: ImageRowBlock, ImageGridBlock 타입 정의
- `BlockRenderer.tsx`: switch case 추가
- `BlockToolbar.tsx`: 옵션 추가

---

## ✅ 최종 검증 체크리스트

### Phase 1 완료 시
```
□ resetBlocks 호출 추가됨
□ 콘솔: "[useBlockEditor] resetBlocks called with 4 blocks"
□ UI: "4 rows / 4 blocks" 표시
□ 블록 편집 가능
□ 저장하면 4개 블록 저장됨
□ TypeScript: 0 에러
□ Commit: "fix: Add resetBlocks call in WorkBlogModal"
```

### Phase 2 완료 시
```
□ Header 라벨 변경됨
□ Tabs 라벨 변경됨
□ Settings 헤더 추가됨
□ 용도가 명확하게 구분됨
□ TypeScript: 0 에러
□ Commit: "refactor: Improve LayoutRowBlockEditor UI labels"
```

### Phase 3 완료 시
```
□ golden-center 옵션 표시됨
□ 3 Cols + Golden Center 선택 시 렌더링 확인
□ 가운데 열이 wider(44.7%)로 표시됨
□ 양쪽 열은 narrower(27.6%)로 표시됨
□ TypeScript: 0 에러
□ Build: 모든 페이지 생성 성공
□ Commit: "feat: Add golden-center distribution mode for 3-column layout"
```

### Phase 4 완료 시
```
□ ImageRowBlock 타입 정의됨
□ ImageGridBlock 타입 정의됨
□ ImageRowBlockEditor.tsx 구현됨
□ ImageGridBlockEditor.tsx 구현됨
□ BlockRenderer에 switch case 추가됨
□ BlockToolbar에 옵션 표시됨
□ LayoutRow/Grid 내에서 사용 가능
□ 이미지 1-3개 행으로 배치 가능
□ 이미지 N개 그리드로 배치 가능
□ TypeScript: 0 에러
□ Build: 모든 페이지 생성 성공
□ Commit: "feat: Add image-row and image-grid block types"
```

---

## 🎯 실행 명령어

### Phase 1 시작
```bash
# WorkBlogModal 찾기
grep -r "const { blocks" src/app/admin/dashboard/work/

# 수정 후 빌드
npm run build

# 테스트
npm run dev
# http://localhost:3000/admin/dashboard/work 방문 후
# 프로젝트 선택 → 콘솔 확인
```

### Phase 2-4 진행
```bash
# 각 Phase마다 빌드 및 테스트
npm run build
npm run dev

# TypeScript 확인
npx tsc --noEmit

# 커밋
git add -A
git commit -m "feat: [Phase N] ..."
```

---

## 📌 중요 참고사항

### useBlockEditor 업데이트 (이미 완료됨)
```typescript
// ✅ 이미 있는 메서드들
resetBlocks()         // 블록 배열 강제 재설정
undo()               // 이전 상태로
redo()               // 다음 상태로
canUndo / canRedo    // 가능 여부
getBlockCount()      // 블록 개수 반환
```

### 타입 계층 구조
```
BlockType (union)
  ├─ 'text'
  ├─ 'image'
  ├─ 'layout-row'
  ├─ 'layout-grid'
  ├─ 'image-row'      ← Phase 4에서 추가
  ├─ 'image-grid'     ← Phase 4에서 추가
  └─ 'work-gallery'
```

### 데이터 흐름
```
BlockToolbar (옵션 선택)
  ↓
onAddBlock(type)
  ↓
useBlockEditor.addBlock(type)
  ↓
BlockList 렌더링
  ↓
BlockEditor 컴포넌트 표시
  ↓
onChange 콜백 → 상태 업데이트
```

---

## 🚀 시작 준비 상황

| 항목 | 상태 |
|------|------|
| 코드 분석 | ✅ 완료 |
| Phase 계획 | ✅ 완료 |
| 파일 목록 | ✅ 정의됨 |
| 타입 정의 | ✅ 준비됨 |
| 변경사항 | ✅ 리스트업 |

**→ 언제든 Phase 1부터 시작 가능! 🚀**

---

## 📋 추가 문서 참고

1. **LAYOUT_ROW_CODE_ANALYSIS.md** - 상세 코드 분석
2. **LAYOUT_IMPROVEMENTS_PHASE_PLAN.md** - Phase별 상세 계획

이 두 문서를 나란히 열고 작업하면 효율적입니다!
