import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import {
  BetaNotice,
  Biomarkers,
  BloodFaq,
  BloodHero,
  HowItWorks,
  Plans,
} from "@/components/blood/BloodSections";
import { WaitlistForm } from "@/components/blood/WaitlistForm";
import { bloodMeta } from "@/lib/blood";

export const metadata: Metadata = {
  title: "Blood Levels — кръвни изследвания у дома | Health Upgrade",
  description: `Кръвен тест у дома по ${bloodMeta.markerCount} ключови показателя, с обяснения на разбираем език и персонализирани препоръки. В разработка.`,
};

export default function BloodPage() {
  return (
    <>
      <Navbar />
      <BetaNotice />
      <main className="flex-1">
        <BloodHero />
        <HowItWorks />
        <Biomarkers />
        <Plans />

        {/* Waitlist */}
        <section
          id="interes"
          className="scroll-mt-24 bg-brand-navy-500 py-20 lg:py-24"
        >
          <Container className="flex flex-col items-center text-center">
            <span className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-300">
              Ранен достъп
            </span>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Бъди сред първите, които ще тестват
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-white/70">
              Услугата е в процес на разработка с партньорска лаборатория.
              Остави имейл и ще те уведомим при пускането.
            </p>
            <div className="mt-8 flex justify-center">
              <WaitlistForm />
            </div>
          </Container>
        </section>

        <BloodFaq />
      </main>
      <Footer />
    </>
  );
}
