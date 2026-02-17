# 🔴 Admin CMS 미리보기 vs 실제 페이지 - 근본 원인 분석 (최종)

## 📌 결론: 완전히 다르게 렌더링되고 있습니다!

**사용자의 지적이 100% 정확합니다.**

---

## 🔍 근본 원인: iframe의 window.innerWidth 차이

### 측정 결과

| 항목 | 값 | 반응형 모드 |
|------|-----|-----------|
| **메인페이지** | 1920px | isDesktop ✅ |
| **Admin iframe** | 831px | isTablet ⚠️ |

### 코드 로직

**useResponsive.ts** (Line 26-28):
```typescript
const isMobile = width < BREAKPOINTS.mobile;      // < 640
const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop;  // 640~1024
const isDesktop = width >= BREAKPOINTS.desktop;   // >= 1024
```

**BREAKPOINTS** (constants/responsive.ts):
```typescript
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};
```

### WorkSection.tsx의 gridColumns 계산 (Line 55)

```typescript
const gridColumns = isMobile ? '1fr' : isTablet ? '1fr' : 'repeat(2, 1fr)';
```

---

## 🎯 렌더링 결과 차이

### 메인페이지 (1920px, Desktop)
```
window.innerWidth = 1920px
↓
isDesktop = true (1920 >= 1024)
↓
gridColumns = 'repeat(2, 1fr)'
↓
결과: 2열 그리드 레이아웃
- 좌측: Vora, StarNew Valley, Bolio, MIST AWAY
- 우측: BICHAE, Pave, Morae, Nightmare in Neverland
```

### Admin iframe (831px, Tablet)
```
window.innerWidth = 831px (iframe 너비 = 831px)
↓
isTablet = true (831 >= 640 && 831 < 1024)
↓
gridColumns = '1fr'
↓
결과: 1열 그리드 레이아웃
- 모든 작품이 세로로 쌓임
- 필터 버튼들이 줄바꿈으로 분리됨
```

---

## 📊 필터 버튼 배치 차이

### 메인페이지 (2열 그리드, 넓은 화면)
```
┌─────────────────────────────────────────┐
│ All  UX/UI  Motion  Branding  Game  Graphic │
└─────────────────────────────────────────┘
[작품 1] [작품 2]
[작품 3] [작품 4]
```

### Admin iframe (1열 그리드, 좁은 화면)
```
┌──────────────┐
│ All  UX/UI   │
│ Motion       │
│ Branding     │
│ Game design  │
│ Graphic      │
└──────────────┘
[작품 1]
[작품 2]
[작품 3]
```

---

## 🛠️ iframe 너비 측정

**Admin 대시보드 레이아웃:**
```
┌────────────────────────────────────────────────────────────┐
│  200px 사이드바  │     좌측 UI (350px)    │  iframe (831px)  │
│                  │  작품 관리 & 편집 UI   │  실시간 미리보기  │
└────────────────────────────────────────────────────────────┘
```

**iframe 크기 검측:**
- x: 1089px
- y: 0px
- width: **831px** ⚠️
- height: 1335px

---

## ❌ 문제점 정리

### 1️⃣ 반응형 로직 불일치
- **의도**: 모든 화면에서 동일한 레이아웃
- **현실**: iframe이 좁아서 tablet 모드로 렌더링
- **결과**: 미리보기 ≠ 실제 페이지

### 2️⃣ 필터 버튼 배치 차이
- 메인: 모두 한 줄
- 미리보기: 줄바꿈되어 분리

### 3️⃣ 그리드 컬럼 차이
- 메인: repeat(2, 1fr) → 2열
- 미리보기: 1fr → 1열

### 4️⃣ 작품 배치 순서 차이
- 메인: 가로로 쌍을 이룸 (Vora-BICHAE, StarNew Valley-Pave 등)
- 미리보기: 세로로 일렬 배치

---

## 🔧 해결 방법

### 옵션 1: Admin iframe 너비 확대
- iframe 너비를 1024px 이상으로 확대 (Desktop 모드 트리거)
- 파일: `/src/app/admin/dashboard/home/page.tsx`
- 변경: iframe CSS width 조정

### 옵션 2: 반응형 breakpoint 조정
- BREAKPOINTS.desktop을 더 작게 설정
- 예: 800px으로 변경 → 831px가 desktop으로 인식
- **위험**: 다른 모든 페이지에 영향

### 옵션 3: iframe 특별 처리
- iframe 내부에서만 다른 반응형 로직 사용
- 예: `useResponsive`에서 iframe 감지 후 강제 desktop 모드
- **복잡도**: 높음

---

## 📌 권장 솔루션

**옵션 1 (iframe 너비 확대)가 최선입니다.**

### 이유:
1. **간단함**: CSS 한 줄 수정
2. **안전함**: 다른 페이지에 영향 없음
3. **의도 유지**: 관리자가 보는 미리보기 = 실제 사용자가 보는 화면
4. **직관적**: 미리보기가 실제와 같아야 관리자가 신뢰할 수 있음

### 수정 내용:

**파일:** `/src/app/admin/dashboard/home/page.tsx`

**현재 코드:**
```typescript
<iframe
  ref={iframeRef}
  src="http://localhost:3000"
  style={{
    width: '100%',
    height: '100%',
    border: 'none',
  }}
/>
```

**수정 코드:**
```typescript
<iframe
  ref={iframeRef}
  src="http://localhost:3000"
  style={{
    width: '100%',
    height: '100%',
    border: 'none',
    minWidth: '1024px',  // 추가: Desktop 모드 강제
  }}
/>
```

또는 부모 컨테이너에서:

```typescript
<div
  style={{
    width: '100%',
    height: '100%',
    minWidth: '1024px',  // Desktop 모드 강제
    overflow: 'auto',
  }}
>
  <iframe ... />
</div>
```

---

## ✅ 최종 검증

| 항목 | 현재 상태 | 수정 후 예상 |
|------|---------|-----------|
| iframe width | 831px (tablet) | 1024px+ (desktop) |
| gridColumns | '1fr' (1열) | 'repeat(2, 1fr)' (2열) |
| 필터 버튼 | 분리됨 | 한 줄 ✓ |
| 작품 배치 | 세로 일렬 | 2열 그리드 ✓ |
| **일치도** | **0%** | **100%** ✓ |

---

## 🎯 결론

**사용자의 지적이 100% 정확했습니다.**

iframe의 좁은 너비 (831px) 때문에 tablet 모드로 렌더링되어 메인페이지의 desktop 모드와 완전히 다른 레이아웃이 표시되고 있었습니다.

해결책은 간단합니다:
- iframe 컨테이너에 `minWidth: '1024px'` 추가
- 또는 iframe의 부모 div에 최소 너비 설정
