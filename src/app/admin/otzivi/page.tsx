import Link from "next/link";
import { prisma } from "@/lib/db";
import { Stars } from "@/components/reviews/Stars";
import { ModerateReviewButtons } from "@/components/admin/ModerateReviewButtons";
import { formatReviewDate } from "@/lib/reviews";

const statusMeta: Record<string, { label: string; className: string }> = {
  pending: { label: "Чака одобрение", className: "bg-amber-50 text-amber-700" },
  approved: { label: "Публикуван", className: "bg-emerald-50 text-emerald-700" },
  rejected: { label: "Отхвърлен", className: "bg-red-50 text-red-600" },
};

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const active = ["pending", "approved", "rejected"].includes(status ?? "")
    ? status
    : undefined;

  const [reviews, counts] = await Promise.all([
    prisma.review.findMany({
      where: active ? { status: active } : {},
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
        order: { select: { orderNumber: true } },
      },
    }),
    prisma.review.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const countBy = new Map(counts.map((c) => [c.status, c._count._all]));
  const total = counts.reduce((s, c) => s + c._count._all, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-brand-navy-500">
          Отзиви
        </h1>
        <p className="mt-1 text-sm text-brand-navy-500/55">
          Всички отзиви са от клиенти с доставена поръчка.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <Chip href="/admin/otzivi" label={`Всички (${total})`} active={!active} />
        {(["pending", "approved", "rejected"] as const).map((s) => (
          <Chip
            key={s}
            href={`/admin/otzivi?status=${s}`}
            label={`${statusMeta[s].label} (${countBy.get(s) ?? 0})`}
            active={active === s}
          />
        ))}
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-brand-navy-500/10 bg-white p-10 text-center text-brand-navy-500/50">
          Няма отзиви по този филтър.
        </div>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => {
            const meta = statusMeta[r.status] ?? statusMeta.pending;
            const author =
              [r.user.firstName, r.user.lastName].filter(Boolean).join(" ") ||
              r.user.email;
            return (
              <li
                key={r.id}
                className="rounded-2xl border border-brand-navy-500/10 bg-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Stars rating={r.rating} />
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meta.className}`}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <ModerateReviewButtons id={r.id} status={r.status} />
                </div>

                {r.title && (
                  <h2 className="mt-3 font-display font-extrabold text-brand-navy-500">
                    {r.title}
                  </h2>
                )}
                <p className="mt-2 leading-relaxed text-brand-navy-500/75">
                  {r.body}
                </p>
                <p className="mt-3 text-xs text-brand-navy-500/45">
                  {author} · {r.user.email} · поръчка №{r.order.orderNumber} ·{" "}
                  {formatReviewDate(r.createdAt)} · продукт: {r.productSlug}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Chip({
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
