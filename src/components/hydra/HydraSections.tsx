import { Container } from "@/components/ui/Container";
import { CheckItem } from "@/components/ui/CheckItem";
import {
  cleanLabel,
  dehydrationFactors,
  differencePillars,
  howToUseOccasions,
  hydraFaq,
  whatsInside,
  whoForItems,
} from "@/lib/hydra";

function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="mb-12 max-w-2xl">
      <span className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
        {eyebrow}
      </span>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-navy-500 sm:text-4xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-4 text-lg leading-relaxed text-brand-navy-500/70">
          {intro}
        </p>
      )}
    </div>
  );
}

/* ---------- Why Hydra+ ---------- */

export function WhyHydra() {
  return (
    <section className="bg-brand-navy-500 py-20 lg:py-28">
      <Container className="max-w-3xl text-center">
        <span className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-300">
          Защо Hydra+
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
          Повечето хора нямат нужда от повече вода.
          <br />
          Имат нужда от по-добра хидратация.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
          Само водата невинаги е достатъчна. Всеки ден тялото ти губи
          електролити чрез потта, физическото натоварване, топлината,
          пътуванията, кафето и обичайните дневни дейности. Hydra+ помага да
          възстановиш основните минерали, които тялото използва, за да
          поддържа правилна хидратация.
        </p>
      </Container>
    </section>
  );
}

/* ---------- What dehydrates you every day ---------- */

function FactorIcon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "coffee":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" {...common}>
          <path d="M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z" />
          <path d="M17 9h2.5a2.5 2.5 0 0 1 0 5H17" />
          <path d="M8 3c-.5.8-.5 1.5 0 2.3M12 3c-.5.8-.5 1.5 0 2.3" />
        </svg>
      );
    case "plane":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" {...common}>
          <path d="M10.5 13.5 3 12l1-2 7 1 4.5-5.5a2 2 0 0 1 3 2.6L13 13l1 7-2 1-2.5-7.5Z" />
        </svg>
      );
    case "dumbbell":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" {...common}>
          <path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12" />
        </svg>
      );
    case "sauna":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" {...common}>
          <path d="M7 21c-2-2-2-4 0-6s2-4 0-6M12 21c-2-2-2-4 0-6s2-4 0-6M17 21c-2-2-2-4 0-6s2-4 0-6" />
        </svg>
      );
    case "sun":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
        </svg>
      );
    case "laptop":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" {...common}>
          <rect x="5" y="5" width="14" height="10" rx="1.5" />
          <path d="M3 19h18" />
        </svg>
      );
    default:
      return null;
  }
}

export function DehydrationSection() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Всекидневието"
          title="Какво те дехидратира всеки ден?"
          intro="Загубата на течности и електролити не идва само от спорта. Ето кои ежедневни фактори играят роля."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dehydrationFactors.map((factor) => (
            <div
              key={factor.label}
              className="rounded-2xl border border-brand-navy-500/10 p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-sky-50 text-brand-sky-600">
                <FactorIcon name={factor.icon} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-brand-navy-500">
                {factor.label}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-navy-500/70">
                {factor.note}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-2xl text-lg leading-relaxed text-brand-navy-500/75">
          Hydra+ помага да възстановиш основните електролити, за да останеш
          хидратиран през целия ден.
        </p>
      </Container>
    </section>
  );
}

/* ---------- What makes Hydra+ different ---------- */

export function DifferenceSection() {
  return (
    <section className="bg-brand-sky-50 py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Разликата"
          title="По-умен подход към хидратацията"
          intro="За разлика от много електролитни продукти, които разчитат на излишна захар, изкуствени подсладители или ненужни добавки, Hydra+ се фокусира върху най-важното."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {differencePillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-brand-navy-500/5"
            >
              <h3 className="font-display text-xl font-bold text-brand-navy-500">
                {pillar.title}
              </h3>
              <p className="mt-3 leading-relaxed text-brand-navy-500/70">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------- Who is it for ---------- */

export function WhoForSection() {
  return (
    <section className="py-20 lg:py-28">
      <Container className="grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="За кого е" title="За кого е Hydra+?" />
        </div>
        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {whoForItems.map((item) => (
            <CheckItem key={item}>{item}</CheckItem>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ---------- What's inside ---------- */

export function WhatsInsideSection() {
  return (
    <section className="bg-brand-sky-50 py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Състав"
          title="Какво има вътре"
          intro="Всяка доза осигурява внимателно балансиран електролитен профил."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {whatsInside.map((item) => (
            <div key={item.name} className="rounded-2xl bg-white p-6">
              <h3 className="font-display text-lg font-bold text-brand-navy-500">
                {item.name}
              </h3>
              <p className="mt-2 leading-relaxed text-brand-navy-500/70">
                {item.role}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-brand-navy-500/45">
          Здравните твърдения за калия и магнезия са в съответствие с
          одобрения регистър на EFSA. Натрият и микроелементите са описани
          информативно и без здравно твърдение по смисъла на Регламент (ЕО)
          № 1924/2006. Точните количества на дозите ще бъдат обявени преди
          пускането на продукта.
        </p>
      </Container>
    </section>
  );
}

/* ---------- How to use ---------- */

export function HowToUseSection() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow="Употреба" title="Как да използваш Hydra+" />
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl bg-brand-sky-50 p-8">
            <p className="text-2xl font-bold leading-snug text-brand-navy-500">
              Разбъркай 1 мерителна лъжичка с 500–750 ml студена вода.
            </p>
            <p className="mt-3 text-brand-navy-500/60">
              Регулирай количеството вода според предпочитания вкус.
            </p>
          </div>
          <div>
            <span className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
              Идеално за
            </span>
            <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {howToUseOccasions.map((occasion) => (
                <CheckItem key={occasion}>{occasion}</CheckItem>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------- Clean label ---------- */

export function CleanLabelSection() {
  return (
    <section className="bg-brand-navy-500 py-20 lg:py-28">
      <Container>
        <div className="max-w-2xl">
          <span className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-300">
            Чист етикет
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Нищо излишно.
          </h2>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cleanLabel.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3.5"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-brand-sky-300"
              >
                <path
                  d="M4 10.5l3.5 3.5L16 5.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-medium text-white">{item}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------- FAQ ---------- */

export function HydraFaqSection() {
  return (
    <section className="bg-brand-sky-50 py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow="Въпроси" title="Често задавани въпроси" />
        <div className="divide-y divide-brand-navy-500/10 rounded-2xl border border-brand-navy-500/10 bg-white">
          {hydraFaq.map((faq) => (
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
      </Container>
    </section>
  );
}
