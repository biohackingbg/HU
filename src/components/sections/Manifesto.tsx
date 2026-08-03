import { Container } from "@/components/ui/Container";
import { CapsuleParallax } from "@/components/sections/CapsuleParallax";
import { Reveal } from "@/components/ui/Reveal";

export function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-brand-navy-500 py-24 lg:py-32">
      <CapsuleParallax />
      <Container className="relative z-10 max-w-4xl text-center">
        <Reveal>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Upgrade Your System.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-8 text-xl leading-relaxed text-brand-sky-300 sm:text-2xl">
            Your body isn&apos;t one organ. It&apos;s a collection of systems.
            <br className="hidden sm:block" /> Optimize every system.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
