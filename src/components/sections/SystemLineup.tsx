import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { systems } from "@/lib/systems";

/**
 * The full Health Upgrade system line-up. Shared by every product page so the
 * roadmap stays in one place (src/lib/systems.ts).
 */
export function SystemLineup({
  currentSlug,
  eyebrow = "Системата",
  title = "Health Upgrade системата",
  intro = "Тялото не е един орган, а съвкупност от системи. Всеки продукт е създаден да подкрепя конкретна система.",
}: {
  /** Slug of the system being viewed, highlighted in the grid. */
  currentSlug?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
}) {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div className="mb-12 max-w-2xl">
          <span className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
            {eyebrow}
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-navy-500 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-brand-navy-500/70">
            {intro}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {systems.map((system) => {
            const isCurrent = system.slug === currentSlug;
            const inner = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-brand-navy-500">
                      {system.productName ?? system.label}
                    </h3>
                    {system.productName && (
                      <p className="text-sm text-brand-navy-500/50">
                        {system.label}
                      </p>
                    )}
                  </div>
                  {isCurrent ? (
                    <span className="shrink-0 rounded-full bg-brand-sky-100 px-2.5 py-1 text-xs font-medium text-brand-sky-700">
                      Разглеждаш
                    </span>
                  ) : system.status === "soon" ? (
                    <span className="shrink-0 rounded-full bg-brand-navy-500/5 px-2.5 py-1 text-xs font-medium text-brand-navy-500/45">
                      Скоро
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-brand-navy-500/65">
                  {system.note}
                </p>
              </>
            );

            const base = `rounded-2xl border p-6 transition-colors ${
              system.status === "soon"
                ? "border-brand-navy-500/10 opacity-60"
                : isCurrent
                  ? "border-brand-navy-500/30 bg-brand-sky-50"
                  : "border-brand-navy-500/10 hover:border-brand-navy-500/30"
            }`;

            return system.href && !isCurrent ? (
              <Link key={system.slug} href={system.href} className={base}>
                {inner}
              </Link>
            ) : (
              <div key={system.slug} className={base}>
                {inner}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
