# 📊 네비게이션 & 푸터 CMS 구현 - 정확한 분석 리포트 (수정)

**작성일:** 2026-02-17
**분석 범위:** http://localhost:3000/ 메인페이지와의 정확한 연동
**요청 사항:**
1. **네비게이션 섹션 (헤더 영역)**
   - ✅ 로고/파비콘 업로드 기능
   - ✅ 헤더 메뉴 순서 변경
2. **푸터 섹션**
   - ✅ 푸터 텍스트 수정
   - ✅ SNS 추가 (URL 입력 → 아이콘 클릭 시 링크 이동)
   - ✅ SNS 활성화/비활성화 (없으면 숨김)

---

## 1️⃣ 현재 헤더 구조 분석

### 1-1 현재 Header 상태

**파일:** `src/components/common/Header/Header.tsx`

```typescript
// 현재: 텍스트 로고만 있음 (이미지 없음)
<h1>SMVD</h1>
<p>Visual & Media Design</p>

// ❌ 문제: 로고 이미지를 관리할 수 없음
// ❌ 문제: 파비콘을 관리할 수 없음
// ❌ 문제: 메뉴 순서가 고정됨 (TopNavigation 컴포넌트 참조)
```

### 1-2 메인페이지 구조

**파일:** `src/app/(public)/page.tsx`

```typescript
// 현재 문제점
return (
  <div>
    <Header />        // ❌ props 없음 → 데이터를 받지 않음
    <VideoHero />
    <ExhibitionSection items={exhibitionItems} />
    <AboutSection content={aboutContent} />
    <WorkSection items={workItems} />
    <Footer />        // ❌ props 없음 → 데이터를 받지 않음
  </div>
);
```

---

## 2️⃣ 필요한 기능 전체 목록 (정확)

### 2-1 네비게이션 섹션 (헤더)

| 기능 | 현재 | 필요 | 우선순위 |
|------|------|------|---------|
| **로고 이미지 업로드** | ❌ | ✅ 구현 필요 | 🔴 높음 |
| **파비콘 업로드** | ❌ | ✅ 구현 필요 | 🔴 높음 |
| **메뉴 항목** | ⚠️ 고정됨 | ✅ 순서 변경 가능 | 🟡 중간 |
| **메뉴 활성화/비활성화** | ❌ | ✅ 구현 필요 | 🟡 중간 |

### 2-2 푸터 섹션

| 기능 | 현재 | 필요 | 우선순위 |
|------|------|------|---------|
| **기본 텍스트** | ⚠️ 하드코딩 | ✅ 수정 가능 | 🔴 높음 |
| **주소/전화/이메일** | ⚠️ 하드코딩 | ✅ 수정 가능 | 🔴 높음 |
| **SNS 링크** | ❌ | ✅ 추가/수정 | 🔴 높음 |
| **SNS 활성화/비활성화** | ❌ | ✅ 토글 | 🟡 중간 |

---

## 3️⃣ DB 스키마 설계 (수정 필요)

### 3-1 기존 Navigation 모델 (확인됨)

```prisma
model Navigation {
  id        String    @id @default(cuid())
  label     String         // "Home", "About", "Curriculum" 등
  href      String         // "/", "/about", "/curriculum" 등
  order     Int       @default(0)
  isActive  Boolean   @default(true)
  parentId  String?   @map("parent_id")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  @@map("navigation")
}
```

### 3-2 신규: Header 로고/파비콘 관리 테이블

**옵션 A: Navigation 테이블에 추가 필드 (간단)**
```prisma
model Navigation {
  // 기존 필드들...

  // 신규 필드
  logoImageId    String?    @map("logo_image_id")    // 로고 이미지 Media ID
  faviconImageId String?    @map("favicon_image_id") // 파비콘 이미지 Media ID

  // 관계
  logoImage      Media?     @relation(name: "logoImage", fields: [logoImageId], references: [id])
  faviconImage   Media?     @relation(name: "faviconImage", fields: [faviconImageId], references: [id])
}
```

