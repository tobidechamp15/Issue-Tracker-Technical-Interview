import { NextResponse } from "next/server";

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function successResponse<T>(
  data: T,
  meta?: Record<string, unknown>,
  status = 200,
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    meta ? { success: true, data, meta } : { success: true, data },
    { status },
  );
}

export function errorResponse(
  code: string,
  message: string,
  status = 400,
  details?: unknown,
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      success: false,
      error: details ? { code, message, details } : { code, message },
    },
    { status },
  );
}

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 400,
  ) {
    super(message);
    this.name = "AppError";
  }
}
