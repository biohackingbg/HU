"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { catalogEntry } from "@/lib/catalog";
import { getStripe } from "@/lib/stripe";
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
  clientSecret?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
};

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

  // Card payment: create a Stripe PaymentIntent and hand the client secret back.
  if (data.paymentMethod === "card") {
    const stripe = getStripe();
    if (!stripe) {
      return {
        ok: false,
        error:
          "Плащането с карта все още не е активирано. Избери наложен платеж.",
      };
    }
    const intent = await stripe.paymentIntents.create({
      amount: total,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
    });
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentIntentId: intent.id },
    });
    return {
      ok: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      clientSecret: intent.client_secret ?? undefined,
    };
  }

  // Cash on delivery: order is placed immediately (payment on delivery).
  if (user) revalidatePath("/akaunt/porachki");
  revalidatePath("/admin");
  return { ok: true, orderId: order.id, orderNumber: order.orderNumber };
}
