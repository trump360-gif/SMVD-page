# 배포 가이드 (Deployment Guide)

**최종 작성일**: 2026-02-12
**버전**: 1.0
**상태**: 배포 준비 완료 ✅

---

## 📋 배포 전 체크리스트

### 환경 설정
- [ ] `.env` 파일 생성 (`.env.example` 참고)
- [ ] `NEXTAUTH_SECRET` 생성: `openssl rand -base64 32`
- [ ] PostgreSQL 데이터베이스 생성
- [ ] `DATABASE_URL` 설정 완료

### 코드 검증
- [ ] 모든 환경 변수 설정
- [ ] TypeScript 컴파일 성공
- [ ] 로컬 테스트 완료
- [ ] 모든 페이지 로드 확인
- [ ] 관리자 기능 테스트 완료

### 보안
- [ ] 관리자 계정 생성
- [ ] API 인증 확인
- [ ] CORS 설정 확인
- [ ] 민감한 데이터 환경 변수로 관리

---

## 🚀 Vercel 배포 (권장)

### 1단계: Vercel 프로젝트 생성

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 프로젝트 링크
vercel link
```

### 2단계: 환경 변수 설정

**Vercel 대시보드에서 설정**:

1. **Settings** → **Environment Variables** 이동
2. 다음 변수 추가:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### 3단계: 배포

```bash
# 개발 배포 (미리보기)
vercel --prod

# 또는 GitHub 연결 후 자동 배포
# Vercel 대시보드에서 Git 저장소 연결
```

### 4단계: 커스텀 도메인 연결

**Vercel 대시보드**:
1. **Settings** → **Domains** 이동
2. 도메인 추가: `smvd.sookmyung.ac.kr`
3. DNS 레코드 업데이트

---

## 🛠️ 프로덕션 빌드

### 로컬에서 빌드 및 테스트

```bash
# 의존성 설치
npm install

# 프리즈마 마이그레이션
npx prisma migrate deploy

# 빌드
npm run build

# 시작
npm start
```

### 빌드 최적화

```bash
# 번들 분석
npm run build -- --analyze

# 빌드 결과 확인
ls -lah .next/static/
```

---

## 📊 성능 최적화

### Lighthouse 점수 목표
- **Performance**: 90+
- **Accessibility**: 90+
- **Best Practices**: 90+
- **SEO**: 95+

### 최적화 항목

#### 1. 이미지 최적화
```typescript
// ✅ next/image 사용
import Image from 'next/image';

<Image
  src="/path/to/image.webp"
  alt="설명"
  width={800}
  height={600}
  priority={false}
  loading="lazy"
/>
```

#### 2. 코드 스플리팅
- 자동: Next.js App Router에서 자동 처리
- 수동: `dynamic()` import 사용

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <p>로딩 중...</p>,
  ssr: false,
});
```

#### 3. 캐싱 전략

**정적 페이지** (1주일):
```typescript
export const revalidate = 604800; // 7 days
```

**동적 페이지** (1시간):
```typescript
export const revalidate = 3600; // 1 hour
```

**API 응답** (5분):
```typescript
// GET /api/pages
export const revalidate = 300;
```

#### 4. 번들 크기 감소
- Tree-shaking: 사용하지 않는 코드 제거
- 코드 분할: 페이지별 번들 분리
- 라이브러리 최적화: 가벼운 대체 라이브러리 사용

---

## 🔐 프로덕션 보안

### 환경 변수 보호
```bash
# .gitignore에 포함
.env
.env.local
.env.*.local
```

### HTTPS 강제
```typescript
// next.config.ts
export default {
  redirects: async () => {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'X-Forwarded-Proto',
            value: 'http',
          },
        ],
        permanent: true,
        destination: 'https://:host/:path*',
      },
    ];
  },
};
```

### Content Security Policy
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'"
  );

  return response;
}
```

### SQL Injection 방지
- ✅ Prisma ORM 사용 (자동 방지)
- ✅ Zod 검증 (입력 검증)
- ✅ 매개변수화된 쿼리 (Prisma)

---

## 📈 모니터링 및 로깅

### Vercel Analytics
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout() {
  return (
    <html>
      <body>
        {/* ... */}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking (선택)
```typescript
// Sentry 설정
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 로그 관리
```typescript
// lib/logger.ts
export function logError(message: string, error: unknown) {
  console.error(`[ERROR] ${message}:`, error);
  // Datadog, LogRocket 등으로 전송
}
```

---

## 🔄 배포 후 확인

### 1단계: 페이지 접근 확인
```bash
# 모든 페이지 로드 확인
curl https://your-domain.vercel.app/
curl https://your-domain.vercel.app/about
curl https://your-domain.vercel.app/people
curl https://your-domain.vercel.app/work
curl https://your-domain.vercel.app/news
```

### 2단계: 관리자 기능 테스트
```bash
# 관리자 로그인
https://your-domain.vercel.app/admin/login

# 페이지 편집
https://your-domain.vercel.app/admin/pages

# 섹션 드래그 앤 드롭 테스트
```

### 3단계: SEO 확인
- [ ] sitemap.xml 접근 가능: `/sitemap.xml`
- [ ] robots.txt 접근 가능: `/robots.txt`
- [ ] 메타태그 확인: DevTools Inspector
- [ ] Google Search Console 등록

### 4단계: 성능 측정
```bash
# Lighthouse 점수 측정
npm install -g lighthouse
lighthouse https://your-domain.vercel.app --view

# 또는 Chrome DevTools > Lighthouse
```

---

## 🆘 문제 해결

### 빌드 오류: "Cannot find module"
```bash
npm install
npx prisma generate
npm run build
```

### 데이터베이스 연결 오류
```bash
# 데이터베이스 마이그레이션
npx prisma migrate deploy

# 또는 리셋 (주의!)
npx prisma migrate reset
```

### 이미지 로딩 오류
- `.env`에 `NEXT_PUBLIC_SITE_URL` 설정 확인
- 이미지 경로가 절대 경로인지 확인
- Sharp 의존성 설치 확인

### 관리자 로그인 불가
- `NEXTAUTH_SECRET` 설정 확인
- `NEXTAUTH_URL` 이 배포된 도메인과 일치하는지 확인
- 데이터베이스에 관리자 계정이 존재하는지 확인

---

## 📚 추가 리소스

- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Vercel 문서](https://vercel.com/docs)
- [Prisma 배포 가이드](https://www.prisma.io/docs/guides/deployment)
- [NextAuth.js 배포](https://next-auth.js.org/deployment)

---

## ✅ 배포 체크리스트 (최종)

### 배포 전
- [ ] 모든 환경 변수 설정
- [ ] 로컬 빌드 성공
- [ ] 데이터베이스 마이그레이션 완료
- [ ] 관리자 계정 생성
- [ ] 메타태그 확인

### 배포 중
- [ ] Vercel 또는 호스팅 플랫폼에 푸시
- [ ] 환경 변수 설정
- [ ] 빌드 완료 확인

### 배포 후
- [ ] 모든 페이지 접근 확인
- [ ] 관리자 기능 테스트
- [ ] SEO 확인 (sitemap, robots.txt)
- [ ] Lighthouse 점수 측정
- [ ] 모니터링 설정

---

**배포 완료! 🎉**

---

**작성자**: Claude Code
**작성일**: 2026-02-12
**버전**: 1.0
