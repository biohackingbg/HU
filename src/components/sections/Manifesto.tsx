import { Container } from "@/components/ui/Container";
import { CapsuleParallax } from "@/components/sections/CapsuleParallax";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";

export function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-brand-navy-500 py-24 lg:py-32">
      <CapsuleParallax />
      <Container className="relative z-10 max-w-4xl text-center">
        <AnimatedHeading
          as="h2"
          text="Upgrade Your System."
          className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
        />
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
