import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { CheckItem } from "@/components/ui/CheckItem";
import { PurchaseBox } from "@/components/product/PurchaseBox";
import { ProductGallery } from "@/components/product/ProductGallery";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import {
  PhotoSlide,
  PhotoThumb,
  SixFormsSlide,
  SixFormsThumb,
  SynergySlide,
  SynergyThumb,
} from "@/components/product/InfoSlides";
import { IngredientsTable } from "@/components/product/IngredientsTable";
import { FunctionSection } from "@/components/product/FunctionSection";
import { HowToUse } from "@/components/product/HowToUse";
import { ClinicalResearch } from "@/components/product/ClinicalResearch";
import { UsageFaq } from "@/components/product/UsageFaq";

const gallerySlides = [
  {
    id: "jar",
    content: (
      <PhotoSlide
        src="/brand/neuromag6-jar.png"
        alt="Health Upgrade Neuromag 6 — буркан, студийна снимка"
      />
    ),
    thumb: (
      <PhotoThumb src="/brand/neuromag6-jar.png" alt="Neuromag 6 буркан" />
    ),
  },
  {
    id: "six-forms",
    content: <SixFormsSlide />,
    thumb: <SixFormsThumb />,
  },
  {
    id: "synergy",
    content: <SynergySlide />,
    thumb: <SynergyThumb />,
  },
  {
    id: "lifestyle",
    content: (
      <PhotoSlide
        src="/brand/neuromag6-hero.png"
        alt="Health Upgrade Neuromag 6 — буркан и кутия"
      />
    ),
    thumb: (
      <PhotoThumb
        src="/brand/neuromag6-hero.png"
        alt="Neuromag 6 буркан и кутия"
      />
    ),
  },
];

export const metadata: Metadata = {
  title: "Neuromag 6™ — Premium 6-Form Magnesium System | Health Upgrade",
  description:
    "6 високобиодостъпни форми магнезий, подсилени с витамин D3, B6, цинк и калий. За мозък, сън и възстановяване.",
};

const keyPoints = [
  "6 високобиодостъпни форми магнезий",
  "Magnesium Bisglycinate TRAACS®",
  "Magnesium L-Threonate",
  "Витамин D3, витамин B6 (P-5-P), цинк и калий",
];

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <span className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
        {eyebrow}
      </span>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-navy-500">
        {title}
      </h2>
    </div>
  );
}

export default function Neuromag6Page() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Container className="pt-8">
          <nav className="text-sm text-brand-navy-500/50">
            <Link href="/" className="hover:text-brand-navy-500">
              Начало
            </Link>{" "}
            / <span className="text-brand-navy-500">Neuromag 6™</span>
          </nav>
        </Container>

        {/* Top: gallery + purchase */}
        <Container className="grid gap-12 py-10 lg:grid-cols-2 lg:py-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductGallery slides={gallerySlides} />
          </div>

          <div>
            <Badge>Нов продукт</Badge>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-brand-navy-500 sm:text-5xl">
              Neuromag 6™
            </h1>
            <p className="mt-2 text-lg text-brand-navy-500/60">
              Premium 6-Form Magnesium System — Brain · Sleep · Recovery
            </p>

            <ul className="mt-6 space-y-2.5">
              {keyPoints.map((point) => (
                <CheckItem key={point}>{point}</CheckItem>
              ))}
            </ul>

            <div id="kupi" className="mt-8">
              <PurchaseBox />
            </div>
          </div>
        </Container>

        {/* Why Neuromag 6 / Function */}
        <section className="bg-brand-sky-50 py-20">
          <Container>
            <SectionHeading eyebrow="Механизъм" title="Как работи Neuromag 6" />
            <FunctionSection />
          </Container>
        </section>

        {/* Ingredients */}
        <section className="py-20">
          <Container>
            <SectionHeading eyebrow="Прозрачност" title="Съставки и дозировка" />
            <IngredientsTable />
          </Container>
        </section>

        {/* How to use */}
        <section className="bg-brand-sky-50 py-20">
          <Container>
            <SectionHeading eyebrow="Употреба" title="Как да приемате Neuromag 6" />
            <HowToUse />
          </Container>
        </section>

        {/* Clinical research */}
        <section className="py-20">
          <Container>
            <SectionHeading
              eyebrow="Научна основа"
              title="Проучванията зад формулата"
            />
            <ClinicalResearch />
          </Container>
        </section>

        {/* FAQ */}
        <section className="bg-brand-sky-50 py-20">
          <Container>
            <SectionHeading eyebrow="Въпроси" title="Често задавани въпроси" />
            <UsageFaq />
          </Container>
        </section>
      </main>
      <StickyBuyBar targetId="kupi" />
      <Footer />
    </>
  );
}
