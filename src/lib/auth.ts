import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET ?? "";
const REFRESH_SECRET: string = process.env.REFRESH_TOKEN_SECRET ?? JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

if (!process.env.REFRESH_TOKEN_SECRET) {
  console.warn(
    "REFRESH_TOKEN_SECRET not set — falling back to JWT_SECRET. Set a separate REFRESH_TOKEN_SECRET in production.",
  );
}

const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "15m") as string | number;
const REFRESH_EXPIRES_IN = (process.env.REFRESH_EXPIRES_IN ?? "7d") as
  | string
  | number;

export interface JWTPayload {
  userId: string;
  email: string;
}

/**
 * Signs a short-lived access token.
 * Default: 15 minutes.
 */
export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

/**
 * Verifies and returns the decoded access token payload.
 */
export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

/**
 * Signs a long-lived refresh token.
 * Default: 7 days.
 */
export function signRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
}

/**
 * Verifies and returns the decoded refresh token payload.
 */
export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, REFRESH_SECRET) as JWTPayload;
}
