# 🔧 STUDIO KNOT CMS - Phase별 상세 가이드

**작성일:** 2026-02-16 (재정리)
**구조:** 4 blocks, 3 rows (B-1 Basic)
**방식:** Step-by-step 실행 가이드

---

## 🔴 Phase 1: 데이터 동기화 버그 수정

**목표:** useBlockEditor 훅이 prop 변경을 감지하도록 수정
**소요 시간:** 10분
**파일:** 2개

---

### Step 1-1: useBlockEditor.ts 수정

**파일 경로:** `src/components/admin/shared/BlockEditor/useBlockEditor.ts`

#### 수정 내용

라인 110 (마지막) 앞에 추가:

```typescript
// ✅ 새로 추가: 외부에서 블록 배열을 재설정하는 메서드
const resetBlocks = useCallback((newBlocks: Block[]) => {
  console.log('[useBlockEditor] resetBlocks called with', newBlocks.length, 'blocks');
  setBlocks(reindex(newBlocks));
  setSelectedId(null);  // 선택 상태 초기화
}, []);

// ✅ 새로 추가: 현재 블록 개수 반환 (디버깅용)
const getBlockCount = useCallback(() => blocks.length, [blocks]);
```

#### return 객체 수정

기존:
```typescript
return {
  blocks,
  selectedId,
  setSelectedId,
  addBlock,
  updateBlock,
  deleteBlock,
  reorderBlocks,
  getBlockById,
};
```

수정:
```typescript
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
  getBlockCount,      // ← 추가
};
```

#### 완료 확인
```bash
npx tsc --noEmit
# 에러 없어야 함
```

---

### Step 1-2: WorkBlogModal.tsx 수정

**파일 경로:** `src/components/admin/work/WorkBlogModal.tsx`

#### 수정 1: useBlockEditor 추출

라인 76-84 (현재):
```typescript
const {
  blocks,
  selectedId,
  setSelectedId,
  addBlock,
  updateBlock,
  deleteBlock,
  reorderBlocks,
} = useBlockEditor(editorContent.blocks);
```

수정:
```typescript
const {
  blocks,
  selectedId,
  setSelectedId,
  addBlock,
  updateBlock,
  deleteBlock,
  reorderBlocks,
  resetBlocks,        // ← 추가
  getBlockCount,      // ← 추가 (선택사항, 디버깅용)
} = useBlockEditor(editorContent.blocks);
```

#### 수정 2: 동기화 useEffect 추가

라인 92-94 (현재):
```typescript
useEffect(() => {
  setEditorContent((prev) => ({ ...prev, blocks, rowConfig }));
}, [blocks, rowConfig]);
```

다음에 추가 (라인 95 근처):
```typescript
// 🔄 editorContent.blocks가 변경되면 useBlockEditor와 동기화
useEffect(() => {
  if (editorContent.blocks && editorContent.blocks.length > 0) {
    console.log('[WorkBlogModal] Syncing blocks from editorContent:', editorContent.blocks.length);
    resetBlocks(editorContent.blocks);
  }
}, [editorContent.blocks, resetBlocks]);
```

#### 완료 확인
```bash
npm run build
# 0 에러여야 함
npm run dev
# http://localhost:3000/admin/dashboard/work 접속
```

---

### Step 1-3: 검증

```bash
# 개발 서버 실행
npm run dev

# 테스트
1. http://localhost:3000/admin/dashboard/work 접속
2. "STUDIO KNOT" 프로젝트 "수정" 클릭
3. 모달 좌측 패널 확인:
   ✅ "3 rows / 4 blocks" 표시? (이전: "3 rows / 0 blocks" ❌)
   ✅ 각 블록 타입 표시? (Hero, Title, Text, Gallery)
```

**Phase 1 완료 조건:** `"3 rows / 4 blocks"` 표시됨

---

## 🟡 Phase 2: Studio Knot 블록 데이터 생성 & DB 저장

**목표:** 4개 블록의 BlogContent JSON을 DB에 저장
**소요 시간:** 30분
**방법:** Option A (API) 또는 Option B (UI 수동)

---

### Option A: API 호출로 저장 (권장)

#### Step 2-A-1: Studio Knot UUID 확인

```bash
curl http://localhost:3000/api/admin/work/projects \
  -H "Authorization: Bearer YOUR_TOKEN"

# 응답에서 title이 "STUDIO KNOT"인 프로젝트의 id 찾기
# 예시: "id": "clxxx123yyy4zzz"
```

#### Step 2-A-2: BlogContent JSON 준비

**STUDIO_KNOT_CMS_FINAL_SPECIFICATION.md의 "BlogContent JSON 최종 형식" 섹션 참고**

또는 아래 최소 버전 사용:

