# STUDIO KNOT CMS - 블록 데이터 동기화 버그 분석 및 수정 계획

**작성일:** 2026-02-16
**상태:** 🔴 **Critical - 기능 완전 마비**
**우선순위:** P0 (즉시 수정 필요)

---

## 📋 문제 요약

### 현재 상황
```
✅ DB: 4개 블록 저장됨 (hero-image, work-title, text, work-gallery)
✅ editorContent.blocks: 4개 로드됨
❌ useBlockEditor.blocks: 0개 (동기화 실패)
❌ UI: "4 rows / 0 blocks" 표시 - 블록 타입 표시 안 됨
❌ 기능: 블록 선택 불가 → 편집 불가 → 드래그 불가
```

### 사용자 보고 사항
- "블록 4개 생성되었다고 했는데 실제로는 블록 타입이 표시 안 됨"
- "bltext 블록인지 이미지 블록인지도 모름"
- "그럼 저게 본질적으로 기능을 하고 있는거라고 생각을 해?" → **아니다, 아무것도 기능 안 함**

---

## 🔍 근본 원인 분석

### 문제 흐름 추적

#### **1단계: 컴포넌트 초기 렌더링**
```typescript
// src/components/admin/work/WorkBlogModal.tsx - 라인 66-84

const [editorContent, setEditorContent] = useState<BlogContent>({
  blocks: [],  // ← 초기값: 빈 배열
  version: '1.0',
});

const { blocks, ... } = useBlockEditor(editorContent.blocks);
// ↑ useBlockEditor 훅이 [] 로 초기화
// blocks state = []
```

#### **2단계: project 로드 (useEffect)**
```typescript
// src/components/admin/work/WorkBlogModal.tsx - 라인 279-326

useEffect(() => {
  if (isOpen && project) {
    if (project.content && 'blocks' in project.content) {
      const content = project.content as BlogContent;
      setEditorContent(content);  // ← editorContent 업데이트
      setRowConfig(content.rowConfig || []);  // ← rowConfig 업데이트

      // ⚠️ 문제: useBlockEditor는 업데이트 안 함!
    }
  }
}, [isOpen, project]);
```

#### **3단계: UI 렌더링**
```typescript
// src/components/admin/work/WorkBlogModal.tsx - 라인 648-660

<BlockLayoutVisualizer
  blocks={blocks}  // ← useBlockEditor.blocks = [] ← 0개
  rowConfig={rowConfig}  // ← 4개
  selectedId={selectedId}
  onSelect={setSelectedId}
  ...
/>
```

**결과: "4 rows / 0 blocks"**

---

### 상태 비교표

| 상태 변수 | 초기값 | project 로드 후 | 동기화 | 영향 |
|----------|--------|-----------------|--------|------|
| `editorContent.blocks` | `[]` | `[4개 블록]` ✅ | - | DB에서 로드 됨 |
| `editorContent.rowConfig` | `[]` | `[4개 row]` ✅ | - | DB에서 로드 됨 |
| `blocks` (useBlockEditor) | `[]` | `[]` ❌ | ❌ 동기화 안 됨 | **UI에 표시 안 됨** |
| `rowConfig` (state) | `[]` | `[4개 row]` ✅ | - | UI에 빈 row만 표시 |

---

### 왜 동기화가 안 되나?

#### useBlockEditor 훅 구조 (src/components/admin/shared/BlockEditor/useBlockEditor.ts)

```typescript
export function useBlockEditor(initialBlocks: Block[] = []) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);  // ← 초기값만 사용
  // ...
}
```

**문제:**
- `useState`는 초기값을 한 번만 읽음
- 이후 `initialBlocks`이 변경되어도 감지 안 함
- WorkBlogModal에서 `editorContent.blocks`가 변경되어도 useBlockEditor는 알 수 없음

---

## 🎯 영향 범위

### CMS 기능 완전 마비

