import "server-only";

import { econtEnabled } from "@/lib/checkout-config";

/**
 * Minimal Econt (Достави с Еконт) API client — Phase 1 scaffolding.
 *
 * Uses the JSON endpoints at ee.econt.com/services (prod) / demo.econt.com
 * (test) with BASIC auth. Every call is a POST. Functions no-op / return null
 * until ECONT_USERNAME + ECONT_PASSWORD are configured, so the checkout works
 * with the flat shipping fallback until credentials are in place.
 *
 * Docs: https://ee.econt.com/services/  ·  support_integrations@econt.com
 */

const BASE =
  process.env.ECONT_API_BASE ?? "https://demo.econt.com/ee/services";

async function call<T>(path: string, body: unknown): Promise<T | null> {
  if (!econtEnabled) return null;

  const auth = Buffer.from(
    `${process.env.ECONT_USERNAME}:${process.env.ECONT_PASSWORD}`,
  ).toString("base64");

  try {
    const res = await fetch(`${BASE}/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error(`[econt] ${path} → HTTP ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[econt] ${path} failed:`, err);
    return null;
  }
}

export type EcontOffice = {
  code: string;
  name: string;
  city: string;
};

/** Nomenclatures/NomenclaturesService.getOffices — list offices/machines. */
export async function getOffices(
  countryCode = "BGR",
): Promise<EcontOffice[] | null> {
  const data = await call<{ offices?: unknown[] }>(
    "Nomenclatures/NomenclaturesService.getOffices.json",
    { countryCode },
  );
  if (!data?.offices) return null;
  // Shape mapping is finalised against live responses once credentials exist.
  return [];
}

export type ShippingQuote = { totalCents: number; currency: string };

/**
 * Label/LabelService.createLabel with mode="calculate" returns the shipping
 * price without creating a shipment. Returns null when Econt isn't configured
 * (caller then falls back to the flat rate).
 */
export async function calculateShipping(input: {
  method: string;
  city?: string;
  postcode?: string;
  officeCode?: string;
  weightKg?: number;
}): Promise<ShippingQuote | null> {
  const data = await call<{ label?: { totalPrice?: number } }>(
    "Shipments/LabelService.createLabel.json",
    { mode: "calculate", label: buildLabelPayload(input) },
  );
  const price = data?.label?.totalPrice;
  if (typeof price !== "number") return null;
  return { totalCents: Math.round(price * 100), currency: "EUR" };
}

function buildLabelPayload(input: {
  method: string;
  city?: string;
  postcode?: string;
  officeCode?: string;
}) {
  // Placeholder payload — exact fields are confirmed against Econt docs and
  // the signed contract (sender data, service type, EUR fields for 2026).
  return {
    receiverCity: input.city,
    receiverPostcode: input.postcode,
    receiverOfficeCode: input.officeCode,
  };
}
