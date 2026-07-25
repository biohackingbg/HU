import { Container } from "@/components/ui/Container";

export function Manifesto() {
  return (
    <section className="bg-brand-navy-500 py-24 lg:py-32">
      <Container className="max-w-4xl text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Upgrade Your System.
        </h2>
        <p className="mt-8 text-xl leading-relaxed text-white/70 sm:text-2xl">
          Your body isn&apos;t one organ. It&apos;s a collection of systems.
          <br className="hidden sm:block" /> Optimize every system.
        </p>
      </Container>
    </section>
  );
}
