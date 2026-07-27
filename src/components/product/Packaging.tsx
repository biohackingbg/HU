import { Container } from "@/components/ui/Container";

/**
 * Packaging breakdown. Framed around protecting the formula first and
 * recyclability second. Every statement is a plain, verifiable material fact —
 * no generic "eco-friendly" claims (EU rules on environmental claims).
 */

const parts = [
  {
    n: "01",
    title: "Стъклен буркан",
    body: "Стъклото е инертно — не взаимодейства със съдържанието и не пропуска влага или миризми. Рециклира се неограничен брой пъти, без да губи качество.",
  },
  {
    n: "02",
    title: "Алуминиева капачка",
    body: "Метал вместо пластмаса. Затваря плътно и се рециклира заедно с останалия алуминий.",
  },
  {
    n: "03",
    title: "Алуминиев защитен печат",
    body: "Запечатва буркана до първото отваряне — гаранция, че продуктът не е бил докосван, и защита от влага по пътя до теб.",
  },
  {
    n: "04",
    title: "Картонена кутия",
    body: "Пази буркана при транспорт и се рециклира с хартиените отпадъци.",
  },
];

export function Packaging() {
  return (
    <section className="bg-brand-navy-500 py-20 lg:py-28">
      <Container>
        <div className="mb-12 max-w-2xl">
          <span className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-300">
            Опаковката
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Опаковка, която пази формулата
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            Внимателно подбраните съставки заслужават опаковка, която не ги
            компрометира. Затова използваме само стъкло, алуминий и картон —
            без пластмасов буркан и без памучен пълнеж.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {parts.map((part) => (
            <div
              key={part.n}
              className="rounded-2xl bg-white/[0.07] p-6 ring-1 ring-white/10"
            >
              <span className="font-display text-sm font-bold text-brand-sky-300">
                {part.n}
              </span>
              <h3 className="mt-2 font-display text-lg font-bold text-white">
                {part.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {part.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-white/40">
          Възможностите за рециклиране зависят от системата за разделно
          събиране в твоето населено място.
        </p>
      </Container>
    </section>
  );
}
