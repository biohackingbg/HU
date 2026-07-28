/**
 * "Frequently bought together" companion items per product.
 *
 * Only items with a `catalogKey` are actually purchasable (resolved via
 * `catalogEntry()` in checkout — never trust prices defined here). Items
 * without one render as an unavailable "Очаквайте скоро" companion so the
 * module works today with a single real product and needs no code changes
 * once a companion gets real pricing — just add its catalogKey.
 */

export type BundleCompanion = {
  productSlug: string;
  name: string;
  variantLabel: string;
  imageUrl: string;
  /** Key into src/lib/catalog.ts. Omit while the product has no real price yet. */
  catalogKey?: string;
  href: string;
};

export const bundleCompanions: Record<string, BundleCompanion[]> = {
  "neuromag-6": [
    {
      productSlug: "hydra-plus",
      name: "Hydra+",
      variantLabel: "Ежедневна хидратация",
      imageUrl: "/brand/hydra-plus-front.png",
      href: "/produkt/hydra-plus",
    },
  ],
};
