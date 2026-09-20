import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getUserById } from "./db";
import { User } from "./types";

const JWT_SECRET = process.env.JWT_SECRET || "fbc-jobele-divine-power-secret-key-2026-unshakable";
const COOKIE_NAME = "fbc_auth_session";

export interface SessionPayload {
  userId: string;
  email: string;
  role: "superadmin" | "content_admin" | "staff";
  name: string;
}

export function signToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export function getSession(): SessionPayload | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function getCurrentUser(): User | null {
  const session = getSession();
  if (!session) return null;
  return getUserById(session.userId);
}

export function getAuthCookieName(): string {
  return COOKIE_NAME;
}
