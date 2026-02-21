# GSAP 애니메이션 구현 가이드 - SMVD 메인 페이지

> 작성일: 2026-02-20
> Figma 토큰: `[FIGMA_TOKEN_REDACTED]`
> Figma 파일: `14YAcBaazZsFWFwMFU39RA`

---

## 1. Figma 프로토타입 분석 결과

### Figma API로 추출한 전체 인터랙션 목록

| # | 영역 | Figma Node ID | 트리거 | 효과 | 시간 |
|---|------|---------------|--------|------|------|
| 1 | 로딩 스크린 | `6333:10566` | 3초 후 자동 | Dissolve → Default | 0.3s |
| 2 | 히어로 (Default→Interaction) | `2137:11516` | MOUSE_ENTER | hero 이미지 페이드아웃 (Dissolve) | 0.6s ease-in-out |
| 3 | 히어로 (Interaction→Default) | `2137:14948` | MOUSE_LEAVE | hero 이미지 복귀 (Dissolve) | 0.3s ease-in-out |
| 4 | 타이포 애니메이션 1 | `2094:10213` | 0ms 후 자동 | Smart Animate (SLOW) | 2.5s |
| 5 | 타이포 애니메이션 2 | `2094:10214` | 200ms 후 자동 | Smart Animate (SLOW) | 2.5s |
| 6 | 타이포 애니메이션 3 | `2094:10215` | 400ms 후 자동 | Smart Animate (SLOW) | 2.5s |
| 7 | 타이포 애니메이션 4 | `2094:10216` | 700ms 후 자동 | Smart Animate (SLOW) | 2.5s |
| 8 | Exhibition 카드 (5개) | `2137:11458` 등 | ON_HOVER | Smart Animate | 0.4s |
| 9 | Work 카드 (10개) | `2137:11488` 등 | ON_HOVER | Smart Animate | 0.3s |
| 10 | 카테고리 칩 (6개) | `2137:11502` 등 | ON_HOVER | Smart Animate (opacity) | 0.3s |
| 11 | PC 스크롤 | 전체 | 스크롤 | 스크롤 애니메이션 | - |

### Figma 메인 프레임 구조

```
main 시안_loading (6333:10566) - 1440x5075
  ├── loding animation_1 2 (배경 이미지)
  ├── Glass Circle (radius=999, GLASS effect, DROP_SHADOW)
  └── 3초 후 → main 시안_Default로 DISSOLVE 전환

main 시안_Default (2137:11375) - 1440x5075
  ├── hero_1 (1440x949) - 커버 이미지
  ├── Comp_Final 1 (1440x800, opacity 90%) - 그라데이션 오버레이
  ├── Comp_Final 2 (1300x722) - 추가 오버레이
  ├── Glass Circle (1513x1513, radius=999)
  │   ├── fill: rgba(0,0,0,0.004)
  │   ├── effect: GLASS + DROP_SHADOW(y:4, blur:14, spread:4, black 13%)
  │   └── clipsContent: true
  ├── "Visual Media Design" 텍스트 (868x134)
  ├── hover area (948x374) → MOUSE_ENTER triggers
  ├── Exhibition 섹션 (1440x849)
  ├── Vision / About SMVD 섹션
  ├── Work 섹션 (1440x1827)
  └── Info 푸터 (1442x338)

main 시안_interaction (2137:14807) - 1440x5075
  ├── hero_1 → 1x0.66 (사라짐!)  ← 핵심 차이!
  ├── 나머지 동일
  └── hover area → MOUSE_LEAVE triggers
```

### Default vs Interaction 비교 (핵심!)

| 요소 | Default | Interaction | 변화 |
|------|---------|-------------|------|
| hero_1 (커버) | 1440x949 (보임) | 1x0.66 (사라짐) | 페이드아웃 |
| Glass Circle | 1513x1513 | 1513x1513 | 동일 |
| Comp_Final | opacity 90% | opacity 90% | 동일 |
| 텍스트 | 보임 | 보임 | 동일 |

**결론:** 마우스 호버 시 커버 이미지만 사라지면서 뒤의 그라데이션이 더 선명하게 보임

---

## 2. 히어로 이미지 에셋 매핑

### Figma imageRef → 로컬 파일 매핑

| Figma 레이어 | imageRef | 로컬 파일 | 상태 |
|-------------|----------|----------|------|
| hero_1 (커버) | `318ef6adb1ff...` | `public/images/home/318ef6adb1ffc52de5cea722262251cd1a19a000.webp` | ✅ 있음 |
| Comp_Final 1 (그라데이션) | `758e03053f46...` | `public/images/home/758e03053f4610d36f4ac31a3c4ac73fe8943409.webp` | ✅ 있음 |
| Comp_Final 2 | `7b487bfe9da5...` | `public/images/home/7b487bfe9da588e663aaaf4bac656794bdcd8b44.webp` | ✅ 있음 |
| loding animation | `bf44c9de4528...` | - | ❌ 없음 (Figma에서 내보내기 필요) |

### 로딩 이미지 내보내기 방법
```bash
# Figma API로 로딩 이미지 다운로드
curl -s -H "X-Figma-Token: [FIGMA_TOKEN_REDACTED]" \
  "https://api.figma.com/v1/images/14YAcBaazZsFWFwMFU39RA?ids=2137-11374&format=png&scale=1"
# 반환된 URL에서 다운로드하여 public/images/home/에 저장
```

---

## 3. 현재 코드 상태

### 이미 완료된 작업 (Phase 1-3 부분)

