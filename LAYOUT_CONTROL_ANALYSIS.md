# BlockEditor 레이아웃 컨트롤 분석 - 혼동 문제

**작성일**: 2026-02-16
**분석 대상**: Work Gallery 블록 선택 시 UI 레이아웃 컨트롤 중복

---

## 📊 현재 상황: 2개의 레이아웃 컨트롤 발견

### 왼쪽 패널 (BlockLayoutVisualizer) - ROW 컨트롤
```
ROW 3
├─ 1 Col  ← 행의 컬럼 수 결정
├─ 2 Col
├─ 3 Col
└─ 🗑️ Delete row
```

### 중앙 패널 (BlockEditorPanel) - 갤러리 이미지 컨트롤
```
Edit Work Gallery
├─ Image Column Layout
│  ├─ 1 Col  ← 갤러리 이미지 표시 레이아웃
│  ├─ 2 Cols
│  └─ 3 Cols
└─ 9 images (vertical stack, full-width)
```

---

## 🔍 상세 분석

### 1. 왼쪽 1Col/2Col/3Col (ROW 레이아웃 컨트롤)

**용도**: ROW의 컬럼 구조 결정
```
ROW 3에서 "1 Col" 선택 → 이 행은 1개 컬럼만 사용
                        → Work Gallery 블록 1개만 배치 가능

"2 Col"으로 변경 → 이 행을 2개 컬럼으로 나눔
                  → Work Gallery 블록 옆에 다른 블록 배치 가능
```

**작동 상태**: ✅ 정상 (선택 시 색상 변함)

**데이터 흐름**:
```
User clicks "2 Col"
  ↓
handleRowLayoutChange(rowIndex=2, newLayout=2)
  ↓
setRowConfig([...]) → rowConfig 변경
  ↓
useEffect 감지 → setEditorContent 업데이트
  ↓
BlockLayoutVisualizer 재렌더링 (2 Col 표시)
```

---

### 2. 중앙 1 Col/2Cols/3Cols (갤러리 이미지 컬럼 레이아웃)

**용도**: Work Gallery 블록 내의 이미지 표시 방식 결정
```
1 Col  → 9개 이미지를 세로로 1열 배치 (현재)
2 Cols → 9개 이미지를 2열 배치 (3×2 + 3)
3 Cols → 9개 이미지를 3열 배치 (3×3)
```

**작동 상태**: ❓ **불명확 - 기능 분석 필요**

---

## 🔎 중앙 갤러리 레이아웃 컨트롤의 문제점

### 문제 1: 기능 작동 여부 불명확
```
현재 상황:
- "1 Col" 버튼만 활성화되어 있음 (파란색)
- "2 Cols", "3 Cols" 버튼은 비활성 상태 (회색)

의문점:
❓ 클릭해도 반응이 없는 건 아닌가?
❓ 클릭 이벤트가 바인딩되어 있는가?
❓ 실제로 갤러리 이미지 레이아웃이 변경되는가?
```

### 문제 2: 중복성 및 혼동

**왼쪽 ROW 레이아웃과 중앙 이미지 레이아웃의 관계:**
```
┌─────────────────────────────────┐
│ ROW 3 (왼쪽에서 1 Col 선택)     │
│ → 이 행의 컬럼 수 = 1개         │
└─────────────────────────────────┘
              ↓ 이 행에 배치됨
┌─────────────────────────────────┐
│ Work Gallery 블록                │
│ (중앙에서 1 Col 선택)           │
│ → 갤러리 이미지를 1열로 표시    │
└─────────────────────────────────┘
```

**혼동점:**
- 사용자: "1 Col이 2개 있는데 뭐가 다른 거야?"
- 왼쪽: ROW의 구조 결정 (몇 개의 블록을 나란히 배치)
- 중앙: 갤러리의 구조 결정 (이미지를 몇 열로 표시)

---

## 📋 기술 구조 분석

### 왼쪽 ROW 컨트롤 (BlockLayoutVisualizer)

**코드 위치**: `src/components/admin/work/BlockLayoutVisualizer.tsx`

```typescript
handleRowLayoutChange(rowIndex: number, newLayout: 1 | 2 | 3) {
  setRowConfig((prev) => {
    const updated = [...prev];
    if (rowIndex < updated.length) {
      updated[rowIndex] = { ...updated[rowIndex], layout: newLayout };
    }
    return updated;
  });
}
```

**작동**: ✅ 정상 (rowConfig 상태 변경)

---

### 중앙 갤러리 컨트롤 (Work Gallery Editor)

**코드 위치**: `src/components/admin/shared/BlockEditor/blocks/WorkGalleryBlockEditor.tsx`

```typescript
// 추정되는 구조 (실제 코드 확인 필요)
const [imageLayout, setImageLayout] = useState<1 | 2 | 3>(
  block.imageLayout || 1
);

const handleLayoutChange = (layout: 1 | 2 | 3) => {
  setImageLayout(layout);
  updateBlock({
    ...block,
    imageLayout: layout  // ← 블록 데이터 업데이트
  });
};
```

**작동**: ❓ **실제로 작동하는지 확인 필요**

---

## 🎯 확인해야 할 사항

### 1. 갤러리 컨트롤 실제 기능 확인