| 기능 | 상태 | 이유 |
|------|------|------|
| **블록 선택** | ❌ | blocks 배열이 0개 |
| **블록 편집** | ❌ | 블록이 없으니 선택할 수 없음 |
| **블록 삭제** | ❌ | 블록이 없으니 삭제할 수 없음 |
| **드래그앤드롭** | ❌ | blocks가 0개라 드래그 대상 없음 |
| **다중 열 레이아웃** | ❌ | 드래그앤드롭 작동 안 해서 불가 |
| **실시간 미리보기** | ❌ | blocks가 0개라 아무것도 렌더링 안 됨 |
| **저장** | ⚠️ | 빈 배열로 저장됨 (데이터 손실) |

---

## 📊 데이터 흐름 다이어그램

```
STUDIO KNOT 클릭 (Admin 대시보드)
    ↓
handleEditProject(project)
    ├─ setEditingProject(project)
    └─ WorkBlogModal key 변경 → 리마운트
        ↓
    WorkBlogModal 초기 렌더링
        ├─ editorContent = { blocks: [], ... }
        ├─ useBlockEditor([]) ← blocks state = []
        └─ rowConfig = []

        useEffect (project 로드)
        ├─ setEditorContent(project.content)
        │  └─ editorContent.blocks = [4개] ✅
        ├─ setRowConfig(project.rowConfig)
        │  └─ rowConfig = [4개] ✅
        └─ ⚠️ useBlockEditor.blocks는 여전히 []

        UI 렌더링
        ├─ BlockLayoutVisualizer(blocks=[], rowConfig=[4개])
        │  └─ "4 rows / 0 blocks"  ← 블록 타입 표시 안 됨
        ├─ BlockEditorPanel(block=null)
        │  └─ "No Block Selected"
        └─ WorkDetailPreviewRenderer(blocks=[])
           └─ 비어있음
```

---

## ✅ 해결 방법

### Option A: useBlockEditor 훅 개선 (권장)

**문제 원인:** useState의 초기값만 사용
**해결책:** 외부에서 blocks 업데이트 가능하도록 수정

```typescript
// src/components/admin/shared/BlockEditor/useBlockEditor.ts

export function useBlockEditor(initialBlocks: Block[] = []) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);

  // ✅ 새로 추가: 외부에서 blocks를 재설정할 수 있는 메서드
  const resetBlocks = useCallback((newBlocks: Block[]) => {
    setBlocks(reindex(newBlocks));  // reindex 함수 사용해서 order 정렬
  }, []);

  return {
    blocks,
    selectedId,
    setSelectedId,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    getBlockById,
    resetBlocks,  // ← 새로 추가
  };
}
```

### Option B: WorkBlogModal에서 동기화 (대체안)

```typescript
// src/components/admin/work/WorkBlogModal.tsx - 라인 91-94 추가

// 라인 91-94: editorContent 변경 감지 시 useBlockEditor 동기화
useEffect(() => {
  // editorContent.blocks가 변경되면 useBlockEditor 동기화
  if (editorContent.blocks.length > 0) {
    // useBlockEditor의 blocks를 강제 업데이트
    // (Option A로 resetBlocks 메서드 추가 후 사용)
  }
}, [editorContent.blocks]);
```

---

## 🔧 수정 계획

### Phase 1: useBlockEditor 훅 개선 (10분)

**파일:** `src/components/admin/shared/BlockEditor/useBlockEditor.ts`

```typescript
// 라인 26-109 수정
export function useBlockEditor(initialBlocks: Block[] = []) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const reindex = (arr: Block[]): Block[] =>
    arr.map((block, idx) => withOrder(block, idx));

  // ✅ 새로 추가: 외부 동기화용 메서드
  const resetBlocks = useCallback((newBlocks: Block[]) => {
    setBlocks(reindex(newBlocks));
    setSelectedId(null);  // 선택 리셋
  }, []);

  // ... 기존 메서드들 ...

  return {
    blocks,
    selectedId,
    setSelectedId,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    getBlockById,
    resetBlocks,  // ← 추가
  };
}
```

