# 📊 네비게이션 & 푸터 CMS 구현 분석 리포트

**작성일:** 2026-02-17
**분석 범위:** 메인페이지(http://localhost:3000/) 와의 연동
**진행 상황:** Home/About/Curriculum CMS 완료 후 마지막 2개 섹션

---

## 1️⃣ 현재 상태 분석

### 1-1 네비게이션 & 푸터 현황

| 항목 | 현재 상태 | 문제점 | 필요한 작업 |
|------|---------|------|----------|
| **DB 스키마** | ✅ Navigation, Footer 모델 존재 | - | 없음 |
| **공개 페이지** | Header, Footer 컴포넌트 있음 | ❌ 데이터 없이 렌더링 (하드코딩) | DB 연동 필요 |
| **Admin CMS** | ❌ 없음 | 수정 불가 | 전체 구현 필요 |
| **Admin API** | ❌ 없음 | 수정 API 없음 | 8개 엔드포인트 필요 |

### 1-2 메인페이지 구조 (`src/app/(public)/page.tsx`)

```typescript
// 현재 상황: Header, Footer가 props 없이 호출됨
<Header />  // ❌ 데이터를 받지 않음
<Footer />  // ❌ 데이터를 받지 않음
```

**결론:** Header와 Footer를 **Server Component로 변환**하고 DB에서 직접 데이터를 페칭해야 합니다.

---

## 2️⃣ 기존 CMS 구현 패턴 분석

### 2-1 Home CMS 아키텍처 (참고 자료)

```
메인 페이지
  └─ fetchData() (DB에서 sections 가져옴)
     ├─ EXHIBITION_SECTION → ExhibitionItem 배열
     ├─ WORK_PORTFOLIO → WorkPortfolio 배열
     └─ HOME_ABOUT → Section.content JSON

Admin 대시보드 (/admin/dashboard/home)
  └─ useHomeEditor() 훅
     ├─ useExhibitionItemEditor()
     │  └─ API: POST/PUT/DELETE/PATCH /api/admin/exhibition-items
     └─ useWorkPortfolioEditor()
        └─ API: POST/PUT/DELETE/PATCH /api/admin/work-portfolios
```

### 2-2 Core 패턴

| 계층 | 파일 | 역할 | 라인수 |
|------|------|------|--------|
| **Hook** | `src/hooks/home/index.ts` | 상태 관리 + API 호출 | 98줄 |
| **Sub-Hook** | `src/hooks/home/useExhibitionItemEditor.ts` | 세부 CRUD | 각 ~100줄 |
| **API** | `src/app/api/admin/exhibition-items/route.ts` | HTTP 엔드포인트 | ~200줄 |
| **Component** | `src/components/admin/ExhibitionItemsList.tsx` | UI 렌더링 | ~150줄 |
| **Modal** | `src/components/admin/ExhibitionItemModal.tsx` | 추가/수정 | ~250줄 |

### 2-3 재활용 가능한 컴포넌트/라이브러리

```typescript
// 1. 이미 설치된 라이브러리
✅ @dnd-kit (drag-n-drop)
✅ react-hook-form (폼 관리)
✅ zod (스키마 검증)
✅ next-auth (인증 보호)
✅ lucide-react (아이콘)

// 2. 기존 유틸 함수들
✅ src/lib/api-response.ts (successResponse, errorResponse, etc.)
✅ src/lib/auth-check.ts (checkAdminAuth)
✅ src/lib/db.ts (prisma 클라이언트)
✅ src/types/schemas.ts (Zod 스키마)

// 3. 기존 컴포넌트 패턴
✅ ExhibitionItemsList.tsx (리스트 + 드래그)
✅ ExhibitionItemModal.tsx (추가/수정 폼)
✅ ColorPicker.tsx (색상 선택)
✅ 공통 모달 구조
```

---

## 3️⃣ 네비게이션 CMS 설계

### 3-1 DB 스키마 (이미 있음 ✅)

```prisma
model Navigation {
  id        String    @id @default(cuid())
  label     String    // "Home", "About", "Curriculum" 등
  href      String    // "/", "/about", "/curriculum" 등
  order     Int       @default(0)
  isActive  Boolean   @default(true)
  parentId  String?   // 향후 서브메뉴 확장용
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  @@map("navigation")
}
```

### 3-2 데이터 구조 & 기본값

```typescript
// Prisma에서 가져올 데이터 형식
interface NavigationItem {
  id: string;
  label: string;      // "Home", "About Major", "Curriculum", "Our People", "Work", "News&Event"
  href: string;       // "/", "/about", "/curriculum", "/people", "/work", "/news-and-events"
  order: number;      // 0, 1, 2, 3, 4, 5
  isActive: boolean;  // true/false (활성화/비활성화)
}

// 초기 데이터 (기본값)
const defaultNavigation: NavigationItem[] = [
  { id: "nav-1", label: "Home", href: "/", order: 0, isActive: true },
  { id: "nav-2", label: "About Major", href: "/about", order: 1, isActive: true },
  { id: "nav-3", label: "Curriculum", href: "/curriculum", order: 2, isActive: true },
  { id: "nav-4", label: "Our People", href: "/people", order: 3, isActive: true },
  { id: "nav-5", label: "Work", href: "/work", order: 4, isActive: true },
  { id: "nav-6", label: "News&Event", href: "/news-and-events", order: 5, isActive: true },
];
```

### 3-3 API 엔드포인트 (8개)

```
GET    /api/admin/navigation              # 네비게이션 조회
POST   /api/admin/navigation              # 항목 추가
PUT    /api/admin/navigation/:id          # 항목 수정
DELETE /api/admin/navigation/:id          # 항목 삭제
PATCH  /api/admin/navigation/:id/order    # 순서 변경
PATCH  /api/admin/navigation/:id/toggle   # 활성화/비활성화
PATCH  /api/admin/navigation/reorder      # 드래그로 재정렬 (트랜잭션)
```

### 3-4 Admin UI 구조

```
Admin 대시보드 (/admin/dashboard/navigation)
├── NavigationList.tsx (테이블)
│   ├── 드래그 가능 행
│   ├── label, href 표시
│   ├── isActive 토글 버튼
│   └── 수정/삭제 버튼
├── NavigationModal.tsx (추가/수정)
│   ├── label 입력 (Text)
│   ├── href 입력 (Select: /, /about, /curriculum, ...)
│   └── 저장/취소 버튼
└── 미리보기 (우측 40%)
    └── 실시간 Header 렌더링
```

---

## 4️⃣ 푸터 CMS 설계

### 4-1 DB 스키마 (이미 있음 ✅)

```prisma
model Footer {
  id          String    @id @default(cuid())
  title       String    @default("숙명여자대학교 시각영상디자인과")
  description String?
  address     String?
  phone       String?
  email       String?
  socialLinks Json?     // { instagram: "url", youtube: "url", ... }
  copyright   String?
  updatedAt   DateTime  @updatedAt
  @@map("footer")
}

// socialLinks 구조
type SocialLink = {
  platform: "instagram" | "youtube" | "facebook" | "twitter" | "linkedin";
  url: string;
  isActive: boolean;
}

// 예: { instagram: { url: "...", isActive: true }, youtube: { url: "...", isActive: false } }
```

### 4-2 데이터 구조 & 기본값

```typescript
// Prisma에서 가져올 데이터 형식
interface FooterData {
  id: string;
  title: string;                          // "숙명여자대학교 시각영상디자인과"
  description: string;                    // 영문 설명 또는 추가 정보
  address: string;                        // "서울 특별시 용산구 청파로 47길 100 숙명여자대학교"
  phone: string;                          // "+82 (0)2 710 9958"
  email: string;                          // "smvd@sookmyung.ac.kr"
  socialLinks: {
    instagram?: { url: string; isActive: boolean };
    youtube?: { url: string; isActive: boolean };
    facebook?: { url: string; isActive: boolean };
    twitter?: { url: string; isActive: boolean };
    linkedin?: { url: string; isActive: boolean };
  };
  copyright: string;                      // "© 2026 All rights reserved"
}

// 초기 데이터 (기본값)
const defaultFooter: FooterData = {
  id: "footer-1",
  title: "숙명여자대학교 시각영상디자인과",
  description: "Visual Media Design Department, Sookmyung Women's University",
  address: "서울 특별시 용산구 청파로 47길 100 숙명여자대학교 미술대학 201호",
  phone: "+82 (0)2 710 9958",
  email: "smvd@sookmyung.ac.kr",
  socialLinks: {
    instagram: { url: "", isActive: false },
    youtube: { url: "", isActive: false },
    facebook: { url: "", isActive: false },
    twitter: { url: "", isActive: false },
    linkedin: { url: "", isActive: false },
  },
  copyright: "© 2026 Sookmyung Women's University. All rights reserved.",
};
```

### 4-3 API 엔드포인트 (6개)

```
GET    /api/admin/footer                       # 푸터 데이터 조회
PUT    /api/admin/footer                       # 푸터 전체 수정 (title, address, phone, email)
PUT    /api/admin/footer/social-links          # SNS 링크 업데이트
PATCH  /api/admin/footer/social-links/:id      # 특정 SNS 항목 수정
PATCH  /api/admin/footer/social-links/:id/toggle  # SNS 활성화/비활성화
DELETE /api/admin/footer/social-links/:id      # SNS 항목 삭제
```

### 4-4 Admin UI 구조

```
Admin 대시보드 (/admin/dashboard/footer)
├── 좌측 60%: 푸터 에디터
│   ├── 기본 정보 섹션
│   │   ├── title 입력 (Text)
│   │   ├── description 입력 (TextArea)
│   │   ├── address 입력 (TextArea)
│   │   ├── phone 입력 (Text)
│   │   ├── email 입력 (Text)
│   │   └── copyright 입력 (TextArea)
│   │
│   └── SNS 섹션
│       ├── SNS 항목 리스트
│       │   ├── 플랫폼 (Instagram, YouTube, Facebook, Twitter, LinkedIn)
│       │   ├── URL 입력 필드
│       │   ├── 활성화 토글 (✓/✗)
│       │   └── 삭제 버튼
│       │
│       └── SNS 추가 버튼
│           └── 플랫폼 선택 드롭다운
│
└── 우측 40%: 실시간 미리보기
    └── 실시간 Footer 컴포넌트 렌더링
```

---

## 5️⃣ 메인페이지 연동 방식 (핵심!)

### 5-1 현재 문제

```typescript
// src/app/(public)/page.tsx (현재)
export default async function HomePage() {
  // ... exhibition, work 데이터는 페칭

  return (
    <div>
      <Header />      // ❌ props 없음 → 데이터 없음
      <Footer />      // ❌ props 없음 → 데이터 없음
    </div>
  );
}
```

### 5-2 해결책: Server Component로 변환

```typescript
// src/app/(public)/page.tsx (수정 후)

// Header를 Server Component로 변환
async function HeaderWithData() {
  const navigation = await prisma.navigation.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  return <Header navigation={navigation} />;
}

// Footer를 Server Component로 변환
async function FooterWithData() {
  const footer = await prisma.footer.findFirst();
  return <Footer data={footer || defaultFooter} />;
}

export default async function HomePage() {
  // ... existing code ...

  return (
    <div>
      <HeaderWithData />        // ✅ DB 데이터 전달
      <VideoHero />
      {/* ... */}
      <FooterWithData />         // ✅ DB 데이터 전달
    </div>
  );
}
```

### 5-3 다른 공개 페이지에서도 동일하게

```
/about
/curriculum
/people
/work
/news-and-events
```

모두 마찬가지로:

```typescript
// 각 페이지의 layout.tsx 또는 page.tsx에서
<HeaderWithData />
<FooterWithData />
```

---

## 6️⃣ 재활용 가능한 컴포넌트/라이브러리

### 6-1 기존 Home CMS 패턴 재사용

```
Navigation CMS:
  ✅ useHomeEditor.ts 패턴 → useNavigationEditor.ts 생성
     ├─ fetchNavigation()
     ├─ addNavigation()
     ├─ updateNavigation()
     ├─ deleteNavigation()
     └─ reorderNavigation() (트랜잭션)

Footer CMS:
  ✅ useHomeEditor.ts 패턴 → useFooterEditor.ts 생성
     ├─ fetchFooter()
     ├─ updateFooter() (기본 정보)
     ├─ addSocialLink()
     ├─ updateSocialLink()
     ├─ toggleSocialLink()
     └─ deleteSocialLink()
```

### 6-2 이미 설치된 라이브러리 활용

| 라이브러리 | 용도 | 예시 |
|----------|------|------|
| **@dnd-kit** | 드래그 순서 변경 | NavigationList에서 메뉴 순서 재정렬 |
| **react-hook-form** | 폼 관리 | NavigationModal, FooterEditor에서 입력 폼 |
| **zod** | 검증 | NavigationSchema, FooterSchema 정의 |
| **lucide-react** | 아이콘 | 활성화/비활성화 토글, 삭제 아이콘 |
| **next-auth** | 인증 | API 엔드포인트 `checkAdminAuth()` |

### 6-3 기존 컴포넌트 구조 재사용

```
ExhibitionItemsList.tsx (기존) → NavigationList.tsx (신규)
  ✅ 테이블 구조
  ✅ @dnd-kit DnD Context
  ✅ 드래그 가능한 행
  ✅ 수정/삭제 버튼

ExhibitionItemModal.tsx (기존) → NavigationModal.tsx (신규)
  ✅ react-hook-form 구조
  ✅ 입력 필드
  ✅ Zod 검증
  ✅ 저장/취소 로직

--- 푸터 대시보드 ---

CourseTable.tsx (Curriculum) → FooterBasicEditor.tsx (신규)
  ✅ 텍스트 입력 폼
  ✅ TextArea 지원

ThesisTable.tsx (Curriculum) → SocialLinksList.tsx (신규)
  ✅ 테이블 구조
  ✅ 추가/수정/삭제 로직
```

### 6-4 기존 API 패턴 재사용

```
src/app/api/admin/exhibition-items/route.ts (기존)
  ✅ POST: 항목 추가 + order 자동 계산
  ✅ PUT: 항목 수정
  ✅ DELETE: 항목 삭제
  ✅ PATCH: 순서 변경 (트랜잭션)

신규:
  src/app/api/admin/navigation/route.ts
  src/app/api/admin/footer/route.ts
```

---

## 7️⃣ 파일 구조 계획

### 7-1 신규 생성할 파일 (Navigation)

```
src/
├── hooks/
│   └── navigation/                      # (새 폴더)
│       ├── index.ts                     # useNavigationEditor 메인
│       └── types.ts                     # NavigationItem 타입
│
├── components/admin/
│   ├── NavigationList.tsx               # 테이블 + DnD
│   ├── NavigationModal.tsx              # 추가/수정 모달
│   └── NavigationEditor.tsx             # 전체 컨테이너
│
├── app/api/admin/navigation/
│   └── route.ts                         # GET, POST, PUT, DELETE, PATCH
│
├── app/api/admin/navigation/
│   ├── [id]/
│   │   └── route.ts                     # PUT (수정), DELETE (삭제)
│   ├── [id]/order/
│   │   └── route.ts                     # PATCH (순서 변경)
│   └── [id]/toggle/
│       └── route.ts                     # PATCH (활성화/비활성화)
│
└── app/admin/dashboard/navigation/
    └── page.tsx                         # Admin 대시보드 페이지
```

### 7-2 신규 생성할 파일 (Footer)

```
src/
├── hooks/
│   └── footer/                          # (새 폴더)
│       ├── index.ts                     # useFooterEditor 메인
│       └── types.ts                     # FooterData 타입
│
├── components/admin/
│   ├── FooterBasicEditor.tsx            # 기본 정보 입력
│   ├── SocialLinksList.tsx              # SNS 항목 테이블
│   ├── SocialLinkModal.tsx              # SNS 추가/수정 모달
│   └── FooterEditor.tsx                 # 전체 컨테이너
│
├── app/api/admin/footer/
│   └── route.ts                         # GET, PUT
│
├── app/api/admin/footer/
│   └── social-links/
│       ├── route.ts                     # POST (추가)
│       └── [id]/
│           ├── route.ts                 # PUT (수정), DELETE (삭제)
│           └── toggle/
│               └── route.ts             # PATCH (활성화/비활성화)
│
└── app/admin/dashboard/footer/
    └── page.tsx                         # Admin 대시보드 페이지
```

---

## 8️⃣ 수정해야 할 기존 파일

### 8-1 메인 페이지 컴포넌트

| 파일 | 변경 사항 | 이유 |
|------|---------|------|
| `src/components/common/Header/Header.tsx` | Props 추가: `navigation?: NavigationItem[]` | DB 데이터 받기 |
| `src/components/common/Footer/Footer.tsx` | Props 추가: `data?: FooterData` | DB 데이터 받기 |
| `src/app/(public)/page.tsx` | HeaderWithData, FooterWithData 추가 | DB에서 데이터 페칭 |

### 8-2 타입 정의

| 파일 | 변경 사항 |
|------|---------|
| `src/types/index.ts` 또는 신규 | `NavigationItem`, `FooterData` 타입 추가 |
| `src/types/schemas.ts` | Zod 스키마 추가: `NavigationSchema`, `FooterSchema` |

### 8-3 Admin 대시보드

| 파일 | 변경 사항 |
|------|---------|
| `src/app/admin/dashboard/page.tsx` | 네비게이션, 푸터 링크 추가 |

---

## 9️⃣ 구현 순서 (제안)

### Phase 1: 네비게이션 CMS (8-10시간)
1. 타입 정의 + Zod 스키마
2. `useNavigationEditor` 훅 구현
3. API 라우트 구현 (6개 엔드포인트)
4. NavigationList, NavigationModal 컴포넌트
5. Admin 대시보드 페이지

### Phase 2: 푸터 CMS (8-10시간)
1. 타입 정의 + Zod 스키마
2. `useFooterEditor` 훅 구현
3. API 라우트 구현 (6개 엔드포인트)
4. FooterBasicEditor, SocialLinksList, SocialLinkModal 컴포넌트
5. Admin 대시보드 페이지

### Phase 3: 메인페이지 연동 (2-3시간)
1. Header 컴포넌트 수정 (Server Component)
2. Footer 컴포넌트 수정 (Server Component)
3. page.tsx에서 HeaderWithData, FooterWithData 추가
4. 다른 공개 페이지도 동일하게 적용

### Phase 4: 테스트 & 배포 (1-2시간)
1. Admin 대시보드에서 네비게이션/푸터 수정
2. 메인페이지 실시간 반영 확인
3. 빌드 & TypeScript 검증
4. Git commit

---

## 🔟 기술 스택 & 라이브러리

```typescript
// 드래그 앤 드롭
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';

// 폼 관리
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// 검증
import { z } from 'zod';

// 인증
import { checkAdminAuth } from '@/lib/auth-check';

// 아이콘
import { Trash2, Edit, Plus, Eye, EyeOff } from 'lucide-react';

// API 응답
import { successResponse, errorResponse } from '@/lib/api-response';

// DB
import { prisma } from '@/lib/db';
```

---

## 1️⃣1️⃣ 핵심 설계 원칙

### 네비게이션
- ✅ 6개 기본 항목 (Home, About, Curriculum, People, Work, News&Event)
- ✅ 순서 변경은 드래그 또는 순번 입력
- ✅ 활성화/비활성화로 메뉴 표시 제어
- ✅ 향후 서브메뉴 확장 가능 (parentId 필드)

### 푸터
- ✅ 기본 정보 (주소, 전화, 이메일)
- ✅ 5개 SNS 플랫폼 (Instagram, YouTube, Facebook, Twitter, LinkedIn)
- ✅ SNS는 URL + 활성화 여부로 제어
- ✅ 로고 이미지는 향후 추가 (현재는 텍스트만)

### 메인페이지 연동
- ✅ Server Component로 변환 (ISR 유지)
- ✅ DB에서 최신 데이터 항상 페칭
- ✅ 모든 공개 페이지에서 일관된 Header/Footer
- ✅ Admin 수정 후 `revalidatePath('/')` 호출로 ISR 갱신

---

## 1️⃣2️⃣ 주의사항 & 체크리스트

### 구현 전
- [ ] Prisma 스키마 확인 (Navigation, Footer 모델 존재)
- [ ] 기존 Home CMS 코드 리뷰 (패턴 학습)
- [ ] 타입 정의 먼저 하기 (Zod 스키마 포함)

### 구현 중
- [ ] API 엔드포인트마다 `checkAdminAuth()` 호출 필수
- [ ] 트랜잭션 처리 (reorder 등 복수 업데이트)
- [ ] 에러 처리 및 Zod 검증
- [ ] Props 타입 명시적으로 정의

### 배포 전
- [ ] TypeScript 검증: `npm run build` (0 errors)
- [ ] Admin에서 CRUD 모두 테스트
- [ ] 메인페이지 실시간 반영 확인
- [ ] 모든 공개 페이지에 Header/Footer 반영
- [ ] Git commit + push

---

## 1️⃣3️⃣ 추가 참고사항

### 이미 구현된 유사 기능들
- 📌 `src/hooks/home/useExhibitionItemEditor.ts` (100줄, 드래그 구현)
- 📌 `src/app/api/admin/exhibition-items/route.ts` (200줄, API 패턴)
- 📌 `src/components/admin/ExhibitionItemsList.tsx` (150줄, UI 패턴)
- 📌 `src/components/admin/ExhibitionItemModal.tsx` (250줄, 모달 패턴)

### 복사해서 활용 가능한 코드
```typescript
// 순서 변경 로직 (트랜잭션)
const result = await prisma.$transaction(
  updates.map((item, index) =>
    prisma.navigation.update({
      where: { id: item.id },
      data: { order: index },
    })
  )
);

// 드래그 이벤트 처리
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (over && active.id !== over.id) {
    // 상태 업데이트 + API 호출
  }
};

// API 응답 포맷
return successResponse(data, '성공 메시지', 201);
return errorResponse('에러 메시지', 'ERROR_CODE', 400);
```

---

## 🎯 최종 요약

| 항목 | 현재 | 필요 | 예상 소요 시간 |
|------|------|------|---------------|
| **네비게이션 CMS** | ❌ 없음 | 전체 구현 | 8-10시간 |
| **푸터 CMS** | ❌ 없음 | 전체 구현 | 8-10시간 |
| **메인페이지 연동** | ❌ 하드코딩 | Server Component 전환 | 2-3시간 |
| **테스트 & 배포** | - | - | 1-2시간 |
| **총계** | | | **19-25시간** |

**재활용 컴포넌트/라이브러리:** 8개 이상 (Home CMS 패턴 완전 재사용)

---

**다음 단계:**
1. 이 리포트 검토 & 피드백
2. 네비게이션 CMS 구현 시작 (Phase 1)
3. 푸터 CMS 구현 (Phase 2)
4. 메인페이지 연동 (Phase 3)
5. 최종 테스트 & 배포
