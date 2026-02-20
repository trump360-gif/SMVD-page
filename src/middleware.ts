import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const middleware = withAuth(
  function middleware(req) {
    // 관리자 페이지 접근 시 역할 확인
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const token = req.nextauth.token;

      // ✅ 디버깅: 토큰 상태 로깅
      console.log('[Middleware] Admin route accessed', {
        path: req.nextUrl.pathname,
        hasToken: !!token,
        tokenRole: token?.role,
        tokenEmail: token?.email,
      });

      // 관리자 역할 확인
      if (token?.role !== "admin") {
        console.log('[Middleware] Unauthorized access - redirecting to login', {
          tokenRole: token?.role,
          expectedRole: 'admin',
        });
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        // ✅ 디버깅: 토큰 도착 확인
        console.log('[Middleware] Authorized callback', {
          hasToken: !!token,
          tokenEmail: token?.email,
        });
        // 관리자 경로 접근 시 토큰 확인
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // 관리자 경로 보호 (로그인 페이지 제외)
    "/admin/:path((?!login).*)",
    // API 경로 중 관리자 API 보호
    "/api/admin/:path*",
  ],
};
