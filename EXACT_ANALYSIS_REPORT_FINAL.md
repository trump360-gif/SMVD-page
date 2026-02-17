# 📊 네비게이션 & 푸터 CMS 구현 - 최종 정확 분석 리포트

**작성일:** 2026-02-17
**분석 범위:** 메인페이지(`http://localhost:3000/`) 완전 정확 분석
**버전:** Final (철저한 코드 분석 후)

---

## 1️⃣ 메인페이지 현재 상태 (정확)

### 1-1 Header 현황

**파일:** `src/components/public/home/Header.tsx`

#### 현재 구성:
```
┌─────────────────────────────────────────────┐
│         Header (80px height)                │
├─────────────────────────────────────────────┤
│                                             │
│  [SVG 로고] ← About  Curriculum  Work  News│
│  (42x42)      [버튼1] [버튼2] [버튼3] [버튼4]│
│                                             │
└─────────────────────────────────────────────┘
```

#### 정확한 내용:
- **로고**: SVG 이미지만 있음 (텍스트 "SMVD" ❌ 없음)
- **네비게이션**: 4개 메뉴 (About, Curriculum, Work, News&Event)
- **상태**: 모두 **하드코딩** - DB와 연동 안 됨
- **Props**: 받지 않음 (`export default function Header()`)

#### 문제점:
1. ❌ 로고 이미지를 관리할 수 없음 (SVG 하드코딩)
2. ❌ 파비콘이 없음
3. ❌ 네비게이션을 DB에서 못 가져옴
4. ❌ 메뉴 순서를 변경할 수 없음

---

### 1-2 Footer 현황

**파일:** `src/components/public/home/Footer.tsx`

#### 현재 구성:
```
┌──────────────────────────────────────┐
│           Footer                     │
├──────────────────────────────────────┤
│                                      │
│  [SVG] 숙명여자대학교 미술대학...   │
│         Visual Media Design         │
│                                      │
│  Contact                             │
│  +82 (0)2 710 9958                  │
│  서울 특별시 용산구 청파로 47길...  │
│  시각영상디자인과 (미술대학 201호)  │
│                                      │
└──────────────────────────────────────┘
```

#### 정확한 내용:
- **로고 이미지**: `/images/icon/Group-27-3.svg` (고정)
- **제목**: "숙명여자대학교 미술대학 시각영상디자인학과" (하드코딩)
- **설명**: "University of Sookmyung Women, Visual Media Design" (하드코딩)
- **주소**: "서울 특별시 용산구 청파로 47길 100..." (하드코딩)
- **전화**: "+82 (0)2 710 9958" (하드코딩)
- **SNS**: ❌ 없음
- **Props**: 받지 않음 (`export default function Footer()`)

#### 문제점:
1. ❌ 텍스트를 수정할 수 없음 (모두 하드코딩)
2. ❌ SNS 링크가 없음
3. ❌ 로고 이미지를 변경할 수 없음
4. ❌ DB와 연동 안 됨

---

### 1-3 메인페이지 구조

**파일:** `src/app/(public)/page.tsx`

```typescript
// 현재 문제: Header/Footer를 props 없이 호출
return (
  <div>
    <Header />           // ❌ 데이터 전달 안 함
    <VideoHero />
    <ExhibitionSection items={exhibitionItems} />  // ✅ 데이터 전달
    <AboutSection content={aboutContent} />        // ✅ 데이터 전달
    <WorkSection items={workItems} />              // ✅ 데이터 전달
    <Footer />           // ❌ 데이터 전달 안 함
  </div>
);
```

---

### 1-4 파비콘 현황

**확인 결과:**
- ❌ `/public/favicon.ico` 없음
- ❌ `src/app/layout.tsx`에서 파비콘 설정 없음
- ❌ 현재 브라우저 탭에 파비콘 없음

---

## 2️⃣ DB 스키마 현황 (정확)

### 2-1 존재하는 테이블