**옵션 B: 별도 테이블 생성 (권장 - 더 명확)**
```prisma
model HeaderConfig {
  id             String    @id @default(cuid())

  // 로고
  logoImageId    String?   @map("logo_image_id")
  logoImage      Media?    @relation(name: "logoImage", fields: [logoImageId], references: [id])

  // 파비콘
  faviconImageId String?   @map("favicon_image_id")
  faviconImage   Media?    @relation(name: "faviconImage", fields: [faviconImageId], references: [id])

  // 메타
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  @@map("header_config")
}
```

**추천: 옵션 B (HeaderConfig 별도 테이블)**
- 네비게이션 관심사 분리 (메뉴 vs 헤더 설정)
- 향후 헤더 설정 확장 용이 (색상, 높이 등)

### 3-3 기존 Footer 모델 (확인됨 - 이미 있음)

```prisma
model Footer {
  id          String    @id @default(cuid())
  title       String    @default("숙명여자대학교 시각영상디자인과")
  description String?   // 영문 설명
  address     String?   // 주소
  phone       String?   // 전화
  email       String?   // 이메일
  socialLinks Json?     @map("social_links") // SNS 링크 JSON
  copyright   String?   // 저작권
  updatedAt   DateTime  @updatedAt
  @@map("footer")
}

// socialLinks JSON 구조
{
  "instagram": { "url": "https://...", "isActive": true },
  "youtube": { "url": "https://...", "isActive": true },
  "facebook": { "url": "https://...", "isActive": false },
  "twitter": { "url": "https://...", "isActive": false },
  "linkedin": { "url": "https://...", "isActive": false }
}
```

---

## 4️⃣ 네비게이션 CMS 구현 설계

### 4-1 HeaderConfig 관리 (로고 + 파비콘)

**Admin Dashboard: `/admin/dashboard/navigation`**

```
┌─────────────────────────────────────────────────┐
│          네비게이션 & 헤더 설정                  │
└─────────────────────────────────────────────────┘

[탭] 헤더 설정  |  메뉴 관리

┌─ 헤더 설정 탭 ─────────────────────────────────┐
│                                                 │
│ 🎯 로고 이미지                                 │
│   [현재 로고 미리보기]                         │
│   [파일 선택 버튼] ← 클릭하면 파일 업로드    │
│   Drag & Drop 영역                             │
│   "PNG, JPG, WebP 지원 (최대 2MB)"            │
│                                                 │
│ 🎯 파비콘                                      │
│   [현재 파비콘 미리보기]                       │
│   [파일 선택 버튼] ← 클릭하면 파일 업로드    │
│   Drag & Drop 영역                             │
│   "ICO, PNG 지원 (최대 1MB)"                  │
│                                                 │
│ [저장]  [취소]                                 │
│                                                 │
└─────────────────────────────────────────────────┘

┌─ 메뉴 관리 탭 ──────────────────────────────────┐
│                                                  │
│ 📋 메뉴 항목 (드래그로 순서 변경)              │
│                                                  │
│ ⋮ [Home]        [활성/비활성] [수정] [삭제]   │
│ ⋮ [About]       [활성/비활성] [수정] [삭제]   │
│ ⋮ [Curriculum]  [활성/비활성] [수정] [삭제]   │
│ ⋮ [Our People]  [활성/비활성] [수정] [삭제]   │
│ ⋮ [Work]        [활성/비활성] [수정] [삭제]   │
│ ⋮ [News&Event]  [활성/비활성] [수정] [삭제]   │
│                                                  │
│ [+ 메뉴 추가]                                  │
│                                                  │
└──────────────────────────────────────────────────┘

┌─ 우측 40%: 실시간 미리보기 ──────────────────┐
│                                                │
│  [로고 이미지]  [메뉴1] [메뉴2] [메뉴3]      │
│                                                │
└────────────────────────────────────────────────┘
```

### 4-2 API 엔드포인트 (네비게이션)

