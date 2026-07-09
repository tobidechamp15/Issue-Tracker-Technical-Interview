import { NextRequest } from "next/server";
import { withAuth } from "@/middleware";
import { getDashboardMetrics } from "@/services/issue.service";
import { successResponse, errorResponse, AppError } from "@/lib/response";

export const GET = withAuth(async (_request, _context, user) => {
  try {
    const metrics = await getDashboardMetrics(user);
    return successResponse(metrics);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.code, error.message, error.statusCode);
    }
    console.error("GET /api/dashboard/metrics error:", error);
    return errorResponse("INTERNAL_ERROR", "An unexpected error occurred", 500);
  }
});
