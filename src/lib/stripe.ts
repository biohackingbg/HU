import "server-only";

import Stripe from "stripe";

/**
 * Server-side Stripe client. Returns null until STRIPE_SECRET_KEY is set,
 * so the app runs (with cash-on-delivery only) before Stripe is configured.
 */
let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!cached) cached = new Stripe(key);
  return cached;
}
