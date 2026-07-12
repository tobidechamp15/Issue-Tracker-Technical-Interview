import { NextRequest, NextResponse } from "next/server";
import { verifyToken, JWTPayload } from "@/lib/auth";

/**
 * Higher-order function that wraps a route handler with JWT authentication.
 * Extracts the token from httpOnly cookie, verifies it, and attaches userId
 * to the request context.
 */
export function withAuth(
  handler: (
    request: NextRequest,
    context: { params: Promise<Record<string, string>> },
    user: JWTPayload,
  ) => Promise<NextResponse>,
) {
  return async (
    request: NextRequest,
    routeContext: { params: Promise<Record<string, string>> },
  ): Promise<NextResponse> => {
    try {
      const token = request.cookies.get("token")?.value;

      if (!token) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "UNAUTHORIZED",
              message: "Authentication required",
            },
          },
          { status: 401 },
        );
      }

      const payload = verifyToken(token);
      return handler(request, routeContext, payload);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Invalid or expired token",
          },
        },
        { status: 401 },
      );
    }
  };
}
