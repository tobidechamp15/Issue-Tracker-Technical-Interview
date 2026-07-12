import { z } from "zod";

export const createIssueSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be at most 200 characters")
    .trim(),
  description: z
    .string()
    .max(5000, "Description must be at most 5000 characters")
    .default(""),
  status: z.enum(["open", "in_progress", "closed"]).default("open"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  assignee: z.string().trim().default(""),
  dueDate: z.string().datetime().nullable().optional(),
});

export const updateIssueSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be at most 200 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .max(5000, "Description must be at most 5000 characters")
    .optional(),
  status: z.enum(["open", "in_progress", "closed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  assignee: z.string().trim().optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

export const issueQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(["open", "in_progress", "closed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  sort: z.enum(["newest", "oldest"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  range: z.coerce.number().int().min(1).optional(),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;
export type IssueQuery = z.infer<typeof issueQuerySchema>;
