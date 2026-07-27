"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { emailSchema } from "@/lib/validation";
import { sendEmail } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { quizCategories, type QuizCategoryId } from "@/lib/quiz";
import { QUIZ_PROMO_CODE } from "@/lib/promo";

const leadSchema = z.object({
  email: emailSchema,
  category: z.enum(["sleep", "stress", "energy", "recovery"]),
});

export type QuizLeadState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitQuizLead(
  _prev: QuizLeadState,
  formData: FormData,
): Promise<QuizLeadState> {
  const parsed = leadSchema.safeParse({
    email: formData.get("email"),
    category: formData.get("category"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: { email: parsed.error.issues[0]?.message ?? "Невалиден имейл" },
    };
  }

  const ip = await clientIp();
  if (!rateLimit(`quiz-lead:${ip}`, 8, 60 * 60 * 1000).ok) {
    return { error: "Твърде много опити. Опитай отново по-късно." };
  }

  const { email, category } = parsed.data;

  await prisma.quizLead.create({ data: { email, category } }).catch(() => {});

  const categoryLabel = quizCategories[category as QuizCategoryId].label;
  await sendEmail({
    to: email,
    subject: "Твоят резултат от теста — Health Upgrade",
    text: `Твоят фокус според теста: ${categoryLabel}.\n\nВиж Neuromag 6: /produkt/neuromag-6\n\nИзползвай код ${QUIZ_PROMO_CODE} за 10% отстъпка от първата си поръчка.`,
  });

  return { ok: true };
}
