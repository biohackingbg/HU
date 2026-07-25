import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { AccountNav } from "@/components/account/AccountNav";
import { getCurrentUser, displayName } from "@/lib/auth";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/vhod");

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-sky-50/40">
        <Container className="py-12 lg:py-16">
          <div className="mb-8">
            <span className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
              Моят акаунт
            </span>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-brand-navy-500">
              Здравей, {displayName(user)}
            </h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <AccountNav isAdmin={user.role === "admin"} />
            </aside>
            <div className="min-w-0">{children}</div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
