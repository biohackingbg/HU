import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { BenefitsGrid } from "@/components/sections/BenefitsGrid";
import { Pillars } from "@/components/sections/Pillars";
import { TrustProof } from "@/components/sections/TrustProof";
import { ComingSoon } from "@/components/sections/ComingSoon";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Manifesto />
        <BenefitsGrid />
        <Pillars />
        <TrustProof />
        <ComingSoon />
      </main>
      <Footer />
    </>
  );
}
