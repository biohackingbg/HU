import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ingredients } from "@/lib/ingredients";

export const metadata: Metadata = {
  title: "Съставки от А до Я | Health Upgrade",
  description:
    "Научната основа зад всяка съставка в продуктите на Health Upgrade — какво представлява, защо е избрана тази форма и какво показват изследванията.",
};

const categories = ["Форма магнезий", "Витамин", "Минерал"] as const;

export default function IngredientsIndexPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Container className="py-14">
          <div className="max-w-2xl">
            <span className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
              Прозрачност
            </span>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-brand-navy-500">
              Съставки от А до Я
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-brand-navy-500/70">
              Вярваме, че трябва да знаете точно какво приемате и защо. Тук
              обясняваме всяка активна съставка в продуктите на Health
              Upgrade — какво представлява, защо сме избрали точно тази
              форма и какво показват изследванията зад нея.
            </p>
          </div>

          {categories.map((category) => (
            <div key={category} className="mt-14">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-brand-navy-500/50">
                {category === "Форма магнезий"
                  ? "Формите магнезий"
                  : category === "Витамин"
                    ? "Витамини"
                    : "Минерали"}
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ingredients
                  .filter((i) => i.category === category)
                  .map((ingredient) => (
                    <Link
                      key={ingredient.slug}
                      href={`/sustavki/${ingredient.slug}`}
                      className="group rounded-2xl border border-brand-navy-500/10 p-6 transition-colors hover:border-brand-navy-500/30 hover:bg-brand-sky-50"
                    >
                      <h3 className="font-display text-lg font-bold text-brand-navy-500">
                        {ingredient.name}
                      </h3>
                      <p className="mt-1 text-sm italic text-brand-navy-500/45">
                        {ingredient.latinName}
                      </p>
                      <p className="mt-3 text-sm text-brand-navy-500/70">
                        {ingredient.roleShort}
                      </p>
                      <span className="mt-4 inline-block text-sm font-semibold text-brand-sky-600 group-hover:underline">
                        Виж повече →
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </Container>
      </main>
      <Footer />
    </>
  );
}