```
HeaderConfig 관리:
GET    /api/admin/header-config              # 로고/파비콘 조회
PUT    /api/admin/header-config              # 로고/파비콘 업데이트

Navigation 관리:
GET    /api/admin/navigation                 # 네비게이션 조회
POST   /api/admin/navigation                 # 메뉴 추가
PUT    /api/admin/navigation/:id             # 메뉴 수정
DELETE /api/admin/navigation/:id             # 메뉴 삭제
PATCH  /api/admin/navigation/reorder         # 순서 변경 (드래그)
PATCH  /api/admin/navigation/:id/toggle      # 활성화/비활성화
```

---

## 5️⃣ 푸터 CMS 구현 설계

### 5-1 Admin Dashboard: `/admin/dashboard/footer`

```
┌─────────────────────────────────────────────┐
│          푸터 관리                          │
└─────────────────────────────────────────────┘

┌─ 좌측 60%: 푸터 에디터 ─────────────────────┐
│                                             │
│ 📋 기본 정보                               │
│                                             │
│ 제목:                                      │
│ [숙명여자대학교 시각영상디자인과]          │
│                                             │
│ 설명 (영문):                               │
│ [Visual Media Design Department, ...]      │
│                                             │
│ 주소:                                      │
│ [서울 특별시 용산구 청파로 47길 100 ...]  │
│                                             │
│ 전화:                                      │
│ [+82 (0)2 710 9958]                       │
│                                             │
│ 이메일:                                    │
│ [smvd@sookmyung.ac.kr]                    │
│                                             │
│ ─────────────────────────────────────────  │
│ 📱 SNS 링크                                │
│                                             │
│ ☑️ Instagram  [URL 입력] [x]             │
│ ☑️ YouTube    [URL 입력] [x]             │
│ ☐ Facebook    [URL 입력] [x]             │
│ ☐ Twitter     [URL 입력] [x]             │
│ ☐ LinkedIn    [URL 입력] [x]             │
│                                             │
│ [+ SNS 추가]  (비활성화된 항목만 추가)    │
│                                             │
│ ─────────────────────────────────────────  │
│ 저작권:                                     │
│ [© 2026 All rights reserved]               │
│                                             │
│ [저장]  [취소]                             │
│                                             │
└─────────────────────────────────────────────┘

┌─ 우측 40%: 실시간 미리보기 ──────────────────┐
│                                              │
│ [푸터 실시간 렌더링]                         │
│ SMVD                                         │
│ 숙명여자대학교 시각영상디자인과              │
│ Visual Media Design Department               │
│                                              │
│ 주소: 서울...                               │
│ 전화: +82...                                │
│ 이메일: smvd@...                            │
│                                              │
│ [Insta] [YouTube]                          │
│                                              │
│ © 2026 All rights reserved                 │
│                                              │
└──────────────────────────────────────────────┘
```

### 5-2 API 엔드포인트 (푸터)

```
Footer 관리:
GET    /api/admin/footer                              # 푸터 조회
PUT    /api/admin/footer                              # 푸터 수정 (제목, 주소, 전화, 이메일, copyright)

SNS 관리:
PUT    /api/admin/footer/social-links                 # SNS 링크 전체 업데이트
PATCH  /api/admin/footer/social-links/:platform       # 특정 SNS 수정 (URL)
PATCH  /api/admin/footer/social-links/:platform/toggle # SNS 활성화/비활성화
DELETE /api/admin/footer/social-links/:platform       # SNS 항목 삭제
```

---

## 6️⃣ 메인페이지 연동 (핵심!)

### 6-1 Header 컴포넌트 수정

**현재 문제:**
```typescript
// src/components/common/Header/Header.tsx
export function Header({ navigation }: HeaderProps) {
  // navigation props만 받음
  // 로고/파비콘 데이터 없음
}
```

**수정:**
```typescript
// src/components/common/Header/Header.tsx

interface HeaderProps {
  navigation: NavigationItem[];
  headerConfig?: {
    logoImagePath?: string;    // 로고 이미지 경로
    faviconImagePath?: string; // 파비콘 경로
  };
}

export function Header({ navigation, headerConfig }: HeaderProps) {
  return (
    <header>
      <nav>
        <div>
          {/* 로고 - 동적 이미지 */}
          {headerConfig?.logoImagePath ? (
            <img
              src={headerConfig.logoImagePath}
              alt="Logo"
              width={50}
              height={50}
            />
          ) : (
            <div>
              <h1>SMVD</h1>
              <p>Visual & Media Design</p>
            </div>
          )}

          {/* 메뉴 */}
          <TopNavigation items={navigation.filter(n => n.isActive)} />
        </div>
      </nav>
    </header>
  );
}
```

