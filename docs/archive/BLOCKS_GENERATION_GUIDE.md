# BlockEditor Blocks 생성 가이드 - STUDIO KNOT

**목표:** work-details.ts의 STUDIO KNOT 데이터를 BlockEditor blocks JSON으로 변환
**파일:** STUDIO_KNOT_CMS_INTEGRATION.md 참고

---

## 📊 생성할 4개 블록 상세 스펙

### Block 0: Hero Image

**용도:** 공개 페이지 최상단 히어로 이미지

```typescript
{
  id: "block-hero-1",           // 고유 ID (자동 생성 권장: generateBlockId())
  type: "hero-image",            // Block 타입
  order: 0,                       // 블록 순서 (0부터 시작)
  url: "/images/work/knot/hero.png",  // 이미지 경로
  alt: "STUDIO KNOT Hero"        // alt 텍스트
}
```

**검증:**
- [ ] 이미지 파일 실제 존재 확인
- [ ] URL 경로 정확성 확인 (public/ 폴더 기준)

---

### Block 1: Work Title

**용도:** 프로젝트 제목 + 작가 정보 (왼쪽 컬럼)

```typescript
{
  id: "block-title-1",
  type: "work-title",
  order: 1,

  // 필수 필드
  title: "STUDIO KNOT",
  author: "노하린",
  email: "havein6@gmail.com",

  // 선택 필드 (기본값 사용)
  titleFontSize: 60,              // 기본값 (픽셀)
  authorFontSize: 14,             // 기본값 (픽셀)
  gap: 24,                        // 제목과 작가 사이 간격 (픽셀)

  titleFontWeight: "700",         // Bold
  authorFontWeight: "500",        // Medium
  emailFontWeight: "400",         // Regular

  titleColor: "#1b1d1f",          // 검은색 (기본값)
  authorColor: "#1b1d1f",         // 검은색
  emailColor: "#7b828e"           // 회색
}
```

**검증:**
- [ ] title 입력 (필수)
- [ ] author 입력 (필수)
- [ ] email 입력 (필수)
- [ ] 색상 값 검증 (hex 형식)

---

### Block 2: Description Text

**용도:** 프로젝트 설명 텍스트 (오른쪽 컬럼)

```typescript
{
  id: "block-text-1",
  type: "text",
  order: 2,

  // 필수 필드
  content: "STUDIO KNOT는 입지 않는 옷에 새로운 쓰임을 더해 반려견 장난감으로 재탄생시키는 업사이클링 터그 토이 브랜드입니다. 쉽게 버려지는 의류와 빠르게 닳는 반려견 장난감의 순환 구조를 개선하며, 보호자의 체취가 남은 옷으로 만든 토이는 정서적 가치를 담은 지속가능한 대안을 제시합니다.",

  // 선택 필드 (기본값 사용)
  fontSize: 18,                   // 픽셀 (기본값)
  fontWeight: "400",              // Regular
  color: "#1b1d1f",               // 검은색
  lineHeight: 1.8                 // 줄 높이 배수
}
```

**주의:**
- content는 마크다운 미지원 (plain text만)
- 개행이 필요하면 \n 사용하지 않음 (한 문단)
- 색상 hex 형식 (RGB 아님)

---

### Block 3: Work Gallery

**용도:** 8개 갤러리 이미지 (galleryImages 첫 번째 text-below.png 제외)

```typescript
{
  id: "block-gallery-1",
  type: "work-gallery",
  order: 3,

  // 필수 필드
  images: [
    {
      id: "img-1",
      url: "/images/work/knot/gallery-1.png",
      alt: "Gallery 1"
    },
    {
      id: "img-2",
      url: "/images/work/knot/gallery-2.png",
      alt: "Gallery 2"
    },
    {
      id: "img-3",
      url: "/images/work/knot/gallery-3.png",
      alt: "Gallery 3"
    },
    {
      id: "img-4",
      url: "/images/work/knot/gallery-4.png",
      alt: "Gallery 4"
    },
    {
      id: "img-5",
      url: "/images/work/knot/gallery-5.png",
      alt: "Gallery 5"
    },
    {
      id: "img-6",
      url: "/images/work/knot/gallery-6.png",
      alt: "Gallery 6"
    },
    {
      id: "img-7",
      url: "/images/work/knot/gallery-7.png",
      alt: "Gallery 7"
    },
    {
      id: "img-8",
      url: "/images/work/knot/gallery-8.png",
      alt: "Gallery 8"
    }
  ],

  // 선택 필드
  imageLayout: 1                  // 1열 레이아웃 (기본값)
}
```

**주의:**
- ❌ `/images/work/knot/text-below.png` 제외 (첫 번째)
- ✅ gallery-1.png ~ gallery-8.png (8개만)
- 각 img.id는 고유해야 함 ("img-1", "img-2", ...)

---

## 🛠️ 구현 방법 (3가지 옵션)

### 옵션 1: Admin CMS 수동 추가 (가장 간단 ✅ 추천)

**단계:**

```
1. http://localhost:3000/admin/dashboard/work 접속
2. STUDIO KNOT 항목에서 "수정" 버튼 클릭
3. "Content (Blocks)" 탭 클릭
4. 좌측 패널 하단 "+ Add Block" 클릭
5. 블록 타입 선택 (hero-image)
6. 상세 정보 입력:
   - URL: /images/work/knot/hero.png
   - Alt: STUDIO KNOT Hero
7. "Save Changes" 클릭
8. 반복 (work-title, text, work-gallery 추가)
```

**장점:**
- 코드 작성 없음
- UI 기반 직관적 입력
- 실시간 미리보기 확인 가능

**단점:**
- 수동 작업이라 시간 소요
- 실수 가능성 높음

