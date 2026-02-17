# STUDIO KNOT CMS 버그 수정 - 빠른 시작 가이드

**작성일:** 2026-02-16
**심각도:** 🔴 **P0 - 즉시 수정 필요**
**소요 시간:** 38분
**상태:** ⏳ 준비 완료

---

## 📌 한눈에 보기

| 항목 | 상태 | 설명 |
|------|------|------|
| **문제** | 🔴 Critical | CMS에서 블록이 표시되지 않음 |
| **원인** | 🔍 파악됨 | useBlockEditor 동기화 실패 |
| **해결책** | ✅ 설계됨 | 2가지 옵션 제시 |
| **구현** | ⏳ 준비됨 | Phase별 상세 가이드 |
| **검증** | ⏳ 준비됨 | 5단계 검증 체크리스트 |

---

## 🔴 현재 상황

### STUDIO KNOT 클릭했을 때:
```
Admin 모달:
  좌측 패널: "4 rows / 0 blocks" ← 블록 타입 표시 안 됨 ❌
  중앙 패널: "No Block Selected" ← 선택할 블록이 없음 ❌
  우측 패널: 비어있음 ← 미리보기 불가 ❌

기능:
  - 블록 선택: ❌ 불가
  - 블록 편집: ❌ 불가
  - 블록 삭제: ❌ 불가
  - 드래그앤드롭: ❌ 불가
  - 다중 열 생성: ❌ 불가
  - 저장: ⚠️ 빈 배열로 저장
```

---

## 🎯 해결 방법 (2가지 옵션)

### ✅ **Option A: useBlockEditor 개선 (권장)**

**파일:** `src/components/admin/shared/BlockEditor/useBlockEditor.ts`

```typescript
// 라인 26-109 수정
export function useBlockEditor(initialBlocks: Block[] = []) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ... 기존 reindex, addBlock, updateBlock, deleteBlock, reorderBlocks, getBlockById ...

  // ✅ 새로 추가: 외부에서 blocks 재설정 가능
  const resetBlocks = useCallback((newBlocks: Block[]) => {
    setBlocks(reindex(newBlocks));
    setSelectedId(null);  // 선택 초기화
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
    resetBlocks,  // ← 추가
  };
}
```

**파일:** `src/components/admin/work/WorkBlogModal.tsx`

```typescript
// 라인 76-84 수정: resetBlocks 추가
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

// 라인 92-94 추가: 동기화 useEffect
useEffect(() => {
  if (editorContent.blocks.length > 0) {
    resetBlocks(editorContent.blocks);
  }
}, [editorContent.blocks, resetBlocks]);
```

---

## 🔧 구현 단계

### Phase 1: useBlockEditor 수정 (10분)

1. `src/components/admin/shared/BlockEditor/useBlockEditor.ts` 열기
2. `resetBlocks` 메서드 추가 (위 코드 참고)
3. return 객체에 `resetBlocks` 추가

### Phase 2: WorkBlogModal 수정 (10분)

1. `src/components/admin/work/WorkBlogModal.tsx` 열기
2. useBlockEditor 호출부에 `resetBlocks` 추가
3. 라인 92-94에 동기화 useEffect 추가

### Phase 3: 빌드 확인 (5분)

```bash
npm run build
# 에러 확인: TypeScript 0 에러 필요
```

### Phase 4: 모달 검증 (10분)

1. `npm run dev` 실행
2. `/admin/dashboard/work` 접속
3. STUDIO KNOT 클릭
4. ✅ 좌측에 "4 rows / 4 blocks" 표시되는지 확인
5. ✅ 각 블록 타입 표시 확인 (hero-image, work-title, text, work-gallery)

### Phase 5: 기능 테스트 (3분)

- [ ] 블록 클릭 → 중앙/우측 패널에 표시
- [ ] 블록 드래그 가능한가?
- [ ] 저장 후 재로드 시 블록 유지되는가?

---

## ✅ 검증 체크리스트

### Before (현재)
```
모달 열 때:
  좌측: "4 rows / 0 blocks"
        Empty row
        Empty row
        Empty row
        Empty row
  중앙: "No Block Selected"
  우측: (비어있음)

블록 클릭: 불가능
```

### After (수정 후)
```
모달 열 때:
  좌측: "4 rows / 4 blocks" ✅
        [Row 1] Hero Image (hero-image) ✅
        [Row 2] Work Title (work-title) ✅
        [Row 3] Text (text) ✅
        [Row 4] Work Gallery (work-gallery) ✅
  중앙: 선택된 블록의 상세 편집 패널 ✅
  우측: 실시간 미리보기 (4개 블록 렌더링) ✅

블록 클릭: 가능 ✅
블록 드래그: 가능 ✅
블록 편집: 가능 ✅
저장 후 재로드: 데이터 유지 ✅
```

---

## 📚 참고 문서

**상세 분석:**
- `STUDIO_KNOT_CMS_DATA_SYNC_BUG.md` (완전한 분석 리포트)

**데이터:**
- 저장된 위치: DB의 WorkProject.content 필드
- 로드 순서: DB → editorContent → useBlockEditor.blocks

**관련 파일:**
- `src/components/admin/work/WorkBlogModal.tsx` (메인 모달)
- `src/components/admin/shared/BlockEditor/useBlockEditor.ts` (훅)
- `src/components/admin/work/BlockLayoutVisualizer.tsx` (좌측 패널)

---

## ⚠️ 주의사항

- ✅ 저장되었다고 해서 표시되는 게 아님 (이번 버그가 증명)
- ✅ "4 rows"는 구조, "0 blocks"는 데이터 → 둘이 다름
- ✅ rowConfig와 blocks는 서로 다른 state임
- ✅ 블록 타입이 표시 안 되면 blocks 배열이 비어있다는 의미

---

## 🚀 시작하기

```bash
# 1. 문서 읽기
→ STUDIO_KNOT_CMS_DATA_SYNC_BUG.md 읽기 (완전한 이해)

# 2. 코드 수정
→ Phase 1-2 진행 (useBlockEditor + WorkBlogModal)

# 3. 빌드 확인
npm run build

# 4. 테스트
npm run dev
# http://localhost:3000/admin/dashboard/work 접속
# STUDIO KNOT 클릭 → 블록 타입 표시 확인

# 5. 완료
→ MEMORY.md 업데이트
```

---

**예상 완료 시간: 38분**