### 6-2 메인페이지 수정 (Server Component)

**현재:**
```typescript
// src/app/(public)/page.tsx
return (
  <div>
    <Header />
    <Footer />
  </div>
);
```

**수정 후:**
```typescript
// src/app/(public)/page.tsx

// Server Component: 헤더 설정 데이터 페칭
async function HeaderWithData() {
  const [navigation, headerConfig] = await Promise.all([
    prisma.navigation.findMany({
      orderBy: { order: 'asc' },
    }),
    prisma.headerConfig.findFirst()?.then(config => {
      if (!config) return undefined;
      return {
        logoImagePath: config.logoImage?.filepath,
        faviconImagePath: config.faviconImage?.filepath,
      };
    }),
  ]);

  return <Header navigation={navigation} headerConfig={headerConfig} />;
}

// Server Component: 푸터 데이터 페칭
async function FooterWithData() {
  const footer = await prisma.footer.findFirst();

  // socialLinks JSON 파싱
  const socialLinks = footer?.socialLinks && typeof footer.socialLinks === 'object'
    ? (footer.socialLinks as Record<string, any>)
    : {};

  return <Footer data={footer} socialLinks={socialLinks} />;
}

export default async function HomePage() {
  // ... existing code ...

  return (
    <div>
      <HeaderWithData />           // ✅ DB 데이터 전달
      <VideoHero />
      <ExhibitionSection items={exhibitionItems} />
      <AboutSection content={aboutContent} />
      <WorkSection items={workItems} />
      <FooterWithData />           // ✅ DB 데이터 전달
    </div>
  );
}
```

### 6-3 Favicon 적용 (head에 동적 적용)

**옵션 A: layout.tsx에서 (권장)**
```typescript
// src/app/layout.tsx
import { getHeaderConfig } from '@/lib/header-config';

export async function generateMetadata() {
  const headerConfig = await getHeaderConfig();

  return {
    title: '숙명여자대학교 시각영상디자인과',
    icons: {
      icon: headerConfig?.faviconImagePath || '/favicon.ico',
    },
  };
}
```

**옵션 B: public/favicon.ico 동적 복사**
```typescript
// API에서 파비콘 다운로드 후 public/favicon.ico로 복사
// 다만 이는 빌드 시간에만 가능하므로 ISR 갱신 필요
```

**추천: 옵션 A (metadata로 동적 적용)**

---

## 7️⃣ 파일 구조 전체

### 7-1 신규 생성 파일 (네비게이션)

```
src/
├── hooks/
│   └── navigation/
│       ├── index.ts                    # useNavigationEditor
│       ├── useHeaderConfigEditor.ts   # useHeaderConfigEditor (로고/파비콘)
│       └── types.ts                    # 타입 정의
│
├── components/admin/
│   ├── HeaderConfigEditor.tsx          # 로고/파비콘 업로드
│   ├── NavigationList.tsx              # 메뉴 테이블 (드래그)
│   ├── NavigationModal.tsx             # 메뉴 추가/수정
│   └── NavigationEditor.tsx            # 전체 컨테이너
│
├── app/api/admin/
│   ├── header-config/
│   │   └── route.ts                   # GET, PUT
│   │
│   └── navigation/
│       ├── route.ts                   # GET, POST
│       ├── [id]/
│       │   └── route.ts               # PUT, DELETE
│       ├── [id]/toggle/
│       │   └── route.ts               # PATCH
│       └── reorder/
│           └── route.ts               # PATCH (트랜잭션)
│
└── app/admin/dashboard/
    └── navigation/
        └── page.tsx                    # Admin 대시보드
```

### 7-2 신규 생성 파일 (푸터)

