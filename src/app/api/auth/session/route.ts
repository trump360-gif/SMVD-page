import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: session.user,
  });
}
