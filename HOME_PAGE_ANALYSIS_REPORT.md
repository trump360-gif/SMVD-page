# 메인 페이지 (Home) 코드 분석 리포트

**분석일**: 2026-02-15
**분석 대상**: `/src/app/(public)/page.tsx` 및 Home 섹션 컴포넌트들

---

## 📋 현재 구조 분석

### 1. 메인 페이지 (page.tsx)

```typescript
// ❌ 문제점: DB에서 데이터를 받아오지만 사용하지 않음
const page = await prisma.page.findUnique({
  where: { slug: 'home' },
  include: { sections: { orderBy: { order: 'asc' } } },
});
// ↑ 이 데이터가 어디에도 전달되지 않음!
```

**상태**: DB 쿼리는 있지만 **데이터 사용 안 함** (낭비)

---

## 🔴 각 섹션 컴포넌트 상태

### 2-1. VideoHero.tsx

| 항목 | 상태 |
|------|------|
| **파일 존재** | ✅ 있음 |
| **데이터 연결** | ❌ 없음 |
| **하드코딩** | ✅ 완전 하드코딩 |
| **Props 지원** | ❌ 없음 |
| **현재 상태** | `"Video coming soon..."` placeholder |

**문제점**:
- 비디오 영역은 그냥 검정색 박스 + 텍스트
- 비디오 파일 없음
- GSAP 애니메이션 필요 (아직 미구현)

**결론**: ⏳ **나중 작업 (비디오 파일 준비 필요)**

---

### 2-2. ExhibitionSection.tsx ⭐ (우선순위 높음)

| 항목 | 상태 |
|------|------|
| **파일 존재** | ✅ 있음 |
| **Props 지원** | ✅ `items` props 지원 |
| **기본값** | ✅ 하드코딩된 기본값 있음 |
| **데이터 연결** | ❌ page.tsx에서 props 전달 안 함 |
| **DB 연결** | ❌ ExhibitionItem 테이블과 미연결 |

**현재 코드**:
```typescript
interface ExhibitionSectionProps {
  items?: ExhibitionItem[];
}

export default function ExhibitionSection({
  items = [
    { year: '2025', src: '/images/home/exhibition-2025.png', alt: '...' },
    { year: '2024', src: '/images/home/exhibition-2024.png', alt: '...' },
    { year: '2023', src: '/images/home/exhibition-2023.png', alt: '...' },
  ],
}: ExhibitionSectionProps) { ... }
```

**page.tsx에서 호출**:
```typescript
<ExhibitionSection />  // ❌ props 전달 없음!
```

**문제점**:
- ✅ 이미지는 준비되어 있음 (`/images/home/exhibition-*.png`)
- ✅ Props 구조는 좋음 (단순함)
- ❌ 하지만 DB에서 받은 데이터를 전달하지 않음
- ❌ ExhibitionItem 테이블과 연결 안 됨

**필요한 작업**:
```typescript
// 1. page.tsx에서 DB 데이터 조회
const exhibitionSection = page.sections.find(s => s.type === 'EXHIBITION_SECTION');
const exhibitionItems = await prisma.exhibitionItem.findMany({
  where: { sectionId: exhibitionSection?.id },
  include: { media: true },
  orderBy: { order: 'asc' },
});

// 2. 컴포넌트에 데이터 전달
<ExhibitionSection items={exhibitionItems} />

// 3. 컴포넌트에서 Media 객체 처리
```

**결론**: 🔴 **가장 우선순위 높음! (바로 구현 가능)**

---

### 2-3. AboutSection.tsx

| 항목 | 상태 |
|------|------|
| **파일 존재** | ✅ 있음 |
| **Props 지원** | ✅ `title` props만 지원 |
| **하드코딩** | ✅ 대부분 하드코딩 |
| **데이터 연결** | ❌ HOME_ABOUT 섹션과 미연결 |

