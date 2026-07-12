import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";

// Mock dependencies
vi.mock("@/lib/db", () => ({
  connectDB: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/models/User", () => {
  const mockCreate = vi.fn();
  const mockFindOne = vi.fn();
  const MockUser = {
    findOne: mockFindOne,
    create: mockCreate,
  };
  return { default: MockUser };
});

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password"),
    compare: vi.fn().mockResolvedValue(true),
  },
}));

import User from "@/models/User";
import {
  registerUser,
  loginUser,
  DuplicateEmailError,
  InvalidCredentialsError,
} from "@/services/auth.service";

describe("auth.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should register a new user successfully", async () => {
      const mockUser = {
        _id: { toString: () => "user123" },
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date(),
        toObject: vi.fn().mockReturnValue({
          _id: { toString: () => "user123" },
          name: "Test User",
          email: "test@example.com",
          createdAt: new Date(),
          passwordHash: "hashed",
        }),
      };

      vi.mocked(User.findOne).mockResolvedValue(null);
      vi.mocked(User.create).mockResolvedValue(mockUser as never);

      const result = await registerUser(
        "Test User",
        "test@example.com",
        "password123",
      );

      expect(result.user._id).toBe("user123");
      expect(result.user.name).toBe("Test User");
      expect(result.user.email).toBe("test@example.com");
      expect(User.findOne).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(User.create).toHaveBeenCalledWith({
        name: "Test User",
        email: "test@example.com",
        passwordHash: "hashed_password",
      });
    });

    it("should throw DuplicateEmailError if email exists", async () => {
      vi.mocked(User.findOne).mockResolvedValue({
        email: "test@example.com",
      } as never);

      await expect(
        registerUser("Test User", "test@example.com", "password123"),
      ).rejects.toThrow(DuplicateEmailError);

      expect(User.create).not.toHaveBeenCalled();
    });
  });

  describe("loginUser", () => {
    it("should login successfully with correct credentials", async () => {
      const mockUser = {
        _id: { toString: () => "user123" },
        name: "Test User",
        email: "test@example.com",
        passwordHash: "hashed",
        createdAt: new Date(),
        toObject: vi.fn().mockReturnValue({
          _id: { toString: () => "user123" },
          name: "Test User",
          email: "test@example.com",
          createdAt: new Date(),
          passwordHash: "hashed",
        }),
      };

      const mockQuery = {
        select: vi.fn().mockResolvedValue(mockUser),
      };

      vi.mocked(User.findOne).mockReturnValue(mockQuery as never);

      const result = await loginUser("test@example.com", "password123");

      expect(result.user._id).toBe("user123");
      expect(User.findOne).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });

    it("should throw InvalidCredentialsError if user not found", async () => {
      const mockQuery = {
        select: vi.fn().mockResolvedValue(null),
      };

      vi.mocked(User.findOne).mockReturnValue(mockQuery as never);

      await expect(
        loginUser("nonexistent@example.com", "password123"),
      ).rejects.toThrow(InvalidCredentialsError);
    });

    it("should throw InvalidCredentialsError if password is wrong", async () => {
      const mockUser = {
        passwordHash: "hashed",
        toObject: vi.fn(),
      };

      const mockQuery = {
        select: vi.fn().mockResolvedValue(mockUser),
      };

      vi.mocked(User.findOne).mockReturnValue(mockQuery as never);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        loginUser("test@example.com", "wrongpassword"),
      ).rejects.toThrow(InvalidCredentialsError);
    });
  });
});
