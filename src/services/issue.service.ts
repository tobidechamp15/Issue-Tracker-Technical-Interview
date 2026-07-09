import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Issue, { IIssue, IssueStatus, IssuePriority } from "@/models/Issue";
import {
  CreateIssueInput,
  UpdateIssueInput,
  IssueQuery,
} from "@/lib/validation/issue.schema";
import { JWTPayload } from "@/lib/auth";
import { AppError } from "@/lib/response";

// ---- Create ----

export async function createIssue(
  input: CreateIssueInput,
  user: JWTPayload,
): Promise<IIssue> {
  await connectDB();

  const issue = await Issue.create({
    ...input,
    dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
    createdBy: new mongoose.Types.ObjectId(user.userId),
  });

  return issue;
}

// ---- List with search, filter, sort, pagination ----

interface ListIssuesResult {
  issues: IIssue[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getIssues(
  query: IssueQuery,
  user: JWTPayload,
): Promise<ListIssuesResult> {
  await connectDB();

  const { search, status, priority, sort, page, limit } = query;

  // Build filter
  const filter: Record<string, unknown> = {
    createdBy: new mongoose.Types.ObjectId(user.userId),
  };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) {
    filter.$text = { $search: search };
  }

  // Build sort
  const sortOption: Record<string, 1 | -1> =
    sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const skip = (page - 1) * limit;

  const [issues, total] = await Promise.all([
    Issue.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),
    Issue.countDocuments(filter),
  ]);

  return {
    issues: issues as unknown as IIssue[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// ---- Get by ID ----

export async function getIssueById(
  id: string,
  user: JWTPayload,
): Promise<IIssue> {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("INVALID_ID", "Invalid issue ID", 400);
  }

  const issue = await Issue.findOne({
    _id: id,
    createdBy: user.userId,
  }).lean();

  if (!issue) {
    throw new AppError("NOT_FOUND", "Issue not found", 404);
  }

  return issue as unknown as IIssue;
}

// ---- Update ----

export async function updateIssue(
  id: string,
  input: UpdateIssueInput,
  user: JWTPayload,
): Promise<IIssue> {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("INVALID_ID", "Invalid issue ID", 400);
  }

  const updateData: Record<string, unknown> = { ...input };
  if (input.dueDate !== undefined) {
    updateData.dueDate = input.dueDate ? new Date(input.dueDate) : null;
  }

  const issue = await Issue.findOneAndUpdate(
    { _id: id, createdBy: user.userId },
    { $set: updateData },
    { new: true, runValidators: true },
  ).lean();

  if (!issue) {
    throw new AppError("NOT_FOUND", "Issue not found", 404);
  }

  return issue as unknown as IIssue;
}

// ---- Delete ----

export async function deleteIssue(id: string, user: JWTPayload): Promise<void> {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("INVALID_ID", "Invalid issue ID", 400);
  }

  const result = await Issue.deleteOne({
    _id: id,
    createdBy: user.userId,
  });

  if (result.deletedCount === 0) {
    throw new AppError("NOT_FOUND", "Issue not found", 404);
  }
}

// ---- Dashboard Metrics ----

export interface DashboardMetrics {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
  overdue: number;
}

export async function getDashboardMetrics(
  user: JWTPayload,
): Promise<DashboardMetrics> {
  await connectDB();

  const userId = new mongoose.Types.ObjectId(user.userId);
  const now = new Date();

  const [result] = await Issue.aggregate([
    { $match: { createdBy: userId } },
    {
      $facet: {
        total: [{ $count: "count" }],
        open: [{ $match: { status: "open" } }, { $count: "count" }],
        inProgress: [
          { $match: { status: "in_progress" } },
          { $count: "count" },
        ],
        closed: [{ $match: { status: "closed" } }, { $count: "count" }],
        overdue: [
          {
            $match: {
              status: { $ne: "closed" },
              dueDate: { $ne: null, $lt: now },
            },
          },
          { $count: "count" },
        ],
      },
    },
    {
      $project: {
        total: { $arrayElemAt: ["$total.count", 0] },
        open: { $arrayElemAt: ["$open.count", 0] },
        inProgress: { $arrayElemAt: ["$inProgress.count", 0] },
        closed: { $arrayElemAt: ["$closed.count", 0] },
        overdue: { $arrayElemAt: ["$overdue.count", 0] },
      },
    },
  ]);

  return {
    total: result?.total ?? 0,
    open: result?.open ?? 0,
    inProgress: result?.inProgress ?? 0,
    closed: result?.closed ?? 0,
    overdue: result?.overdue ?? 0,
  };
}