**현재 코드**:
```typescript
export default function AboutSection({
  title = 'About SMVD',
}: AboutSectionProps) {
  return (
    <section>
      <h2>{title}</h2>
      {/* 다음 내용 100% 하드코딩 */}
      FROM VISUAL DELIVERY
      TO SYSTEMIC SOLUTIONS
      SOLVING PROBLEMS
      SHAPING THE FUTURE OF VISUALS
      {/* + 3개의 SVG 아이콘도 하드코딩 */}
    </section>
  );
}
```

**문제점**:
- ❌ 텍스트 4줄이 모두 하드코딩
- ❌ SVG 아이콘 3개도 하드코딩 (수정 불가)
- ❌ DB의 HOME_ABOUT 섹션 데이터 미사용

**필요한 구조**:
```typescript
interface AboutSectionProps {
  title?: string;
  content?: {
    lines: string[];        // 4줄 텍스트
    icons?: IconData[];     // 3개 아이콘
  };
}
```

**결론**: 🟡 **CMS 구현 필요 (텍스트 + 아이콘 구조화)**

---

### 2-4. WorkSection.tsx

| 항목 | 상태 |
|------|------|
| **파일 존재** | ✅ 있음 |
| **Props 지원** | ✅ `title`, `items` props 지원 |
| **기본값** | ✅ 10개 작품 하드코딩 |
| **필터링** | ✅ 카테고리 필터 있음 (6개) |
| **데이터 연결** | ❌ page.tsx에서 props 전달 안 함 |
| **DB 연결** | ❌ WorkPortfolio 테이블과 미연결 |

**현재 코드**:
```typescript
const workItems: WorkItem[] = [
  { src: '/images/work/portfolio-12.png', alt: 'Vora', title: 'Vora', category: 'UX/UI' },
  { src: '/images/work/portfolio-5.png', alt: 'BICHAE', title: 'BICHAE', category: 'Branding' },
  // ... 10개 모두 하드코딩
];

const categories = ['All', 'UX/UI', 'Motion', 'Branding', 'Game design', 'Graphic'];

export default function WorkSection({
  title = 'Work',
  items = workItems,  // ← 기본값 사용
}: WorkSectionProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  // 필터링 로직 + 렌더링
}
```

**page.tsx에서 호출**:
```typescript
<WorkSection />  // ❌ props 전달 없음!
```

**문제점**:
- ✅ Props 구조 좋음
- ✅ 필터링 기능 좋음
- ❌ 10개 작품 항목이 하드코딩
- ❌ 카테고리도 하드코딩 (확장 불가)
- ❌ WorkPortfolio 테이블과 미연결

**필요한 작업**:
```typescript
// 1. page.tsx에서 workPortfolios 조회
const workPortfolios = await prisma.workPortfolio.findMany({
  include: { media: true },
  orderBy: { order: 'asc' },
});

// 2. 카테고리 추출
const categories = [...new Set(workPortfolios.map(w => w.category))];

// 3. 컴포넌트에 전달
<WorkSection items={workPortfolios} categories={categories} />
```

**결론**: 🟡 **Props 전달만 추가하면 거의 준비됨**

---

### 2-5. VisionSection.tsx

| 항목 | 상태 |
|------|------|
| **파일 존재** | ✅ 있음 |
| **Props 지원** | ✅ `line1`, `line2` props 지원 |
| **기본값** | ✅ 하드코딩된 기본값 |
| **데이터 연결** | ❌ DB와 미연결 |

**상태**: About 페이지에 사용됨 (Home에서는 미사용)

---

## 📊 문제점 요약

| 컴포넌트 | DB 쿼리 | Props 전달 | 하드코딩 | 데이터 손실 위험 |
|---------|--------|----------|--------|----------------|
| **VideoHero** | ❌ | ❌ | ✅ 100% | 낮음 (파일 없음) |
| **ExhibitionSection** | ✅ 있음 | ❌ | ✅ 기본값 | **높음** 🔴 |
| **AboutSection** | ✅ 있음 | ❌ | ✅ 100% | **높음** 🔴 |
| **WorkSection** | ✅ 있음 | ❌ | ✅ 완전 | **높음** 🔴 |

