# Prisma Schema Design - Work & News CMS

---

## 1. 설계 원칙

1. **데이터 무결성**: 기존 하드코딩 데이터 100% 보존
2. **유연성**: 관리자가 항목 추가/수정/삭제 가능
3. **일관성**: 기존 CMS 패턴(Home, About, Curriculum)과 동일한 구조
4. **안전한 폴백**: DB 데이터 없을 때 하드코딩 데이터 사용 가능

---

## 2. SectionType Enum 추가

```prisma
enum SectionType {
  // ... 기존 값들 ...

  // Work page section types (NEW)
  WORK_ARCHIVE              // Work 아카이브 (포트폴리오 목록)
  WORK_EXHIBITION           // Work 전시 탭

  // News page section types (NEW)
  NEWS_ARCHIVE              // News 아카이브 (뉴스 목록)
}
```

---

## 3. 새 모델: WorkProject

### 목적
- `work-details.ts`의 12개 프로젝트 데이터를 DB로 관리
- `WorkArchive.tsx`의 portfolioItems 데이터와 통합

### 스키마

```prisma
// Work 프로젝트 (포트폴리오 아카이브)
model WorkProject {
  id              String    @id @default(cuid())
  slug            String    @unique                    // URL용 (기존 '1', '2', ... '12')
  title           String                               // 'Vora', 'Mindit', etc.
  subtitle        String                               // '권나연 외 3명, 2025'
  category        String                               // 'UX/UI', 'Branding', 'Motion', 'Game'
  tags            String[]                             // PostgreSQL 배열: ['UX/UI'] 또는 ['UX/UI', 'Graphic', ...]
  author          String                               // '권나연'
  email           String                               // 'contact@vora.com'
  description     String    @default("")               // 프로젝트 설명 (줄바꿈 포함)
  year            String    @default("2025")           // 연도
  heroImage       String    @map("hero_image")         // 상세 히어로 이미지 경로
  thumbnailImage  String    @map("thumbnail_image")    // 목록 썸네일 경로 (portfolio-*.png)
  galleryImages   Json      @default("[]") @map("gallery_images")  // 갤러리 이미지 배열 (JSON)
  order           Int       @default(0)                // 표시 순서 (1~12)
  published       Boolean   @default(true)             // 공개 여부
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  @@map("work_projects")
  @@index([category])
  @@index([order])
}
```

### 필드 설명

| 필드 | 타입 | 출처 | 설명 |
|------|------|------|------|
| id | cuid | 자동 | PK |
| slug | String unique | work-details.ts id | URL 경로 (/work/1) |
| title | String | work-details.ts | 프로젝트명 |
| subtitle | String | work-details.ts | 작가+연도 |
| category | String | work-details.ts | 카테고리 |
| tags | String[] | work-details.ts | 태그 배열 |
| author | String | work-details.ts | 작가명 |
| email | String | work-details.ts | 이메일 |
| description | String | work-details.ts | 설명 |
| year | String | subtitle에서 추출 | 연도 |
| heroImage | String | work-details.ts | 상세 히어로 이미지 |
| thumbnailImage | String | WorkArchive.tsx | 목록 썸네일 |
| galleryImages | Json | work-details.ts | 갤러리 배열 |
| order | Int | 목록 순서 | 표시+네비게이션 순서 |
| published | Boolean | - | 공개 여부 |

### 설계 결정: prev/next 네비게이션
- **DB에 저장하지 않음** -> `order` 필드 기반으로 동적 계산
- 순환 구조: 마지막(order=12) -> 첫번째(order=1)
- 이유: 순서 변경/추가/삭제 시 자동으로 네비게이션 업데이트

---

## 4. 새 모델: WorkExhibition

### 목적
- `WorkArchive.tsx`의 exhibitionItems 6개를 DB로 관리
- 포트폴리오(WorkProject)와 독립적인 전시 아이템

### 스키마

```prisma
// Work 전시 아이템 (Exhibition 탭)
model WorkExhibition {
  id          String    @id @default(cuid())
  title       String                               // 'Vora', 'GALJIDO' 등
  subtitle    String                               // '권나연 외 3명, 2025'
  artist      String                               // '신예지', '조혜원' 등
  image       String                               // 전시 이미지 경로
  year        String    @default("2025")           // 연도
  order       Int       @default(0)                // 표시 순서
  published   Boolean   @default(true)             // 공개 여부
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  @@map("work_exhibitions")
  @@index([order])
}
```

### 설계 결정: 별도 모델로 분리
- 전시 아이템 6개 중 3개(GALJIDO, Callmate, MOA)는 포트폴리오에 없음
- 전시와 포트폴리오는 독립적으로 관리 가능해야 함
- 관리자가 전시만 추가/삭제 가능

---

## 5. 기존 모델 수정: NewsEvent

