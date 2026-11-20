import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  amountToCents,
  getMyposConfig,
  verifyFields,
  type Fields,
} from "@/lib/mypos";

/**
 * myPOS Checkout server-to-server notifications (URL_Notify).
 *
 * myPOS requires HTTP 200 with the plain-text body "OK"; anything else makes it
 * retry. We answer OK for every correctly signed notification (including
 * rollbacks and cancels we have nothing to do for) and reject forged ones.
 */
function ok() {
  return new Response("OK", {
    status: 200,
    headers: { "content-type": "text/plain" },
  });
}

export async function POST(req: Request) {
  const config = getMyposConfig();
  if (!config) return new Response("myPOS not configured", { status: 503 });

  const form = await req.formData();
  const fields: Fields = [];
  form.forEach((value, key) => {
    if (typeof value === "string") fields.push([key, value]);
  });

  if (!verifyFields(fields, config.publicCert)) {
    console.error("[mypos] notify signature verification failed");
    return new Response("Invalid signature", { status: 400 });
  }

  const get = (name: string) => form.get(name)?.toString() ?? "";
  const method = get("IPCmethod");
  const orderId = get("OrderID");

  if (method !== "IPCPurchaseNotify") {
    // e.g. IPCPurchaseRollback / IPCPurchaseCancel: the order stays unpaid.
    console.info(`[mypos] ${method} for order ${orderId}`);
    return ok();
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, total: true, currency: true, userId: true },
  });
  if (!order) {
    console.error(`[mypos] notify for unknown order ${orderId}`);
    return ok();
  }

  const paidCents = amountToCents(get("Amount"));
  if (paidCents !== order.total || get("Currency") !== order.currency) {
    console.error(
      `[mypos] amount mismatch for order ${orderId}: got ${get("Amount")} ${get("Currency")}, expected ${order.total} cents ${order.currency}`,
    );
    return ok();
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: "paid",
      // myPOS transaction reference, kept in the generic payment-ref column.
      paymentIntentId: get("IPC_Trnref") || null,
    },
  });
  if (order.userId) revalidatePath("/akaunt/porachki");
  revalidatePath("/admin");

  return ok();
}
