import { NextResponse } from "next/server";

export function successResponse<T>(
  data: T,
  message: string = "요청이 성공했습니다",
  status: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

export function errorResponse(
  message: string,
  code: string = "ERROR",
  status: number = 400,
  details?: Record<string, unknown>
) {
  return NextResponse.json(
    {
      success: false,
      message,
      code,
      details,
    },
    { status }
  );
}

export function unauthorizedResponse() {
  return errorResponse(
    "인증이 필요합니다",
    "UNAUTHORIZED",
    401
  );
}

export function forbiddenResponse() {
  return errorResponse(
    "접근 권한이 없습니다",
    "FORBIDDEN",
    403
  );
}

export function notFoundResponse(resource: string = "리소스") {
  return errorResponse(
    `${resource}를 찾을 수 없습니다`,
    "NOT_FOUND",
    404
  );
}

export function validationErrorResponse(details: Record<string, string>) {
  return errorResponse(
    "입력값 검증에 실패했습니다",
    "VALIDATION_ERROR",
    400,
    details
  );
}
