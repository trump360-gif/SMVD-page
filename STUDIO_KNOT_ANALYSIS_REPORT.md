# STUDIO KNOT 분석 리포트

## 📋 1. 로컬 상수 데이터 (work-details.ts)

### 기본 정보
```
ID: '9'
Title: STUDIO KNOT
Subtitle: 노하린, 2025
Category: Branding
Author: 노하린
Email: havein6@gmail.com
Year: 2025
```

### 본문 (Description)
```
STUDIO KNOT는 입지 않는 옷에 새로운 쓰임을 더해 반려견 장난감으로 재탄생시키는 업사이클링 터그 토이 브랜드입니다.
쉽게 버려지는 의류와 빠르게 닳는 반려견 장난감의 순환 구조를 개선하며, 보호자의 체취가 남은 옷으로 만든 토이는
정서적 가치를 담은 지속가능한 대안을 제시합니다.
```

**특징:**
- 순수 텍스트 형식 (마크다운 없음)
- 3줄의 명확한 단락 구조
- 핵심: 업사이클링 → 지속가능성 → 정서적 가치

### 태그
```
tags: [
  'UX/UI',
  'Graphic',
  'Editorial',
  'Illustration',
  'Branding',
  'CM/CF',
  'Game'
]
```
**분석:** 7개 태그로 다양한 디자인 분야 포함 (가장 복합적인 프로젝트)

### 이미지 데이터

#### Hero Image
```
/images/work/knot/hero.png
```

#### Gallery Images (9개)
```
1. /images/work/knot/text-below.png    ← 설명 텍스트 이미지
2. /images/work/knot/gallery-1.png
3. /images/work/knot/gallery-2.png
4. /images/work/knot/gallery-3.png
5. /images/work/knot/gallery-4.png
6. /images/work/knot/gallery-5.png
7. /images/work/knot/gallery-6.png
8. /images/work/knot/gallery-7.png
9. /images/work/knot/gallery-8.png
```

**특징:** `text-below.png`가 첫 번째 갤러리 이미지 (프로젝트 설명 비주얼)

---

## 🔄 2. CMS 모달에서의 데이터 변환 프로세스

### 2-1. 입력 데이터 (WorkBlogModal)

CMS 모달에서 받는 프로젝트 정보:

**Basic Info 탭:**
- `title` → "STUDIO KNOT"
- `subtitle` → "노하린, 2025"
- `category` → "Branding"
- `tags` → "UX/UI, Graphic, Editorial, Illustration, Branding, CM/CF, Game"
- `author` → "노하린"
- `email` → "havein6@gmail.com"
- `year` → "2025"
- `thumbnailImage` → (포트폴리오 목록용 썸네일)
- `published` → true

**Content (Blocks) 탭:**
- BlockEditor로 본문, 이미지 등 편집
- 기존 프로젝트 수정 시: `parseWorkProjectContent()` 함수로 레거시 데이터 변환

### 2-2. 데이터 변환 로직 (parseWorkProjectContent)

로컬 상수 데이터가 CMS에 로드될 때:

```javascript
// 입력
parseWorkProjectContent(
  description: "STUDIO KNOT는 입지 않는 옷에 새로운 쓰임을 더해...",
  galleryImages: ["/images/work/knot/text-below.png", ..., "/images/work/knot/gallery-8.png"],
  heroImage: "/images/work/knot/hero.png",
  title: "STUDIO KNOT",
  author: "노하린",
  email: "havein6@gmail.com"
)
```

**출력 (BlogContent):**

