# 🚀 SMVD CMS 완전 구현 로드맵 (2026-02-17)

**문서 목표:**
- 컨텍스트 압축으로 인한 업무 축소 방지
- 변형 없는 정확한 코드 구현
- 타입/API 변경 금지
- 세부 파일 경로 + 라인 번호 + 정확한 코드 제시

---

## 📊 전체 작업량: 42-45시간 (6-7일)

```
Phase 1: 코드 리뷰 필수 개선              7-8시간
Phase 2: 홈페이지 반응형 구현             16.5시간
Phase 3: 선택 개선 항목 (선택사항)        18-24시간
─────────────────────────────────────────
총계:                                      42-45시간
```

---

## 📋 현재 메인페이지 분석

### 반응형 현황: **0% (완전히 데스크톱 전용)**

| 파일 | 위치 | 현재 상태 | 반응형 필요 |
|------|------|---------|-----------|
| **page.tsx** | `src/app/(public)/` | 고정 padding 40px, maxWidth 1360px | ⚠️ 심각 |
| **Header.tsx** | `src/components/public/home/` | 고정 80px, padding 55.5px | ⚠️ 심각 |
| **VideoHero.tsx** | 같음 | 고정 949px | ⚠️ 심각 |
| **ExhibitionSection.tsx** | 같음 | 3컬럼 그리드 고정 | ⚠️ 심각 |
| **AboutSection.tsx** | 같음 | 고정 60px padding | ⚠️ 심각 |
| **WorkSection.tsx** | 같음 | 2컬럼 + 200px 사이드바 고정 | ⚠️ 심각 |
| **Footer.tsx** | 같음 | 고정 81px padding | ⚠️ 심각 |

### 코드 리뷰 필수 개선: **50% 완료됨**

| 항목 | 파일 | 상태 | 액션 |
|------|------|------|------|
| **isEmpty() 함수** | `src/app/api/admin/news/articles/[id]/route.ts:15-16` | ✅ 이미 구현됨 | 검증만 |
| **복잡한 검증 로직** | 같음: Line 145-150 | ✅ 이미 개선됨 | 검증만 |
| **Record<string, any>** | `src/hooks/useWorkEditor.ts:71` | ❌ 아직 남음 | 변경 필요 |
| **XSS 방지** | React Markdown | ❌ 아직 남음 | 추가 필요 |

---

# Phase 1: 코드 리뷰 필수 개선 (7-8시간)

## 1-1: Record<string, any> 제거 (1.5시간)

### 파일 분석

**파일 경로:** `src/hooks/useWorkEditor.ts`

**현재 상태 (Line 71, 55):**
```typescript
// Line 55
content?: Record<string, any>; // BlockEditor content with blocks array

// Line 71
content?: Record<string, any>; // BlockEditor content with blocks array
```

**타입 검증:**
- `BlogContent` 타입 확인 필요
- 파일: `src/components/admin/shared/BlockEditor/types.ts` 또는 `src/types/`

### 수정 방법

1. **BlogContent 타입 import 확인**
   ```bash
   grep -n "export.*BlogContent" src/components/admin/shared/BlockEditor/types.ts
   grep -n "type BlogContent" src/types/
   ```

2. **두 라인 수정**

   **Before (Line 55):**
   ```typescript
   content?: Record<string, any>; // BlockEditor content with blocks array
   ```

   **After:**
   ```typescript
   content?: BlogContent; // BlockEditor content with blocks array
   ```

   **Before (Line 71):**
   ```typescript
   content?: Record<string, any>; // BlockEditor content with blocks array
   ```

   **After:**
   ```typescript
   content?: BlogContent; // BlockEditor content with blocks array
   ```

3. **검증**
   ```bash
   npm run build  # 0 errors 확인
   ```

### 변형 방지 체크리스트
- ✅ 로직 변경 없음 (타입만 명시적으로)
- ✅ API 응답 포맷 변경 없음
- ✅ 함수 동작 변경 없음

---

## 1-2: XSS 방지 구현 (2시간)

### 현황 분석

