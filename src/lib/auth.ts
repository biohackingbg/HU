import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const SESSION_COOKIE = "hu_session";
const SESSION_TTL_DAYS = 30;
const BCRYPT_ROUNDS = 12;

export function hashPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a session for the user and sets the session cookie.
 * Only a hash of the token is stored, so a database leak can't be used to log in.
 */
export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(
    Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
  );

  await prisma.session.create({
    data: { tokenHash: hashToken(token), userId, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/**
 * Deletes every session for a user except the one tied to the current
 * request cookie. Used after a password change.
 */
export async function invalidateOtherSessions(userId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  await prisma.session.deleteMany({
    where: {
      userId,
      ...(token ? { tokenHash: { not: hashToken(token) } } : {}),
    },
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session
      .deleteMany({ where: { tokenHash: hashToken(token) } })
      .catch(() => {});
  }

  cookieStore.delete(SESSION_COOKIE);
}

const RESET_TTL_MINUTES = 60;

/** Creates a single-use password reset token and returns the raw token. */
export async function createPasswordResetToken(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + RESET_TTL_MINUTES * 60 * 1000);

  // Invalidate any previous outstanding tokens for this user.
  await prisma.passwordResetToken.deleteMany({
    where: { userId, usedAt: null },
  });
  await prisma.passwordResetToken.create({
    data: { tokenHash: hashToken(token), userId, expiresAt },
  });

  return token;
}

/**
 * Validates and consumes a reset token. Returns the userId on success,
 * or null if the token is missing, expired or already used.
 */
export async function consumePasswordResetToken(token: string) {
  if (!token) return null;

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return null;
  }

  await prisma.passwordResetToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return record.userId;
}

export type CurrentUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session.user;
}

/** Returns the current user only if they are an admin, otherwise null. */
export async function requireAdmin(): Promise<CurrentUser | null> {
  const user = await getCurrentUser();
  return user?.role === "admin" ? user : null;
}

export function displayName(user: {
  firstName: string | null;
  lastName: string | null;
  email: string;
}) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return name || user.email;
}
