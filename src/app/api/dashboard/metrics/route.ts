import { withAuth } from "@/lib/with-auth";
import { getDashboardMetrics } from "@/services/issue.service";
import { successResponse, errorResponse, AppError } from "@/lib/response";

export const GET = withAuth(async (request, _context, user) => {
  try {
    const url = new URL(request.url);
    const range = url.searchParams.get("range");
    const rangeNum = range ? Number(range) : undefined;
    const metrics = await getDashboardMetrics(user, rangeNum);
    return successResponse(metrics);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.code, error.message, error.statusCode);
    }
    console.error("GET /api/dashboard/metrics error:", error);
    return errorResponse("INTERNAL_ERROR", "An unexpected error occurred", 500);
  }
});