### Phase 2: WorkBlogModal 동기화 추가 (10분)

**파일:** `src/components/admin/work/WorkBlogModal.tsx`

```typescript
// 라인 76-84 수정
const {
  blocks,
  selectedId,
  setSelectedId,
  addBlock,
  updateBlock,
  deleteBlock,
  reorderBlocks,
  resetBlocks,  // ← 추가
} = useBlockEditor(editorContent.blocks);

// 라인 92-94에 추가
// Sync editorContent.blocks with useBlockEditor
useEffect(() => {
  if (editorContent.blocks.length > 0) {
    resetBlocks(editorContent.blocks);  // ← 동기화
  }
}, [editorContent.blocks, resetBlocks]);
```

### Phase 3: 검증 (5분)

```
✅ STUDIO KNOT 클릭
   └─ 모달 열림 → blocks 로드 확인

✅ 좌측 패널
   └─ "4 rows / 4 blocks" 표시
   └─ 각 블록 타입 표시 (hero-image, work-title, text, work-gallery)

✅ 블록 선택
   └─ 블록 클릭 → 중앙/우측 패널에 표시

✅ 드래그앤드롭
   └─ 블록 드래그 → 위치 변경

✅ 미리보기
   └─ 우측 패널에 블록 렌더링 표시

✅ 저장
   └─ PUT /api/admin/work/projects/[id]
   └─ 4개 블록 DB 저장 확인
```

---

## 📌 기대 결과

### Before (현재)
```
모달 좌측: "4 rows / 0 blocks"
          Empty row
          Empty row
          Empty row
          Empty row

모달 중앙: "No Block Selected"

모달 우측: (비어있음)

기능:     모두 작동 안 함
```

### After (수정 후)
```
모달 좌측: "4 rows / 4 blocks"
          [Row 1] Hero Image (hero-image)
          [Row 2] Work Title (work-title)
          [Row 3] Text (text)
          [Row 4] Work Gallery (work-gallery)

모달 중앙: 선택된 블록의 상세 편집 패널

모달 우측: 실시간 미리보기 (4개 블록 렌더링)

기능:     모두 작동 ✅
         - 블록 선택/편집
         - 드래그앤드롭
         - 삭제/추가
         - 다중 열 레이아웃
         - 저장
```

---

## 🚀 구현 우선순위

| Phase | 작업 | 시간 | 상태 |
|-------|------|------|------|
| **1** | useBlockEditor.resetBlocks() 추가 | 10분 | ⏳ Pending |
| **2** | WorkBlogModal 동기화 useEffect 추가 | 10분 | ⏳ Pending |
| **3** | 모달에서 블록 타입 표시 확인 | 5분 | ⏳ Pending |
| **4** | 드래그앤드롭 작동 확인 | 5분 | ⏳ Pending |
| **5** | 저장 후 재로드 시 블록 유지 확인 | 5분 | ⏳ Pending |
| **6** | MEMORY.md 업데이트 | 3분 | ⏳ Pending |

**총 예상 시간:** 38분

---

## ⚠️ 주의사항

- ✅ 저장되었다고 해서 모달에 표시되는 게 아님 (이번 버그가 증명)
- ✅ 블록 타입이 표시되지 않으면 실제로는 데이터가 로드 안 된 것
- ✅ "4 rows"는 rowConfig인데, "0 blocks"는 실제 블록 데이터 부재를 의미
- ✅ 이 버그로 인해 다중 열 자동 생성 기능도 완전히 마비됨

---

## 📚 참고 문서

- `src/components/admin/work/WorkBlogModal.tsx` - 라인 66-84, 279-326
- `src/components/admin/shared/BlockEditor/useBlockEditor.ts` - 라인 26-109
- `src/components/admin/work/BlockLayoutVisualizer.tsx` - 라인 648-660

