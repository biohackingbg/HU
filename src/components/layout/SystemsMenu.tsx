import Link from "next/link";
import { systems } from "@/lib/systems";

export function SystemsMenu() {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-brand-navy-500/70 marker:content-none [&::-webkit-details-marker]:hidden hover:text-brand-navy-500">
        Системи
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className="h-3.5 w-3.5 transition-transform group-open:rotate-180"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>

      <div className="absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-3">
        <div className="rounded-2xl border border-brand-navy-500/10 bg-white p-5 shadow-xl">
          <span className="font-display text-xs font-semibold uppercase tracking-wider text-brand-sky-600">
            Upgrade Your System
          </span>
          <ul className="mt-3 space-y-1">
            {systems.map((system) =>
              system.status === "live" && system.href ? (
                <li key={system.slug}>
                  <Link
                    href={system.href}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-brand-navy-500 transition-colors hover:bg-brand-sky-50"
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
                  <span className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-brand-navy-500/35">
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
        </div>
      </div>
    </details>
  );
}
