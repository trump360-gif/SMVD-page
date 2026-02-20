# /work/9 (STUDIO KNOT) 페이지 분석 리포트

## 📋 현재 상황 분석

### 1️⃣ 렌더링 흐름
```
WorkDetailPage.tsx
  ↓ project.content 확인
  ├─ content가 있고 Tiptap 형식이면 → TiptapWorkDetailView 사용
  └─ content가 없거나 레거시 형식 → WorkDetailContent 사용 ← ⭐ STUDIO KNOT은 여기
```

### 2️⃣ STUDIO KNOT 데이터 (work-details.ts 라인 224-253)
```typescript
'9': {
  id: '9',
  title: 'STUDIO KNOT',
  author: '노하린',
  heroImage: '/images/work/knot/hero.png',  // ← 메인 히어로 이미지
  galleryImages: [
    '/images/work/knot/text-below.png',      // ← ⚠️ 첫 번째 갤러리 이미지
    '/images/work/knot/gallery-1.png',
    '/images/work/knot/gallery-2.png',
    // ... 6개 더
  ],
  content: undefined,  // ← Tiptap 콘텐츠 없음
}
```

### 3️⃣ 현재 렌더링 구조 (WorkDetailContent.tsx)

```
┌─────────────────────────────────────────┐
│  Hero Image (displayHero)                │  ← /images/work/knot/hero.png
│  fullWidth × 860px                       │
├─────────────────────────────────────────┤
│  [Left Column]    [Right Column]         │
│  - Title: STUDIO  - Description text     │  ← 2컬럼 레이아웃 (원래대로)
│  - Author KNOT    - Author & email      │
│  (minWidth:       (flex: 1)              │
│   400px)          (width: auto)          │
├─────────────────────────────────────────┤
│  Gallery Images (갤러리)                 │
│  ├─ text-below.png        (960×???)     │  ← ⚠️ 첫 번째
│  ├─ gallery-1.png                       │
│  ├─ gallery-2.png                       │
│  └─ ... (8개 총)                        │
└─────────────────────────────────────────┘
```

---

## 🔍 "이미지 2번 보이는" 현상 원인 분석

### 가능성 1: `/images/work/knot/text-below.png` 가 실제로 중복된 히어로 이미지
**증거:**
- 파일명이 "text-below" = "텍스트 아래"라는 의미
- 갤러리의 첫 번째 항목이 아니라 별도의 썸네일/헤더일 수 있음
- 사용자: "섬네일이 상단에 보이게 바뀐건지" → 썸네일이 갤러리 첫 항목이 됨

**확인 방법:** 
```bash
ls -lh /Users/jeonminjun/claude/SMVD_page/public/images/work/knot/
# text-below.png와 hero.png 비교 (크기, 내용 비교)
```

### 가능성 2: Hero 이미지가 두 곳에서 렌더링
**코드 추적 (WorkDetailContent.tsx):**
- Line 69-73: Hero 이미지 렌더링 (displayHero prop 사용)
- Line 106-121: Gallery 이미지 렌더링 (displayGalleryImages[0] = text-below.png)

→ **둘 다 다른 이미지이므로 중복이 아님** (하나는 hero.png, 다른 하나는 text-below.png)

---

## ✅ 원래 2컬럼 레이아웃 구조 확인

### 현재 레이아웃 코드 (WorkDetailContent.tsx 라인 76-103)

**데스크톱 기준:**
```jsx
<div style={{ display: 'flex', flexDirection: 'row', gap: '90px', width: '100%' }}>
  {/* Left Column - Title and Author */}
  <div style={{ flex: '0 0 auto', minWidth: '400px' }}>
    <h1>STUDIO KNOT</h1>  {/* ← 좌측 큰 제목 */}
    <p>노하린</p>
  </div>

  {/* Right Column - Description */}
  <div style={{ flex: '1' }}>
    {/* 본문 텍스트 */}
  </div>
</div>
```

