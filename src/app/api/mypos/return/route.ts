import { prisma } from "@/lib/db";

/**
 * Where myPOS sends the customer's browser back (URL_OK / URL_Cancel).
 * myPOS may come back with a POST, which a page cannot accept, so this route
 * redirects (303) to the right page. It never marks an order paid — only the
 * signed notification in ../notify does that.
 */
async function handle(req: Request) {
  const url = new URL(req.url);
  const result = url.searchParams.get("result");

  let orderId = url.searchParams.get("OrderID") ?? "";
  if (!orderId && req.method === "POST") {
    const form = await req.formData().catch(() => null);
    orderId = form?.get("OrderID")?.toString() ?? "";
  }

  const order = orderId
    ? await prisma.order.findUnique({
        where: { id: orderId },
        select: { orderNumber: true },
      })
    : null;

  const target =
    result === "ok" && order
      ? `/plashtane/uspeh?n=${encodeURIComponent(order.orderNumber)}&paid=1`
      : "/plashtane?payment=cancelled";

  return new Response(null, {
    status: 303,
    headers: { location: new URL(target, url.origin).toString() },
  });
}

export const GET = handle;
export const POST = handle;