**문제점:**
- `ReactMarkdown` 사용하는 컴포넌트에서 XSS 위험
- `dangerouslySetInnerHTML` 미발견 (좋은 점)
- 하지만 사용자 입력 마크다운 렌더링 시 위험

**찾기:**
```bash
grep -r "ReactMarkdown" src/components/ --include="*.tsx"
# 결과: WorkDetailPage.tsx, NewsDetailPage.tsx 등

grep -r "dangerouslySetInnerHTML" src/ --include="*.tsx"
# 결과: (미발견 - 좋음)
```

### 구현

1. **유틸 함수 생성**

   **파일:** `src/lib/sanitize.ts` (새 파일)

   ```typescript
   'use client';

   /**
    * Markdown 콘텐츠 기본 검증
    * 위험한 태그는 제거하지만 일반 마크다운은 허용
    */
   export const sanitizeContent = (content: string | null | undefined): string => {
     if (!content) return '';

     // 기본 검증: script 태그 제거
     let sanitized = content
       .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
       .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

     return sanitized;
   };
   ```

2. **사용처 적용**

   **WorkDetailPage.tsx에서:**
   ```typescript
   // Before:
   <ReactMarkdown>{blockContent}</ReactMarkdown>

   // After:
   import { sanitizeContent } from '@/lib/sanitize';
   <ReactMarkdown>{sanitizeContent(blockContent)}</ReactMarkdown>
   ```

3. **검증**
   ```bash
   npm run build
   npm run dev
   # 마크다운 렌더링 정상 확인
   ```

---

## 1-3: logger 사용 확대 (2시간)

### 현황
- API 50%만 logger 적용
- 목표: 100% 적용

### 작업

**패턴:**
```typescript
// 모든 API 라우트에 추가
logger.info({ context: 'GET /api/admin/sections' }, 'Sections fetched');
logger.error({ err: error, context: 'GET /api/admin/sections' }, 'Failed to fetch');
```

**대상 파일들:**
```bash
find src/app/api -name "route.ts" | wc -l
# 약 40개 파일
```

### 검증
```bash
npm run dev
# 콘솔에서 [INFO], [ERROR] 로그 확인
```

---

## 1-4: 기타 구조 개선 (1.5시간)

- src/lib 폴더 구조 정리
- 모달 컴포넌트 분리
- useMemo 추가

**(자세한 내용은 COMPREHENSIVE_IMPLEMENTATION_PLAN.md 참고)**

---

# Phase 2: 홈페이지 반응형 구현 (16.5시간)

## 개요

모든 섹션을 모바일(320px~640px) / 태블릿(640px~1024px) / 데스크톱(1024px+)에 대응

### Breakpoint 정의

**파일:** `src/constants/responsive.ts` (새 파일)

```typescript
export const BREAKPOINTS = {
  mobile: 640,    // 320px ~ 640px
  tablet: 768,    // 640px ~ 1024px
  desktop: 1024,  // 1024px+
  wide: 1440,     // 와이드 데스크톱
};

export const PADDING = {
  mobile: 16,
  tablet: 24,
  desktop: 40,
};

export const GAP = {
  mobile: 20,
  tablet: 24,
  desktop: 40,
};

export const FONT_SIZE = {
  mobile: { h1: 20, h2: 18, body: 14 },
  tablet: { h1: 28, h2: 24, body: 15 },
  desktop: { h1: 40, h2: 32, body: 16 },
};
```

---

## 2-1: Header 반응형 (2시간)

### 파일: `src/components/public/home/Header.tsx`

**현재 상태 (Line 22-31):**
```typescript
<header
  style={{
    width: '100%',
    height: '80px',           // ❌ 고정
    backgroundColor: '#ffffffff',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '55.5px',    // ❌ 고정
    paddingRight: '55.5px',   // ❌ 고정
  }}
>
```

**수정:**

1. `useResponsive` 훅 추가 (상단에)
   ```typescript
   'use client';

   import { useResponsive } from '@/lib/responsive';
   import { PADDING } from '@/constants/responsive';

   export default function Header() {
     const { isMobile, isTablet } = useResponsive();
   ```