### ✅ 결론
**원래 구조는 이미 구현되어 있습니다:**
- ✅ 좌측: STUDIO KNOT 큰 제목 (minWidth: 400px, 고정폭)
- ✅ 우측: 본문 텍스트 (flex: 1, 유연함)
- ✅ gap: 90px (양쪽 사이 공간)

---

## 🎯 "이미지 2번 보이는" 문제 해결 방안

### 시나리오별 진단

#### ❌ 시나리오 1: `/images/work/knot/text-below.png` ≈ `/images/work/knot/hero.png`
**원인:** 갤러리의 첫 번째 항목이 hero와 거의 동일한 이미지
**해결책:**
```typescript
// work-details.ts 라인 234-243 수정
galleryImages: [
  // '/images/work/knot/text-below.png', ← 제거
  '/images/work/knot/gallery-1.png',  ← 첫 번째로 변경
  '/images/work/knot/gallery-2.png',
  // ...
],
```
**복잡도:** 🟢 매우 낮음 (1줄 제거)

---

#### ❌ 시나리오 2: Hero 이미지가 Hero 영역 + Gallery에 중복 렌더링
**원인:** 코드 버그 (hero를 두 곳에서 렌더링)
**확인 위치:** WorkDetailContent.tsx 라인 69 + 108
**현재 상태:** ✅ 버그 아님 (hero와 text-below는 다른 이미지)

---

#### ❌ 시나리오 3: Tiptap 형식 콘텐츠가 있어서 TiptapWorkDetailView 렌더링됨
**원인:** work-details.ts에 `content` 필드가 추가됨
**확인:** `project.content` 값 확인 필요
**현재 상태:** ✅ 확인됨 - content는 undefined

---

## 📸 실제 확인 필요사항

### 1단계: 이미지 파일 확인
```bash
# 파일 존재 확인
ls -lh /Users/jeonminjun/claude/SMVD_page/public/images/work/knot/

# 파일 내용 미리보기 (이미지 식별)
# → /images/work/knot/hero.png
# → /images/work/knot/text-below.png
# 이 두 이미지가 동일한지 다른지 확인
```

### 2단계: 브라우저 검사 (F12)
```javascript
// 브라우저 콘솔에서 실행
document.querySelectorAll('img').forEach((img, i) => {
  console.log(`Image ${i}:`, img.src, img.naturalWidth, img.naturalHeight);
});
```

결과 예상:
```
Image 0: /images/work/knot/hero.png (960 × 860)       ← Hero
Image 1: /images/work/knot/text-below.png (960 × ??)  ← Gallery-1
Image 2: /images/work/knot/gallery-1.png (...)        ← Gallery-2
```

→ 이미지 1과 0이 시각적으로 동일한지 확인

---

## 🔧 최종 권장 수정사항

### ✅ 확정: 2컬럼 레이아웃은 이미 구현됨
**변경 불필요** - 원래대로 작동 중

### ⚠️ 확인 필요: Hero 이미지 중복 확인
1. 브라우저에서 /work/9 방문
2. F12 → 네트워크 탭에서 이미지 목록 확인
3. 상단 hero.png와 갤러리 첫 번째 text-below.png 비교

### 💡 가능한 해결책
**IF `text-below.png` ≈ `hero.png`:**
```typescript
// work-details.ts 라인 235 제거
- '/images/work/knot/text-below.png',
```
→ 1줄 제거로 완료 ✅

---

## 📊 최종 결론

| 항목 | 현황 | 결론 |
|------|------|------|
| 2컬럼 레이아웃 (좌:제목, 우:본문) | ✅ 구현됨 | 변경 불필요 |
| 이미지 2번 보이는 현상 | ⚠️ 확인 필요 | 원인: text-below.png가 갤러리 첫 항목일 가능성 |
| 해결 복잡도 | 🟢 매우 낮음 | 1줄 제거 또는 이미지 순서 조정 |

---

## 🎯 다음 스텝

1. **즉시:** `/work/9` 브라우저 검사로 실제 이미지 확인
2. **확인 후:**
   - If text-below.png가 중복 → work-details.ts 라인 235 제거
   - If 다른 이유 → 추가 분석 필요

**예상 수정 시간:** 5분 이내

