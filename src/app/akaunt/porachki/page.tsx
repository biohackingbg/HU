import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  formatCentsEur,
  formatOrderDate,
  statusInfo,
} from "@/lib/orders";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { placedAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h2 className="font-display text-lg font-extrabold text-brand-navy-500">
        Моите поръчки
      </h2>

      {orders.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-brand-navy-500/10 bg-white p-8 text-center">
          <p className="text-brand-navy-500/60">Все още нямаш поръчки.</p>
          <Link
            href="/produkt/neuromag-6"
            className="mt-4 inline-flex rounded-full bg-brand-navy-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-700"
          >
            Разгледай продуктите
          </Link>
        </div>
      ) : (
        <ul className="mt-4 space-y-4">
          {orders.map((order) => {
            const status = statusInfo(order.status);
            const itemCount = order.items.reduce(
              (sum, item) => sum + item.quantity,
              0,
            );
            return (
              <li key={order.id}>
                <Link
                  href={`/akaunt/porachki/${order.id}`}
                  className="block rounded-2xl border border-brand-navy-500/10 bg-white p-5 transition-colors hover:border-brand-navy-500/30 sm:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-brand-navy-500">
                        Поръчка №{order.orderNumber}
                      </p>
                      <p className="text-sm text-brand-navy-500/55">
                        {formatOrderDate(order.placedAt)} · {itemCount}{" "}
                        {itemCount === 1 ? "продукт" : "продукта"} ·{" "}
                        {formatCentsEur(order.total)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
