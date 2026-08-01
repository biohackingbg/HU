"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { systems } from "@/lib/systems";

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Затвори менюто" : "Отвори менюто"}
        aria-expanded={open}
        className="rounded-full p-2 text-brand-navy-500/70 transition-colors hover:bg-brand-navy-500/5 hover:text-brand-navy-500"
      >
        <HamburgerIcon open={open} />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Затвори менюто"
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-20 z-40 bg-brand-navy-500/20 backdrop-blur-[1px]"
          />
          <div className="fixed inset-x-0 top-20 z-40 max-h-[calc(100vh-5rem)] overflow-y-auto border-b border-brand-navy-500/10 bg-white shadow-lg">
            <div className="px-5 py-6">
              <span className="font-display text-xs font-semibold uppercase tracking-wider text-brand-sky-600">
                Upgrade Your System
              </span>
              <ul className="mt-3 space-y-1">
                {systems.map((system) =>
                  system.status === "live" && system.href ? (
                    <li key={system.slug}>
                      <Link
                        href={system.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-brand-navy-500 transition-colors hover:bg-brand-sky-50"
                      >
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-sky-500"
                        />
                        {system.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={system.slug}>
                      <span className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-brand-navy-500/35">
                        <span className="flex items-center gap-2.5">
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 shrink-0 rounded-full border border-brand-navy-500/25"
                          />
                          {system.label}
                        </span>
                        <span className="text-xs">Скоро</span>
                      </span>
                    </li>
                  ),
                )}
              </ul>

              <div className="mt-5 space-y-1 border-t border-brand-navy-500/8 pt-5">
                <Link
                  href="/blood"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-brand-navy-500/80 hover:bg-brand-sky-50"
                >
                  Blood Levels
                </Link>
                <Link
                  href="/sustavki"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-brand-navy-500/80 hover:bg-brand-sky-50"
                >
                  Съставки
                </Link>
                <Link
                  href="/vhod"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-brand-navy-500/80 hover:bg-brand-sky-50"
                >
                  Вход и профил
                </Link>
              </div>

              <Link
                href="/test"
                onClick={() => setOpen(false)}
                className="mt-5 flex items-center justify-center rounded-full border border-brand-navy-500/15 bg-white px-6 py-3 text-sm font-semibold text-brand-navy-500 transition-colors hover:border-brand-navy-500/40"
              >
                Направи теста
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