```json
{
  "blocks": [
    {
      "id": "generated-uuid-1",
      "type": "hero-image",
      "url": "/images/work/knot/hero.png",
      "alt": "",
      "order": 0
    },
    {
      "id": "generated-uuid-2",
      "type": "work-title",
      "title": "STUDIO KNOT",
      "author": "노하린",
      "email": "havein6@gmail.com",
      "titleFontSize": 60,
      "authorFontSize": 14,
      "gap": 24,
      "titleFontWeight": "700",
      "authorFontWeight": "500",
      "emailFontWeight": "400",
      "titleColor": "#1b1d1f",
      "authorColor": "#1b1d1f",
      "emailColor": "#7b828e",
      "order": 1
    },
    {
      "id": "generated-uuid-3",
      "type": "text",
      "content": "STUDIO KNOT는 입지 않는 옷에 새로운 쓰임을 더해...",
      "order": 2
    },
    {
      "id": "generated-uuid-4",
      "type": "work-gallery",
      "images": [
        { "id": "img-uuid-1", "url": "/images/work/knot/text-below.png" },
        { "id": "img-uuid-2", "url": "/images/work/knot/gallery-1.png" },
        ...
        { "id": "img-uuid-9", "url": "/images/work/knot/gallery-8.png" }
      ],
      "order": 3
    }
  ],
  "version": "1.0"
}
```

### 2-3. CMS 모달에서의 표시

**Basic Info 탭:**
- 모든 메타데이터 입력 필드에 값이 채워짐
- Tags: 7개 태그가 파란색 칩으로 표시

**Content (Blocks) 탭:**
- BlockEditor 미리보기에서 4개 블록이 시각적으로 표시됨:
  1. **Hero Image Block** → hero.png 미리보기
  2. **Work Title Block** → "STUDIO KNOT" (60px bold) + "노하린" + "havein6@gmail.com"
  3. **Text Block** → 본문 텍스트 (우측 컬럼)
  4. **Work Gallery Block** → 9개 이미지 갤러리

---

## 📌 3. 공개 페이지 렌더링 (WorkDetailPage)

### 3-1. 렌더링 프로세스

공개 페이지에서 studio knot 상세 페이지를 열 때:

```javascript
// 페이지 로드 (/work/9 또는 /work/studio-knot)
getProjectFromDB(slug)
  → DB에 저장된 WorkProject 찾기
  → 없으면 null 반환
  → workDetails[id] 폴백 사용 (로컬 상수)
```

현재 상태: **DB 테이블 없음** → 항상 로컬 상수 사용

### 3-2. 블록 파싱 (parseBlockContent)

로컬 상수의 순수 텍스트 description이 입력되면:

```javascript
parseBlockContent(description)
  → JSON.parse() 시도
  → 실패 (순수 텍스트이므로)
  → null 반환
```

**결과:** 블록 기반 렌더링이 아님 → 레거시 마크다운 렌더링

### 3-3. 레거시 마크다운 렌더링

```javascript
const blockContent = parseBlockContent(project.description);
// blockContent = null (순수 텍스트이므로)

// 폴백: react-markdown으로 description 렌더링
<ReactMarkdown>{project.description}</ReactMarkdown>
```

**현재 화면:**
- Hero Image: hero.png ✅
- Title/Author/Email: 직접 렌더링 (hardcoded props)
- Description: react-markdown으로 렌더링 ✅
- Gallery: project.galleryImages 배열 직접 사용 ✅

---

## ⚠️ 4. 핵심 문제점 분석

### 문제 1: DB-CMS 연결 끊김
**상황:**
- CMS 모달에서 studio knot 데이터 수정 가능
- 저장 시 API 호출: `POST /api/admin/work/projects`
- **하지만:** DB 테이블이 없어서 저장 실패

**영향:**
- CMS에서 아무리 수정해도 DB에 저장 안 됨
- 공개 페이지는 항상 로컬 상수만 표시

### 문제 2: 레거시 데이터 포맷
**현재:**
```
description: "STUDIO KNOT는 입지 않는 옷에... (순수 텍스트)"
galleryImages: ["/images/work/knot/text-below.png", ...]
```

**CMS에서 편집할 때 변환되는 포맷:**
```json
{
  "blocks": [
    { "type": "hero-image", ... },
    { "type": "work-title", ... },
    { "type": "text", ... },
    { "type": "work-gallery", ... }
  ]
}
```

**문제:**
- 로컬 상수는 순수 텍스트
- CMS에서 BlockEditor로 편집하면 JSON 포맷으로 변환됨
- 다시 로드하면 JSON 파싱 성공 → 블록 기반 렌더링으로 변경됨