```
테스트:
□ "2 Cols" 버튼 클릭
□ 갤러리 이미지가 2열로 표시되는가?
□ 저장 후 데이터베이스에 imageLayout: 2 저장되는가?
□ 공개 페이지에서 2열로 렌더링되는가?
```

### 2. UI 반응성 확인

```
현재 상태:
- "1 Col": 파란색 (활성)
- "2 Cols", "3 Cols": 회색 (비활성)

확인 필요:
- 다른 버튼을 클릭하면 색상이 바뀌는가?
- 콘솔에 에러가 있는가?
- 클릭 이벤트가 바인딩되어 있는가?
```

### 3. 데이터 동기화 확인

```
워크플로우:
User clicks "2 Cols"
  ↓
handleLayoutChange 호출?
  ↓
setImageLayout(2)?
  ↓
updateBlock(block) 호출?
  ↓
BlockEditorPanel의 imageLayout 상태 변경?
  ↓
실시간 미리보기에서 2열 표시?
```

---

## 💡 개선 제안

### 현재 설계의 문제점

1. **혼동되는 용어**
   - "Col" (Column) = 행의 컬럼? 갤러리의 컬럼?
   - 명확한 구분 필요

2. **불필요한 중복성**
   - ROW 컨트롤로 이미 레이아웃이 결정됨
   - 갤러리 이미지 레이아웃도 추가로 제어하면 복잡

3. **UI 혼동**
   - 왼쪽과 중앙이 같은 이름의 컨트롤 사용
   - 사용자가 어디를 건드려야 하는지 불명확

### 해결책 (권장)

#### 옵션 1: 용어 명확화 (간단)
```
왼쪽: "Row Layout" (현재: 1 Col, 2 Col, 3 Col)
중앙: "Image Grid" (변경: 1x9, 2x5, 3x3)

이미지 레이아웃 버튼을 다시 설계:
- 1x9: 1열 × 9행 (세로 스택)
- 2x5: 2열 × 5행
- 3x3: 3열 × 3행
```

#### 옵션 2: 갤러리 컨트롤 통합 (복잡)
```
ROW 3의 레이아웃을 "1 Col"로 설정
  ↓
이 행에 Work Gallery 배치
  ↓
Gallery 내부의 이미지는 자동으로 1열 표시
  ↓
추가 제어 불필요
```

#### 옵션 3: 상황별 표시 (권장)
```
ROW 컨트롤: 항상 표시 (행 구조 결정)
갤러리 컨트롤: Work Gallery 선택 시만 표시 (이미지 레이아웃 결정)

→ 현재가 이 방식인데, UI 라벨을 명확히 하면 됨
```

---

## 🔧 다음 단계 (권장 우선순위)

### 1. 긴급 확인 (필수)
```
□ 갤러리 "2 Cols", "3 Cols" 버튼 클릭 시 기능하는가?
□ 기능하지 않으면: 왜 비활성 상태인가?
□ 기능한다면: 실제로 이미지 레이아웃이 변경되는가?
```

### 2. UI 개선 (권장)
```
□ 갤러리 컨트롤 라벨 명확화
  - "Image Column Layout" → "Image Columns per Row"
  - "1 Col" → "1 Column", "2 Cols" → "2 Columns", "3 Cols" → "3 Columns"

□ 시각적 구분 추가
  - 왼쪽 ROW 컨트롤: 파란 배경 + "Row Layout" 라벨
  - 중앙 갤러리 컨트롤: 다른 색상 배경 + "Image Layout" 라벨
```

### 3. 문서화 (선택)
```
□ 사용자 가이드에 각 컨트롤의 용도 설명
□ 스크린샷에 주석 추가
□ 헬프 텍스트 추가
```

---

## 📊 결론

### 현재 상황
- ✅ **왼쪽 ROW 컨트롤**: 작동 정상
- ❓ **중앙 갤러리 컨트롤**: 작동 여부 미확인 + UI 혼동

### 핵심 질문
1. 중앙의 "2 Cols", "3 Cols"는 기능하는가?
2. 만약 기능한다면, 왜 기본값이 "1 Col"로만 활성화되어 있는가?
3. 사용자가 갤러리 이미지의 컬럼 수를 원하는가?

### 권장 액션
1. **긴급**: 갤러리 컨트롤 실제 기능 테스트
2. **높음**: UI 라벨 명확화 (혼동 해결)
3. **중간**: 필요시 갤러리 컨트롤 개선

---

## 📸 참고: 스크린샷 분석

### 왼쪽 ROW 3 컨트롤
```
ROW 3 (파란 테두리, 선택됨)
├─ 1 Col (파란색, 활성)
├─ 2 Col (회색, 비활성)
├─ 3 Col (회색, 비활성)
└─ 🗑️ Delete row
```
→ ROW의 컬럼 수 결정

### 중앙 갤러리 컨트롤
```
Edit Work Gallery
├─ 9 images (vertical stack, full-width)
├─ Image Column Layout
│  ├─ 1 Col (파란색, 활성)
│  ├─ 2 Cols (회색, 비활성)
│  └─ 3 Cols (회색, 비활성)
└─ 이미지 목록 (9개 표시)
```
→ 갤러리 이미지의 표시 방식 결정

**차이점이 명확하지 않아서 혼동 발생!**
