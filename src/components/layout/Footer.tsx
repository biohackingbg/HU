import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

const columns = [
  {
    title: "Пазарувай",
    links: [
      { href: "/produkt/neuromag-6", label: "Neuromag 6" },
      { href: "/produkt/hydra-plus", label: "Hydra+ (очаквайте скоро)" },
      { href: "/sustavki", label: "Съставки" },
      { href: "/nauka", label: "Нашата наука" },
    ],
  },
  {
    title: "Компания",
    links: [
      { href: "/za-nas", label: "За нас" },
      { href: "/faq", label: "Въпроси" },
      { href: "/kontakti", label: "Контакти" },
    ],
  },
  {
    title: "Правна информация",
    links: [
      { href: "/obshti-usloviya", label: "Общи условия" },
      { href: "/poveritelnost", label: "Поверителност" },
      { href: "/pravo-na-otkaz", label: "Право на отказ" },
      { href: "/dostavka-i-vrashtane", label: "Доставка и връщане" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-navy-500/10 bg-white">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-navy-500/60">
              Хранителни добавки на база наука, най-високо качество на
              съставките и максимална бионаличност.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold text-brand-navy-500">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-navy-500/65 transition-colors hover:text-brand-navy-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-brand-navy-500/10 pt-6 text-xs leading-relaxed text-brand-navy-500/50">
          <p>
            Хранителната добавка не трябва да се използва като заместител на
            разнообразното и балансирано хранене и здравословния начин на
            живот. Да не се превишава препоръчителната дневна доза. Да се
            съхранява на сухо и хладно място, недостъпно за малки деца.
          </p>
          <p className="mt-4">
            © {new Date().getFullYear()} Health Upgrade. Всички права
            запазени.
          </p>
        </div>
      </Container>
    </footer>
  );
}
