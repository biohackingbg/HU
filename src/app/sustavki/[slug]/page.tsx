import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { CheckItem } from "@/components/ui/CheckItem";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { getIngredient, ingredients } from "@/lib/ingredients";

export function generateStaticParams() {
  return ingredients.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ingredient = getIngredient(slug);
  if (!ingredient) return {};
  return {
    title: `${ingredient.name} | Съставки | Health Upgrade`,
    description: ingredient.whatItIs,
  };
}

export default async function IngredientPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ingredient = getIngredient(slug);
  if (!ingredient) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Container className="max-w-3xl py-14">
          <nav className="text-sm text-brand-navy-500/50">
            <Link href="/" className="hover:text-brand-navy-500">
              Начало
            </Link>{" "}
            /{" "}
            <Link href="/sustavki" className="hover:text-brand-navy-500">
              Съставки
            </Link>{" "}
            / <span className="text-brand-navy-500">{ingredient.name}</span>
          </nav>

          <span className="mt-6 inline-block font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
            {ingredient.category}
          </span>
          <AnimatedHeading
            as="h1"
            text={ingredient.name}
            className="mt-2 font-display text-4xl font-extrabold tracking-tight text-brand-navy-500"
          />
          <p className="mt-1 text-lg italic text-brand-navy-500/45">
            {ingredient.latinName}
          </p>

          <div className="mt-10 space-y-8">
            <section>
              <h2 className="font-display text-xl font-extrabold text-brand-navy-500">
                Какво представлява
              </h2>
              <p className="mt-3 leading-relaxed text-brand-navy-500/75">
                {ingredient.whatItIs}
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-extrabold text-brand-navy-500">
                Защо избрахме точно тази форма
              </h2>
              <p className="mt-3 leading-relaxed text-brand-navy-500/75">
                {ingredient.whyThisForm}
              </p>
            </section>

            {ingredient.research && (
              <section>
                <h2 className="font-display text-xl font-extrabold text-brand-navy-500">
                  Научна основа
                </h2>
                <div className="mt-3 rounded-2xl border border-brand-navy-500/10 p-6">
                  <p className="leading-relaxed text-brand-navy-500/75">
                    {ingredient.research.finding}
                  </p>
                  <p className="mt-3 text-sm text-brand-navy-500/45">
                    {ingredient.research.source}
                  </p>
                </div>
              </section>
            )}

            <section>
              <h2 className="font-display text-xl font-extrabold text-brand-navy-500">
                Официални здравни твърдения (EFSA)
              </h2>
              <ul className="mt-3 space-y-2.5">
                {ingredient.efsaClaims.map((claim) => (
                  <CheckItem key={claim}>{claim}</CheckItem>
                ))}
              </ul>
            </section>

            <p className="border-t border-brand-navy-500/10 pt-6 text-xs leading-relaxed text-brand-navy-500/45">
              Информацията в раздел „Научна основа“ има образователна цел и
              не следва да се тълкува като здравно твърдение по смисъла на
              Регламент (ЕО) № 1924/2006. Единствените официални здравни
              твърдения са изброените по-горе, в съответствие с одобрения
              регистър на EFSA.
            </p>

            <div className="rounded-2xl bg-brand-sky-50 p-6">
              <p className="text-brand-navy-500/75">
                Тази съставка присъства в{" "}
                <Link
                  href="/produkt/neuromag-6"
                  className="font-semibold text-brand-navy-500 underline"
                >
                  Neuromag 6™
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
