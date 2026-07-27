"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { reviewEligibility } from "@/lib/reviews";
import { reviewSchema } from "@/lib/validation";

export type ReviewState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitReviewAction(
  _prev: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Влез в акаунта си, за да оставиш отзив." };
  }

  const parsed = reviewSchema.safeParse({
    productSlug: formData.get("productSlug"),
    rating: formData.get("rating"),
    title: formData.get("title"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] != null ? String(issue.path[0]) : "";
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { fieldErrors };
  }

  const { productSlug, rating, title, body } = parsed.data;

  // Re-check server-side: only a delivered purchase can be reviewed.
  const eligibility = await reviewEligibility(user.id, productSlug);
  if (!eligibility.canReview) {
    return {
      error:
        eligibility.reason === "already_reviewed"
          ? "Вече си оставил(а) отзив за този продукт."
          : "Отзиви могат да оставят само клиенти с доставена поръчка на този продукт.",
    };
  }

  await prisma.review.create({
    data: {
      productSlug,
      userId: user.id,
      orderId: eligibility.orderId,
      rating,
      title: title || null,
      body,
      status: "pending",
    },
  });

  revalidatePath(`/produkt/${productSlug}`);
  revalidatePath("/admin/otzivi");
  return { ok: true };
}

/** Admin: approve or reject a review. */
export async function moderateReviewAction(
  _prev: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Няма достъп." };

  const id = String(formData.get("id") ?? "");
  const action = String(formData.get("action") ?? "");
  if (!id || !["approve", "reject"].includes(action)) {
    return { error: "Невалидна заявка." };
  }

  const review = await prisma.review.update({
    where: { id },
    data: { status: action === "approve" ? "approved" : "rejected" },
    select: { productSlug: true },
  });

  revalidatePath("/admin/otzivi");
  revalidatePath(`/produkt/${review.productSlug}`);
  return { ok: true };
}