#### Navigation 모델 ✅ (있음)
```prisma
model Navigation {
  id        String    @id @default(cuid())
  label     String                          // "About", "Curriculum", "Work", "News&Event"
  href      String                          // "/about", "/curriculum", "/work", "/news"
  order     Int       @default(0)           // 순서
  isActive  Boolean   @default(true)        // 활성화 여부
  parentId  String?   @map("parent_id")     // 서브메뉴용
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  @@map("navigation")
}
```

#### Footer 모델 ✅ (있음)
```prisma
model Footer {
  id          String    @id @default(cuid())
  title       String    @default("숙명여자대학교 시각영상디자인과")
  description String?                      // 영문 설명
  address     String?                       // 주소
  phone       String?                       // 전화
  email       String?                       // 이메일
  socialLinks Json?     @map("social_links") // SNS 링크
  copyright   String?
  updatedAt   DateTime  @updatedAt
  @@map("footer")
}
```

### 2-2 필요하지만 없는 테이블

#### HeaderConfig 모델 ❌ (없음 - 필요함!)
```prisma
model HeaderConfig {
  id             String    @id @default(cuid())

  // 로고 이미지
  logoImageId    String?   @map("logo_image_id")
  logoImage      Media?    @relation(name: "logoImage", fields: [logoImageId], references: [id])

  // 파비콘
  faviconImageId String?   @map("favicon_image_id")
  faviconImage   Media?    @relation(name: "faviconImage", fields: [faviconImageId], references: [id])

  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  @@map("header_config")
}
```

---

## 3️⃣ 사용자 요청사항 정리 (정확)

### 3-1 네비게이션 섹션 (헤더 영역)
- ✅ **로고 이미지 업로드**: 현재 SVG 고정 → DB에서 관리
- ✅ **파비콘 업로드**: 현재 없음 → DB에서 관리
- ✅ **메뉴 순서 변경**: 현재 고정 → DB에서 순서 변경

### 3-2 푸터 섹션
- ✅ **푸터 텍스트 수정**: 현재 하드코딩 → DB에서 수정
- ✅ **SNS 추가**: 현재 없음 → DB에서 추가/수정
- ✅ **SNS URL → 링크 이동**: 아이콘 클릭 시 해당 SNS로
- ✅ **SNS 활성화/비활성화**: 없으면 숨김

---

## 4️⃣ 구현 전략

### 4-1 Phase 1: DB 스키마 추가 (1시간)

**필요한 변경:**
1. Prisma에 `HeaderConfig` 모델 추가
2. `Media` 모델에 로고/파비콘 관계 추가
3. 마이그레이션 실행

```bash
npx prisma migrate dev --name add_header_config
```

### 4-2 Phase 2: Header 컴포넌트 수정 (3-4시간)

**현재:**
```typescript
export default function Header() {
  const navItems = [
    { label: 'About', href: '/about' },
    { label: 'Curriculum', href: '/curriculum' },
    { label: 'Work', href: '/work' },
    { label: 'News&Event', href: '/news' },
  ];

  return (
    <header>
      <svg>...</svg>  // 고정된 SVG
      {navItems.map(...)}  // 고정된 메뉴
    </header>
  );
}
```

**수정:**
```typescript
interface HeaderProps {
  navigation: NavigationItem[];
  headerConfig?: {
    logoImagePath?: string;
    faviconImagePath?: string;
  };
}

export function Header({ navigation, headerConfig }: HeaderProps) {
  return (
    <header>
      {/* 로고 - 동적 이미지 또는 SVG */}
      {headerConfig?.logoImagePath ? (
        <img src={headerConfig.logoImagePath} alt="Logo" />
      ) : (
        <svg>...</svg>  // 기본값
      )}

      {/* 메뉴 - DB에서 가져온 데이터 */}
      {navigation.filter(n => n.isActive).map(...)}
    </header>
  );
}
```

**파일 경로:** `src/components/public/home/Header.tsx` (전체 재작성)

### 4-3 Phase 3: Footer 컴포넌트 수정 (3-4시간)

**현재:**
```typescript
export default function Footer() {
  return (
    <footer>
      <img src="/images/icon/Group-27-3.svg" />  // 고정
      <p>숙명여자대학교...</p>  // 하드코딩
      <p>+82 (0)2 710 9958</p>  // 하드코딩
      {/* SNS 없음 */}
    </footer>
  );
}
```

