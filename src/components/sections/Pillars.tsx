import { Container } from "@/components/ui/Container";

const pillars = [
  {
    title: "Наука",
    body: "Всяка формула се изгражда върху публикувани клинични проучвания, не върху тенденции. Работим само с дози и съотношения, за които има доказана ефективност.",
  },
  {
    title: "Съставки",
    body: "Избираме патентовани, най-качествени форми на всяка активна съставка — от известен произход, с проверена чистота и постоянство от партида до партида.",
  },
  {
    title: "Бионаличност",
    body: "Формулите ни комбинират няколко синергични форми на един и същ нутриент, за да постигнат максимално усвояване от тялото — не просто максимална доза на етикета.",
  },
];

export function Pillars() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-brand-navy-500 sm:text-4xl">
            Не индустриален стандарт. Health Upgrade стандарт.
          </h2>
          <p className="mt-4 text-lg text-brand-navy-500/70">
            Тези три принципа стоят зад всяко решение, което вземаме — от
            съставките, които избираме, до формулите, които стигат до вас.
          </p>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, i) => (
            <div key={pillar.title} className="border-t border-brand-navy-500/10 pt-6">
              <span className="font-display text-sm font-semibold text-brand-sky-600">
                0{i + 1}
              </span>
              <h3 className="mt-3 font-display text-xl font-bold text-brand-navy-500">
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