### 문제 3: 마크다운 vs 블록 렌더링 불일치
**현재 렌더링:**
```
✅ description → react-markdown (순수 텍스트)
✅ gallery images → 직접 배열 사용

❌ work-title (title/author/email) → hardcoded props
❌ hero image → project.heroImage prop (블록 기반 아님)
```

**문제:**
- 블록 기반 포맷으로 저장되면 WorkTitleBlock의 스타일링이 반영 안 될 수 있음
- layout-config 블록이 저장되면 컬럼 레이아웃이 적용 안 될 수 있음

---

## 📊 5. 비교표: 로컬 상수 vs CMS 모달 vs 공개 페이지

| 구성요소 | 로컬 상수 | CMS 모달 | 공개 페이지 |
|---------|---------|--------|----------|
| **Title** | "STUDIO KNOT" | 입력 필드 | hardcoded props |
| **Subtitle** | "노하린, 2025" | 입력 필드 | project.subtitle |
| **Category** | "Branding" | 선택 드롭다운 | project.category |
| **Tags** | 7개 배열 | 쉼표 분리 입력 | project.tags |
| **Author** | "노하린" | 입력 필드 | hardcoded props |
| **Email** | "havein6@gmail.com" | 입력 필드 | hardcoded props |
| **Description** | 순수 텍스트 | BlockEditor | react-markdown |
| **Hero Image** | /images/work/knot/hero.png | BlockEditor | project.heroImage |
| **Gallery** | 9개 배열 | BlockEditor | project.galleryImages |
| **저장 위치** | 소스 코드 | DB (없음) | 로컬 상수 사용 |

---

## 🔧 6. 권장 해결 방안

### 방안 1: DB 테이블 생성 (권장)
1. Prisma 마이그레이션으로 `WorkProject` 테이블 생성
2. studio knot 포함 12개 프로젝트 초기 데이터 생성
3. CMS 모달에서 수정하면 DB에 저장됨
4. 공개 페이지에서 DB 데이터 자동 렌더링

### 방안 2: BlockEditor 저장 검증
1. CMS에서 저장 시 description을 JSON으로 자동 변환
2. 로컬 상수도 JSON 포맷으로 통일
3. WorkDetailPage에서 항상 블록 기반 렌더링

### 방안 3: 마크다운 -> BlockEditor 마이그레이션
1. 로컬 상수의 모든 description을 parseWorkProjectContent로 미리 변환
2. BlockEditor 포맷으로 저장
3. CMS와 로컬 상수 포맷 통일

---

## 💡 7. 추가 관찰사항

### 긍정적인 부분
✅ **유연한 전환 메커니즘**
- 로컬 상수 → BlockEditor 포맷으로 자동 변환 가능
- 순수 텍스트도 마크다운으로 렌더링 가능

✅ **태그 다양성**
- studio knot은 7개 태그로 가장 복합적인 프로젝트
- "UX/UI, Graphic, Editorial, Illustration, Branding, CM/CF, Game"

✅ **높은 재사용성**
- galleryImages 9개로 풍부한 시각 자료

### 잠재적 문제
⚠️ **이미지 경로 검증 부재**
- `/images/work/knot/text-below.png` 등이 실제로 존재하는지 확인 필요

⚠️ **블록 스타일링 적용 미흡**
- WorkTitleBlock의 색상(#1b1d1f, #7b828e) 등이 공개 페이지에 반영되지 않을 수 있음

⚠️ **Hero Image Block 미처리**
- CMS에서 HeroImageBlock으로 저장되면 WorkDetailPage에서 처리 가능하나, 현재 로컬 상수는 project.heroImage prop으로 처리됨

---

## 📝 결론

**현재 상태:**
- 로컬 상수 데이터와 CMS 모달 사이의 데이터 포맷 불일치
- DB가 없어서 CMS 수정이 공개 페이지에 반영 안 됨
- 순수 텍스트와 BlockEditor JSON 포맷이 혼재됨

**우선순위:**
1. 🚨 **긴급:** WorkProject DB 테이블 생성
2. 📋 **높음:** studio knot 초기 데이터 생성 (DB)
3. 🔄 **중간:** BlockEditor 포맷 통일 (로컬 상수도 JSON으로)
4. 🎨 **중간:** 블록 스타일링 공개 페이지 렌더링 반영

