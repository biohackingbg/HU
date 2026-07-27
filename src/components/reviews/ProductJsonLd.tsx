import { reviewSummary } from "@/lib/reviews";

/**
 * schema.org Product markup so search engines can show rating stars.
 * AggregateRating is only emitted when real approved reviews exist —
 * never fabricate ratings.
 */
export async function ProductJsonLd({
  productSlug,
  name,
  description,
  image,
  priceEur,
}: {
  productSlug: string;
  name: string;
  description: string;
  image: string;
  priceEur: number;
}) {
  const summary = await reviewSummary(productSlug);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    brand: { "@type": "Brand", name: "Health Upgrade" },
    offers: {
      "@type": "Offer",
      price: priceEur.toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  };

  if (summary.count > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: summary.average,
      reviewCount: summary.count,
    };
  }

  return (
    <script
      type="application/ld+json"
      // Static, server-generated JSON — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