```
src/
├── hooks/
│   └── footer/
│       ├── index.ts                    # useFooterEditor
│       └── types.ts                    # 타입 정의
│
├── components/admin/
│   ├── FooterBasicEditor.tsx           # 텍스트 입력 (제목, 주소, 전화 등)
│   ├── SocialLinksList.tsx             # SNS 테이블
│   ├── SocialLinkModal.tsx             # SNS 추가/수정
│   └── FooterEditor.tsx                # 전체 컨테이너
│
├── app/api/admin/footer/
│   ├── route.ts                        # GET, PUT
│   └── social-links/
│       ├── route.ts                   # PUT (전체), POST (항목 추가)
│       └── [platform]/
│           ├── route.ts               # PATCH, DELETE
│           └── toggle/
│               └── route.ts           # PATCH
│
└── app/admin/dashboard/footer/
    └── page.tsx                        # Admin 대시보드
```

### 7-3 수정할 기존 파일

```
src/
├── components/common/
│   ├── Header/Header.tsx               # ✏️ props 추가 (headerConfig)
│   └── Footer/Footer.tsx               # ✏️ props 추가 (socialLinks)
│
├── app/(public)/
│   └── page.tsx                        # ✏️ HeaderWithData, FooterWithData 추가
│
├── app/layout.tsx                      # ✏️ favicon 동적 적용
│
├── app/admin/dashboard/
│   └── page.tsx                        # ✏️ 링크 추가 (네비, 푸터)
│
├── types/
│   ├── index.ts                        # ✏️ 타입 추가
│   └── schemas.ts                      # ✏️ Zod 스키마 추가
│
└── prisma/
    └── schema.prisma                   # ✏️ HeaderConfig 모델 추가
```

---

## 8️⃣ 재활용 가능한 컴포넌트/라이브러리

### 8-1 기존 Home CMS에서 복사

```typescript
// 네비게이션 드래그 (ExhibitionItemsList.tsx 패턴)
✅ @dnd-kit DnD Context
✅ DragEndEvent 처리
✅ 트랜잭션 기반 reorder 로직

// 네비게이션 폼 (ExhibitionItemModal.tsx 패턴)
✅ react-hook-form
✅ zodResolver 검증
✅ 모달 구조

// 푸터 폼 (CourseModal.tsx 패턴)
✅ 다중 입력 필드
✅ TextArea 지원
✅ 저장/취소 로직

// SNS 관리 (ThesisTable.tsx 패턴)
✅ 테이블 구조
✅ 추가/수정/삭제 로직
✅ 토글 (활성화/비활성화)
```

### 8-2 이미 설치된 라이브러리

```typescript
✅ @dnd-kit (드래그 순서 변경)
✅ react-hook-form (폼 관리)
✅ zod (검증)
✅ lucide-react (아이콘)
✅ next-auth (인증)
✅ multer (파일 업로드 - 이미 사용 중)
```

### 8-3 기존 유틸 함수

```typescript
✅ src/lib/api-response.ts (successResponse, errorResponse)
✅ src/lib/auth-check.ts (checkAdminAuth)
✅ src/lib/db.ts (prisma)
✅ src/lib/image/process.ts (이미지 처리 - 재사용)
✅ src/app/api/admin/upload/route.ts (파일 업로드 API)
```

---

## 9️⃣ 구현 순서 (권장)

### Phase 1: DB 스키마 + 타입 (1-2시간)
1. Prisma: HeaderConfig 모델 추가
2. Prisma: Media 관계 수정 (로고/파비콘)
3. 타입 정의: NavigationItem, HeaderConfig, FooterData, SocialLink
4. Zod 스키마: NavigationSchema, HeaderConfigSchema, FooterSchema

### Phase 2: 네비게이션 CMS (10-12시간)
1. useHeaderConfigEditor 훅 (로고/파비콘)
2. useNavigationEditor 훅 (메뉴)
3. API 라우트: /api/admin/header-config (GET, PUT)
4. API 라우트: /api/admin/navigation (GET, POST, PATCH, DELETE)
5. HeaderConfigEditor 컴포넌트 (파일 업로드)
6. NavigationList, NavigationModal 컴포넌트
7. Admin 대시보드: /admin/dashboard/navigation

