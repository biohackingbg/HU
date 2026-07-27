"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { emailSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const waitlistSchema = z.object({ email: emailSchema });

export type WaitlistState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function joinBloodWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const parsed = waitlistSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return {
      fieldErrors: { email: parsed.error.issues[0]?.message ?? "Невалиден имейл" },
    };
  }

  const ip = await clientIp();
  if (!rateLimit(`blood-waitlist:${ip}`, 5, 60 * 60 * 1000).ok) {
    return { error: "Твърде много опити. Опитай отново по-късно." };
  }

  // Idempotent: signing up twice is not an error for the visitor.
  await prisma.bloodWaitlist
    .create({ data: { email: parsed.data.email } })
    .catch(() => {});

  return { ok: true };
}
