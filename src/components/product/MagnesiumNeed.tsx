import Link from "next/link";
import { Container } from "@/components/ui/Container";

/**
 * Educational "when is magnesium need higher" section.
 *
 * Deliberately framed around circumstances that increase requirement or
 * losses — never around symptoms — so the page stays educational and makes no
 * diagnostic claim. Mirrors the "what dehydrates you" section on Hydra+.
 */

const factors = [
  {
    icon: "dumbbell",
    label: "Редовни тренировки",
    note: "Магнезият се губи с потта, а натоварените мускули го използват активно.",
  },
  {
    icon: "pulse",
    label: "Продължителен стрес",
    note: "В периоди на високо напрежение организмът отделя повече магнезий с урината.",
  },
  {
    icon: "coffee",
    label: "Кафе и алкохол",
    note: "И двете могат да повишат отделянето на магнезий през бъбреците.",
  },
  {
    icon: "hourglass",
    label: "С напредване на възрастта",
    note: "Усвояването на минерали от храната обичайно намалява с годините.",
  },
  {
    icon: "package",
    label: "Преработени храни",
    note: "Рафинирането отнема голяма част от магнезия в зърнените храни.",
  },
  {
    icon: "plate",
    label: "Ограничителни режими",
    note: "Кето, нисковъглехидратно или елиминационно хранене изключва храни, богати на магнезий.",
  },
];

function FactorIcon({ name }: { name: string }) {
  const s = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "dumbbell":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" {...s}>
          <path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12" />
        </svg>
      );
    case "pulse":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" {...s}>
          <path d="M3 12h4l2-5 3 10 2.5-5H21" />
        </svg>
      );
    case "coffee":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" {...s}>
          <path d="M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z" />
          <path d="M17 9h2.5a2.5 2.5 0 0 1 0 5H17" />
          <path d="M8 3c-.5.8-.5 1.5 0 2.3M12 3c-.5.8-.5 1.5 0 2.3" />
        </svg>
      );
    case "hourglass":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" {...s}>
          <path d="M7 3h10M7 21h10" />
          <path d="M8 3c0 4 8 5 8 9s-8 5-8 9" />
          <path d="M16 3c0 4-8 5-8 9s8 5 8 9" />
        </svg>
      );
    case "package":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" {...s}>
          <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" />
          <path d="M4 8.5 12 13l8-4.5M12 13v7" />
        </svg>
      );
    case "plate":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" {...s}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3.5" />
        </svg>
      );
    default:
      return null;
  }
}

export function MagnesiumNeed() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div className="mb-12 max-w-2xl">
          <span className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
            Нуждата
          </span>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-brand-navy-500 sm:text-4xl">
            Кога нуждата от магнезий е по-висока
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-brand-navy-500/70">
            Магнезият участва в стотици ензимни реакции всеки ден, а тялото го
            изразходва и отделя постоянно. Определени навици и обстоятелства
            повишават нуждата от него — или загубите му.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {factors.map((factor) => (
            <div
              key={factor.label}
              className="rounded-2xl border border-brand-navy-500/10 p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-sky-50 text-brand-sky-600">
                <FactorIcon name={factor.icon} />
              </div>
              <h3 className="mt-4 font-display text-lg font-extrabold text-brand-navy-500">
                {factor.label}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-navy-500/70">
                {factor.note}
              </p>
            </div>
          ))}
        </div>

        {/* Honest close: we don't diagnose — here's how you'd actually know. */}
        <div className="mt-10 rounded-3xl bg-brand-sky-50 p-8 sm:p-10">
          <div className="max-w-2xl">
            <h3 className="font-display text-xl font-extrabold text-brand-navy-500">
              Как да разбереш какви са твоите стойности
            </h3>
            <p className="mt-3 leading-relaxed text-brand-navy-500/75">
              Тази страница не поставя диагноза и не може да ти каже какви са
              нивата ти. Единственият начин да ги узнаеш е кръвно изследване.
              Затова разработваме и{" "}
              <Link
                href="/blood"
                className="font-semibold text-brand-navy-500 underline"
              >
                Health Upgrade Blood Levels
              </Link>{" "}
              — за да не гадаеш, а да знаеш.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-brand-navy-500/50">
              Информацията е с образователна цел. При оплаквания или съмнение
              за дефицит се консултирай с лекар — хранителните добавки не
              заместват медицинска консултация, диагноза или лечение.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
