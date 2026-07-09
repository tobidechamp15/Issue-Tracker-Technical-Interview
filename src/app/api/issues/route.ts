import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/middleware";
import { createIssue, getIssues } from "@/services/issue.service";
import {
  createIssueSchema,
  issueQuerySchema,
} from "@/lib/validation/issue.schema";
import { successResponse, errorResponse, AppError } from "@/lib/response";

export const GET = withAuth(async (request, _context, user) => {
  try {
    const url = new URL(request.url);
    const rawQuery = Object.fromEntries(url.searchParams.entries());

    const parsed = issueQuerySchema.safeParse(rawQuery);
    if (!parsed.success) {
      return errorResponse(
        "VALIDATION_ERROR",
        parsed.error.issues[0]?.message || "Invalid query parameters",
        400,
        parsed.error.issues,
      );
    }

    const result = await getIssues(parsed.data, user);

    return successResponse(result.issues, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.code, error.message, error.statusCode);
    }
    console.error("GET /api/issues error:", error);
    return errorResponse("INTERNAL_ERROR", "An unexpected error occurred", 500);
  }
});

export const POST = withAuth(async (request, _context, user) => {
  try {
    const body = await request.json();

    const parsed = createIssueSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(
        "VALIDATION_ERROR",
        parsed.error.issues[0]?.message || "Invalid input",
        400,
        parsed.error.issues,
      );
    }

    const issue = await createIssue(parsed.data, user);

    return successResponse(issue, undefined, 201);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.code, error.message, error.statusCode);
    }
    console.error("POST /api/issues error:", error);
    return errorResponse("INTERNAL_ERROR", "An unexpected error occurred", 500);
  }
});