2. **Header 스타일 변경 (Line 22-31)**
   ```typescript
   const headerHeight = isMobile ? '64px' : isTablet ? '72px' : '80px';
   const headerPadding = isMobile ? PADDING.mobile : isTablet ? PADDING.tablet : PADDING.desktop;
   const headerPaddingLeft = isMobile ? `${PADDING.mobile}px` : isTablet ? `${PADDING.tablet}px` : '55.5px';
   const headerPaddingRight = isMobile ? `${PADDING.mobile}px` : isTablet ? `${PADDING.tablet}px` : '55.5px';

   <header
     style={{
       width: '100%',
       height: headerHeight,
       backgroundColor: '#ffffffff',
       display: 'flex',
       alignItems: 'center',
       paddingLeft: headerPaddingLeft,
       paddingRight: headerPaddingRight,
     }}
   >
   ```

3. **Navigation gap 변경 (Line 78-81)**
   ```typescript
   // Before:
   gap: '18px',

   // After:
   gap: isMobile ? '8px' : isTablet ? '12px' : '18px',
   ```

4. **Logo 크기 변경 (Line 37-42)**
   ```typescript
   // Before:
   width: '42px',
   height: '42px',

   // After:
   width: isMobile ? '36px' : '42px',
   height: isMobile ? '36px' : '42px',
   ```

---

## 2-2: VideoHero 반응형 (1시간)

### 파일: `src/components/public/home/VideoHero.tsx`

**현재 상태 (Line 6-8):**
```typescript
style={{
  width: '100%',
  height: '949px',  // ❌ 고정
```

**수정:**

```typescript
'use client';

import { useResponsive } from '@/lib/responsive';

export default function VideoHero() {
  const { isMobile, isTablet } = useResponsive();

  const heroHeight = isMobile ? '40vh' : isTablet ? '50vh' : '949px';
  const heroMarginBottom = isMobile ? '24px' : isTablet ? '32px' : '40px';

  return (
    <div
      style={{
        width: '100%',
        height: heroHeight,
        backgroundColor: '#000000ff',
        borderRadius: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: heroMarginBottom,
      }}
    >
```

---

## 2-3: ExhibitionSection 반응형 (1.5시간)

### 파일: `src/components/public/home/ExhibitionSection.tsx`

**현재 상태 (Line 81-87):**
```typescript
<div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',  // ❌ 항상 3컬럼
    gap: '40px',                             // ❌ 고정
    width: '100%',
  }}
>
```

**수정:**

```typescript
'use client';

import Image from 'next/image';
import { useResponsive } from '@/lib/responsive';
import { GAP } from '@/constants/responsive';

export default function ExhibitionSection({ items = [...] }: ExhibitionSectionProps) {
  const { isMobile, isTablet } = useResponsive();

  const gridColumns = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';
  const gridGap = isMobile ? GAP.mobile : isTablet ? GAP.tablet : GAP.desktop;

  return (
    <section
      id="exhibition"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${gridGap}px`,
        width: '100%',
        marginBottom: isMobile ? '40px' : isTablet ? '60px' : '80px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #141414ff',
          paddingBottom: '20px',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '12px' : '0',
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? '20px' : isTablet ? '24px' : '32px',
            fontWeight: '700',
            fontFamily: 'Helvetica',
            color: '#141414ff',
            margin: 0,
          }}
        >
          Exhibition
        </h2>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: gridColumns,
          gap: `${gridGap}px`,
          width: '100%',
        }}
      >
```

---

## 2-4: AboutSection 반응형 (1.5시간)

### 파일: `src/components/public/home/AboutSection.tsx`

**핵심 변경:**

```typescript
'use client';

import { useResponsive } from '@/lib/responsive';
import { PADDING, FONT_SIZE } from '@/constants/responsive';

