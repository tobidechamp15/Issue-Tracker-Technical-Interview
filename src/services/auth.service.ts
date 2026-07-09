meimport bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User, { IUser } from "@/models/User";

const SALT_ROUNDS = 12;

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<{ user: Omit<IUser, "passwordHash"> }> {
  await connectDB();

  // Check for existing user
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

  // Return user without passwordHash (select: false already handles this,
  // but we explicitly omit it for type safety)
  const { passwordHash: _, ...userWithoutPassword } = user.toObject();

  return { user: userWithoutPassword as Omit<IUser, "passwordHash"> };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ user: Omit<IUser, "passwordHash"> }> {
  await connectDB();

  // Explicitly select passwordHash since it's excluded by default
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    throw new InvalidCredentialsError();
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new InvalidCredentialsError();
  }

  const { passwordHash: _, ...userWithoutPassword } = user.toObject();

  return { user: userWithoutPassword as Omit<IUser, "passwordHash"> };
}

// Custom error classes for predictable error handling
export class DuplicateEmailError extends Error {
  constructor(email: string) {
    super(`User with email "${email}" already exists`);
    this.name = "DuplicateEmailError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password");
    this.name = "InvalidCredentialsError";
  }
}