**수정:**
```typescript
interface FooterProps {
  data?: {
    title: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    logoImagePath?: string;
  };
  socialLinks?: {
    instagram?: { url: string; isActive: boolean };
    youtube?: { url: string; isActive: boolean };
    facebook?: { url: string; isActive: boolean };
    twitter?: { url: string; isActive: boolean };
    linkedin?: { url: string; isActive: boolean };
  };
}

export function Footer({ data, socialLinks }: FooterProps) {
  return (
    <footer>
      {/* 로고 이미지 */}
      {data?.logoImagePath ? (
        <img src={data.logoImagePath} />
      ) : (
        <img src="/images/icon/Group-27-3.svg" />  // 기본값
      )}

      {/* 텍스트 - DB에서 */}
      <p>{data?.title}</p>
      <p>{data?.address}</p>
      <p>{data?.phone}</p>

      {/* SNS 링크 - 활성화된 것만 표시 */}
      {socialLinks && Object.entries(socialLinks)
        .filter(([_, link]) => link?.isActive)
        .map(([platform, link]) => (
          <a href={link?.url} key={platform}>
            {/* SNS 아이콘 */}
          </a>
        ))}
    </footer>
  );
}
```

**파일 경로:** `src/components/public/home/Footer.tsx` (전체 재작성)

### 4-4 Phase 4: 메인페이지 수정 (2-3시간)

**현재:**
```typescript
return (
  <div>
    <Header />
    <Footer />
  </div>
);
```

**수정:**
```typescript
// Server Component: 네비게이션 + 헤더 설정 가져오기
async function HeaderWithData() {
  const [navigation, headerConfig] = await Promise.all([
    prisma.navigation.findMany({ orderBy: { order: 'asc' } }),
    prisma.headerConfig.findFirst(),
  ]);

  return (
    <Header
      navigation={navigation}
      headerConfig={{
        logoImagePath: headerConfig?.logoImage?.filepath,
        faviconImagePath: headerConfig?.faviconImage?.filepath,
      }}
    />
  );
}

// Server Component: 푸터 데이터 가져오기
async function FooterWithData() {
  const footer = await prisma.footer.findFirst();

  const socialLinks = footer?.socialLinks && typeof footer.socialLinks === 'object'
    ? (footer.socialLinks as Record<string, any>)
    : {};

  return (
    <Footer
      data={{
        title: footer?.title || '',
        description: footer?.description || '',
        address: footer?.address || '',
        phone: footer?.phone || '',
        email: footer?.email || '',
        logoImagePath: undefined, // 별도 필드 추가 필요
      }}
      socialLinks={socialLinks}
    />
  );
}

export default async function HomePage() {
  // ... 기존 코드 ...

  return (
    <div>
      <HeaderWithData />   // ✅ DB 데이터
      <VideoHero />
      <ExhibitionSection items={exhibitionItems} />
      <AboutSection content={aboutContent} />
      <WorkSection items={workItems} />
      <FooterWithData />   // ✅ DB 데이터
    </div>
  );
}
```

**파일 경로:** `src/app/(public)/page.tsx`

### 4-5 Phase 5: Favicon 설정 (1시간)

**파일:** `src/app/layout.tsx`

```typescript
export async function generateMetadata() {
  const headerConfig = await prisma.headerConfig.findFirst({
    include: { faviconImage: true },
  });

  return {
    title: '숙명여자대학교 시각영상디자인과',
    description: '...',
    icons: {
      icon: headerConfig?.faviconImage?.filepath || '/favicon.ico',
    },
  };
}
```

### 4-6 Phase 6: Admin CMS 구현 (15-18시간)

**네비게이션 CMS:**
- `/admin/dashboard/navigation` 페이지
- 메뉴 리스트 (드래그로 순서 변경)
- 메뉴 추가/수정/삭제
- 로고/파비콘 업로드

**푸터 CMS:**
- `/admin/dashboard/footer` 페이지
- 텍스트 입력 (제목, 주소, 전화, 이메일)
- SNS 관리 (추가/수정/삭제, 활성화/비활성화)
- 로고 업로드

