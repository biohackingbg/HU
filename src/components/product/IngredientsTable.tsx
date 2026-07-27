import Link from "next/link";
import { ingredients } from "@/lib/ingredients";

const rows = [
  { name: "Магнезий — елементарен, от 6 форми", two: "120 mg", four: "240 mg" },
  { name: "Витамин D3", two: "12.5 μg (500 IU)", four: "25 μg (1000 IU)" },
  { name: "Витамин B6 (P-5-P)", two: "1 mg", four: "2 mg" },
  { name: "Цинк", two: "3.75 mg", four: "7.5 mg" },
  { name: "Калий", two: "75 mg", four: "150 mg" },
];

const forms = ingredients.filter((i) => i.category === "Форма магнезий");

export function IngredientsTable() {
  return (
    <div className="grid gap-10 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
          Състав на дневна доза
        </h3>
        <div className="mt-4 overflow-hidden rounded-2xl border border-brand-navy-500/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-brand-sky-50 text-brand-navy-500/60">
                <th className="px-4 py-3 font-medium">Съставка</th>
                <th className="px-4 py-3 font-medium">2 капсули</th>
                <th className="px-4 py-3 font-medium">4 капсули</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.name}
                  className={i !== rows.length - 1 ? "border-b border-brand-navy-500/8" : ""}
                >
                  <td className="px-4 py-3 font-medium text-brand-navy-500">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 text-brand-navy-500/70">{row.two}</td>
                  <td className="px-4 py-3 text-brand-navy-500/70">{row.four}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-xl bg-brand-sky-50 px-4 py-3.5">
          <p className="text-sm leading-relaxed text-brand-navy-500/75">
            <span className="font-semibold text-brand-navy-500">
              Защо пишем „елементарен“:
            </span>{" "}
            посочените милиграми са чистият магнезий, който тялото усвоява — не
            общото тегло на съединенията. Магнезиевите форми тежат многократно
            повече от магнезия в тях, така че двете числа не са едно и също.
          </p>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-brand-navy-500/45">
          Да не се превишава препоръчителната дневна доза. Хранителната
          добавка не трябва да се използва като заместител на разнообразното
          и балансирано хранене и здравословния начин на живот.
        </p>
      </div>

      <div className="lg:col-span-2">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
          6-те форми магнезий
        </h3>
        <ul className="mt-4 space-y-3">
          {forms.map((form) => (
            <li key={form.slug}>
              <Link
                href={`/sustavki/${form.slug}`}
                className="block rounded-xl bg-brand-sky-50 px-4 py-3 text-sm transition-colors hover:bg-brand-sky-100"
              >
                <span className="block font-semibold text-brand-navy-500">
                  {form.name}
                </span>
                <span className="text-brand-navy-500/60">
                  {form.roleShort}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
