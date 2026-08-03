import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { trustPoints } from "@/lib/trust";

export function TrustProof() {
  return (
    <section className="bg-brand-sky-50 py-20 lg:py-28">
      <Container>
        <div className="max-w-2xl">
          <span className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
            Прозрачност
          </span>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-brand-navy-500 sm:text-4xl">
            Доказателства, не обещания
          </h2>
          <p className="mt-4 text-lg text-brand-navy-500/70">
            Не искаме да ни вярвате на думата — искаме да можете да проверите
            всичко сами.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {trustPoints.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-brand-navy-500/5"
            >
              <h3 className="font-display text-lg font-extrabold text-brand-navy-500">
                {point.title}
              </h3>
              <p className="mt-2 leading-relaxed text-brand-navy-500/70">
                {point.body}
              </p>
              <Link
                href={point.href}
                className="mt-4 inline-block text-sm font-semibold text-brand-sky-600 hover:underline"
              >
                {point.linkLabel} →
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
