import { neuromag6 } from "@/lib/product";

/**
 * Server-authoritative product pricing. Never trust prices sent from the
 * client — cart line ids are resolved here to real prices/labels.
 */

export type CatalogEntry = {
  name: string;
  variantLabel: string;
  unitPriceCents: number;
  imageUrl: string;
  recurring: boolean;
};

const catalog: Record<string, CatalogEntry> = {
  "neuromag-6:subscribe": {
    name: "Neuromag 6™",
    variantLabel: "60 капсули · абонамент",
    unitPriceCents: Math.round(neuromag6.priceSubscribe * 100),
    imageUrl: "/brand/neuromag6-jar.png",
    recurring: true,
  },
  "neuromag-6:onetime": {
    name: "Neuromag 6™",
    variantLabel: "60 капсули · еднократна покупка",
    unitPriceCents: Math.round(neuromag6.priceOneTime * 100),
    imageUrl: "/brand/neuromag6-jar.png",
    recurring: false,
  },
};

export function catalogEntry(id: string): CatalogEntry | null {
  return catalog[id] ?? null;
}
