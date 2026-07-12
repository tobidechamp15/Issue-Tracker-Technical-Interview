import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const SALT_ROUNDS = 12;

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
}

function toUserResponse(user: {
  _id: { toString(): string };
  name: string;
  email: string;
  createdAt: Date;
}): UserResponse {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<{ user: UserResponse }> {
  await connectDB();

   const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new DuplicateEmailError(email);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    name,
    email,
    passwordHash,
  });

  return { user: toUserResponse(user) };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ user: UserResponse }> {
  await connectDB();

   const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    throw new InvalidCredentialsError();
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new InvalidCredentialsError();
  }

  return { user: toUserResponse(user) };
}

 export class DuplicateEmailError extends Error {
  constructor(email: string) {
    super(`User with email "${email}" already exists`);
    this.name = "DuplicateEmailError";
  }
}

export async function getUserById(
  userId: string,
): Promise<UserResponse | null> {
  await connectDB();

  const user = await User.findById(userId);
  if (!user) return null;

  return toUserResponse(user);
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password");
    this.name = "InvalidCredentialsError";
  }
}