---

### 옵션 2: TypeScript 스크립트로 자동 생성

**파일 생성:** `src/scripts/generate-studio-knot-blocks.ts`

```typescript
import { generateBlockId } from '@/components/admin/shared/BlockEditor/types';
import { BlogContent } from '@/components/admin/shared/BlockEditor/types';

const generateStudioKnotBlocks = (): BlogContent => {
  return {
    version: '1.0',
    blocks: [
      // Block 0: Hero Image
      {
        id: generateBlockId(),
        type: 'hero-image',
        order: 0,
        url: '/images/work/knot/hero.png',
        alt: 'STUDIO KNOT Hero',
      },

      // Block 1: Work Title
      {
        id: generateBlockId(),
        type: 'work-title',
        order: 1,
        title: 'STUDIO KNOT',
        author: '노하린',
        email: 'havein6@gmail.com',
        titleFontSize: 60,
        authorFontSize: 14,
        gap: 24,
        titleFontWeight: '700',
        authorFontWeight: '500',
        emailFontWeight: '400',
        titleColor: '#1b1d1f',
        authorColor: '#1b1d1f',
        emailColor: '#7b828e',
      },

      // Block 2: Description Text
      {
        id: generateBlockId(),
        type: 'text',
        order: 2,
        content:
          'STUDIO KNOT는 입지 않는 옷에 새로운 쓰임을 더해 반려견 장난감으로 재탄생시키는 업사이클링 터그 토이 브랜드입니다. 쉽게 버려지는 의류와 빠르게 닳는 반려견 장난감의 순환 구조를 개선하며, 보호자의 체취가 남은 옷으로 만든 토이는 정서적 가치를 담은 지속가능한 대안을 제시합니다.',
        fontSize: 18,
        fontWeight: '400',
        color: '#1b1d1f',
        lineHeight: 1.8,
      },

      // Block 3: Gallery
      {
        id: generateBlockId(),
        type: 'work-gallery',
        order: 3,
        images: [
          { id: generateBlockId(), url: '/images/work/knot/gallery-1.png', alt: 'Gallery 1' },
          { id: generateBlockId(), url: '/images/work/knot/gallery-2.png', alt: 'Gallery 2' },
          { id: generateBlockId(), url: '/images/work/knot/gallery-3.png', alt: 'Gallery 3' },
          { id: generateBlockId(), url: '/images/work/knot/gallery-4.png', alt: 'Gallery 4' },
          { id: generateBlockId(), url: '/images/work/knot/gallery-5.png', alt: 'Gallery 5' },
          { id: generateBlockId(), url: '/images/work/knot/gallery-6.png', alt: 'Gallery 6' },
          { id: generateBlockId(), url: '/images/work/knot/gallery-7.png', alt: 'Gallery 7' },
          { id: generateBlockId(), url: '/images/work/knot/gallery-8.png', alt: 'Gallery 8' },
        ],
        imageLayout: 1,
      },
    ],
  };
};

export default generateStudioKnotBlocks;
```

**실행:**
```bash
npx tsx src/scripts/generate-studio-knot-blocks.ts
```

**장점:**
- 자동 생성으로 시간 절약
- Block ID 자동 생성
- 재사용 가능한 스크립트

---

### 옵션 3: API 직접 호출

**방법:** curl 또는 fetch로 API 호출

```bash
# 1. STUDIO KNOT 프로젝트 ID 찾기
curl http://localhost:3000/api/admin/work/projects \
  -H "Authorization: Bearer <TOKEN>"

# 2. 응답에서 STUDIO KNOT의 ID 복사

# 3. Content 업데이트
curl -X PUT http://localhost:3000/api/admin/work/projects/<PROJECT_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "content": {
      "version": "1.0",
      "blocks": [
        {
          "id": "block-hero-1",
          "type": "hero-image",
          "order": 0,
          "url": "/images/work/knot/hero.png",
          "alt": "STUDIO KNOT Hero"
        },
        ...
      ]
    }
  }'
```

**장점:**
- 프로그래매틱 제어
- 배치 업데이트 가능
- 자동화 스크립트 작성 가능

---

## ✅ 검증 체크리스트

### 생성 전
- [ ] work-details.ts의 STUDIO KNOT 데이터 확인
- [ ] 9개 이미지 경로 모두 확인
- [ ] public/images/work/knot/ 폴더 존재 확인

### 생성 후
- [ ] 4개 블록 생성 확인
- [ ] 각 블록 ID 고유성 확인
- [ ] order 필드 0-3 순서 확인
- [ ] 필수 필드 모두 입력 확인

### DB 저장 후
- [ ] Admin 대시보드 STUDIO KNOT 수정 클릭
- [ ] Content 탭에서 4개 블록 시각화 확인
- [ ] 각 블록 선택해서 에디터 확인
- [ ] 우측 미리보기에서 렌더링 확인
- [ ] "Save Changes" 버튼으로 DB 저장

### 공개 페이지 검증
- [ ] /work/9 페이지 새로고침
- [ ] Hero 이미지 표시 확인
- [ ] 제목 + 작가 정보 확인
- [ ] 설명 텍스트 확인
- [ ] 8개 갤러리 이미지 확인

---

## 🔗 관련 API 문서

**POST 블록 추가:**
```
Endpoint: PUT /api/admin/work/projects/:id
Method: PUT
Auth: NextAuth 필수
Body: { content: BlogContent }
Response: { data: WorkProject, success: true }
```

**참고:**
- BlogContent: { version: "1.0", blocks: Block[] }
- Block: ContentBlock 기본 인터페이스 확장
- types.ts 참고: `/src/components/admin/shared/BlockEditor/types.ts`

---

**마지막 업데이트:** 2026-02-16
