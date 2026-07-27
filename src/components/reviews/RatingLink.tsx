import { Stars } from "@/components/reviews/Stars";
import { reviewSummary } from "@/lib/reviews";

/** Compact rating shown under a product title, linking to the reviews section. */
export async function RatingLink({ productSlug }: { productSlug: string }) {
  const summary = await reviewSummary(productSlug);

  if (summary.count === 0) {
    return (
      <a
        href="#otzivi"
        className="mt-3 inline-flex items-center gap-2 text-sm text-brand-navy-500/50 hover:text-brand-navy-500"
      >
        <Stars rating={0} size={15} />
        Бъди първият с отзив
      </a>
    );
  }

  return (
    <a
      href="#otzivi"
      className="mt-3 inline-flex items-center gap-2 text-sm text-brand-navy-500/70 hover:text-brand-navy-500"
    >
      <Stars rating={summary.average} size={15} />
      <span className="font-semibold text-brand-navy-500">
        {summary.average.toFixed(1)}
      </span>
      <span className="underline">
        ({summary.count} {summary.count === 1 ? "отзив" : "отзива"})
      </span>
    </a>
  );
}
