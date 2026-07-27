import "server-only";

import { prisma } from "@/lib/db";

/**
 * Reviews are only ever created for a real, delivered purchase, so every
 * published review is a verified purchase. Nothing here trusts client input.
 */

/** Orders in these states count as a completed purchase. */
const PURCHASE_STATES = ["delivered"];

export type Eligibility =
  | { canReview: true; orderId: string }
  | {
      canReview: false;
      reason: "not_logged_in" | "no_purchase" | "already_reviewed";
    };

/**
 * A user may review a product when they have a delivered order containing it
 * and haven't reviewed it yet.
 */
export async function reviewEligibility(
  userId: string | null,
  productSlug: string,
): Promise<Eligibility> {
  if (!userId) return { canReview: false, reason: "not_logged_in" };

  const existing = await prisma.review.findUnique({
    where: { userId_productSlug: { userId, productSlug } },
    select: { id: true },
  });
  if (existing) return { canReview: false, reason: "already_reviewed" };

  const order = await prisma.order.findFirst({
    where: {
      userId,
      status: { in: PURCHASE_STATES },
      items: { some: { productSlug } },
    },
    orderBy: { placedAt: "desc" },
    select: { id: true },
  });

  if (!order) return { canReview: false, reason: "no_purchase" };
  return { canReview: true, orderId: order.id };
}

export type ReviewSummary = {
  count: number;
  average: number;
  /** Counts per star, index 0 = 1 star … index 4 = 5 stars. */
  distribution: number[];
};

export async function reviewSummary(
  productSlug: string,
): Promise<ReviewSummary> {
  const rows = await prisma.review.groupBy({
    by: ["rating"],
    where: { productSlug, status: "approved" },
    _count: { _all: true },
  });

  const distribution = [0, 0, 0, 0, 0];
  let count = 0;
  let total = 0;

  for (const row of rows) {
    const n = row._count._all;
    distribution[row.rating - 1] = n;
    count += n;
    total += row.rating * n;
  }

  return {
    count,
    average: count ? Math.round((total / count) * 10) / 10 : 0,
    distribution,
  };
}

export type PublicReview = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
  createdAt: Date;
  helpfulCount: number;
};

/** Approved reviews for public display. Author names are abbreviated. */
export async function listApprovedReviews(
  productSlug: string,
  sort: "recent" | "highest" | "lowest" = "recent",
): Promise<PublicReview[]> {
  const orderBy =
    sort === "highest"
      ? [{ rating: "desc" as const }, { createdAt: "desc" as const }]
      : sort === "lowest"
        ? [{ rating: "asc" as const }, { createdAt: "desc" as const }]
        : [{ createdAt: "desc" as const }];

  const reviews = await prisma.review.findMany({
    where: { productSlug, status: "approved" },
    orderBy,
    include: { user: { select: { firstName: true, lastName: true } } },
  });

  return reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    title: r.title,
    body: r.body,
    authorName: abbreviateName(r.user.firstName, r.user.lastName),
    createdAt: r.createdAt,
    helpfulCount: r.helpfulCount,
  }));
}

/** "Иван Петров" → "Иван П." — keeps reviews personal without exposing full names. */
function abbreviateName(first: string | null, last: string | null) {
  const f = (first ?? "").trim();
  const l = (last ?? "").trim();
  if (!f && !l) return "Клиент";
  if (!l) return f;
  return `${f} ${l[0]}.`;
}

export function formatReviewDate(date: Date) {
  return new Intl.DateTimeFormat("bg-BG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
