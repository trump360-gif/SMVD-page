# SMVD 웹사이트 CMS - CLAUDE.md

## 프로젝트 정보

| 항목 | 값 |
|------|-----|
| **프로젝트명** | 숙명여자대학교 시각영상디자인과 웹사이트 (CMS) |
| **Tech Stack** | Next.js 15 + React 19 + TypeScript + PostgreSQL + NextAuth |
| **생성일** | 2026-02-12 |
| **타입** | Full-stack CMS (공개 사이트 + 관리자 페이지) |

---

## 📋 프로젝트 개요

### 목표
숙명여대 시각영상디자인과의 공식 웹사이트를 구축하되, **관리자가 콘텐츠를 자유롭게 수정/관리**할 수 있는 CMS 시스템 구현

### 주요 기능

#### 📄 공개 페이지 (6개)
1. **Home** (홈페이지) - 메인 페이지
2. **About Major** (학과소개)
3. **Curriculum** (교과과정)
4. **People** (교수진)
5. **Work** (포트폴리오)
6. **News&Event** (뉴스/이벤트)

#### 🔐 관리자 기능
- **콘텐츠 관리**
  - 각 페이지 텍스트 수정
  - 이미지 업로드/변경 (WebP 자동 변환 + 최적화)
  - 비디오 업로드 (임베드 가능)
  - 섹션 순서 자유롭게 변경

- **헤더(네비게이션) 관리**
  - 메뉴 텍스트 수정
  - 메뉴 순서 변경
  - 메뉴 활성화/비활성화

- **푸터 관리**
  - 푸터 정보 수정
  - 푸터 링크 수정
  - 푸터 항목 추가/삭제

---

## 🏗️ 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI**: React 19 + TypeScript
- **Styling**: Tailwind CSS (Pencil 디자인 기반)
- **상태관리**: React Query + Context API
- **이미지**: next/image + sharp (WebP 변환)
- **폼**: React Hook Form + Zod 검증

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **인증**: NextAuth.js v5
- **ORM**: Prisma
- **DB**: PostgreSQL 14+
- **파일관리**: multer (로컬) → 나중에 S3 연동

### 개발 도구
- **타입**: TypeScript (strict mode)
- **번들러**: Turbopack
- **테스트**: Vitest + Playwright (E2E)
- **배포**: Vercel (Next.js 최적화)

---

## 📐 아키텍처

### 폴더 구조
```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # 공개 페이지
│   │   ├── page.tsx              # Home
│   │   ├── about/page.tsx        # About Major
│   │   ├── curriculum/page.tsx   # Curriculum
│   │   ├── people/page.tsx       # People
│   │   ├── work/page.tsx         # Work
│   │   └── news/page.tsx         # News&Event
│   │
│   ├── admin/                    # 관리자 페이지
│   │   ├── login/page.tsx        # 로그인
│   │   ├── dashboard/page.tsx    # 대시보드
│   │   ├── [pageId]/edit/page.tsx    # 페이지 편집
│   │   ├── navigation/edit/page.tsx  # 헤더 관리
│   │   └── footer/edit/page.tsx      # 푸터 관리
│   │
│   └── api/                      # API 라우트
│       ├── auth/[...nextauth]/route.ts
│       ├── pages/route.ts        # 페이지 CRUD
│       ├── sections/route.ts     # 섹션 CRUD
│       ├── upload/route.ts       # 파일 업로드
│       ├── navigation/route.ts   # 네비게이션 CRUD
│       └── footer/route.ts       # 푸터 CRUD
│
├── components/
│   ├── public/                   # 공개 페이지 컴포넌트
│   ├── admin/                    # 관리자 페이지 컴포넌트
│   ├── common/                   # 공유 컴포넌트
│   └── ui/                       # UI 컴포넌트
│
├── lib/
│   ├── api.ts                    # API 클라이언트
│   ├── auth.ts                   # NextAuth 설정
│   ├── db.ts                     # Prisma 클라이언트
│   ├── image.ts                  # 이미지 처리 (WebP 변환)
│   └── validation.ts             # Zod 스키마
│
├── types/
│   ├── api/                      # API 타입
│   ├── domain/                   # 도메인 타입
│   └── schemas/                  # Zod 스키마
│
├── hooks/
│   ├── useAuth.ts
│   ├── usePages.ts
│   └── useAdmin.ts
│
└── styles/
    └── globals.css               # Tailwind + 커스텀
```