```json
{
  "version": "1.0",
  "blocks": [
    {
      "id": "block-hero-knot-1",
      "type": "hero-image",
      "order": 0,
      "url": "/images/work/knot/hero.png",
      "alt": "STUDIO KNOT Hero Image",
      "height": 600,
      "objectFit": "cover"
    },
    {
      "id": "block-title-knot-1",
      "type": "work-title",
      "order": 1,
      "title": "STUDIO KNOT",
      "author": "노하린",
      "email": "havein6@gmail.com",
      "titleFontSize": 60,
      "titleFontWeight": "700",
      "titleColor": "#1b1d1f",
      "authorFontSize": 14,
      "gap": 24
    },
    {
      "id": "block-text-knot-1",
      "type": "text",
      "order": 2,
      "content": "STUDIO KNOT는 입지 않는 옷에 새로운 쓰임을 더해 반려견 장난감으로 재탄생시키는 업사이클링 터그 토이 브랜드입니다. 쉽게 버려지는 의류와 빠르게 닳는 반려견 장난감의 순환 구조를 개선하며, 보호자의 체취가 남은 옷으로 만한 토이는 정서적 가치를 담은 지속가능한 대안을 제시합니다.",
      "fontSize": 18,
      "fontWeight": "400",
      "color": "#1b1d1f",
      "lineHeight": 1.8
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
        { "id": "img-8", "url": "/images/work/knot/gallery-8.png", "alt": "Gallery 8" },
        { "id": "img-9", "url": "/images/work/knot/gallery-9.png", "alt": "Gallery 9" }
      ],
      "imageLayout": 2,
      "gap": 16,
      "minImageHeight": 300
    }
  ],
  "rowConfig": [
    { "layout": 1, "blockCount": 1 },
    { "layout": 2, "blockCount": 2 },
    { "layout": 1, "blockCount": 1 }
  ]
}
```

#### Step 2-A-3: API 호출

```bash
# YOUR_UUID를 Step 2-A-1에서 찾은 ID로 교체
UUID="clxxx123yyy4zzz"

curl -X PUT "http://localhost:3000/api/admin/work/projects/$UUID" \
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
          "alt": "STUDIO KNOT Hero Image",
          "height": 600,
          "objectFit": "cover"
        },
        ... (나머지 3개 블록)
      ],
      "rowConfig": [
        { "layout": 1, "blockCount": 1 },
        { "layout": 2, "blockCount": 2 },
        { "layout": 1, "blockCount": 1 }
      ]
    }
  }'

# 응답: HTTP 200 OK
```

#### 완료 확인
```
✅ HTTP 200 또는 201 응답
✅ /admin/dashboard/work 새로고침 → STUDIO KNOT 클릭 → 4개 블록 표시
```

---

### Option B: Admin CMS UI 수동 입력

#### Step 2-B-1: 모달 열기

```
1. http://localhost:3000/admin/dashboard/work 접속
2. STUDIO KNOT 프로젝트의 "수정" 버튼 클릭
3. 모달 오른쪽 상단의 탭에서 "Content" 탭 클릭
4. 좌측 패널에서 "+ Add Block" 버튼 클릭
```

#### Step 2-B-2: Block 0 추가 (Hero Image)

```
1. 블록 타입 선택: "hero-image"
2. 설정:
   - URL: /images/work/knot/hero.png
   - Alt: STUDIO KNOT Hero Image
   - Height: 600
   - Object Fit: cover
3. [Add Block] 클릭
```

#### Step 2-B-3: Block 1 추가 (Work Title)

```
1. 블록 타입 선택: "work-title"
2. 설정:
   - Title: STUDIO KNOT
   - Author: 노하린
   - Email: havein6@gmail.com
   - Title Font Size: 60
   - Title Font Weight: 700
   - Gap: 24
3. [Add Block] 클릭
```

#### Step 2-B-4: Block 2 추가 (Text)

```
1. 블록 타입 선택: "text"
2. 설정:
   - Content: "STUDIO KNOT는 입지 않는 옷에 새로운 쓰임을..."
   - Font Size: 18
   - Font Weight: 400
   - Line Height: 1.8
3. [Add Block] 클릭
```

#### Step 2-B-5: Block 3 추가 (Work Gallery)

```
1. 블록 타입 선택: "work-gallery"
2. [+ Add Image] 버튼으로 9개 이미지 추가:
   - gallery-1.png (Alt: Gallery 1)
   - gallery-2.png (Alt: Gallery 2)
   ...
   - gallery-9.png (Alt: Gallery 9)
3. Image Layout: 2-Column
4. Gap: 16
5. Min Height: 300
6. [Add Block] 클릭
```

#### Step 2-B-6: rowConfig 설정

```
(자동으로 설정됨)
- Row 0: layout=1, blockCount=1 (Hero)
- Row 1: layout=2, blockCount=2 (Title | Text)
- Row 2: layout=1, blockCount=1 (Gallery)
```

#### 완료 확인
```
✅ 좌측 패널에 "3 rows / 4 blocks" 표시
✅ 우측 미리보기에 모든 내용 렌더링
✅ [Save Changes] 클릭 → HTTP 200 응답
```

---

## 🟢 Phase 3: CMS 기능 검증

**목표:** 모든 CMS 기능이 제대로 작동하는지 검증
**소요 시간:** 20분

---

### Test 3-1: 블록 선택 & 편집

