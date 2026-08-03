import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Създай акаунт | Health Upgrade",
  description:
    "Създай акаунт в Health Upgrade, за да следиш поръчките и абонаментите си.",
};

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/akaunt");

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Container className="flex justify-center py-16 lg:py-24">
          <div className="w-full max-w-md">
            <div className="text-center">
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-brand-navy-500">
                Създай акаунт
              </h1>
              <p className="mt-2 text-brand-navy-500/60">
                Проследявай поръчки, управлявай абонаменти и пазарувай
                по-бързо.
              </p>
            </div>

            <div className="mt-8 rounded-3xl border border-brand-navy-500/10 bg-white p-6 shadow-sm sm:p-8">
              <RegisterForm />
            </div>

            <p className="mt-6 text-center text-sm text-brand-navy-500/50">
              <Link href="/" className="hover:text-brand-navy-500">
                ← Обратно към началото
              </Link>
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
