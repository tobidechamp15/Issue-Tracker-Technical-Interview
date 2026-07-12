import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, signToken, signRefreshToken } from "@/lib/auth";
import { getUserById } from "@/services/auth.service";

/**
 * POST /api/auth/refresh
 *
 * Reads the httpOnly `refreshToken` cookie, verifies it, and issues a new
 * access token + rotated refresh token pair. This endpoint is called by the
 * client-side API interceptor when a 401 is received.
 *
 * Cookie configuration matches login/register for consistency.
 */
export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NO_REFRESH_TOKEN",
            message: "No refresh token provided",
          },
        },
        { status: 401 },
      );
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await getUserById(payload.userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "USER_NOT_FOUND", message: "User not found" },
        },
        { status: 401 },
      );
    }

    // Issue new token pair
    const newAccessToken = signToken({
      userId: user._id.toString(),
      email: user.email,
    });
    const newRefreshToken = signRefreshToken({
      userId: user._id.toString(),
      email: user.email,
    });

    const response = NextResponse.json(
      {
        success: true,
        data: { user },
      },
      { status: 200 },
    );

    // Set new access token cookie
    response.cookies.set("token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 minutes — matches default JWT_EXPIRES_IN
    });

    // Set new (rotated) refresh token cookie
    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days — matches default REFRESH_EXPIRES_IN
    });

    return response;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_REFRESH_TOKEN",
          message: "Invalid or expired refresh token",
        },
      },
      { status: 401 },
    );
  }
}
