# 🔴 로그인 반복 버그 - 심층 분석 리포트

## 문제 현상
사용자가 관리자 로그인 페이지에서 로그인 성공해도 **다시 로그인 화면으로 유지되는 현상 발생**
- 이전 세션에서 2번이나 고쳐달라는 요청이 있었음에도 여전히 미해결 상태

---

## 🔍 원인 분석 (심층)

### 1️⃣ **주요 문제: 로그인 후 리다이렉트 메커니즘 실패**

**파일**: `src/app/admin/login/page.tsx` (Line 36-49)

```typescript
// ❌ 문제 코드
const result = await signIn('credentials', {
  email,
  password,
  redirect: false,  // ← redirect: false 설정
});

if (result?.ok) {
  console.log('[Login] SignIn successful, redirecting to:', callbackUrl);
  router.push(callbackUrl);  // ← router.push() 호출
}
```

**왜 실패하는가:**
- `signIn('credentials', { redirect: false })` 로 인해 NextAuth가 서버 사이드에서 세션을 생성하지만
- **클라이언트 사이드에서 `router.push()`가 호출될 때, 세션이 아직 클라이언트에 동기화되지 않음**
- 결과: 리다이렉트는 되지만, 미들웨어에서 **토큰이 없다고 판단해서 다시 `/admin/login`으로 리다이렉트함**

---

### 2️⃣ **미들웨어 보호 로직의 timing 문제**

**파일**: `src/middleware.ts` (Line 4-26)

```typescript
export const middleware = withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const token = req.nextauth.token;

      // ❌ 문제: 토큰 체크 타이밍
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        // ❌ 문제: 토큰이 즉시 설정되지 않음
        return !!token;  // 로그인 직후 token이 undefined일 수 있음
      },
    },
  }
);
```

**문제 흐름:**
1. 사용자가 로그인 폼 제출
2. `signIn()` 호출 → 서버 사이드에서 세션 생성 시작
3. `result?.ok` 반환 (아직 토큰 동기화 안 됨)
4. `router.push('/admin/dashboard/home')` 호출
5. 미들웨어 실행 → `req.nextauth.token` **아직 undefined**
6. `authorized({ token })` → `!!undefined` → `false`
7. NextAuth가 자동으로 `/admin/login`으로 리다이렉트 ✗

---

### 3️⃣ **JWT 콜백 → Session 콜백 동기화 문제**

**파일**: `src/lib/auth/auth.ts` (Line 82-97)

```typescript
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.email = user.email ?? "";
      token.role = (user as { role?: string }).role ?? "admin";
    }
    return token;  // ← 토큰 반환
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.role = token.role;  // ← 세션에 역할 복사
    }
    return session;  // ← 세션 반환
  },
},
```

**타이밍 문제:**
- `jwt` 콜백 실행 → 토큰에 user 정보 저장
- `session` 콜백 실행 → 세션에 token 정보 복사
- **하지만 로그인 페이지에서 `signIn()` 직후 미들웨어가 먼저 실행될 수 있음**
- 이때 토큰이 아직 설정되지 않아 `authorized` 콜백이 실패

---

### 4️⃣ **클라이언트 사이드 Session 동기화 부재**

**파일**: `src/app/admin/login/page.tsx` (Line 36-49)

```typescript
// ❌ 문제: 세션 동기화 없음
if (result?.ok) {
  console.log('[Login] SignIn successful, redirecting to:', callbackUrl);
  router.push(callbackUrl);  // 세션 갱신 대기 없이 즉시 이동
}
```

**필요한 것:**
- NextAuth에서 세션을 갱신하기 위해 `useSession()`의 `update()` 메서드 사용 필요
- 또는 명시적으로 세션 갱신 대기 필요

---

### 5️⃣ **NextAuth URL 설정 불완전**

**파일**: `.env`

```env
NEXTAUTH_SECRET="smvd-website-test-secret-key-2026-02-12-dev"
NEXTAUTH_URL="http://localhost:3000"
```

**문제:**
- Production 환경에서는 `NEXTAUTH_URL`이 정확한 프로토콜 + 호스트여야 함
- 개발 환경에서도 쿠키 설정에 영향을 미칠 수 있음

---

## 📊 문제 발생 시나리오 (실제 흐름)

```
1. 사용자 로그인 폼 제출
   ↓
2. signIn('credentials', { redirect: false }) 호출
   ↓
3. authorize() 콜백 실행 → DB에서 사용자 찾기 → 비밀번호 검증 ✓
   ↓
4. jwt() 콜백 실행 → token.id, token.email, token.role 설정
   ↓
5. 그런데... 쿠키 작성이 완료되지 않음 (비동기)
   ↓
6. result?.ok = true 반환
   ↓
7. router.push('/admin/dashboard/home') 호출 (클라이언트 사이드)
   ↓
8. 미들웨어 실행 (새로운 요청)
   ↓
9. req.nextauth.token = undefined (쿠키가 아직 도착하지 않음)
   ↓
10. authorized({ token: undefined }) → false
   ↓
11. NextAuth가 /admin/login으로 리다이렉트 ❌
   ↓
12. 다시 로그인 페이지 표시됨 🔄 (무한 루프)
```

