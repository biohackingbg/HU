import type { ReactNode } from "react";

export function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-brand-navy-500 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white ${className}`}
    >
      {children}
    </span>
  );
}
