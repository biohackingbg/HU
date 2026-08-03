import { CheckItem } from "@/components/ui/CheckItem";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const forms = [
  { name: "Магнезиев бисглицинат", role: "за релаксация и възстановяване" },
  { name: "Магнезиев L-треонат", role: "за мозъка и нервната система" },
  { name: "Магнезиев таурат", role: "за сърдечно-съдовата система" },
  { name: "Магнезиев малат", role: "за клетъчна енергия и мускули" },
  { name: "Магнезиев цитрат", role: "за оптимална абсорбция" },
  { name: "Магнезиев оротат", role: "за клетъчна функция" },
];

export function BenefitsGrid() {
  return (
    <section className="bg-brand-sky-50 py-20 lg:py-28">
      <Container className="grid gap-14 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-brand-navy-500 sm:text-4xl">
            Защо Neuromag 6™
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-brand-navy-500/75">
            Повечето магнезиеви добавки използват една или две форми магнезий.
            Neuromag 6™ комбинира шест високобиодостъпни форми, които работят
            синергично за подкрепа на нервната система, когнитивната функция,
            мускулното възстановяване и качествения сън.
          </p>
          <p className="mt-4 leading-relaxed text-brand-navy-500/75">
            Подсилен с витамин D3, витамин B6, цинк и калий за максимална
            синергия.
          </p>

          <div className="mt-8">
            <Button href="/produkt/neuromag-6">Виж пълния състав</Button>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-brand-navy-500/5 sm:p-10">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
            Формулата включва
          </h3>
          <ul className="mt-6 space-y-4">
            {forms.map((form) => (
              <CheckItem key={form.name}>
                <span className="font-semibold text-brand-navy-500">
                  {form.name}
                </span>{" "}
                — {form.role}
              </CheckItem>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