export default function AboutSection({ ... }) {
  const { isMobile, isTablet } = useResponsive();

  const paddingTop = isMobile ? '32px' : isTablet ? '48px' : '60px';
  const paddingBottom = isMobile ? '32px' : isTablet ? '48px' : '40px';
  const padding = isMobile ? PADDING.mobile : isTablet ? PADDING.tablet : PADDING.desktop;

  const contentPaddingTop = isMobile ? '40px' : isTablet ? '60px' : '80px';
  const contentPaddingBottom = isMobile ? '40px' : isTablet ? '60px' : '80px';

  const fontSize = isMobile ? FONT_SIZE.mobile.h1 : isTablet ? FONT_SIZE.tablet.h1 : FONT_SIZE.desktop.h1;
  const svgSize = isMobile ? '24px' : isTablet ? '28px' : '36px';

  return (
    <section
      id="about"
      style={{
        width: '100%',
        backgroundColor: '#ffffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Title Section */}
      <div
        style={{
          width: '100%',
          paddingTop,
          paddingBottom,
          paddingLeft: `${padding}px`,
          paddingRight: `${padding}px`,
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
          }}
        >
          <h2
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: '700',
              color: '#000000ff',
              fontFamily: 'Helvetica',
              margin: '0',
            }}
          >
            {title}
          </h2>
        </div>
      </div>

      {/* Content Container */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#f0f0f0ff',
          paddingTop: `${contentPaddingTop}px`,
          paddingBottom: `${contentPaddingBottom}px`,
          paddingLeft: `${padding}px`,
          paddingRight: `${padding}px`,
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: isMobile ? '4px' : '8px',
          }}
        >
          {content ? (
            <p
              style={{
                fontSize: `${isTablet ? '15px' : isMobile ? '14px' : '16px'}px`,
                fontWeight: '400',
                lineHeight: 1.6,
                color: '#141414ff',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                margin: '0',
                whiteSpace: 'pre-wrap',
                wordBreak: 'keep-all',
              }}
            >
              {content}
            </p>
          ) : (
            <>
              {/* SVG 아이콘 크기 조정 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: `${fontSize}px`,
                  fontWeight: '500',
                  lineHeight: 1.3,
                  color: '#141414ff',
                  fontFamily: 'Satoshi, sans-serif',
                }}
              >
                FROM VISUAL DELIVERY
                <svg
                  width={svgSize}
                  height={svgSize}
                  viewBox="0 0 50 50"
                  // ... 나머지는 동일
                />
              </div>
              {/* 나머지 라인들도 동일 패턴 적용 */}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
```

---

## 2-5: WorkSection 반응형 (2.5시간 - 가장 복잡함)

### 파일: `src/components/public/home/WorkSection.tsx`

**현재 상태의 문제점:**
- 사이드바 고정 200px (모바일에서 불가능)
- 2컬럼 그리드 고정 (모바일에서 1컬럼 필요)
- 60px gap 고정

**수정 (핵심):**

```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useResponsive } from '@/lib/responsive';

export default function WorkSection({ title = 'Work', items = workItems }: WorkSectionProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(item => item.category === activeCategory || item.category === (activeCategory === 'Game design' ? 'Game' : activeCategory));

  // 반응형 레이아웃 계산
  const headerFontSize = isMobile ? '28px' : isTablet ? '40px' : '48px';
  const mainGap = isMobile ? '24px' : isTablet ? '40px' : '60px';
  const sidebarWidth = isMobile ? '100%' : isTablet ? '100px' : '200px';
  const gridColumns = isMobile ? '1fr' : isTablet ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)';
  const gridGap = isMobile ? '24px' : isTablet ? '40px' : '60px';
  const buttonHeight = isMobile ? '44px' : isTablet ? '50px' : '56px';
  const buttonFontSize = isMobile ? '18px' : isTablet ? '24px' : '32px';

  return (
    <section
      id="work"
      style={{
        width: '100%',
        backgroundColor: '#ffffffff',
        borderTop: '1px solid #adadadff',
        paddingTop: isMobile ? '32px' : isTablet ? '48px' : '61px',
        paddingBottom: isMobile ? '32px' : isTablet ? '48px' : '61px',
      }}
    >
      {/* Header */}
      <div
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          paddingLeft: isMobile ? '16px' : isTablet ? '24px' : '40px',
          paddingRight: isMobile ? '16px' : isTablet ? '24px' : '40px',
          marginBottom: isMobile ? '32px' : '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '12px' : '0',
          paddingBottom: '0',
          borderBottom: '1px solid #adadadff',
        }}
      >
        <h2
          style={{
            fontSize: headerFontSize,
            fontWeight: '500',
            color: '#000000ff',
            fontFamily: 'Inter',
            margin: '0',
            letterSpacing: '-0.128px',
            lineHeight: 1.5,
            paddingBottom: isMobile ? '12px' : '0',
            width: isMobile ? '100%' : 'auto',
          }}
        >
          {title}
        </h2>
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '18px', fontWeight: 'normal', color: '#000000ff', fontFamily: 'Inter' }}>
              More
            </span>
            <img src="/images/icon/Right-3.svg" alt="more" width={14} height={14} />
          </div>
        )}
      </div>

      {/* Main Container: Sidebar + Grid */}
      <div
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          paddingLeft: isMobile ? '16px' : isTablet ? '24px' : '40px',
          paddingRight: isMobile ? '16px' : isTablet ? '24px' : '40px',
          display: 'flex',
          flexDirection: isMobile || isTablet ? 'column' : 'row',
          gap: `${mainGap}px`,
        }}
      >
        {/* Sidebar Filter */}
        <div
          style={{
            width: sidebarWidth,
            flexShrink: 0,
            display: 'flex',
            flexDirection: isMobile || isTablet ? 'row' : 'column',
            gap: isMobile ? '8px' : isTablet ? '12px' : '20px',
            overflowX: isMobile || isTablet ? 'auto' : 'visible',
            paddingBottom: isMobile || isTablet ? '8px' : '0',
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: activeCategory === category ? '0 8px' : '0',
                minWidth: activeCategory === category ? 'auto' : 'auto',
                height: buttonHeight,
                fontSize: buttonFontSize,
                fontWeight: 'normal',
                fontFamily: 'Inter',
                letterSpacing: '0.406px',
                lineHeight: 1.5,
                whiteSpace: 'nowrap',
                backgroundColor: activeCategory === category ? '#000000ff' : 'transparent',
                color: activeCategory === category ? '#ffffffff' : '#3b3b3bff',
                border: 'none',
                cursor: 'pointer',
                opacity: activeCategory === category ? 1 : 0.5,
                transition: 'all 0.2s ease',
              }}
            >
              {activeCategory === category && (
                <img src="/images/check.svg" alt="selected" width={12} height={14} style={{ flexShrink: 0 }} />
              )}
              {category}
            </button>
          ))}
        </div>

        {/* Grid Container */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: gridColumns,
            gap: `${gridGap}px`,
          }}
        >
          {filteredItems.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Image */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '530 / 286',
                  backgroundColor: '#e1e1e1ff',
                  overflow: 'hidden',
                  marginBottom: '16px',
                }}
              >
                <Image src={item.src} alt={item.alt} fill style={{ objectFit: 'cover' }} />
              </div>

              {/* Title + Category */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '14px',
                  borderTop: '1px solid #e1e1e1ff',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? '8px' : '0',
                  alignItems: isMobile ? 'flex-start' : 'center',
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? '18px' : isTablet ? '19px' : '20px',
                    fontWeight: '500',
                    color: '#000000ff',
                    fontFamily: 'Inter',
                    margin: '0',
                    letterSpacing: '-0.449px',
                    lineHeight: 1.5,
                  }}
                >
                  {item.title}
                </h3>
                <span
                  style={{
                    fontSize: isMobile ? '14px' : isTablet ? '16px' : '18px',
                    fontWeight: 'normal',
                    color: '#000000ff',
                    fontFamily: 'Inter',
                    opacity: 0.6,
                    letterSpacing: '-0.439px',
                    lineHeight: 1.5,
                  }}
                >
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 2-6: Footer 반응형 (1시간)

