import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";
import { unauthorizedResponse, errorResponse } from "@/lib/api-response";
import { NextResponse } from "next/server";

type AuthSuccessResult = {
  authenticated: true;
  session: Awaited<ReturnType<typeof getServerSession<typeof authOptions>>>;
};

type AuthFailureResult = {
  authenticated: false;
  session: null;
  error: NextResponse;
};

export type AuthResult = AuthSuccessResult | AuthFailureResult;

export async function checkAuth(): Promise<AuthResult> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { authenticated: false, session: null, error: unauthorizedResponse() };
  }

  return { authenticated: true, session };
}

export async function checkAdminAuth(): Promise<AuthResult> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { authenticated: false, session: null, error: unauthorizedResponse() };
  }

  if (session.user.role !== "admin") {
    return {
      authenticated: false,
      session: null,
      error: errorResponse("관리자 권한이 필요합니다", "FORBIDDEN", 403),
    };
  }

  return { authenticated: true, session };
}
