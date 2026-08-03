import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Забравена парола | Health Upgrade",
  description: "Заяви връзка за възстановяване на паролата на акаунта си.",
};

export default async function ForgotPasswordPage() {
  if (await getCurrentUser()) redirect("/akaunt");

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Container className="flex justify-center py-16 lg:py-24">
          <div className="w-full max-w-md">
            <div className="text-center">
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-brand-navy-500">
                Забравена парола
              </h1>
              <p className="mt-2 text-brand-navy-500/60">
                Въведи имейла си и ще ти изпратим връзка за възстановяване.
              </p>
            </div>

            <div className="mt-8 rounded-3xl border border-brand-navy-500/10 bg-white p-6 shadow-sm sm:p-8">
              <ForgotPasswordForm />
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
