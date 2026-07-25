"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth";

const links = [
  { href: "/akaunt", label: "Преглед", exact: true },
  { href: "/akaunt/porachki", label: "Поръчки" },
  { href: "/akaunt/profil", label: "Профил" },
  { href: "/akaunt/adresi", label: "Адреси" },
];

export function AccountNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
            isActive(link.href, link.exact)
              ? "bg-brand-navy-500 text-white"
              : "text-brand-navy-500/70 hover:bg-brand-sky-50 hover:text-brand-navy-500"
          }`}
        >
          {link.label}
        </Link>
      ))}

      {isAdmin && (
        <Link
          href="/admin"
          className="mt-1 rounded-xl px-4 py-2.5 text-sm font-medium text-brand-sky-700 transition-colors hover:bg-brand-sky-50"
        >
          Админ панел
        </Link>
      )}

      <form action={logoutAction} className="mt-2">
        <button
          type="submit"
          className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-brand-navy-500/60 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          Изход
        </button>
      </form>
    </nav>
  );
}
