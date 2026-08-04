"use client";

import { usePathname } from "next/navigation";

/**
 * Sitewide announcement bar. Always visible while enabled in admin —
 * visitors cannot dismiss it. Hidden on admin screens.
 */
export function PromoBar({
  enabled,
  text,
}: {
  enabled: boolean;
  text: string;
}) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;
  if (!enabled || !text) return null;

  return (
    <div className="flex items-center justify-center gap-3 bg-brand-navy-500 px-6 py-2.5 text-center text-sm font-medium text-white">
      <span className="text-[#0088FF]" aria-hidden="true">
        ✦
      </span>
      <span>{text}</span>
    </div>
  );
}
