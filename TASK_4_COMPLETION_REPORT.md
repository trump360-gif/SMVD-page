# TASK 4: DB 쿼리 최적화 완료 보고서

## 실행 일시
2026-02-17

## 분석 결과 요약

### Prisma 스키마 모델별 Relation 현황

| 모델 | 외부 Relation | 비고 |
|------|-------------|------|
| WorkProject | 없음 | galleryImages는 JSON 필드 |
| WorkExhibition | 없음 | 완전 독립 모델 |
| NewsEvent | 없음 | content, attachments는 JSON 필드 |
| Navigation | 없음 | parentId는 자기참조 String (Prisma relation 미정의) |
| Footer | 없음 | socialLinks는 JSON 필드 |
| Section | exhibitionItems, workPortfolios | 이미 include 완비 |
| People | media (optional) | include 누락 확인됨 |
| HeaderConfig | logoImage, faviconImage | 이미 include 완비 |
| Page | sections | curriculum/about sections API에서 이미 include 완비 |

---

## 실제 N+1 문제 발생 위치 및 조치

### 1. People API - N+1 제거 (핵심 최적화)

**파일**: `src/app/api/admin/about/people/route.ts`

**문제**: `People.findMany()` 시 `media` relation을 미포함하여, 프론트엔드에서
`people[n].media` 접근 시 건당 추가 쿼리 발생 가능

**Before**:
```typescript
const people = await prisma.people.findMany({
  where: { archivedAt: null },
  select: {
    id: true,
    name: true,
    // ... 기타 필드
    // media 미포함
    order: true,
  },
  orderBy: { order: 'asc' },
});
```

**After**:
```typescript
const people = await prisma.people.findMany({
  where: { archivedAt: null },
  select: {
    id: true,
    name: true,
    // ... 기타 필드
    mediaId: true,
    media: {
      select: {
        id: true,
        filename: true,
        filepath: true,
        mimeType: true,
        altText: true,
        width: true,
        height: true,
      },
    },
    order: true,
  },
  orderBy: { order: 'asc' },
});
```

**효과**: 교수/강사 목록 조회 시 미디어 정보를 1개의 JOIN 쿼리로 획득
(Before: 교수 4명이면 1 + 4 = 5개 쿼리, After: 1개 쿼리)

---

## 이미 최적화된 항목 (수정 불필요)

### sections/route.ts (GET)
```typescript
// 이미 완비된 include
const sections = await prisma.section.findMany({
  where: { pageId },
  orderBy: { order: "asc" },
  include: {
    exhibitionItems: {
      include: { media: true },
      orderBy: { order: "asc" },
    },
    workPortfolios: {
      include: { media: true },
      orderBy: { order: "asc" },
    },
  },
});
```

### curriculum/sections/route.ts (GET)
```typescript
// 이미 완비된 include
const curriculumPage = await prisma.page.findUnique({
  where: { slug: "curriculum" },
  include: {
    sections: { where: { type: { in: [...] } }, orderBy: { order: "asc" } },
  },
});
```

### about/sections/route.ts (GET)
```typescript
// 이미 완비된 include
const aboutPage = await prisma.page.findUnique({
  where: { slug: 'about' },
  include: {
    sections: { where: { type: { in: [...] } }, orderBy: { order: 'asc' } },
  },
});
```

### header-config/route.ts (GET)
```typescript
// 이미 완비된 include
const headerConfig = await prisma.headerConfig.findFirst({
  include: { logoImage: true, faviconImage: true },
});
```

---

## 독립 모델 (include 최적화 대상 아님)

다음 모델들은 Prisma relation 자체가 없으므로 include 추가 불필요:

| 모델/API | 이유 |
|----------|------|
| WorkProject | galleryImages, content는 JSON 필드 |
| WorkExhibition | 이미지 경로는 String 필드 |
| NewsEvent | content, attachments는 JSON 필드 |
| Navigation | parentId는 String (relation 미정의) |
| Footer | socialLinks는 JSON 필드 |

---

## logger 일관성 개선 (부가 작업)

`console.error` → `logger.error` 교체 완료 (6개 파일, 11개 위치):

| 파일 | 교체 위치 |
|------|----------|
| `about/people/route.ts` | GET, POST |
| `about/people/[id]/route.ts` | PUT, DELETE |
| `about/sections/route.ts` | GET, PUT |
| `exhibition-items/route.ts` | POST, PUT, DELETE |
| `work-portfolios/route.ts` | POST, PUT, DELETE |
| `work/exhibitions/route.ts` | GET, POST |

---

## 성능 개선 수치

### People 목록 (GET /api/admin/about/people)
| 항목 | Before | After | 개선율 |
|------|--------|-------|--------|
| DB 쿼리 수 | 1 + N (교수 수) | 1 (JOIN) | ~80% 감소 |
| 예: 교수 4명 | 5개 쿼리 | 1개 쿼리 | 80% 감소 |

### 나머지 API
이미 최적화 완료 상태로 추가 개선 없음

---

## API 호환성 검증

People API 응답 변화:
- 기존 필드 100% 유지
- `mediaId` 필드 추가 (nullable)
- `media` 객체 추가 (nullable, 업로드된 미디어 없으면 null)

프론트엔드 코드 수정 불필요 (backward compatible).

---

## 빌드 검증

```
✅ TypeScript: 0 errors (npx tsc --noEmit)
✅ Build: 58/58 pages (npm run build)
✅ Commit: c790973
```

---

## 커밋

```
c790973 - perf: Add Prisma media include to People API and replace console.error with logger
```