```
1. /admin/dashboard/work 접속
2. STUDIO KNOT 수정 클릭
3. 좌측 패널의 각 블록 클릭:

   ✅ Block 0 (Hero Image) 클릭
      → 중앙: HeroImageBlockEditor 표시
      → 우측: Hero 미리보기

   ✅ Block 1 (Work Title) 클릭
      → 중앙: WorkTitleBlockEditor 표시
      → 필드: title, author, email, 폰트 설정

   ✅ Block 2 (Text) 클릭
      → 중앙: TextBlockEditor 표시
      → 텍스트 편집 가능

   ✅ Block 3 (Work Gallery) 클릭
      → 중앙: WorkGalleryBlockEditor 표시
      → 9개 이미지 목록 + 배치 설정
```

### Test 3-2: 데이터 수정

```
1. Block 1 (Work Title) 선택
2. Author 필드: "노하린" → "노하린 (작가)" 변경
3. 우측 미리보기 즉시 업데이트? ✅

1. Block 2 (Text) 선택
2. Content 처음 20자 삭제
3. 우측 미리보기 즉시 업데이트? ✅
```

### Test 3-3: 갤러리 이미지 관리

```
1. Block 3 (Work Gallery) 선택
2. 이미지 순서 변경:
   - gallery-1과 gallery-2 위치 교체
   - 드래그로 변경 가능? ✅
   - 우측 미리보기 반영? ✅

1. [+ Add Image] 클릭
   - 10번째 이미지 추가 가능? ✅
   - Block 3의 blockCount 증가? ✅

1. gallery-9 [Delete] 클릭
   - 이미지 삭제 가능? ✅
   - blockCount 감소? ✅
```

### Test 3-4: 저장

```
1. [Save Changes] 클릭
   - API 호출? ✅ (PUT /api/admin/work/projects/...)
   - HTTP 200 응답? ✅
   - 성공 메시지? ✅

1. 모달 닫고 STUDIO KNOT 다시 수정
   - 저장된 변경사항 로드? ✅
```

---

## 🔵 Phase 4: 공개 페이지 동기화 검증

**목표:** /work/9에서 DB 데이터가 제대로 렌더링되는지 검증
**소요 시간:** 15분

---

### Test 4-1: 기본 렌더링

```
1. http://localhost:3000/work/9 접속
2. 화면 확인:

   ✅ Hero 이미지 표시
      - URL: /images/work/knot/hero.png
      - 크기: 1200 x 600px (또는 반응형)

   ✅ 좌측 제목 정보
      - "STUDIO KNOT" (60px, 700 weight)
      - "노하린" (14px)
      - "havein6@gmail.com"

   ✅ 우측 설명 텍스트
      - 전체 277자 표시
      - 18px, 400 weight
      - 라인 높이 1.8

   ✅ 갤러리 이미지
      - 9개 이미지 모두 표시
      - 2-column 레이아웃
```

### Test 4-2: CMS 수정 후 반영

```
1. Admin CMS에서 Block 1의 author 변경
   - "노하린" → "노하린 & Team"

2. [Save Changes] 클릭 → HTTP 200

3. /work/9 새로고침 (F5)
   - "노하린 & Team" 표시? ✅

4. Admin CMS에서 Block 3의 imageLayout 변경
   - 2 → 3으로 변경

5. [Save Changes] 클릭

6. /work/9 새로고침
   - 3-column 갤러리 표시? ✅
```

---

## ✅ Phase 5: 최종 검증

**목표:** 모든 기능이 정상 작동하는지 최종 확인
**소요 시간:** 10분

---

### Checklist

```
CMS 기능:
□ 4개 블록 모두 선택 가능
□ 각 블록 타입별 에디터 작동
□ 블록별 데이터 수정 가능
□ 우측 미리보기 실시간 업데이트
□ 저장 기능 작동
□ 데이터 재로드 확인

공개 페이지:
□ Hero 이미지 표시
□ 제목/작가 정보 표시
□ 설명 텍스트 표시
□ 갤러리 9개 이미지 표시
□ CMS 수정 → 공개 페이지 반영

데이터 무결성:
□ DB에 4개 블록 저장됨
□ Block ID 모두 고유함
□ Order: 0, 1, 2, 3
□ rowConfig: 3개 행, layout 설정 정확
□ 이미지 경로 모두 존재
```

---

## 📞 Troubleshooting

### "4 blocks / 3 rows" 여전히 0 blocks 표시?
- ❌ Phase 1 완료 안 됨
- ✅ useBlockEditor.ts와 WorkBlogModal.tsx 다시 확인
- ✅ npm run build에서 에러 없는지 확인

### 이미지 안 보임?
- ❌ 이미지 경로 잘못됨
- ✅ /public/images/work/knot/ 폴더 확인
- ✅ gallery-1.png ~ gallery-9.png 모두 있는지 확인

### 저장 안 됨?
- ❌ 인증 토큰 문제
- ✅ Authorization 헤더 확인
- ✅ NextAuth 설정 확인

### rowConfig 안 맞음?
- ❌ blockCount 합이 blocks 개수와 다름
- ✅ blockCount 합 = 1 + 2 + 1 = 4 ✅
- ✅ blocks 배열 개수 = 4개 ✅

---

**모든 Phase 완료 예상 시간: 85분 (1.5시간)**

