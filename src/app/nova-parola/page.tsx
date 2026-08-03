import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Нова парола | Health Upgrade",
  description: "Задай нова парола за акаунта си.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Container className="flex justify-center py-16 lg:py-24">
          <div className="w-full max-w-md">
            <div className="text-center">
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-brand-navy-500">
                Нова парола
              </h1>
              <p className="mt-2 text-brand-navy-500/60">
                Задай нова парола за акаунта си.
              </p>
            </div>

            <div className="mt-8 rounded-3xl border border-brand-navy-500/10 bg-white p-6 shadow-sm sm:p-8">
              {token ? (
                <ResetPasswordForm token={token} />
              ) : (
                <div className="space-y-4 text-center">
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    Липсва или невалидна връзка за възстановяване.
                  </p>
                  <Link
                    href="/zabravena-parola"
                    className="inline-block text-sm font-semibold text-brand-navy-500 underline"
                  >
                    Заяви нова връзка
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
