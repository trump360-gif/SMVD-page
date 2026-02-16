# News 이미지 갤러리 폭 불일치 분석 리포트 (2026-02-17)

## 🔍 문제 현상

- **URL**: http://localhost:3000/news/5 ("2024 시각영상디자인과 졸업전시회")
- **증상**: 갤러리 이미지들(아래의 6개 이미지)이 다른 폭으로 렌더링됨
- **원인**: 공개 페이지와 CMS 미리보기의 레이아웃 방식이 완전히 다름

---

## 📊 코드 비교 분석

### 1️⃣ 공개 페이지 (NewsBlockRenderer - 문제 코드)

**파일**: `src/components/public/news/NewsBlockRenderer.tsx:269-367`

#### GalleryRenderer의 레이아웃 구조:

```javascript
// Line 304-340: 중앙 2개 이미지
<div style={{ display: 'flex', gap: '20px', width: '100%' }}>
  <div style={{
    width: '670px',      // ← 고정 너비!
    height: '670px',
    ...
  }}>
  <div style={{
    width: '670px',      // ← 고정 너비!
    height: '670px',
    ...
  }}>
</div>

// Line 344-364: 하단 3개 이미지
<div style={{ display: 'flex', gap: '20px', width: '100%' }}>
  {[img3, img4, img5].map((img) => (
    <div style={{
      width: '440px',    // ← 고정 너비!
      height: '440px',
      ...
    }}>
  ))}
</div>
```

#### 문제점:

- **고정 너비 사용** (670px, 440px)
- **컨테이너 너비와 불일치** 가능성
  - 2개 이미지: 670 + 20(gap) + 670 = **1360px**
  - 3개 이미지: 440 + 20 + 440 + 20 + 440 = **1360px**
- **조정 불가능**: display: 'flex' 컨테이너가 100% 너비인데도 자식이 고정 너비
- **부모 maxWidth 없음**: 공개 페이지 전체 너비 제한이 없음

---

### 2️⃣ CMS 미리보기 (NewsDetailPreviewRenderer - 정상 코드)

**파일**: `src/components/admin/shared/BlockEditor/renderers/NewsDetailPreviewRenderer.tsx:495-605`

#### Fallback 1+2+3 레이아웃:

```javascript
// Line 525-571: 중앙 2개 이미지
<div style={{ display: 'flex', gap: '20px', width: '100%' }}>
  <div style={{
    flex: 1,           // ← 유연한 너비!
    aspectRatio: '1',
    ...
  }}>
  <div style={{
    flex: 1,           // ← 유연한 너비!
    aspectRatio: '1',
    ...
  }}>
</div>

// Line 574-600: 하단 3개 이미지
<div style={{ display: 'flex', gap: '20px', width: '100%' }}>
  {[img3, img4, img5].map((img) => (
    <div style={{
      flex: 1,         // ← 유연한 너비!
      aspectRatio: '1',
      ...
    }}>
  ))}
</div>
```

#### 장점:

- **유연한 너비** (flex: 1)
- **자동 조정**: 컨테이너 너비에 따라 이미지 크기 자동 조정
- **일관된 비율**: aspectRatio로 정사각형 유지
- **maxWidth 포함**: Line 273-280에 maxWidth: '1440px' + margin: '0 auto' (정상)

---

### 3️⃣ 최상위 컨테이너 비교

#### 공개 페이지 (NewsBlockDetailView - 문제!)

**파일**: `src/app/(public)/news/[id]/page.tsx:185-299`

```javascript
function NewsBlockDetailView({ data }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
      width: '100%',
      // ❌ maxWidth 없음!
    }}>
      {/* 본문 내용 */}
    </div>
  );
}

// 부모 컨테이너 (Line 141-174)
<div style={{
  width: '100%',
  paddingTop: '0px',
  paddingBottom: '61px',
  paddingLeft: '40px',      // ← padding만 있음
  paddingRight: '40px',
  backgroundColor: '#ffffffff',
}}>
  <div style={{
    maxWidth: '1440px',      // ← 여기는 있네?
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '100px',
  }}>
    {result?.type === 'blocks' ? (
      <NewsBlockDetailView data={result.data} /> // ← 문제!
    ) : (
      // Legacy 콘텐츠
    )}
  </div>
</div>
```

#### 문제 발견!

1. **최상위 컨테이너**: maxWidth: 1440px ✓ (Line 153)
2. **NewsBlockDetailView**: maxWidth 없음 ❌ (Line 185-193)
   - 자식이 부모의 maxWidth를 상속받지 않음!

#### CMS 미리보기 (정상!)

**파일**: `src/components/admin/shared/BlockEditor/renderers/NewsDetailPreviewRenderer.tsx:264-611`

```javascript
return (
  <div style={{
    width: '100%',
    backgroundColor: '#ffffff',
    fontFamily: 'Pretendard, sans-serif',
  }}>
    <div style={{
      maxWidth: '1440px',        // ✓ 있음!
      margin: '0 auto',          // ✓ 센터링!
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
      width: '100%',
    }}>
      {/* 콘텐츠 */}
    </div>
  </div>
);
```

---

## 🎯 근본 원인 (Root Cause)

### 2가지 조합된 문제:

