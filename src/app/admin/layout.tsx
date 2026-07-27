import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/vhod");

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-brand-navy-500/10 bg-white">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Health Upgrade — начало">
              <Logo className="h-7 w-auto" />
            </Link>
            <span className="rounded-full bg-brand-navy-500 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              Админ
            </span>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <Link
              href="/admin"
              className="font-medium text-brand-navy-500/70 hover:text-brand-navy-500"
            >
              Поръчки
            </Link>
            <Link
              href="/admin/otzivi"
              className="font-medium text-brand-navy-500/70 hover:text-brand-navy-500"
            >
              Отзиви
            </Link>
            <span className="hidden text-brand-navy-500/40 sm:inline">
              {admin.email}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="font-medium text-brand-navy-500/60 hover:text-red-600"
              >
                Изход
              </button>
            </form>
          </div>
        </Container>
      </header>

      <main className="flex-1 bg-brand-sky-50/40">
        <Container className="py-10">{children}</Container>
      </main>
    </div>
  );
}
