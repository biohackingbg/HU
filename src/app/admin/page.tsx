import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  formatCentsEur,
  formatOrderDate,
  statusInfo,
  statusMeta,
  type OrderStatus,
} from "@/lib/orders";

const STATUS_KEYS = Object.keys(statusMeta) as OrderStatus[];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status: statusParam, q } = await searchParams;
  const activeStatus = STATUS_KEYS.includes(statusParam as OrderStatus)
    ? (statusParam as OrderStatus)
    : undefined;
  const query = (q ?? "").trim();

  const where: Prisma.OrderWhereInput = {
    ...(activeStatus ? { status: activeStatus } : {}),
    ...(query
      ? {
          OR: [
            { orderNumber: { contains: query } },
            { email: { contains: query } },
            { shipName: { contains: query } },
            { user: { email: { contains: query } } },
            { user: { firstName: { contains: query } } },
            { user: { lastName: { contains: query } } },
          ],
        }
      : {}),
  };

  const [orders, counts] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { placedAt: "desc" },
      include: {
        items: true,
        user: { select: { email: true, firstName: true, lastName: true } },
      },
    }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const countByStatus = new Map(counts.map((c) => [c.status, c._count._all]));
  const totalCount = counts.reduce((sum, c) => sum + c._count._all, 0);
  const revenueCents = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  function filterHref(status?: OrderStatus) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (query) params.set("q", query);
    const qs = params.toString();
    return qs ? `/admin?${qs}` : "/admin";
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-brand-navy-500">
            Поръчки
          </h1>
          <p className="mt-1 text-sm text-brand-navy-500/55">
            {orders.length} показани · оборот {formatCentsEur(revenueCents)}{" "}
            (без отказани)
          </p>
        </div>

        <form method="get" className="flex gap-2">
          {activeStatus && (
            <input type="hidden" name="status" value={activeStatus} />
          )}
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Търси по №, имейл, име…"
            className="w-56 rounded-full border border-brand-navy-500/15 bg-white px-4 py-2 text-sm text-brand-navy-500 outline-none placeholder:text-brand-navy-500/35 focus:border-brand-navy-500"
          />
          <button
            type="submit"
            className="rounded-full bg-brand-navy-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy-700"
          >
            Търси
          </button>
        </form>
      </div>

      {/* Status filters */}
      <div className="mb-5 flex flex-wrap gap-2">
        <FilterChip
          href={filterHref(undefined)}
          label={`Всички (${totalCount})`}
          active={!activeStatus}
        />
        {STATUS_KEYS.map((status) => (
          <FilterChip
            key={status}
            href={filterHref(status)}
            label={`${statusMeta[status].label} (${countByStatus.get(status) ?? 0})`}
            active={activeStatus === status}
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand-navy-500/10 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-navy-500/8 bg-brand-sky-50 text-brand-navy-500/60">
                <th className="px-4 py-3 font-medium">Поръчка</th>
                <th className="px-4 py-3 font-medium">Клиент</th>
                <th className="px-4 py-3 font-medium">Дата</th>
                <th className="px-4 py-3 font-medium">Сума</th>
                <th className="px-4 py-3 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const status = statusInfo(order.status);
                const customer = order.user
                  ? [order.user.firstName, order.user.lastName]
                      .filter(Boolean)
                      .join(" ")
                      .trim() || order.user.email
                  : order.shipName || order.email || "Гост";
                return (
                  <tr
                    key={order.id}
                    className="border-b border-brand-navy-500/6 last:border-0 hover:bg-brand-sky-50/50"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/porachki/${order.id}`}
                        className="font-semibold text-brand-navy-500 hover:underline"
                      >
                        №{order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-brand-navy-500/75">
                      {customer}
                    </td>
                    <td className="px-4 py-3 text-brand-navy-500/60">
                      {formatOrderDate(order.placedAt)}
                    </td>
                    <td className="px-4 py-3 font-medium text-brand-navy-500">
                      {formatCentsEur(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-brand-navy-500/50"
                  >
                    Няма поръчки по този филтър.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "border-brand-navy-500 bg-brand-navy-500 text-white"
          : "border-brand-navy-500/15 text-brand-navy-500/70 hover:border-brand-navy-500/40"
      }`}
    >
      {label}
    </Link>
  );
}