**API 엔드포인트:**
- `GET /api/admin/header-config`
- `PUT /api/admin/header-config`
- `GET /api/admin/navigation`
- `POST/PUT/DELETE /api/admin/navigation`
- `PATCH /api/admin/navigation/reorder`
- `GET /api/admin/footer`
- `PUT /api/admin/footer`
- `PUT/PATCH/DELETE /api/admin/footer/social-links`

### 4-7 Phase 7: 테스트 & 배포 (2-3시간)

---

## 5️⃣ 재활용 가능한 것들

### Home CMS에서 복사:
```
✅ useExhibitionItemEditor.ts → useNavigationEditor.ts
✅ useWorkPortfolioEditor.ts → useFooterEditor.ts
✅ ExhibitionItemsList.tsx → NavigationList.tsx (드래그)
✅ ExhibitionItemModal.tsx → NavigationModal.tsx
✅ CourseTable.tsx → FooterBasicEditor.tsx
✅ ThesisTable.tsx → SocialLinksList.tsx
✅ API 패턴 (POST/PUT/DELETE/PATCH)
✅ 파일 업로드 로직 (src/app/api/admin/upload/route.ts)
```

### 이미 설치된 라이브러리:
```
✅ @dnd-kit (드래그)
✅ react-hook-form (폼)
✅ zod (검증)
✅ lucide-react (아이콘)
```

---

## 6️⃣ 예상 소요 시간

| Phase | 내용 | 시간 |
|-------|------|------|
| 1 | DB 스키마 추가 | 1시간 |
| 2 | Header 컴포넌트 수정 | 3-4시간 |
| 3 | Footer 컴포넌트 수정 | 3-4시간 |
| 4 | 메인페이지 수정 | 2-3시간 |
| 5 | Favicon 설정 | 1시간 |
| 6 | Admin CMS 구현 | 15-18시간 |
| 7 | 테스트 & 배포 | 2-3시간 |
| **총계** | | **27-33시간** |

---

## 7️⃣ 구현 순서 (권장)

```
1️⃣ DB 스키마 추가 (Phase 1)
   ↓
2️⃣ Header 수정 (Phase 2)
   ↓
3️⃣ Footer 수정 (Phase 3)
   ↓
4️⃣ 메인페이지 수정 (Phase 4)
   ↓
5️⃣ Favicon 설정 (Phase 5)
   ↓
6️⃣ Admin CMS 전체 구현 (Phase 6)
   ↓
7️⃣ 테스트 & 배포 (Phase 7)
```

---

## 8️⃣ 체크리스트

### 구현 전
- [ ] Prisma 스키마 이해
- [ ] Header/Footer 현재 코드 숙지
- [ ] 기존 Home CMS 패턴 학습

### 구현 중
- [ ] DB 마이그레이션 성공 (0 errors)
- [ ] Header Props 타입 정의
- [ ] Footer Props 타입 정의
- [ ] Admin API 모두 `checkAdminAuth()` 포함
- [ ] 파일 업로드 검증 (확장자, 크기)

### 배포 전
- [ ] 메인페이지 Header/Footer 실시간 반영 확인
- [ ] Admin: 모든 CRUD 테스트 완료
- [ ] TypeScript: `npm run build` (0 errors)
- [ ] Build: 49/49 페이지 성공
- [ ] 다른 공개 페이지도 HeaderWithData/FooterWithData 적용

---

## 9️⃣ 핵심 정리

```
현재:
- Header: SVG 로고만, 메뉴 고정, 데이터 못 가져옴
- Footer: 모든 텍스트 하드코딩, SNS 없음, 데이터 못 가져옴
- DB: Navigation/Footer 모델 있음, HeaderConfig 없음
- Favicon: 없음

필요:
- Header: 로고/파비콘 DB 관리, 네비게이션 DB 가져오기
- Footer: 텍스트 DB 관리, SNS 추가/수정/삭제
- DB: HeaderConfig 모델 추가
- Favicon: 동적으로 DB에서 가져오기
- Admin CMS: 네비게이션 & 푸터 관리 페이지 구현
```

---

**다음 단계:** Phase 1부터 시작 (DB 스키마 추가)
