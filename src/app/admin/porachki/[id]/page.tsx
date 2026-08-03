import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  formatCentsEur,
  formatOrderDate,
  statusInfo,
} from "@/lib/orders";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: { select: { email: true, firstName: true, lastName: true } },
    },
  });

  if (!order) notFound();

  const status = statusInfo(order.status);
  const customer = order.user
    ? [order.user.firstName, order.user.lastName]
        .filter(Boolean)
        .join(" ")
        .trim() || order.user.email
    : order.shipName || order.email || "Гост";
  const contactEmail = order.user?.email ?? order.email ?? "—";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin"
        className="inline-block text-sm text-brand-navy-500/55 hover:text-brand-navy-500"
      >
        ← Всички поръчки
      </Link>

      <section className="rounded-3xl border border-brand-navy-500/10 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-xl font-extrabold text-brand-navy-500">
              Поръчка №{order.orderNumber}
            </h1>
            <p className="text-sm text-brand-navy-500/55">
              {formatOrderDate(order.placedAt)} · {customer} · {contactEmail}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
          >
            {status.label}
          </span>
        </div>
      </section>

      {/* Manage */}
      <section className="rounded-3xl border border-brand-navy-500/10 bg-white p-6 sm:p-8">
        <h2 className="font-display font-extrabold text-brand-navy-500">
          Управление на поръчката
        </h2>
        <div className="mt-5">
          <OrderStatusForm
            orderId={order.id}
            status={order.status}
            carrier={order.carrier ?? ""}
            trackingNo={order.trackingNo ?? ""}
          />
        </div>
      </section>

      {/* Items */}
      <section className="rounded-3xl border border-brand-navy-500/10 bg-white p-6 sm:p-8">
        <h2 className="font-display font-extrabold text-brand-navy-500">Продукти</h2>
        <ul className="mt-4 divide-y divide-brand-navy-500/8">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-brand-sky-50">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    fill
                    sizes="56px"
                    className="object-contain p-1.5"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-brand-navy-500">
                  {item.productName}
                </p>
                {item.variant && (
                  <p className="text-sm text-brand-navy-500/55">
                    {item.variant}
                  </p>
                )}
                <p className="text-sm text-brand-navy-500/55">
                  Количество: {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-brand-navy-500">
                {formatCentsEur(item.unitPrice * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-6 space-y-2 border-t border-brand-navy-500/8 pt-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-brand-navy-500/60">Междинна сума</dt>
            <dd className="text-brand-navy-500">
              {formatCentsEur(order.subtotal)}
            </dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <dt className="text-emerald-600">
                Отстъпка{order.promoCode ? ` (${order.promoCode})` : ""}
              </dt>
              <dd className="text-emerald-600">
                −{formatCentsEur(order.discount)}
              </dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-brand-navy-500/60">Доставка</dt>
            <dd className="text-brand-navy-500">
              {order.shipping === 0
                ? "Безплатна"
                : formatCentsEur(order.shipping)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-brand-navy-500/8 pt-2 font-semibold">
            <dt className="text-brand-navy-500">Общо</dt>
            <dd className="text-brand-navy-500">
              {formatCentsEur(order.total)}
            </dd>
          </div>
        </dl>
      </section>

      {order.shipName && (
        <section className="rounded-3xl border border-brand-navy-500/10 bg-white p-6 sm:p-8">
          <h2 className="font-display font-extrabold text-brand-navy-500">
            Адрес за доставка
          </h2>
          <address className="mt-3 not-italic leading-relaxed text-brand-navy-500/70">
            {order.shipName}
            <br />
            {order.shipLine1}
            <br />
            {order.shipPostcode} {order.shipCity}
          </address>
        </section>
      )}
    </div>
  );
}