| 파일 | 상태 | 설명 |
|------|------|------|
| `src/lib/gsap.ts` | ✅ NEW | GSAP + ScrollTrigger 등록 |
| `src/hooks/useGsapAnimation.ts` | ✅ NEW | GSAP context 훅 (SSR safe, reduced motion) |
| `src/hooks/useScrollReveal.ts` | ✅ NEW | ScrollTrigger 스크롤 리빌 훅 |
| `src/components/public/home/VideoHero.tsx` | ✅ REWRITTEN | Glass Circle + 호버 + 타이포 애니메이션 |
| `src/components/public/home/ExhibitionSection.tsx` | ✅ MODIFIED | 카드 호버(scale 1.03) + 스크롤 리빌 |

### 아직 안 한 작업

| 파일 | 필요한 작업 | Phase |
|------|-----------|-------|
| `src/components/public/home/WorkSection.tsx` | 카드 호버(y:-8) + 스크롤 리빌 | 5 |
| `src/components/public/home/AboutSection.tsx` | 텍스트 라인 순차 리빌 | 6 |
| `src/components/public/home/Header.tsx` | 페이지 로드 slide-down | 6 |
| `src/components/public/home/Footer.tsx` | 스크롤 리빌 | 6 |
| `src/components/public/home/LoadingScreen.tsx` | NEW - 3초 로딩 스크린 | 7 |
| `src/app/(public)/HomePageContent.tsx` | LoadingScreen 통합 | 7 |

---

## 4. Phase별 구현 계획

### Phase 4: Exhibition 카드 (✅ 완료)

### Phase 5: Work 카드 호버 + 스크롤 리빌

**파일:** `src/components/public/home/WorkSection.tsx`

**추가할 import:**
```typescript
import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { useScrollReveal } from '@/hooks/useScrollReveal';
```

**카드 호버 GSAP 설정:**
```typescript
// Mouse Enter:
gsap.to(card, { y: -8, boxShadow: '0 12px 40px rgba(0,0,0,0.1)', duration: 0.3, ease: 'power2.out' });
// Mouse Leave:
gsap.to(card, { y: 0, boxShadow: '0 0px 0px rgba(0,0,0,0)', duration: 0.25, ease: 'power2.out' });
```

**스크롤 리빌:**
```typescript
const gridRef = useScrollReveal({ selector: ':scope > div', stagger: 0.1, y: 50 });
// Grid Container div에 ref={gridRef} 추가
```

### Phase 6: 섹션별 스크롤 리빌

**AboutSection.tsx:**
```typescript
import { useScrollReveal } from '@/hooks/useScrollReveal';
// 텍스트 라인에 data-about-text 속성 추가
const sectionRef = useScrollReveal({ selector: '[data-about-text]', stagger: 0.15, y: 40, start: 'top 75%' });
```

**Header.tsx:**
```typescript
import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
// 페이지 로드 시:
useEffect(() => {
  gsap.from(headerRef.current, { y: -20, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 });
}, []);
```

**Footer.tsx:**
```typescript
import { useScrollReveal } from '@/hooks/useScrollReveal';
const footerRef = useScrollReveal({ y: 40, duration: 0.8 });
```

### Phase 7: 로딩 스크린

**새 파일:** `src/components/public/home/LoadingScreen.tsx`
```typescript
'use client';
import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;
    const tl = gsap.timeline({ onComplete });
    tl.to(screen, { opacity: 0, duration: 0.3, ease: 'power2.inOut', delay: 3 });
    return () => { tl.kill(); };
  }, [onComplete]);

  return (
    <div ref={screenRef} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontSize: '24px', fontFamily: 'Helvetica', color: '#000' }}>SMVD</span>
    </div>
  );
}
```

**HomePageContent.tsx 수정:**
```typescript
import LoadingScreen from '@/components/public/home/LoadingScreen';

// 컴포넌트 내부:
const [showLoading, setShowLoading] = useState(true);

return (
  <div>
    {showLoading && <LoadingScreen onComplete={() => setShowLoading(false)} />}
    {/* 나머지 기존 코드 */}
  </div>
);
```

---

## 5. GSAP 설정 참고

### 이미 설치됨
- `gsap`: v3.14.2 (package.json)
- ScrollTrigger: gsap에 포함 (별도 설치 불필요)

### 기존 GSAP 사용 패턴 (참고용)
- `src/components/common/CursorGlassEffect.tsx` - gsap.to(), gsap.set(), gsap.killTweensOf()

### Figma 이징 → GSAP 매핑
| Figma | GSAP |
|-------|------|
| EASE_IN_AND_OUT | `power2.inOut` |
| SLOW (Smart Animate) | `power1.out` |
| - (기본) | `power2.out` 또는 `power3.out` |

---

## 6. 검증 체크리스트

각 Phase 완료 후:
- [ ] `npx tsc --noEmit` → 0 에러
- [ ] `npm run build` → 빌드 성공
- [ ] `npm run dev` → localhost:3000 시각적 확인
- [ ] `prefers-reduced-motion` 설정 시 애니메이션 비활성화
- [ ] 모바일/태블릿 반응형 정상
- [ ] 60fps 유지 (DevTools Performance)

---

## 7. Figma API 참고 명령어

```bash
# 파일 전체 구조 (depth=2)
curl -s -H "X-Figma-Token: [FIGMA_TOKEN_REDACTED]" \
  "https://api.figma.com/v1/files/14YAcBaazZsFWFwMFU39RA?depth=2"

# 특정 노드 상세
curl -s -H "X-Figma-Token: [FIGMA_TOKEN_REDACTED]" \
  "https://api.figma.com/v1/files/14YAcBaazZsFWFwMFU39RA/nodes?ids=NODE_ID&depth=5"

# 이미지 내보내기
curl -s -H "X-Figma-Token: [FIGMA_TOKEN_REDACTED]" \
  "https://api.figma.com/v1/images/14YAcBaazZsFWFwMFU39RA?ids=NODE_ID&format=png&scale=1"
```