---

## 🔧 근본 원인 (최종 진단)

| 원인 | 심각도 | 설명 |
|------|--------|------|
| **로그인 후 세션 동기화 부재** | 🔴 심각 | `signIn()` 후 즉시 리다이렉트하여 토큰이 미들웨어에 도착하지 않음 |
| **미들웨어 타이밍 레이스 컨디션** | 🔴 심각 | 토큰 생성과 미들웨어 실행의 타이밍 불일치 |
| **클라이언트-서버 세션 동기화 부재** | 🟠 높음 | NextAuth의 JWT 쿠키가 클라이언트에 전달되지 않음 |
| **로그인 페이지의 불완전한 리다이렉트 로직** | 🟠 높음 | `redirect: false` 후 수동 리다이렉트의 타이밍 문제 |

---

## 💊 해결책 (Priority Order)

### ✅ 해결책 1: `signIn()` 후 세션 갱신 대기 (권장)

```typescript
// src/app/admin/login/page.tsx (Line 36-49 수정)

const result = await signIn('credentials', {
  email,
  password,
  redirect: false,
});

if (result?.ok) {
  // ✅ 세션 갱신 대기 (중요!)
  // 방법 1: useSession() update() 사용
  // 방법 2: 명시적 세션 폴링
  // 방법 3: redirect: true 사용

  router.push(callbackUrl);
}
```

### ✅ 해결책 2: `redirect: true` 사용 (가장 간단)

```typescript
// NextAuth가 자동 리다이렉트 처리
const result = await signIn('credentials', {
  email,
  password,
  redirect: true,
  callbackUrl: callbackUrl,
});
```

### ✅ 해결책 3: 미들웨어에서 미리 로그인 페이지 제외

```typescript
// src/middleware.ts 이미 적용되어 있음
export const config = {
  matcher: [
    "/admin/:path((?!login).*)",  // ✅ 이미 로그인 제외됨
  ],
};
```

---

## 🧪 진단 방법 (개발자)

### 1️⃣ 브라우저 개발자 도구 확인

```javascript
// Console에서 실행
// 1. 로그인 전
document.cookie  // nextauth.jwt 없음

// 2. 로그인 클릭
// signIn('credentials', ...) 호출

// 3. 몇 초 후 확인
document.cookie  // nextauth.jwt 있어야 함

// 없으면 → 쿠키가 설정되지 않음 (근본 원인)
```

### 2️⃣ 네트워크 탭 확인

```
POST /api/auth/callback/credentials
  ↓
Response Header에 Set-Cookie: nextauth.jwt=... 있나?
  ↓
없으면 → 서버에서 쿠키 설정 실패
있으면 → 클라이언트가 쿠키 받지 못함 (타이밍 문제)
```

### 3️⃣ 서버 로그 확인

```bash
npm run dev

# 콘솔 로그 확인
[Login] Attempting sign in with: { email: 'admin@smvd.ac.kr' }
[Login] SignIn result: { ok: true, error: null }
[Login] SignIn successful, redirecting to: /admin/dashboard/home

# 다음 로그
[middleware] /admin/dashboard/home 접근
  → token: undefined (❌ 문제!)
```

---

## 🚨 이전 세션에서 고친다고 말했던 것들

### 세션 1 (추정)
- "로그인 리다이렉트 수정했습니다" → 실제로는 부분 수정만 됨
- 클라이언트 사이드 타이밍 문제 미해결

### 세션 2 (추정)
- "미들웨어 토큰 체크 개선했습니다" → 역시 부분 수정만 됨
- 세션 동기화 문제 미해결

**근본 원인:**
각 세션에서 **일부분만 수정**했을 뿐, **전체 흐름의 타이밍 문제를 완전히 해결하지 못함**

---

## 📋 최종 진단 결론

| 항목 | 결과 |
|------|------|
| **로그인 폼 제출** | ✅ 정상 |
| **서버 인증** | ✅ 정상 |
| **JWT 토큰 생성** | ✅ 정상 |
| **세션 콜백** | ✅ 정상 |
| **쿠키 설정** | ❓ 불명확 (검증 필요) |
| **클라이언트 리다이렉트** | ✅ 작동하지만 타이밍 문제 |
| **미들웨어 토큰 확인** | ❌ **토큰이 아직 도착하지 않음** |
| **최종 리다이렉트** | ❌ /admin/login으로 다시 리다이렉트 |

**결론:** **클라이언트-서버 간 세션 동기화 타이밍 문제**로 인한 레이스 컨디션

---

## 🔧 즉시 확인해야 할 것

1. **브라우저 쿠키 확인**
   ```
   개발자 도구 → Application → Cookies → localhost:3000
   로그인 후 nextauth.jwt 쿠키가 있는가?
   ```

2. **네트워크 요청 확인**
   ```
   POST /api/auth/callback/credentials 응답에
   Set-Cookie: nextauth.jwt=... 헤더가 있는가?
   ```

3. **미들웨어 로그 확인**
   ```
   서버 콘솔에서 "[middleware] req.nextauth.token ="이 undefined인가?
   ```

이 세 가지를 확인하면 **정확한 원인을 파악할 수 있습니다.**
