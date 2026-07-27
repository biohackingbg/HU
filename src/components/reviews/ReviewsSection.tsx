import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Stars } from "@/components/reviews/Stars";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { getCurrentUser } from "@/lib/auth";
import {
  formatReviewDate,
  listApprovedReviews,
  reviewEligibility,
  reviewSummary,
} from "@/lib/reviews";

export async function ReviewsSection({
  productSlug,
}: {
  productSlug: string;
}) {
  const user = await getCurrentUser();
  const [summary, reviews, eligibility] = await Promise.all([
    reviewSummary(productSlug),
    listApprovedReviews(productSlug),
    reviewEligibility(user?.id ?? null, productSlug),
  ]);

  return (
    <section id="otzivi" className="bg-white py-20 lg:py-28">
      <Container>
        <div className="mb-10 max-w-2xl">
          <span className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
            Отзиви
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-navy-500 sm:text-4xl">
            Какво казват клиентите
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
          {/* Summary + form */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            {summary.count > 0 ? (
              <div className="rounded-3xl border border-brand-navy-500/10 p-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-4xl font-bold text-brand-navy-500">
                    {summary.average.toFixed(1)}
                  </span>
                  <div>
                    <Stars rating={summary.average} size={18} />
                    <p className="mt-1 text-sm text-brand-navy-500/55">
                      {summary.count}{" "}
                      {summary.count === 1 ? "отзив" : "отзива"}
                    </p>
                  </div>
                </div>

                <ul className="mt-5 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const n = summary.distribution[star - 1];
                    const pct = summary.count
                      ? Math.round((n / summary.count) * 100)
                      : 0;
                    return (
                      <li key={star} className="flex items-center gap-2 text-sm">
                        <span className="w-8 shrink-0 text-brand-navy-500/60">
                          {star} ★
                        </span>
                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-brand-navy-500/8">
                          <span
                            className="block h-full rounded-full bg-amber-400"
                            style={{ width: `${pct}%` }}
                          />
                        </span>
                        <span className="w-7 shrink-0 text-right text-brand-navy-500/45">
                          {n}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-brand-navy-500/15 p-6 text-center">
                <Stars rating={0} size={20} className="justify-center" />
                <p className="mt-3 font-medium text-brand-navy-500">
                  Още няма отзиви
                </p>
                <p className="mt-1 text-sm text-brand-navy-500/55">
                  Бъди първият, който споделя опита си.
                </p>
              </div>
            )}

            {/* Write-a-review state */}
            <div className="mt-6 rounded-3xl border border-brand-navy-500/10 p-6">
              <h3 className="font-display font-bold text-brand-navy-500">
                Остави отзив
              </h3>
              {eligibility.canReview ? (
                <div className="mt-4">
                  <ReviewForm productSlug={productSlug} />
                </div>
              ) : (
                <p className="mt-2 text-sm leading-relaxed text-brand-navy-500/60">
                  {eligibility.reason === "not_logged_in" ? (
                    <>
                      Отзиви могат да оставят само клиенти с доставена поръчка.{" "}
                      <Link
                        href="/vhod"
                        className="font-semibold text-brand-navy-500 underline"
                      >
                        Влез в акаунта си
                      </Link>
                      .
                    </>
                  ) : eligibility.reason === "already_reviewed" ? (
                    "Благодарим — вече си оставил(а) отзив за този продукт."
                  ) : (
                    "Отзиви могат да оставят само клиенти с доставена поръчка на този продукт."
                  )}
                </p>
              )}
            </div>
          </div>

          {/* List */}
          <div>
            {reviews.length === 0 ? (
              <div className="rounded-3xl bg-brand-sky-50 p-10 text-center">
                <p className="text-brand-navy-500/60">
                  Все още няма публикувани отзиви за този продукт.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-brand-navy-500/8">
                {reviews.map((review) => (
                  <li key={review.id} className="py-6 first:pt-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <Stars rating={review.rating} />
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <svg
                          viewBox="0 0 20 20"
                          className="h-3.5 w-3.5"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M4 10.5l3.5 3.5L16 5.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Потвърдена покупка
                      </span>
                    </div>

                    {review.title && (
                      <h3 className="mt-3 font-display font-bold text-brand-navy-500">
                        {review.title}
                      </h3>
                    )}
                    <p className="mt-2 leading-relaxed text-brand-navy-500/75">
                      {review.body}
                    </p>
                    <p className="mt-3 text-sm text-brand-navy-500/45">
                      {review.authorName} · {formatReviewDate(review.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
