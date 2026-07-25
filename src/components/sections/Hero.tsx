import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-sky-50">
      <Container className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div className="max-w-xl">
          <Badge>Нов продукт</Badge>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-brand-navy-500 sm:text-5xl lg:text-6xl">
            Наука зад всяка формула.
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-brand-navy-500/75">
            Health Upgrade създава хранителни добавки на база научни
            изследвания, най-високо качество на съставките и специални
            формули за максимална бионаличност.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/produkt/neuromag-6">Разгледай Neuromag 6</Button>
            <Button href="/nauka" variant="secondary">
              Нашата наука
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-brand-navy-900/10">
            <Image
              src="/brand/neuromag6-hero.png"
              alt="Health Upgrade Neuromag 6 — буркан и кутия"
              width={1370}
              height={1148}
              priority
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
