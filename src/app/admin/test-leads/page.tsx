import Link from "next/link";
import { prisma } from "@/lib/db";
import { quizCategories, type QuizCategoryId } from "@/lib/quiz";

const CATEGORY_IDS = Object.keys(quizCategories) as QuizCategoryId[];

function isCategoryId(value: string | undefined): value is QuizCategoryId {
  return !!value && CATEGORY_IDS.includes(value as QuizCategoryId);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("bg-BG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminQuizLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = isCategoryId(category) ? category : undefined;

  const [leads, counts] = await Promise.all([
    prisma.quizLead.findMany({
      where: active ? { category: active } : {},
      orderBy: { createdAt: "desc" },
    }),
    prisma.quizLead.groupBy({ by: ["category"], _count: { _all: true } }),
  ]);

  const countBy = new Map(counts.map((c) => [c.category, c._count._all]));
  const total = counts.reduce((s, c) => s + c._count._all, 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-brand-navy-500">
            Лийдове от теста
          </h1>
          <p className="mt-1 text-sm text-brand-navy-500/55">
            Имейли, оставени доброволно на резултатната страница на
            „Направи теста“ — {total} общо.
          </p>
        </div>
        <a
          href={`/api/admin/test-leads/export${active ? `?category=${active}` : ""}`}
          className="rounded-full border border-brand-navy-500/15 px-5 py-2.5 text-sm font-semibold text-brand-navy-500 transition-colors hover:border-brand-navy-500/40"
        >
          Изтегли CSV
        </a>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <Chip
          href="/admin/test-leads"
          label={`Всички (${total})`}
          active={!active}
        />
        {CATEGORY_IDS.map((id) => (
          <Chip
            key={id}
            href={`/admin/test-leads?category=${id}`}
            label={`${quizCategories[id].label} (${countBy.get(id) ?? 0})`}
            active={active === id}
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand-navy-500/10 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-navy-500/8 bg-brand-sky-50 text-brand-navy-500/60">
                <th className="px-4 py-3 font-medium">Имейл</th>
                <th className="px-4 py-3 font-medium">Резултат</th>
                <th className="px-4 py-3 font-medium">Дата</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-brand-navy-500/6 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-brand-navy-500">
                    {lead.email}
                  </td>
                  <td className="px-4 py-3 text-brand-navy-500/75">
                    {isCategoryId(lead.category)
                      ? quizCategories[lead.category].label
                      : lead.category}
                  </td>
                  <td className="px-4 py-3 text-brand-navy-500/60">
                    {formatDate(lead.createdAt)}
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-10 text-center text-brand-navy-500/50"
                  >
                    Няма лийдове по този филтър.
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
