import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  formatCentsEur,
  formatOrderDate,
  statusInfo,
} from "@/lib/orders";

export default async function AccountOverviewPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [latestOrder, orderCount] = await Promise.all([
    prisma.order.findFirst({
      where: { userId: user.id },
      orderBy: { placedAt: "desc" },
      include: { items: true },
    }),
    prisma.order.count({ where: { userId: user.id } }),
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-brand-navy-500/10 bg-white p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold text-brand-navy-500">
          Последна поръчка
        </h2>

        {latestOrder ? (
          <div className="mt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-brand-navy-500">
                  Поръчка №{latestOrder.orderNumber}
                </p>
                <p className="text-sm text-brand-navy-500/55">
                  {formatOrderDate(latestOrder.placedAt)} ·{" "}
                  {formatCentsEur(latestOrder.total)}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusInfo(latestOrder.status).className}`}
              >
                {statusInfo(latestOrder.status).label}
              </span>
            </div>
            <Link
              href={`/akaunt/porachki/${latestOrder.id}`}
              className="mt-4 inline-block text-sm font-semibold text-brand-sky-600 hover:underline"
            >
              Виж детайли и проследяване →
            </Link>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-brand-navy-500/60">
              Все още нямаш поръчки.
            </p>
            <Link
              href="/produkt/neuromag-6"
              className="mt-4 inline-flex rounded-full bg-brand-navy-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-700"
            >
              Разгледай продуктите
            </Link>
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <QuickLink
          href="/akaunt/porachki"
          title="Поръчки"
          note={`${orderCount} ${orderCount === 1 ? "поръчка" : "поръчки"}`}
        />
        <QuickLink
          href="/akaunt/profil"
          title="Профил"
          note="Име и парола"
        />
        <QuickLink
          href="/akaunt/adresi"
          title="Адреси"
          note="Адреси за доставка"
        />
      </section>
    </div>
  );
}

function QuickLink({
  href,
  title,
  note,
}: {
  href: string;
  title: string;
  note: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-brand-navy-500/10 bg-white p-5 transition-colors hover:border-brand-navy-500/30"
    >
      <p className="font-display font-bold text-brand-navy-500">{title}</p>
      <p className="mt-1 text-sm text-brand-navy-500/55">{note}</p>
    </Link>
  );
}
