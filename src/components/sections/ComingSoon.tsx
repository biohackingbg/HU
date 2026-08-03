import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

export function ComingSoon() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <Link
          href="/produkt/hydra-plus"
          className="group grid items-center gap-10 rounded-3xl bg-brand-sky-50 p-8 transition-colors hover:bg-brand-sky-100 sm:p-12 lg:grid-cols-2"
        >
          <div className="order-2 lg:order-1">
            <Badge>Очаквайте скоро</Badge>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-brand-navy-500 sm:text-4xl">
              Hydra+
            </h2>
            <p className="mt-2 text-lg text-brand-navy-500/60">
              Hydrate. Recharge. Perform.
            </p>
            <p className="mt-4 max-w-md leading-relaxed text-brand-navy-500/70">
              Следващата формула на Health Upgrade — електролитен микс за
              хидратация и възстановяване, изграден на същите принципи за
              наука и качество.
            </p>
            <span className="mt-6 inline-block font-semibold text-brand-sky-600 group-hover:underline">
              Разбери повече →
            </span>
          </div>

          <div className="order-1 overflow-hidden rounded-2xl lg:order-2">
            <Image
              src="/brand/hydra-plus-front.png"
              alt="Health Upgrade Hydra+ — електролитна формула"
              width={1024}
              height={1024}
              className="h-auto w-full object-cover"
            />
          </div>
        </Link>
      </Container>
    </section>
  );
}