### 파일: `src/components/public/home/Footer.tsx`

**현재 고정:**
- padding: 81px
- fontSize: 16px

**수정:**

```typescript
'use client';

import { useResponsive } from '@/lib/responsive';
import { PADDING } from '@/constants/responsive';

export default function Footer() {
  const { isMobile, isTablet } = useResponsive();

  const padding = isMobile ? PADDING.mobile : isTablet ? PADDING.tablet : PADDING.desktop;
  const footerPadding = isMobile ? '32px' : isTablet ? '48px' : '81px';
  const fontSize = isMobile ? '14px' : isTablet ? '15px' : '16px';
  const iconSize = isMobile ? '24px' : '31px';

  return (
    <footer
      style={{
        width: '100%',
        backgroundColor: '#ebeef4ff',
        borderTop: '1px solid #e5e7ebff',
        paddingTop: footerPadding,
        paddingBottom: footerPadding,
        paddingLeft: `${padding}px`,
        paddingRight: `${padding}px`,
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '24px' : '40px',
          width: '100%',
        }}
      >
        {/* Left Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            flex: 1,
          }}
        >
          <img
            src="/images/icon/Group-27-3.svg"
            alt="logo"
            width={isMobile ? 24 : 31}
            height={isMobile ? 24 : 32}
            style={{ display: 'block' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            <p
              style={{
                fontSize,
                fontWeight: '700',
                color: '#434850ff',
                fontFamily: 'Inter',
                margin: '0',
                lineHeight: 1.6,
                letterSpacing: '-0.3125px',
              }}
            >
              숙명여자대학교 미술대학 시각영상디자인학과
            </p>
            <p
              style={{
                fontSize,
                fontWeight: '400',
                color: '#434850ff',
                fontFamily: 'Inter',
                margin: '0',
                lineHeight: 1.6,
                letterSpacing: '-0.3125px',
              }}
            >
              University of Sookmyung Women, Visual Media Design
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <p
            style={{
              fontSize,
              fontWeight: '700',
              color: '#434850ff',
              fontFamily: 'Inter',
              margin: '0',
              lineHeight: 1.6,
              letterSpacing: '-0.3125px',
            }}
          >
            Contact
          </p>
          <p
            style={{
              fontSize,
              fontWeight: '400',
              color: '#434850ff',
              fontFamily: 'Inter',
              margin: '0',
              lineHeight: 1.6,
              letterSpacing: '-0.3125px',
              whiteSpace: 'pre-line',
            }}
          >
            {'+82 (0)2 710 9958\n서울 특별시 용산구 청파로 47길 100 숙명여자대학교\n시각영상디자인과 (미술대학 201호)'}
          </p>
        </div>
      </div>
    </footer>
  );
}
```

