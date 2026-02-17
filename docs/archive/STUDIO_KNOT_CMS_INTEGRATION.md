# STUDIO KNOT CMS 통합 프로젝트

**상태:** 분석 완료 ✅ → 다음: 블록 생성 & DB 업데이트
**생성일:** 2026-02-16
**담당자:** Claude Code

---

## 📋 프로젝트 개요

STUDIO KNOT 프로젝트 (/work/9)의 콘텐츠를 **BlockEditor 기반 CMS**로 완전히 전환하는 작업.

### 현재 상태
- ✅ 공개 페이지: `/work/9` (work-details.ts 하드코딩)
- ✅ Admin CMS: 3-panel 모달 구현 완료
- ❌ **DB 동기화**: STUDIO KNOT의 content 필드 비어있음

### 목표
- BlockEditor blocks로 모든 콘텐츠 마이그레이션
- Admin CMS에서 편집 가능하도록 설정
- 공개 페이지에서 DB 데이터 사용

---

## 🔍 데이터 분석

### 현재 STUDIO KNOT 데이터 (work-details.ts)

```javascript
'9': {
  id: '9',
  title: 'STUDIO KNOT',
  subtitle: '노하린, 2025',
  category: 'Branding',
  tags: ['UX/UI', 'Graphic', 'Editorial', 'Illustration', 'Branding', 'CM/CF', 'Game'],
  author: '노하린',
  email: 'havein6@gmail.com',
  description: 'STUDIO KNOT는 입지 않는 옷에 새로운 쓰임을 더해 반려견 장난감으로 재탄생시키는 업사이클링 터그 토이 브랜드입니다. 쉽게 버려지는 의류와 빠르게 닳는 반려견 장난감의 순환 구조를 개선하며, 보호자의 체취가 남은 옷으로 만든 토이는 정서적 가치를 담은 지속가능한 대안을 제시합니다.',
  heroImage: '/images/work/knot/hero.png',
  galleryImages: [
    '/images/work/knot/text-below.png',
    '/images/work/knot/gallery-1.png',
    '/images/work/knot/gallery-2.png',
    '/images/work/knot/gallery-3.png',
    '/images/work/knot/gallery-4.png',
    '/images/work/knot/gallery-5.png',
    '/images/work/knot/gallery-6.png',
    '/images/work/knot/gallery-7.png',
    '/images/work/knot/gallery-8.png',
  ]
}
```

### 블록 매핑 계획

| 순서 | 요소 | 블록 타입 | URL/내용 |
|------|------|---------|--------|
| 0️⃣ | 히어로 이미지 | `hero-image` | `/images/work/knot/hero.png` |
| 1️⃣ | 제목 + 작가 정보 | `work-title` | STUDIO KNOT / 노하린 / havein6@gmail.com |
| 2️⃣ | 프로젝트 설명 | `text` | STUDIO KNOT는 입지 않는 옷에... (277자) |
| 3️⃣ | 갤러리 (8개) | `work-gallery` | gallery-1~8.png (text-below 제외) |

---

## 🎯 작업 계획

### Phase 1: Blocks JSON 생성 (다음 세션)

**파일 생성:** `/src/scripts/generate-studio-knot-blocks.ts`

**생성될 JSON 구조:**

```typescript
const studioKnotContent = {
  version: "1.0",
  blocks: [
    // Block 0: Hero Image
    {
      id: "block-hero-1",
      type: "hero-image",
      order: 0,
      url: "/images/work/knot/hero.png",
      alt: "STUDIO KNOT Hero"
    },

    // Block 1: Work Title
    {
      id: "block-title-1",
      type: "work-title",
      order: 1,
      title: "STUDIO KNOT",
      author: "노하린",
      email: "havein6@gmail.com",
      titleFontSize: 60,
      authorFontSize: 14,
      gap: 24,
      titleFontWeight: "700",
      authorFontWeight: "500",
      emailFontWeight: "400",
      titleColor: "#1b1d1f",
      authorColor: "#1b1d1f",
      emailColor: "#7b828e"
    },

    // Block 2: Description Text
    {
      id: "block-text-1",
      type: "text",
      order: 2,
      content: "STUDIO KNOT는 입지 않는 옷에 새로운 쓰임을 더해 반려견 장난감으로 재탄생시키는 업사이클링 터그 토이 브랜드입니다. 쉽게 버려지는 의류와 빠르게 닳는 반려견 장난감의 순환 구조를 개선하며, 보호자의 체취가 남은 옷으로 만든 토이는 정서적 가치를 담은 지속가능한 대안을 제시합니다.",
      fontSize: 18,
      fontWeight: "400",
      color: "#1b1d1f",
      lineHeight: 1.8
    },

    // Block 3: Gallery (8 images)
    {
      id: "block-gallery-1",
      type: "work-gallery",
      order: 3,
      images: [
        { id: "img-1", url: "/images/work/knot/gallery-1.png", alt: "Gallery 1" },
        { id: "img-2", url: "/images/work/knot/gallery-2.png", alt: "Gallery 2" },
        { id: "img-3", url: "/images/work/knot/gallery-3.png", alt: "Gallery 3" },
        { id: "img-4", url: "/images/work/knot/gallery-4.png", alt: "Gallery 4" },
        { id: "img-5", url: "/images/work/knot/gallery-5.png", alt: "Gallery 5" },
        { id: "img-6", url: "/images/work/knot/gallery-6.png", alt: "Gallery 6" },
        { id: "img-7", url: "/images/work/knot/gallery-7.png", alt: "Gallery 7" },
        { id: "img-8", url: "/images/work/knot/gallery-8.png", alt: "Gallery 8" }
      ],
      imageLayout: 1
    }
  ]
}
```

