"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { statusInfo } from "@/lib/orders";
import { orderStatusSchema } from "@/lib/validation";

export type AdminState = {
  error?: string;
  ok?: boolean;
};

export async function updateOrderStatusAction(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const admin = await requireAdmin();
  if (!admin) redirect("/vhod");

  const parsed = orderStatusSchema.safeParse({
    orderId: formData.get("orderId"),
    status: formData.get("status"),
    carrier: formData.get("carrier"),
    trackingNo: formData.get("trackingNo"),
  });

  if (!parsed.success) {
    return { error: "Невалидни данни." };
  }

  const { orderId, status, carrier, trackingNo } = parsed.data;

  const before = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true },
  });

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      carrier: carrier || null,
      trackingNo: trackingNo || null,
    },
    select: {
      id: true,
      orderNumber: true,
      trackingNo: true,
      carrier: true,
      email: true,
      user: { select: { email: true } },
    },
  });

  // Notify the customer when the status actually changes.
  const recipient = order.user?.email ?? order.email;
  if (before && before.status !== status && recipient) {
    const label = statusInfo(status).label;
    const tracking =
      status === "shipped" && order.carrier && order.trackingNo
        ? `\n\nПроследяване: ${order.carrier} · ${order.trackingNo}`
        : "";
    await sendEmail({
      to: recipient,
      subject: `Поръчка №${order.orderNumber} — ${label}`,
      text: `Статусът на поръчка №${order.orderNumber} е обновен на: ${label}.${tracking}\n\nМожеш да видиш детайлите в акаунта си: /akaunt/porachki/${order.id}`,
    });
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/porachki/${order.id}`);
  // Reflect the change in the customer's own order views.
  revalidatePath("/akaunt");
  revalidatePath("/akaunt/porachki");
  revalidatePath(`/akaunt/porachki/${order.id}`);

  return { ok: true };
}
