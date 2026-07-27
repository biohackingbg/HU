import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { HydraProductTop } from "@/components/hydra/HydraProductTop";
import {
  CleanLabelSection,
  DehydrationSection,
  DifferenceSection,
  HowToUseSection,
  HydraFaqSection,
  WhatsInsideSection,
  WhoForSection,
  WhyHydra,
} from "@/components/hydra/HydraSections";
import { SystemLineup } from "@/components/sections/SystemLineup";

export const metadata: Metadata = {
  title: "Hydra+ — Daily Hydration System | Health Upgrade",
  description:
    "Hydra+ помага да възстановиш основните електролити — натрий, калий и магнезий — с чиста, премиум формула без захар. Ежедневна хидратация за тяло и ум.",
};

export default function HydraPlusPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Container className="pt-8">
          <nav className="text-sm text-brand-navy-500/50">
            <Link href="/" className="hover:text-brand-navy-500">
              Начало
            </Link>{" "}
            / <span className="text-brand-navy-500">Hydra+</span>
          </nav>
        </Container>

        <Container className="py-10 lg:py-14">
          <HydraProductTop />
        </Container>

        <WhyHydra />
        <DehydrationSection />
        <DifferenceSection />
        <WhoForSection />
        <WhatsInsideSection />
        <HowToUseSection />
        <CleanLabelSection />
        <SystemLineup currentSlug="hydration" />
        <HydraFaqSection />
      </main>
      <Footer />
    </>
  );
}