---

## 2-7: page.tsx 메인 컨테이너 반응형 (1시간)

### 파일: `src/app/(public)/page.tsx`

**현재 (Line 80-86):**
```typescript
<div
  style={{
    maxWidth: '1360px',
    margin: '0 auto',
    paddingLeft: '40px',
    paddingRight: '40px',
  }}
>
```

**수정:**

```typescript
'use client';

import { useResponsive } from '@/lib/responsive';
import { PADDING } from '@/constants/responsive';
import { useState, useEffect } from 'react';

export default async function HomePage() {
  // ... 기존 데이터 페칭 로직 ...

  // Client component 래퍼 필요 (useResponsive 사용하려면)
  return <HomePageContent exhibitionItems={exhibitionItems} workItems={workItems} aboutContent={aboutContent} />;
}

function HomePageContent({ exhibitionItems, workItems, aboutContent }) {
  const { isMobile, isTablet } = useResponsive();
  const padding = isMobile ? PADDING.mobile : isTablet ? PADDING.tablet : PADDING.desktop;

  return (
    <div>
      <Header />
      <VideoHero />

      {/* Main Content Container */}
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          paddingLeft: `${padding}px`,
          paddingRight: `${padding}px`,
        }}
      >
        <ExhibitionSection items={exhibitionItems} />
      </div>

      <AboutSection content={aboutContent} />
      <WorkSection items={workItems} />
      <Footer />
    </div>
  );
}
```

---

## 2-8: 테스트 & 검증 (1시간)

