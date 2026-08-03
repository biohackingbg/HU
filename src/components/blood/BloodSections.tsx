import { Container } from "@/components/ui/Container";
import { CheckItem } from "@/components/ui/CheckItem";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MarkerGauge } from "@/components/blood/MarkerGauge";
import {
  biomarkerGroups,
  bloodFaq,
  bloodMeta,
  bloodPlans,
  bloodSteps,
  includedInEvery,
  sampleMarkers,
} from "@/lib/blood";

/* ---------- Hero ---------- */

export function BloodHero() {
  return (
    <section className="relative overflow-hidden bg-brand-navy-500 py-20 lg:py-28">
      <Container>
        <div className="max-w-3xl">
          <span className="hu-rise inline-flex items-center gap-2 rounded-full border border-brand-sky-300/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-sky-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-sky-300" />
            Бета · в разработка
          </span>

          <h1
            className="hu-rise mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "100ms" }}
          >
            Биологията ти
            <br />
            има отговорите.
          </h1>

          <p
            className="hu-rise mt-6 max-w-xl text-lg leading-relaxed text-brand-sky-300 sm:text-xl"
            style={{ animationDelay: "200ms" }}
          >
            Кръвен тест у дома по {bloodMeta.markerCount} ключови показателя.
            Една пълна картина на организма ти — и ясни следващи стъпки.
          </p>

          <div
            className="hu-rise mt-8 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "300ms" }}
          >
            <a
              href="#planove"
              className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-brand-navy-500 transition-colors hover:bg-brand-sky-100"
            >
              Виж плановете
            </a>
            <a
              href="#interes"
              className="rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/60"
            >
              Уведоми ме при пускане
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------- Beta notice ---------- */

export function BetaNotice() {
  return (
    <div className="border-b border-amber-300/60 bg-amber-50">
      <Container className="py-3">
        <p className="text-center text-sm leading-relaxed text-amber-900">
          <strong>Бета визуализация.</strong> Показателите, цените и сроковете
          са примерни. Услугата не се предлага все още и ще стартира след
          финализиране на партньорството с лицензирана лаборатория.
        </p>
      </Container>
    </div>
  );
}

/* ---------- How it works ---------- */

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Как работи"
          title="От тест до действие"
          intro="Четири стъпки — без чакане в лаборатория и без непонятни таблици с числа."
        />

        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <ol className="space-y-8">
            {bloodSteps.map((step) => (
              <li key={step.n} className="flex gap-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-navy-500 font-display text-sm font-extrabold text-white">
                  {step.n}
                </span>
                <div>
                  <h3 className="font-display text-lg font-extrabold text-brand-navy-500">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 leading-relaxed text-brand-navy-500/70">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* Dashboard preview */}
          <div className="rounded-3xl bg-brand-sky-50 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
                Примерен изглед
              </span>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-brand-navy-500/50">
                демо данни
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {sampleMarkers.map((m) => (
                <MarkerGauge key={m.name} {...m} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------- Biomarkers ---------- */

export function Biomarkers() {
  const total = biomarkerGroups.reduce((s, g) => s + g.markers.length, 0);

  return (
    <section className="bg-brand-sky-50 py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Какво измерваме"
          title="Всеки аспект от здравето ти"
          intro={`${total} показателя, групирани по системи — за да видиш цялата картина, а не отделни числа.`}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {biomarkerGroups.map((group) => (
            <div key={group.group} className="rounded-2xl bg-white p-6">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display font-extrabold text-brand-navy-500">
                  {group.group}
                </h3>
                <span className="text-xs text-brand-navy-500/40">
                  {group.markers.length}
                </span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {group.markers.map((m) => (
                  <li key={m} className="text-sm text-brand-navy-500/70">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------- Plans ---------- */

export function Plans() {
  return (
    <section id="planove" className="scroll-mt-24 py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Планове"
          title="Избери своя тест"
          intro="Еднократно или проследяване във времето — всички планове включват дигитален профил с обяснения."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {bloodPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border p-7 ${
                plan.featured
                  ? "border-brand-navy-500 bg-brand-navy-500 text-white"
                  : "border-brand-navy-500/12 bg-white"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-7 rounded-full bg-brand-sky-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-navy-500">
                  Най-избиран
                </span>
              )}

              <h3
                className={`font-display text-xl font-extrabold ${
                  plan.featured ? "text-white" : "text-brand-navy-500"
                }`}
              >
                {plan.name}
              </h3>

              <div className="mt-3 flex items-baseline gap-2">
                <span
                  className={`font-display text-3xl font-extrabold ${
                    plan.featured ? "text-white" : "text-brand-navy-500"
                  }`}
                >
                  {plan.price} €
                </span>
                {plan.compareAt && (
                  <span
                    className={`text-sm line-through ${
                      plan.featured ? "text-white/45" : "text-brand-navy-500/40"
                    }`}
                  >
                    {plan.compareAt} €
                  </span>
                )}
              </div>
              <span
                className={`text-sm ${
                  plan.featured ? "text-white/60" : "text-brand-navy-500/50"
                }`}
              >
                {plan.cadence}
              </span>

              <p
                className={`mt-4 leading-relaxed ${
                  plan.featured ? "text-white/75" : "text-brand-navy-500/70"
                }`}
              >
                {plan.description}
              </p>

              <p
                className={`mt-4 font-semibold ${
                  plan.featured ? "text-brand-sky-300" : "text-brand-sky-600"
                }`}
              >
                {plan.markerCount}
              </p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-start gap-2.5 text-sm ${
                      plan.featured ? "text-white/80" : "text-brand-navy-500/75"
                    }`}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        plan.featured ? "text-brand-sky-300" : "text-brand-sky-600"
                      }`}
                    >
                      <path
                        d="M4 10.5l3.5 3.5L16 5.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <span
                className={`mt-7 block rounded-full px-6 py-3 text-center text-sm font-semibold ${
                  plan.featured
                    ? "bg-white/10 text-white/60"
                    : "bg-brand-navy-500/5 text-brand-navy-500/45"
                }`}
              >
                Очаквайте скоро
              </span>
            </div>
          ))}
        </div>

        {/* Included in every plan */}
        <div className="mt-10 rounded-3xl bg-brand-sky-50 p-8">
          <h3 className="font-display font-extrabold text-brand-navy-500">
            Включено във всеки план
          </h3>
          <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {includedInEvery.map((item) => (
              <CheckItem key={item}>{item}</CheckItem>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/* ---------- FAQ ---------- */

export function BloodFaq() {
  return (
    <section className="bg-brand-sky-50 py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow="Въпроси" title="Често задавани въпроси" />
        <div className="divide-y divide-brand-navy-500/10 rounded-2xl border border-brand-navy-500/10 bg-white">
          {bloodFaq.map((faq) => (
            <details key={faq.q} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between font-display font-semibold text-brand-navy-500 marker:content-none">
                {faq.q}
                <span className="ml-4 shrink-0 text-brand-navy-500/40 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-brand-navy-500/70">
                {faq.a}
              </p>
            </details>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-brand-navy-500/45">
          Информацията на тази страница е с информативен характер и не
          представлява медицинска консултация, диагноза или лечение.
          Резултатите от лабораторни изследвания следва да се тълкуват от
          квалифициран медицински специалист.
        </p>
      </Container>
    </section>
  );
}
