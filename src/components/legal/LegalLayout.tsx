import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Container className="max-w-3xl py-14">
          <h1 className="font-display text-3xl font-bold tracking-tight text-brand-navy-500 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-brand-navy-500/50">
            Последна актуализация: {updated}
          </p>

          <div className="mt-6 rounded-xl border border-amber-300/60 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-900">
            <strong>Забележка за разработка:</strong> Това е примерен
            правен шаблон, а не финален юридически документ. Полетата в{" "}
            <code>[скоби]</code> трябва да се попълнят с реалните данни на
            дружеството, а целият текст — да мине преглед от юрист,
            специализиран в електронна търговия и хранителни добавки, преди
            публикуване.
          </div>

          <div className="legal-content mt-10 space-y-8">{children}</div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