### 브라우저 테스트

```bash
# 1. 빌드 검증
npm run build
# 결과: 0 errors, 49/49 pages

# 2. 개발 서버
npm run dev

# 3. 모바일 테스트 (DevTools F12)
# Window > 375px (iPhone SE)
[ ] Header 레이아웃 확인
[ ] VideoHero 반응형 높이
[ ] ExhibitionSection 1컬럼
[ ] WorkSection 사이드바 full-width
[ ] Footer 레이아웃
[ ] 텍스트 크기 가독성
[ ] 터치 버튼 크기 (44px+)

# 4. 태블릿 테스트 (DevTools)
# Window: 768px (iPad)
[ ] ExhibitionSection 2컬럼
[ ] WorkSection 1컬럼 그리드
[ ] 텍스트 크기 적절
[ ] 레이아웃 균형

# 5. 데스크톱 테스트
# Window: 1440px+
[ ] 기존 상태와 동일
[ ] 성능 저하 없음
[ ] Lighthouse 점수 유지

# 6. Performance 측정
npx lighthouse http://localhost:3000 --output-json > /tmp/lighthouse-responsive.json
```

---

## 2-9: Git 커밋

```bash
git add -A
git commit -m "feat: Implement responsive design for homepage

- Add responsive utility hook (useResponsive)
- Add responsive constants (BREAKPOINTS, PADDING, GAP, FONT_SIZE)
- Update Header: 64px/72px/80px (mobile/tablet/desktop)
- Update VideoHero: 40vh/50vh/949px responsive
- Update ExhibitionSection: 1/2/3 column grid
- Update AboutSection: responsive padding + font size
- Update WorkSection: responsive sidebar + grid (most complex)
- Update Footer: responsive padding + font size
- Update page.tsx: responsive main container"

git log --oneline -1  # 커밋 확인
```

---

# Phase 3: 선택 개선 항목 (18-24시간 - OPTIONAL)

(Phase 1 + 2 완료 후 시작)

이는 선택사항이므로 자세 내용은 별도 문서 참고

---

# ✅ 최종 검증 체크리스트

```
Phase 1 (7-8h):
[ ] Record<string, any> → BlogContent 변경
[ ] XSS 방지 유틸 생성 및 적용
[ ] logger 100% 확대
[ ] src/lib 폴더 구조 정리
[ ] TypeScript: npm run build (0 errors)
[ ] Git: git commit Phase-1

Phase 2 (16.5h):
[ ] useResponsive 훅 생성
[ ] BREAKPOINTS/PADDING/GAP/FONT_SIZE 상수 정의
[ ] Header 반응형 완료
[ ] VideoHero 반응형 완료
[ ] ExhibitionSection 반응형 완료
[ ] AboutSection 반응형 완료
[ ] WorkSection 반응형 완료
[ ] Footer 반응형 완료
[ ] page.tsx 메인 컨테이너 반응형 완료
[ ] 모바일 테스트 (375px)
[ ] 태블릿 테스트 (768px)
[ ] 데스크톱 테스트 (1440px)
[ ] Lighthouse 성능 측정
[ ] TypeScript: npm run build (0 errors)
[ ] Git: git commit Phase-2

최종:
[ ] 모든 페이지 빌드 성공
[ ] 모든 반응형 테스트 통과
[ ] 성능 저하 없음
[ ] 타입/API 변경 없음
```

---

# 📌 컨텍스트 압축 방지 전략

이 문서가 컨텍스트 압축으로 축소되면:

1. **각 파일별 정확한 라인 번호 기록** (변경 위치 추적)
2. **Before/After 코드 예시** (복사 붙여넣기 가능)
3. **타입/API 스냅샷** (변경 없음 확인)
4. **검증 명령어** (테스트 방법)
5. **Git 커밋** (진행 상황 기록)

→ **각 단계마다 commit을 생성해서 진행 상황을 GIT에 기록하면 컨텍스트 손실 방지 가능**

---

**작성일:** 2026-02-17
**최종 업데이트:** 2026-02-17
**상태:** 준비 완료 🚀
