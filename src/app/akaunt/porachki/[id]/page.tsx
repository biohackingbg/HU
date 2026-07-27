import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  formatCentsBgn,
  formatCentsEur,
  formatOrderDate,
  statusInfo,
} from "@/lib/orders";

const timeline = [
  { key: "processing", label: "Обработва се" },
  { key: "shipped", label: "Изпратена" },
  { key: "delivered", label: "Доставена" },
];

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return null;

  const order = await prisma.order.findFirst({
    // Scope by userId so one user can never open another user's order.
    where: { id, userId: user.id },
    include: { items: true },
  });

  if (!order) notFound();

  const status = statusInfo(order.status);
  const activeStep =
    order.status === "cancelled"
      ? -1
      : timeline.findIndex((s) => s.key === order.status);

  return (
    <div className="space-y-6">
      <Link
        href="/akaunt/porachki"
        className="inline-block text-sm text-brand-navy-500/55 hover:text-brand-navy-500"
      >
        ← Всички поръчки
      </Link>

      <section className="rounded-3xl border border-brand-navy-500/10 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-brand-navy-500">
              Поръчка №{order.orderNumber}
            </h2>
            <p className="text-sm text-brand-navy-500/55">
              {formatOrderDate(order.placedAt)}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        {/* Tracking timeline */}
        {order.status !== "cancelled" && (
          <ol className="mt-8 grid grid-cols-3 gap-2">
            {timeline.map((step, i) => {
              const done = i <= activeStep;
              return (
                <li key={step.key} className="text-center">
                  <div className="relative flex items-center justify-center">
                    {i > 0 && (
                      <span
                        className={`absolute right-1/2 top-1/2 h-0.5 w-full -translate-y-1/2 ${
                          i <= activeStep
                            ? "bg-brand-sky-500"
                            : "bg-brand-navy-500/10"
                        }`}
                      />
                    )}
                    <span
                      className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                        done
                          ? "bg-brand-sky-500 text-white"
                          : "bg-brand-navy-500/10 text-brand-navy-500/40"
                      }`}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <p
                    className={`mt-2 text-xs font-medium ${
                      done ? "text-brand-navy-500" : "text-brand-navy-500/40"
                    }`}
                  >
                    {step.label}
                  </p>
                </li>
              );
            })}
          </ol>
        )}

        {order.carrier && order.trackingNo && (
          <div className="mt-6 rounded-2xl bg-brand-sky-50 p-4 text-sm">
            <p className="text-brand-navy-500/60">Проследяване на пратката</p>
            <p className="mt-1 font-semibold text-brand-navy-500">
              {order.carrier} · {order.trackingNo}
            </p>
          </div>
        )}
      </section>

      {/* Items */}
      <section className="rounded-3xl border border-brand-navy-500/10 bg-white p-6 sm:p-8">
        <h3 className="font-display font-bold text-brand-navy-500">Продукти</h3>
        <ul className="mt-4 divide-y divide-brand-navy-500/8">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-brand-sky-50">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    fill
                    sizes="64px"
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
              {formatCentsEur(order.total)}{" "}
              <span className="font-normal text-brand-navy-500/45">
                ({formatCentsBgn(order.total)})
              </span>
            </dd>
          </div>
        </dl>
      </section>

      {/* Shipping address */}
      {order.shipName && (
        <section className="rounded-3xl border border-brand-navy-500/10 bg-white p-6 sm:p-8">
          <h3 className="font-display font-bold text-brand-navy-500">
            Адрес за доставка
          </h3>
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
