/**
 * Central checkout configuration. Values in cents (EUR).
 *
 * Shipping is a flat fallback for now; it will be replaced by a live Econt
 * price calculation (see src/lib/econt.ts) once Econt credentials are set.
 */

export const FREE_SHIPPING_THRESHOLD_CENTS = 6000; // 60 €
export const FLAT_SHIPPING_CENTS = 499; // 4.99 € fallback
export const COD_FEE_CENTS = 0; // optional cash-on-delivery fee

export type ShippingMethod = "econt_address" | "econt_office" | "econt_machine";

export const shippingMethods: {
  id: ShippingMethod;
  label: string;
  note: string;
}[] = [
  {
    id: "econt_address",
    label: "Еконт — до адрес",
    note: "Доставка до посочен от теб адрес",
  },
  {
    id: "econt_office",
    label: "Еконт — до офис",
    note: "Вземане от офис на Еконт",
  },
  {
    id: "econt_machine",
    label: "Еконт — до автомат (Econtomat)",
    note: "Вземане от автомат 24/7",
  },
];

export function shippingCents(subtotalCents: number): number {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS
    ? 0
    : FLAT_SHIPPING_CENTS;
}

/** Feature flags derived from environment configuration. */
export const stripeEnabled = Boolean(
  process.env.STRIPE_SECRET_KEY &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

export const econtEnabled = Boolean(
  process.env.ECONT_USERNAME && process.env.ECONT_PASSWORD,
);
