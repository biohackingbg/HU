"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import {
  consumePasswordResetToken,
  createPasswordResetToken,
  createSession,
  destroySession,
  getCurrentUser,
  hashPassword,
  invalidateOtherSessions,
  verifyPassword,
} from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  profileSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/validation";

const TOO_MANY = "Твърде много опити. Опитайте отново по-късно.";

export type AuthState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  ok?: boolean;
};

function firstFieldErrors(
  issues: { path: PropertyKey[]; message: string }[],
) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0] != null ? String(issue.path[0]) : "";
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

export async function registerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: firstFieldErrors(parsed.error.issues) };
  }

  const { firstName, lastName, email, password } = parsed.data;

  const ip = await clientIp();
  if (!rateLimit(`register:${ip}`, 5, 60 * 60 * 1000).ok) {
    return { error: TOO_MANY };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Вече съществува акаунт с този имейл адрес." };
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      firstName: firstName || null,
      lastName: lastName || null,
    },
  });

  await createSession(user.id);
  redirect("/akaunt");
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: firstFieldErrors(parsed.error.issues) };
  }

  const { email, password } = parsed.data;

  const ip = await clientIp();
  // Limit by IP+email so brute-forcing one account or spraying is throttled.
  if (!rateLimit(`login:${ip}:${email}`, 8, 15 * 60 * 1000).ok) {
    return { error: TOO_MANY };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  // Always run a comparison to avoid leaking whether the email exists.
  const passwordOk = user
    ? await verifyPassword(password, user.passwordHash)
    : await verifyPassword(password, "$2a$12$invalidinvalidinvalidinvalidinv");

  if (!user || !passwordOk) {
    return { error: "Грешен имейл или парола." };
  }

  await createSession(user.id);
  redirect("/akaunt");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function updateProfileAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const user = await getCurrentUser();
  if (!user) redirect("/vhod");

  const parsed = profileSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });

  if (!parsed.success) {
    return { fieldErrors: firstFieldErrors(parsed.error.issues) };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      firstName: parsed.data.firstName || null,
      lastName: parsed.data.lastName || null,
    },
  });

  revalidatePath("/akaunt");
  revalidatePath("/akaunt/profil");
  return { ok: true };
}

export async function changePasswordAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const user = await getCurrentUser();
  if (!user) redirect("/vhod");

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { fieldErrors: firstFieldErrors(parsed.error.issues) };
  }

  const record = await prisma.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true },
  });
  if (!record) redirect("/vhod");

  const currentOk = await verifyPassword(
    parsed.data.currentPassword,
    record.passwordHash,
  );
  if (!currentOk) {
    return { fieldErrors: { currentPassword: "Грешна текуща парола." } };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.newPassword) },
  });

  // Invalidate all other sessions so a leaked/old session can't persist
  // after a password change. The current session cookie stays valid.
  await invalidateOtherSessions(user.id);

  return { ok: true };
}

async function originFromHeaders() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function forgotPasswordAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { fieldErrors: firstFieldErrors(parsed.error.issues) };
  }

  const ip = await clientIp();
  if (!rateLimit(`forgot:${ip}`, 5, 60 * 60 * 1000).ok) {
    return { error: TOO_MANY };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  // Only send when the account exists, but always report success so the
  // form can't be used to discover which e-mails are registered.
  if (user) {
    const token = await createPasswordResetToken(user.id);
    const origin = await originFromHeaders();
    const link = `${origin}/nova-parola?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: "Възстановяване на парола — Health Upgrade",
      text: `Заявена е промяна на паролата за акаунта ти.\n\nОтвори тази връзка, за да зададеш нова парола (валидна 1 час):\n${link}\n\nАко не си заявявал(а) това, игнорирай този имейл.`,
    });
  }

  return { ok: true };
}

export async function resetPasswordAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { fieldErrors: firstFieldErrors(parsed.error.issues) };
  }

  const userId = await consumePasswordResetToken(parsed.data.token);
  if (!userId) {
    return {
      error: "Връзката е невалидна или изтекла. Заяви нова.",
    };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await hashPassword(parsed.data.newPassword) },
  });

  // Reset invalidates every existing session for the account.
  await prisma.session.deleteMany({ where: { userId } });

  return { ok: true };
}
