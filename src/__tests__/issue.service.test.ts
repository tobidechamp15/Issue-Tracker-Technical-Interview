import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted() to define values before vi.mock hoisting
const { MockObjectId } = vi.hoisted(() => {
  class MockObjectId {
    private id: string;
    constructor(id?: string) {
      this.id = id ?? "mock-id";
    }
    toString() {
      return this.id;
    }
    static isValid() {
      return true;
    }
  }
  return { MockObjectId };
});

vi.mock("mongoose", () => ({
  default: {
    Types: { ObjectId: MockObjectId },
  },
  Types: { ObjectId: MockObjectId },
}));

vi.mock("@/lib/db", () => ({
  connectDB: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/models/Issue", () => ({
  default: {
    find: vi.fn(),
    findOne: vi.fn(),
    countDocuments: vi.fn(),
    create: vi.fn(),
    findOneAndUpdate: vi.fn(),
    deleteOne: vi.fn(),
    aggregate: vi.fn(),
  },
}));

import Issue from "@/models/Issue";
import { JWTPayload } from "@/lib/auth";
import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  getDashboardMetrics,
} from "@/services/issue.service";
import { AppError } from "@/lib/response";

const mockUser: JWTPayload = {
  userId: "507f1f77bcf86cd799439011",
  email: "test@example.com",
};

describe("issue.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createIssue", () => {
    it("should create a new issue", async () => {
      const mockIssue = { _id: "issue1", title: "Test Issue", status: "open" };
      vi.mocked(Issue.create).mockResolvedValue(mockIssue as never);

      const result = await createIssue(
        {
          title: "Test Issue",
          description: "",
          status: "open",
          priority: "medium",
          assignee: "",
          dueDate: null,
        },
        mockUser,
      );

      expect(result._id).toBe("issue1");
      expect(Issue.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("getIssues", () => {
    function mockFindChain(issues: unknown[]) {
      vi.mocked(Issue.find).mockReturnValue({
        sort: vi.fn().mockReturnValue({
          skip: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              lean: vi.fn().mockResolvedValue(issues),
            }),
          }),
        }),
      } as never);
    }

    it("should return paginated issues with total count", async () => {
      const mockIssues = [
        { _id: "issue1", title: "Issue 1", status: "open", priority: "medium" },
        { _id: "issue2", title: "Issue 2", status: "closed", priority: "high" },
      ];

      mockFindChain(mockIssues);
      vi.mocked(Issue.countDocuments).mockResolvedValue(25);

      const result = await getIssues(
        {
          search: undefined,
          status: undefined,
          priority: undefined,
          sort: "newest",
          page: 2,
          limit: 10,
        },
        mockUser,
      );

      expect(result.issues).toHaveLength(2);
      expect(result.total).toBe(25);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(3);
    });

    it("should filter by status and priority", async () => {
      mockFindChain([]);
      vi.mocked(Issue.countDocuments).mockResolvedValue(0);

      await getIssues(
        {
          search: undefined,
          status: "open",
          priority: "high",
          sort: "newest",
          page: 1,
          limit: 10,
        },
        mockUser,
      );

      const findArg = vi.mocked(Issue.find).mock
        .calls[0]![0] as unknown as Record<string, unknown>;
      expect(findArg.status).toBe("open");
      expect(findArg.priority).toBe("high");
    });

    it("should handle search query with text index", async () => {
      mockFindChain([]);
      vi.mocked(Issue.countDocuments).mockResolvedValue(0);

      await getIssues(
        {
          search: "bug fix",
          status: undefined,
          priority: undefined,
          sort: "newest",
          page: 1,
          limit: 10,
        },
        mockUser,
      );

      const findArg = vi.mocked(Issue.find).mock
        .calls[0]![0] as unknown as Record<string, unknown>;
      expect(findArg.$text).toEqual({ $search: "bug fix" });
    });

    it("should sort by oldest when specified", async () => {
      const mockSortFn = vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            lean: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      vi.mocked(Issue.find).mockReturnValue({ sort: mockSortFn } as never);
      vi.mocked(Issue.countDocuments).mockResolvedValue(0);

      await getIssues(
        {
          search: undefined,
          status: undefined,
          priority: undefined,
          sort: "oldest",
          page: 1,
          limit: 10,
        },
        mockUser,
      );

      expect(mockSortFn).toHaveBeenCalledWith({ createdAt: 1 });
    });
  });

  describe("getIssueById", () => {
    it("should return an issue by ID", async () => {
      const mockIssue = { _id: "issue1", title: "Test", status: "open" };
      vi.mocked(Issue.findOne).mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockIssue),
      } as never);

      const result = await getIssueById("507f1f77bcf86cd799439011", mockUser);
      expect(result._id).toBe("issue1");
    });

    it("should throw AppError if issue not found", async () => {
      vi.mocked(Issue.findOne).mockReturnValue({
        lean: vi.fn().mockResolvedValue(null),
      } as never);

      await expect(
        getIssueById("507f1f77bcf86cd799439011", mockUser),
      ).rejects.toThrow(AppError);
    });
  });

  describe("updateIssue", () => {
    it("should update an issue", async () => {
      const mockUpdated = {
        _id: "issue1",
        title: "Updated",
        status: "in_progress",
      };
      vi.mocked(Issue.findOneAndUpdate).mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockUpdated),
      } as never);

      const result = await updateIssue(
        "507f1f77bcf86cd799439011",
        { title: "Updated", status: "in_progress" },
        mockUser,
      );

      expect(result.title).toBe("Updated");
      expect(result.status).toBe("in_progress");
    });

    it("should throw AppError if issue not found for update", async () => {
      vi.mocked(Issue.findOneAndUpdate).mockReturnValue({
        lean: vi.fn().mockResolvedValue(null),
      } as never);

      await expect(
        updateIssue("507f1f77bcf86cd799439011", { title: "X" }, mockUser),
      ).rejects.toThrow(AppError);
    });
  });

  describe("deleteIssue", () => {
    it("should delete an issue", async () => {
      vi.mocked(Issue.deleteOne).mockResolvedValue({
        deletedCount: 1,
      } as never);

      await expect(
        deleteIssue("507f1f77bcf86cd799439011", mockUser),
      ).resolves.toBeUndefined();
    });

    it("should throw AppError if issue not found for delete", async () => {
      vi.mocked(Issue.deleteOne).mockResolvedValue({
        deletedCount: 0,
      } as never);

      await expect(
        deleteIssue("507f1f77bcf86cd799439011", mockUser),
      ).rejects.toThrow(AppError);
    });
  });

  describe("getDashboardMetrics", () => {
    it("should return dashboard metrics from aggregation", async () => {
      vi.mocked(Issue.aggregate).mockResolvedValue([
        { total: 10, open: 5, inProgress: 3, closed: 2, overdue: 1 },
      ] as never);

      const result = await getDashboardMetrics(mockUser);

      expect(result.total).toBe(10);
      expect(result.open).toBe(5);
      expect(result.inProgress).toBe(3);
      expect(result.closed).toBe(2);
      expect(result.overdue).toBe(1);
      expect(Issue.aggregate).toHaveBeenCalledTimes(1);
    });

    it("should default to 0 when no issues exist", async () => {
      vi.mocked(Issue.aggregate).mockResolvedValue([{}] as never);

      const result = await getDashboardMetrics(mockUser);

      expect(result.total).toBe(0);
      expect(result.open).toBe(0);
      expect(result.inProgress).toBe(0);
      expect(result.closed).toBe(0);
      expect(result.overdue).toBe(0);
    });
  });
});
