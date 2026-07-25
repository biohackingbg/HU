export const EUR_TO_BGN = 1.95583;

export function formatEur(amount: number) {
  return new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatBgn(amountInEur: number) {
  const bgn = amountInEur * EUR_TO_BGN;
  return `${bgn.toFixed(2)} лв.`;
}

export const neuromag6 = {
  slug: "neuromag-6",
  name: "Neuromag 6™",
  tagline: "Premium 6-Form Magnesium System",
  servingsPerContainer: 60,
  priceOneTime: 40,
  subscribeDiscountPct: 20,
  get priceSubscribe() {
    return Math.round(this.priceOneTime * (1 - this.subscribeDiscountPct / 100) * 100) / 100;
  },
};
