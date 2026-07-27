import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { SystemsMenu } from "@/components/layout/SystemsMenu";
import { CartButton } from "@/components/cart/CartButton";

const links = [
  { href: "/blood", label: "Blood" },
  { href: "/sustavki", label: "Съставки" },
];

function ProfileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <circle
        cx="12"
        cy="8"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M5 19c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-navy-500/8 bg-white/90 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="Health Upgrade — начало">
          <Logo className="h-11 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <SystemsMenu />
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-navy-500/70 transition-colors hover:text-brand-navy-500"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            href="/test"
            variant="secondary"
            className="hidden !px-5 !py-2.5 sm:inline-flex"
          >
            Направи теста
          </Button>

          <Link
            href="/vhod"
            aria-label="Вход и профил"
            className="rounded-full p-2 text-brand-navy-500/70 transition-colors hover:bg-brand-navy-500/5 hover:text-brand-navy-500"
          >
            <ProfileIcon />
          </Link>

          <CartButton />

          <Button href="/produkt/neuromag-6" className="!px-5 !py-2.5">
            Купи сега
          </Button>
        </div>
      </Container>
    </header>
  );
}