### DB 스키마 (주요)
```sql
-- 사용자 (관리자)
Users (id, email, password_hash, role, createdAt)

-- 페이지
Pages (id, slug, title, description, order)

-- 섹션 (유동적)
Sections (id, pageId, type, title, content, images, video, order)

-- 네비게이션
Navigation (id, label, href, order, isActive)

-- 푸터
Footer (id, title, content, links, createdAt, updatedAt)

-- 이미지 메타
Images (id, filename, path, format, size, uploadedAt)
```

---

## 🔄 개발 프로세스

### Phase 1: 아키텍처 & API 설계 ✅
- [ ] 상세 API 명세 작성
- [ ] DB 스키마 설계 (Prisma)
- [ ] 타입 정의

### Phase 2: 백엔드 구현
- [ ] NextAuth 인증 설정
- [ ] API 라우트 구현
- [ ] Prisma 마이그레이션
- [ ] 이미지 처리 (WebP 변환)

### Phase 3: 공개 페이지 구현
- [ ] 컴포넌트 구현 (Pencil 디자인 기반)
- [ ] 데이터 바인딩

### Phase 4: 관리자 페이지 구현
- [ ] 로그인 페이지
- [ ] 콘텐츠 에디터 (WYSIWYG)
- [ ] 이미지/비디오 업로더
- [ ] 섹션 순서 관리 (Drag & Drop)

### Phase 5: 최적화 & 배포
- [ ] 성능 최적화
- [ ] SEO 최적화
- [ ] E2E 테스트
- [ ] Vercel 배포

---

## 📝 API 명세 (Draft)

### 인증
```
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/session
```

### 페이지 관리
```
GET /api/pages                 # 모든 페이지 조회
GET /api/pages/:pageId        # 페이지 상세
PUT /api/pages/:pageId        # 페이지 수정
```

### 섹션 관리
```
GET /api/sections?pageId=xxx  # 페이지의 섹션 조회
POST /api/sections            # 섹션 생성
PUT /api/sections/:sectionId  # 섹션 수정
DELETE /api/sections/:sectionId
```

### 파일 업로드
```
POST /api/upload              # 이미지/비디오 업로드
DELETE /api/upload/:fileId    # 파일 삭제
```

### 네비게이션
```
GET /api/navigation           # 네비게이션 조회
PUT /api/navigation/:itemId   # 항목 수정
POST /api/navigation          # 항목 추가
```

### 푸터
```
GET /api/footer               # 푸터 정보 조회
PUT /api/footer               # 푸터 수정
```

---

## 🎨 디자인 시스템 (Pencil 기반)

- **색상**: Deep Blue #0845A7, Blue #1A46E7, Light Blue #489AFF
- **폰트**: Pretendard (한글), Satoshi (영문)
- **간격**: 40px (PC), 16px (Mobile)

---

## 📊 진행 상황

```
Phase 1: [ ] 아키텍처 & API 설계
Phase 2: [ ] 백엔드 구현
Phase 3: [ ] 공개 페이지
Phase 4: [ ] 관리자 페이지
Phase 5: [ ] 최적화 & 배포
```

---

## 📅 우선순위

1. **긴급**: 아키텍처 & API 명세 확정
2. **높음**: 백엔드 기본 구조 (인증, DB)
3. **중간**: 공개 페이지 구현
4. **중간**: 관리자 페이지 구현
5. **낮음**: 최적화 & 성능 튜닝

---

## ⚠️ 주의사항

- 이미지는 **로컬 저장** → 나중에 S3/CDN으로 마이그레이션
- WebP 변환은 서버에서 처리 (sharp 라이브러리)
- 섹션 순서는 **DB의 order 필드로 관리** → 유동적 변경 가능
- 관리자 인증은 **NextAuth.js** 사용 (세션 기반)

---

## 🚀 시작하기

```bash
# 1. 프로젝트 초기화
npm create next-app@latest smvd-cms

# 2. 의존성 설치
npm install

# 3. Prisma 설정
npx prisma init

# 4. 데이터베이스 마이그레이션
npx prisma migrate dev

# 5. 개발 서버 시작
npm run dev
```

---

## 📞 문의 및 변경사항

모든 변경사항은 이 문서를 먼저 업데이트한 후 구현한다.