### 변경 전 (현재)
```prisma
model NewsEvent {
  id          String    @id @default(cuid())
  title       String
  content     String                    // 단순 문자열
  excerpt     String?
  type        String    @default("news")
  mediaIds    Json?
  eventDate   DateTime?
  published   Boolean   @default(true)
  order       Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

### 변경 후 (제안)
```prisma
// News & Events (개선된 모델)
model NewsEvent {
  id              String    @id @default(cuid())
  slug            String    @unique                    // URL용 (기존 '1'~'10')
  title           String                               // 목록 제목
  category        String    @default("Notice")         // 'Notice', 'Event', 'Awards', 'Recruiting'
  excerpt         String?                              // 목록 설명 (2줄 요약)
  thumbnailImage  String    @default("/Group-27.svg") @map("thumbnail_image")  // 썸네일 경로
  content         Json?                                // 상세 페이지 데이터 (아래 구조)
  publishedAt     DateTime  @map("published_at")       // 표시 날짜
  published       Boolean   @default(true)
  order           Int       @default(0)                // 표시 순서
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  @@map("news_events")
  @@index([category])
  @@index([order])
  @@index([publishedAt])
}
```

### content JSON 구조

```typescript
// 상세 페이지가 있는 경우 (예: Event #5)
interface NewsEventContent {
  introTitle?: string;     // 상세 제목 (없으면 title 사용)
  introText?: string;      // 본문 텍스트
  bodyHtml?: string;       // 리치 텍스트 콘텐츠 (향후 WYSIWYG용)
  gallery?: {
    layout: 'standard';    // 레이아웃 타입 (향후 다른 레이아웃 추가 가능)
    main?: string;         // 메인 이미지 (전체 너비)
    centerLeft?: string;   // 중단 좌측
    centerRight?: string;  // 중단 우측
    bottomLeft?: string;   // 하단 좌측
    bottomCenter?: string; // 하단 중앙
    bottomRight?: string;  // 하단 우측
    // 향후 확장:
    // additionalImages?: string[];  // 추가 이미지 배열
  };
}

// 상세 페이지가 없는 경우 (예: Notice 아이템)
// content = null
```

### 변경사항 요약

| 변경 | 이전 | 이후 | 이유 |
|------|------|------|------|
| content 타입 | `String` | `Json?` | 갤러리 구조를 JSON으로 |
| type -> category | `String "news"/"event"` | `String "Notice"/"Event"/...` | 프론트엔드 카테고리와 일치 |
| slug 추가 | 없음 | `String @unique` | URL 식별자 |
| thumbnailImage 추가 | 없음 | `String` | 목록 이미지 |
| publishedAt 추가 | `eventDate?` | `DateTime` | 표시 날짜 |
| eventDate 제거 | `DateTime?` | 제거 | publishedAt로 통합 |
| mediaIds 제거 | `Json?` | 제거 | content JSON에 이미지 포함 |

---

## 6. Section 연관 (선택적)

Work와 News는 기존 Home/About/Curriculum처럼 Section-Section 관계를 사용하지 않고, **독립 모델**로 관리합니다.

이유:
- Work/News 데이터는 섹션 내부 JSON이 아닌 독립 레코드로 관리하는 것이 CRUD에 적합
- 각 아이템이 고유 URL을 가짐 (/work/1, /news/5)
- 검색/필터/정렬이 빈번함

단, 페이지 레벨 설정(카테고리 목록, 페이지 제목 등)은 Section으로 관리 가능:

```
Section (type: WORK_ARCHIVE)
  └── content: { categories: ['All', 'UX/UI', ...], itemsPerPage: 12 }

Section (type: WORK_EXHIBITION)
  └── content: { title: 'Exhibition' }

Section (type: NEWS_ARCHIVE)
  └── content: { categories: ['ALL', 'Notice', ...] }
```

---

## 7. 전체 스키마 변경 요약

### 새로 추가되는 모델
1. **WorkProject** - 포트폴리오 프로젝트 (12개)
2. **WorkExhibition** - 전시 아이템 (6개)

### 수정되는 모델
1. **NewsEvent** - 필드 변경 (content 타입, 카테고리, slug, 썸네일)

### 추가되는 Enum 값
1. `WORK_ARCHIVE` - SectionType
2. `WORK_EXHIBITION` - SectionType
3. `NEWS_ARCHIVE` - SectionType

---

## 8. 인덱스 전략

| 모델 | 인덱스 | 용도 |
|------|--------|------|
| WorkProject | `@@index([category])` | 카테고리 필터 |
| WorkProject | `@@index([order])` | 순서 정렬 |
| WorkExhibition | `@@index([order])` | 순서 정렬 |
| NewsEvent | `@@index([category])` | 카테고리 필터 |
| NewsEvent | `@@index([order])` | 순서 정렬 |
| NewsEvent | `@@index([publishedAt])` | 날짜 정렬 |

---

## 9. 데이터 크기 추정

| 모델 | 레코드 수 | 평균 크기 | 비고 |
|------|----------|----------|------|
| WorkProject | 12 | ~2KB | galleryImages JSON 포함 |
| WorkExhibition | 6 | ~0.5KB | 단순 구조 |
| NewsEvent | 10 | ~3KB | content JSON (갤러리) 포함 |

---

## 10. 마이그레이션 전략

### Phase 1: 스키마 변경 (prisma db push)
1. SectionType enum에 3개 값 추가
2. WorkProject 모델 생성
3. WorkExhibition 모델 생성
4. NewsEvent 모델 필드 변경

### Phase 2: 데이터 시딩 (seed script)
1. 12개 WorkProject 레코드 삽입
2. 6개 WorkExhibition 레코드 삽입
3. 10개 NewsEvent 레코드 삽입 (기존 데이터 마이그레이션)

### Phase 3: 공개 페이지 연동
1. WorkArchive 컴포넌트에서 DB 데이터 fetch
2. WorkDetailPage에서 DB 데이터 fetch
3. NewsEventArchive에서 DB 데이터 fetch
4. NewsEventDetailContent에서 DB 데이터 fetch
5. 모든 컴포넌트에 폴백 구조 적용

### 주의사항
- NewsEvent 모델의 `content` 필드 타입 변경 (String -> Json?)은 **데이터 손실 위험**
- 기존 NewsEvent 데이터가 DB에 있다면 마이그레이션 스크립트로 변환 필요
- 현재는 하드코딩만 사용 중이므로 fresh migration 가능
