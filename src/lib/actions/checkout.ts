"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { catalogEntry } from "@/lib/catalog";
import { buildPurchaseForm, getMyposConfig } from "@/lib/mypos";
import { shippingCents } from "@/lib/checkout-config";
import { calculateShipping } from "@/lib/econt";
import { findPromoCode } from "@/lib/promo";
import { checkoutSchema, type CheckoutInput } from "@/lib/validation";

export type PromoPreview = {
  ok: boolean;
  percentOff?: number;
  label?: string;
  error?: string;
};

/** Client-facing preview so the checkout UI can show the discount before submit. */
export async function previewPromoCode(code: string): Promise<PromoPreview> {
  const promo = findPromoCode(code);
  if (!promo) return { ok: false, error: "Невалиден промо код." };
  return { ok: true, percentOff: promo.percentOff, label: promo.label };
}

export type PlaceOrderResult = {
  ok: boolean;
  orderId?: string;
  orderNumber?: string;
  /** Card payment: signed form the browser must POST to myPOS Checkout. */
  redirect?: { url: string; fields: [string, string][] };
  error?: string;
  fieldErrors?: Record<string, string>;
};

/** Public origin of this site, for the URLs myPOS calls back. */
async function siteOrigin(): Promise<string> {
  const configured = process.env.SITE_URL?.replace(/\/+$/, "");
  if (configured) return configured;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

async function nextOrderNumber(): Promise<string> {
  const count = await prisma.order.count();
  return `HU-${1001 + count}`;
}

export async function placeOrder(
  input: CheckoutInput,
): Promise<PlaceOrderResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] != null ? String(issue.path[0]) : "";
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const data = parsed.data;

  if (data.paymentMethod === "card" && !getMyposConfig()) {
    return {
      ok: false,
      error: "Плащането с карта все още не е активирано. Избери наложен платеж.",
    };
  }

  // Resolve every line to server-authoritative pricing.
  const lines = [];
  for (const line of data.items) {
    const entry = catalogEntry(line.id);
    if (!entry) {
      return { ok: false, error: "Невалиден продукт в количката." };
    }
    lines.push({ entry, quantity: line.quantity });
  }

  const subtotal = lines.reduce(
    (sum, l) => sum + l.entry.unitPriceCents * l.quantity,
    0,
  );

  // Promo code: re-validated server-side — never trust a discount from the client.
  let discount = 0;
  let appliedPromoCode: string | null = null;
  if (data.promoCode) {
    const promo = findPromoCode(data.promoCode);
    if (promo) {
      discount = Math.round((subtotal * promo.percentOff) / 100);
      appliedPromoCode = promo.code;
    }
  }

  // Shipping: live Econt quote when configured, else the flat fallback.
  const quote = await calculateShipping({
    method: data.shippingMethod,
    city: data.city || undefined,
    postcode: data.postcode || undefined,
    officeCode: data.office || undefined,
  });
  const shipping = quote ? quote.totalCents : shippingCents(subtotal - discount);
  const total = subtotal - discount + shipping;

  const user = await getCurrentUser();

  const order = await prisma.order.create({
    data: {
      orderNumber: await nextOrderNumber(),
      userId: user?.id ?? null,
      email: data.email,
      phone: data.phone,
      status: "processing",
      paymentMethod: data.paymentMethod,
      paymentStatus: "pending",
      shippingMethod: data.shippingMethod,
      subtotal,
      discount,
      promoCode: appliedPromoCode,
      shipping,
      total,
      shipName: [data.firstName, data.lastName].filter(Boolean).join(" "),
      shipLine1: data.address || null,
      shipCity: data.city || null,
      shipPostcode: data.postcode || null,
      shipOffice: data.office || null,
      carrier: "Еконт",
      items: {
        create: lines.map((l) => ({
          productSlug: l.entry.slug,
          productName: l.entry.name,
          variant: l.entry.variantLabel,
          unitPrice: l.entry.unitPriceCents,
          quantity: l.quantity,
          imageUrl: l.entry.imageUrl,
        })),
      },
    },
    select: { id: true, orderNumber: true },
  });

  // Card / Apple Pay / Google Pay: hand back a signed myPOS Checkout form.
  // The order is marked paid only by the signed IPCPurchaseNotify callback.
  if (data.paymentMethod === "card") {
    const mypos = getMyposConfig()!;
    const origin = await siteOrigin();
    const cartLines = lines.map((l) => ({
      article: [l.entry.name, l.entry.variantLabel].filter(Boolean).join(" — "),
      quantity: l.quantity,
      unitPriceCents: l.entry.unitPriceCents,
    }));
    if (discount > 0) {
      cartLines.push({
        article: `Отстъпка ${appliedPromoCode ?? ""}`.trim(),
        quantity: 1,
        unitPriceCents: -discount,
      });
    }
    if (shipping > 0) {
      cartLines.push({
        article: "Доставка Еконт",
        quantity: 1,
        unitPriceCents: shipping,
      });
    }
    const form = buildPurchaseForm(mypos, {
      orderId: order.id,
      currency: "EUR",
      lines: cartLines,
      urlOk: `${origin}/api/mypos/return?result=ok`,
      urlCancel: `${origin}/api/mypos/return?result=cancel`,
      urlNotify: `${origin}/api/mypos/notify`,
      note: `Поръчка ${order.orderNumber}`,
    });
    return {
      ok: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      redirect: form,
    };
  }

  // Cash on delivery: order is placed immediately (payment on delivery).
  if (user) revalidatePath("/akaunt/porachki");
  revalidatePath("/admin");
  return { ok: true, orderId: order.id, orderNumber: order.orderNumber };
}
