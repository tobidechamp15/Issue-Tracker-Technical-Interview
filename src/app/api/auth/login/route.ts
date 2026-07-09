import { NextRequest, NextResponse } from "next/server";
import { loginUser, InvalidCredentialsError } from "@/services/auth.service";
import { loginSchema } from "@/lib/validation/auth.schema";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
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

    // Sign JWT
    const token = signToken({ userId: user._id.toString(), email: user.email });

    // Set httpOnly cookie
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
      maxAge: 60 * 60 * 24, // 24 hours
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