### Phase 3: 푸터 CMS (8-10시간)
1. useFooterEditor 훅
2. API 라우트: /api/admin/footer (GET, PUT)
3. API 라우트: /api/admin/footer/social-links (PUT, PATCH, DELETE)
4. FooterBasicEditor, SocialLinksList, SocialLinkModal 컴포넌트
5. Admin 대시보드: /admin/dashboard/footer

### Phase 4: 메인페이지 연동 (3-4시간)
1. Header 컴포넌트 수정 (headerConfig props)
2. Footer 컴포넌트 수정 (socialLinks props)
3. page.tsx: HeaderWithData, FooterWithData 추가
4. layout.tsx: favicon 동적 적용
5. 다른 공개 페이지 적용 (/about, /curriculum, /work, /news-and-events)

### Phase 5: 테스트 & 배포 (2-3시간)
1. Admin: 로고/파비콘 업로드 테스트
2. Admin: 메뉴 순서 변경 테스트
3. Admin: 푸터 수정 테스트
4. Admin: SNS 추가/수정/삭제 테스트
5. 메인페이지: 실시간 반영 확인
6. TypeScript: `npm run build` (0 errors)
7. Git commit

**총 예상 시간: 24-31시간**

---

## 🔟 DB 마이그레이션 명령어

```bash
# 1. Prisma 스키마 수정
# prisma/schema.prisma에 HeaderConfig 모델 추가

# 2. 마이그레이션 생성
npx prisma migrate dev --name add_header_config

# 3. Prisma 클라이언트 재생성
npx prisma generate

# 4. 데이터베이스 동기화
npx prisma db push

# 5. 기본 데이터 생성 (seed)
# 예: HeaderConfig 1개, Navigation 6개 등
```

---

## 1️⃣1️⃣ 핵심 체크리스트

### 구현 전
- [ ] 사용자의 원래 요청 3가지 모두 확인
  - [ ] 로고 이미지 업로드
  - [ ] 파비콘 업로드
  - [ ] 메뉴 순서 변경
  - [ ] 푸터 텍스트 수정
  - [ ] SNS 추가/URL/활성화 제어
- [ ] Prisma 스키마 이해 (HeaderConfig 모델)
- [ ] 기존 upload API 이해 (이미지 처리 로직)

### 구현 중
- [ ] API: `checkAdminAuth()` 필수
- [ ] API: 트랜잭션 처리 (reorder)
- [ ] 파일 업로드: 파일 검증 + WebP 변환
- [ ] 파비콘: public/favicon.ico 또는 metadata 동적 적용
- [ ] 메인페이지: Server Component로 변환
- [ ] ISR: revalidatePath() 호출 필수

### 배포 전
- [ ] 모든 공개 페이지에 HeaderWithData, FooterWithData 적용
- [ ] favicon이 모든 페이지에 반영됨
- [ ] Admin: CRUD 모두 테스트
- [ ] TypeScript: 0 errors
- [ ] Build: 49/49 페이지 성공

---

## 1️⃣2️⃣ 최종 요약

| 항목 | 상태 | 소요시간 |
|------|------|---------|
| **로고 이미지 업로드** | ❌ 신규 | 4-5시간 |
| **파비콘 업로드** | ❌ 신규 | 2-3시간 |
| **메뉴 순서 변경** | ❌ 신규 | 4-5시간 |
| **푸터 텍스트 수정** | ❌ 신규 | 3-4시간 |
| **SNS 추가/URL/활성화** | ❌ 신규 | 6-8시간 |
| **메인페이지 연동** | ⚠️ 부분 | 3-4시간 |
| **테스트 & 배포** | - | 2-3시간 |
| **총계** | | **24-31시간** |

---

**다음 단계:**
1. ✅ 이 정확한 분석 리포트 검토
2. 📝 Prisma 스키마 수정 (HeaderConfig 추가)
3. 💾 DB 마이그레이션
4. 🔧 네비게이션 CMS 구현 (Phase 2)
5. 🎨 푸터 CMS 구현 (Phase 3)
6. 🔗 메인페이지 연동 (Phase 4)
7. ✅ 테스트 & 배포 (Phase 5)