| 요소 | 공개 페이지 | CMS 미리보기 | 결과 |
|------|----------|----------|------|
| **이미지 너비 방식** | 고정 (670px, 440px) | 유연 (flex:1) | 🔴 불일치 |
| **최상위 maxWidth** | 있음 (1440px) | 있음 (1440px) | ✓ 같음 |
| **NewsBlockDetailView** | maxWidth 없음 ❌ | N/A (직접 포함) | 🔴 문제 |
| **컨테이너 너비 제한** | padding만 (40px) | maxWidth + margin | 🔴 다름 |

### 결론:

**공개 페이지의 갤러리 이미지들이 고정 너비로 고정되어 있어서 flex 컨테이너 안에서 제대로 조정되지 않음!**

---

## 📐 수정 방안

### ✅ 권장 수정 방법 (3가지)

#### **Option A: GalleryRenderer 수정 (가장 간단)**

**파일**: `src/components/public/news/NewsBlockRenderer.tsx`

```javascript
// Line 304-340 수정
<div style={{ display: 'flex', gap: '20px', width: '100%' }}>
  {images[1] && (
    <div
      style={{
        flex: 1,              // ← 고정 너비 제거, flex:1로 변경
        aspectRatio: '1',     // ← 추가: 정사각형 비율 유지
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      <img ... />
    </div>
  )}
  {images[2] && (
    <div
      style={{
        flex: 1,              // ← 고정 너비 제거, flex:1로 변경
        aspectRatio: '1',     // ← 추가: 정사각형 비율 유지
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      <img ... />
    </div>
  )}
</div>

// Line 344-364 수정
<div style={{ display: 'flex', gap: '20px', width: '100%' }}>
  {[images[3], images[4], images[5]].filter(Boolean).map((img, idx) => (
    <div
      key={img!.id || `bottom-${idx}`}
      style={{
        flex: 1,              // ← 고정 너비 제거, flex:1로 변경
        aspectRatio: '1',     // ← 추가: 정사각형 비율 유지
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      <img ... />
    </div>
  ))}
</div>
```

**변경 사항:**
- `width: '670px'` / `width: '440px'` → `flex: 1`
- `height: '670px'` / `height: '440px'` 제거
- `aspectRatio: '1'` 추가 (정사각형 유지)

**장점:**
- 가장 간단한 수정
- CMS 미리보기와 일치
- 반응형 자동 지원

---

#### **Option B: NewsBlockDetailView에 maxWidth 추가**

**파일**: `src/app/(public)/news/[id]/page.tsx:185-199`

```javascript
function NewsBlockDetailView({ data }: { data: NewsBlockData }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        width: '100%',
        maxWidth: '1440px',          // ← 추가!
        margin: '0 auto',            // ← 추가! 센터링
      }}
    >
      {/* Title and Filter Tabs */}
      {/* Detail Content */}
    </div>
  );
}
```

**장점:**
- 전체 콘텐츠 너비 일정
- 최상위와 일관성

---

#### **Option C: 둘 다 수정 (가장 완벽) ⭐ 권장**

1. **GalleryRenderer**: 고정 너비 → flex:1 (Option A)
2. **NewsBlockDetailView**: maxWidth 추가 (Option B)

---

## 📝 상세 파일 위치

### 수정 필요한 코드 위치:

| 파일 | 라인 | 내용 | 수정 필요 |
|------|------|------|---------|
| `NewsBlockRenderer.tsx` | 304-340 | Center 2 images (670px 고정) | ✅ 필요 |
| `NewsBlockRenderer.tsx` | 344-364 | Bottom 3 images (440px 고정) | ✅ 필요 |
| `NewsBlockRenderer.tsx` | 284-300 | Main image (765px 고정) | ⚠️ 선택 |
| `[id]/page.tsx` | 185-199 | NewsBlockDetailView (maxWidth 없음) | ✅ 필요 |

---

## 🧪 검증 방법

### 수정 후 확인 사항:

```
1. 개발 서버 재시작
   npm run dev

2. 페이지 방문
   http://localhost:3000/news/5

3. 이미지 폭 확인
   ✓ 2개 이미지: 같은 너비 (50% - gap/2)
   ✓ 3개 이미지: 같은 너비 (33.33% - gap)
   ✓ 모든 이미지: 정사각형 비율 (aspectRatio: 1)

4. CMS 미리보기와 비교
   → 동일해야 함!
```

---

## 📋 요약

| 항목 | 문제 | 원인 | 해결책 |
|------|------|------|-------|
| **이미지 폭** | 2개/3개 이미지가 다른 폭 | 고정 너비 (670px, 440px) | flex:1 + aspectRatio:1 |
| **컨테이너 제한** | 전체 폭이 클 수 있음 | maxWidth 없음 | maxWidth:1440px 추가 |
| **반응형 지원** | 화면 크기 변해도 비율 안 맞음 | 고정 너비 사용 | flex 기반으로 변경 |

---

## 🎯 최종 권장사항

**Option C (둘 다 수정) 실행:**

1. ✅ `NewsBlockRenderer.tsx` GalleryRenderer: 고정 너비 → flex:1
2. ✅ `[id]/page.tsx` NewsBlockDetailView: maxWidth + margin 추가
3. ✅ Build & 테스트
4. ✅ Commit: "fix: Fix news gallery image width inconsistency"

이렇게 하면 공개 페이지와 CMS 미리보기가 완벽하게 일치합니다! ✨
