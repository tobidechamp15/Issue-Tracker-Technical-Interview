import { NextRequest, NextResponse } from "next/server";
import { loginUser, InvalidCredentialsError } from "@/services/auth.service";
import { loginSchema } from "@/lib/validation/auth.schema";
import { signToken, signRefreshToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.issues[0]?.message || "Invalid input",
            details: parsed.error.issues,
          },
        },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    const { user } = await loginUser(email, password);

    const token = signToken({ userId: user._id.toString(), email: user.email });
    const refreshToken = signRefreshToken({
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

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 minutes — matches default JWT_EXPIRES_IN
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days — matches default REFRESH_EXPIRES_IN
    });

    return response;
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: error.message,
          },
        },
        { status: 401 },
      );
    }

    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      },
      { status: 500 },
    );
  }
}
