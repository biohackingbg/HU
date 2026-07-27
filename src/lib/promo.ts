/**
 * Promo code registry. Codes are validated server-side in the checkout
 * action — never trust a discount percentage sent from the client.
 */

export type PromoCode = {
  code: string;
  percentOff: number;
  label: string;
};

const PROMO_CODES: Record<string, PromoCode> = {
  MAG10: {
    code: "MAG10",
    percentOff: 10,
    label: "10% отстъпка за първа поръчка",
  },
};

/** Code shown to everyone who completes the "Направи теста" quiz. */
export const QUIZ_PROMO_CODE = "MAG10";

export function findPromoCode(code: string): PromoCode | null {
  return PROMO_CODES[code.trim().toUpperCase()] ?? null;
}
