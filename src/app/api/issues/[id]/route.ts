import { withAuth } from "@/lib/with-auth";
import {
  getIssueById,
  updateIssue,
  deleteIssue,
} from "@/services/issue.service";
import { updateIssueSchema } from "@/lib/validation/issue.schema";
import { successResponse, errorResponse, AppError } from "@/lib/response";

export const GET = withAuth(async (_request, context, user) => {
  try {
    const { id } = await context.params;
    const issue = await getIssueById(id, user);
    return successResponse(issue);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.code, error.message, error.statusCode);
    }
    console.error("GET /api/issues/[id] error:", error);
    return errorResponse("INTERNAL_ERROR", "An unexpected error occurred", 500);
  }
});

export const PUT = withAuth(async (request, context, user) => {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const parsed = updateIssueSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(
        "VALIDATION_ERROR",
        parsed.error.issues[0]?.message || "Invalid input",
        400,
        parsed.error.issues,
      );
    }

    const issue = await updateIssue(id, parsed.data, user);
    return successResponse(issue);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.code, error.message, error.statusCode);
    }
    console.error("PUT /api/issues/[id] error:", error);
    return errorResponse("INTERNAL_ERROR", "An unexpected error occurred", 500);
  }
});

export const DELETE = withAuth(async (_request, context, user) => {
  try {
    const { id } = await context.params;
    await deleteIssue(id, user);
    return successResponse({ deleted: true });
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.code, error.message, error.statusCode);
    }
    console.error("DELETE /api/issues/[id] error:", error);
    return errorResponse("INTERNAL_ERROR", "An unexpected error occurred", 500);
  }
});
