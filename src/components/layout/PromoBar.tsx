"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const STORAGE_PREFIX = "hu_promo_dismissed:";

export function PromoBar({
  enabled,
  text,
}: {
  enabled: boolean;
  text: string;
}) {
  const pathname = usePathname();
  // Starts visible so the bar is present in the server-rendered HTML and the
  // markup matches on hydration; the effect hides it again if this exact
  // message was already dismissed on this device.
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_PREFIX + text) === "1") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDismissed(true);
      }
    } catch {
      // storage unavailable (private mode) — leave the bar visible
    }
  }, [text]);

  if (pathname?.startsWith("/admin")) return null;
  if (!enabled || !text || dismissed) return null;

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_PREFIX + text, "1");
    } catch {
      // ignore storage errors (private mode, quota, etc.)
    }
    setDismissed(true);
  }

  return (
    <div className="relative flex items-center justify-center gap-3 bg-brand-navy-500 px-10 py-2.5 text-center text-sm font-medium text-white">
      <span className="text-[#0088FF]" aria-hidden="true">
        ✦
      </span>
      <span>{text}</span>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Затвори лентата"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/60 transition-colors hover:text-white"
      >
        ×
      </button>
    </div>
  );
}
