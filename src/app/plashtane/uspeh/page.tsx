import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Благодарим за поръчката | Health Upgrade",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ n?: string }>;
}) {
  const { n } = await searchParams;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Container className="flex justify-center py-20 lg:py-28">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                <path
                  d="M5 12.5l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-brand-navy-500">
              Благодарим за поръчката!
            </h1>
            {n && (
              <p className="mt-3 text-brand-navy-500/70">
                Номер на поръчката:{" "}
                <span className="font-semibold text-brand-navy-500">№{n}</span>
              </p>
            )}
            <p className="mt-3 leading-relaxed text-brand-navy-500/70">
              Изпратихме потвърждение и ще те уведомим, когато пратката бъде
              изпратена. Можеш да проследиш поръчката си в акаунта.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/akaunt/porachki"
                className="rounded-full bg-brand-navy-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-navy-700"
              >
                Моите поръчки
              </Link>
              <Link
                href="/"
                className="rounded-full border border-brand-navy-500/15 px-6 py-3 text-sm font-semibold text-brand-navy-500 hover:border-brand-navy-500/40"
              >
                Към началото
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
