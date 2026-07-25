import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckItem } from "@/components/ui/CheckItem";

export const metadata: Metadata = {
  title: "Направи теста | Health Upgrade",
  description:
    "Кратък тест, който ще ти препоръча коя система да оптимизираш първо и кой продукт на Health Upgrade е най-подходящ за теб.",
};

const steps = [
  "Отговаряш на няколко въпроса за целите и начина ти на живот",
  "Получаваш препоръка коя система да оптимизираш първо",
  "Виждаш кой продукт на Health Upgrade е най-подходящ за теб",
];

export default function QuizPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-brand-sky-50 py-20 lg:py-28">
          <Container className="max-w-2xl text-center">
            <Badge>Очаквайте скоро</Badge>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-brand-navy-500 sm:text-5xl">
              Открий своята система
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-brand-navy-500/75">
              Тялото не е един орган — то е съвкупност от системи. Тестът ще
              ти помогне да разбереш коя система да оптимизираш първо и кой
              продукт е най-подходящ за твоите цели.
            </p>

            <ul className="mx-auto mt-10 max-w-md space-y-3 text-left">
              {steps.map((step) => (
                <CheckItem key={step}>{step}</CheckItem>
              ))}
            </ul>

            <p className="mt-10 text-brand-navy-500/70">
              Тестът е в процес на разработка. Междувременно разгледай{" "}
              <Link
                href="/produkt/neuromag-6"
                className="font-semibold text-brand-navy-500 underline"
              >
                Neuromag 6™
              </Link>{" "}
              — вече наличен.
            </p>

            <div className="mt-8 flex justify-center">
              <Button href="/produkt/neuromag-6">Разгледай продукта</Button>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