**실행 방법:**
```bash
npm run ts-node src/scripts/generate-studio-knot-blocks.ts
# 또는
npx tsx src/scripts/generate-studio-knot-blocks.ts
```

---

### Phase 2: DB 업데이트 (다음 세션)

**API 호출:**

```bash
# 1. STUDIO KNOT 프로젝트 ID 확인
curl http://localhost:3000/api/admin/work/projects \
  -H "Authorization: Bearer YOUR_TOKEN"

# 응답에서 STUDIO KNOT의 ID 찾기 (slug: "9" 또는 title: "STUDIO KNOT")

# 2. Content 필드 업데이트
curl -X PUT http://localhost:3000/api/admin/work/projects/<PROJECT_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "content": {
      "version": "1.0",
      "blocks": [...]
    }
  }'
```

**또는 Admin CMS에서 수동 추가:**
1. `/admin/dashboard/work` 접속
2. STUDIO KNOT "수정" 클릭
3. Content (Blocks) 탭
4. "+ Add Block" 클릭해서 4개 블록 추가

---

### Phase 3: CMS 검증 (다음 세션)

**체크리스트:**
- [ ] Admin 대시보드에서 STUDIO KNOT 프로젝트 수정 클릭
- [ ] Content 탭에서 4개 블록 시각화 확인
  - [ ] 좌측: Hero + Title + Text + Gallery 블록 카드
  - [ ] 중앙: 각 블록 선택 시 에디터 표시
  - [ ] 우측: 실시간 미리보기 렌더링
- [ ] "Save Changes" 클릭해서 DB 저장
- [ ] 공개 페이지 `/work/9` 새로고침해서 렌더링 확인

---

### Phase 4: 공개 페이지 검증 (다음 세션 - 선택)

**확인 사항:**
- [ ] `/work/9` 페이지 로드
- [ ] Hero 이미지 표시
- [ ] 제목 + 작가 정보 표시
- [ ] 설명 텍스트 표시
- [ ] 8개 갤러리 이미지 표시
- [ ] 스크린샷 비교: 기존과 동일한지 확인

---

## 📁 관련 파일

### 읽기만 (분석 완료)
- `src/constants/work-details.ts` - STUDIO KNOT 데이터 정의
- `src/components/public/work/WorkDetailPage.tsx` - 공개 페이지 렌더링
- `src/app/api/admin/work/projects/[id]/route.ts` - DB 업데이트 API

### 수정 필요
- `src/components/admin/work/WorkBlogModal.tsx` - ✅ 이미 3-panel 완성
- `src/components/admin/work/BlockLayoutVisualizer.tsx` - ✅ 이미 구현
- `src/components/admin/work/BlockEditorPanel.tsx` - ✅ 이미 구현

### 생성 필요
- `src/scripts/generate-studio-knot-blocks.ts` - 블록 JSON 생성 스크립트 (선택)

---

## 🔗 관련 링크

### 공개 페이지
- 현재: http://localhost:3000/work/9
- 스크린샷: 최상단 hero 이미지 + 좌측 제목/작가, 우측 설명 + 갤러리

### Admin CMS
- 대시보드: http://localhost:3000/admin/dashboard/work
- STUDIO KNOT 항목 위치: 프로젝트 목록 9번째

---

## ⚠️ 주의사항

1. **프로젝트 ID 확인**
   - DB에서 STUDIO KNOT의 실제 UUID 확인
   - work-details.ts의 ID '9'는 파일상 ID일 뿐, DB ID와 다름

2. **이미지 경로 검증**
   - 9개 모두 실제로 존재하는지 확인
   - public/images/work/knot/ 폴더 확인

3. **Block ID 충돌**
   - 각 block.id는 고유해야 함
   - generateBlockId() 함수 사용 권장

4. **다른 프로젝트 영향 없음**
   - STUDIO KNOT만 수정
   - 다른 12개 프로젝트는 기존 하드코딩 유지

---

## 📝 다음 세션 시작 체크리스트

새 세션에서 이 파일을 읽고 다음을 확인하세요:

```
□ 1. STUDIO_KNOT_CMS_INTEGRATION.md 읽기 (이 파일)
□ 2. BLOCKS_GENERATION_GUIDE.md 읽기 (구체적 구현)
□ 3. Dev 서버 실행: npm run dev
□ 4. Admin 대시보드 접속: http://localhost:3000/admin/dashboard/work
□ 5. STUDIO KNOT 수정 클릭해서 모달 확인
□ 6. 블록 생성 또는 수동 추가 시작
```

---

**마지막 업데이트:** 2026-02-16
**최근 작업:** 3-panel 모달 구현 완료, STUDIO KNOT 데이터 분석 완료