---

## 🎯 개선 계획 (우선순위)

### Priority 1: ExhibitionSection ⭐⭐⭐
```
현재: 이미지 3개 하드코딩 (2025, 2024, 2023)
목표: DB의 exhibitionItems에서 동적으로 받아오기
위험도: 높음 (이미지 데이터 손실 가능)
작업량: 중간 (컴포넌트 + DB 연결)
```

### Priority 2: WorkSection ⭐⭐⭐
```
현재: 작품 10개 + 카테고리 6개 하드코딩
목표: DB의 workPortfolios에서 동적으로 받아오기
위험도: 높음 (10개 작품 데이터 손실 가능)
작업량: 중간 (카테고리 동적화 필요)
```

### Priority 3: AboutSection ⭐⭐
```
현재: 텍스트 4줄 + 아이콘 3개 하드코딩
목표: DB의 HOME_ABOUT 섹션 content에서 받아오기
위험도: 높음 (텍스트 + 아이콘 손실)
작업량: 높음 (구조 재설계 필요)
```

### Priority 4: VideoHero ⏳
```
현재: Placeholder만 있음
목표: 비디오 파일 + GSAP 애니메이션 추가
위험도: 낮음 (파일 없어서 손실 위험 없음)
작업량: 높음 (비디오 + 애니메이션)
```

---

## 💾 데이터 안전성 전략

### 현재 상황
```
DB (Prisma)
├─ exhibitionItems[] ← 메인페이지 이미지
├─ workPortfolios[] ← 메인페이지 작품들
└─ Section (HOME_ABOUT) ← 메인페이지 텍스트

컴포넌트 (React)
├─ VideoHero (하드코딩)
├─ ExhibitionSection (기본값 하드코딩) ❌
├─ AboutSection (100% 하드코딩) ❌
└─ WorkSection (완전 하드코딩) ❌
                         ↑
                   연결 끊김!
```

### 해결 방법
```
1. page.tsx에서 모든 섹션 데이터 조회
2. 각 컴포넌트에 props로 전달
3. 컴포넌트에서:
   - Props 데이터 우선 사용
   - Props 없으면 기본값 사용 (안전장치)
```

---

## ✅ 데이터 손실 방지 체크리스트

```
[ ] ExhibitionSection 수정
    [ ] 이미지 3개 모두 보존 확인
    [ ] media 객체 정확히 매핑
    [ ] alt 텍스트 손실 없음

[ ] WorkSection 수정
    [ ] 작품 10개 모두 보존 확인
    [ ] 카테고리 모두 보존
    [ ] 이미지 경로 정확히 매핑

[ ] AboutSection 수정
    [ ] 텍스트 4줄 모두 보존
    [ ] 아이콘 구조 정의
    [ ] 레이아웃 일치 확인

[ ] page.tsx 수정
    [ ] 모든 섹션 조회 (order로 정렬)
    [ ] props 정확히 전달
    [ ] 오류 처리 추가
```

---

## 📁 영향을 받을 파일들

```
수정 필요:
- src/app/(public)/page.tsx (props 전달)
- src/components/public/home/ExhibitionSection.tsx
- src/components/public/home/WorkSection.tsx
- src/components/public/home/AboutSection.tsx

영향 없음:
- src/components/public/home/VideoHero.tsx (나중)
- src/components/public/home/Header.tsx
- src/components/public/home/Footer.tsx
```

---

## 🚀 다음 단계

**1단계**: ExhibitionSection 데이터 연결
**2단계**: WorkSection 데이터 연결
**3단계**: AboutSection 구조 재설계
**4단계**: page.tsx 중앙화된 데이터 조회

---

**작성**: Claude Code
**분석 완료**: 2026-02-15
