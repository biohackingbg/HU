import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Вход | Health Upgrade",
  description: "Влез в акаунта си, за да следиш поръчките и абонаментите си.",
};

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/akaunt");

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Container className="flex justify-center py-16 lg:py-24">
          <div className="w-full max-w-md">
            <div className="text-center">
              <h1 className="font-display text-3xl font-bold tracking-tight text-brand-navy-500">
                Вход в акаунта
              </h1>
              <p className="mt-2 text-brand-navy-500/60">
                Следи поръчките и абонаментите си на едно място.
              </p>
            </div>

            <div className="mt-8 rounded-3xl border border-brand-navy-500/10 bg-white p-6 shadow-sm sm:p-8">
              <LoginForm />
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
