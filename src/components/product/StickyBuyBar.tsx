"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { formatEur, neuromag6 } from "@/lib/product";

export function StickyBuyBar({ targetId }: { targetId: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show once the purchase box has scrolled above the viewport.
        setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [targetId]);

  function scrollToBuy() {
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-brand-navy-500/10 bg-white/95 backdrop-blur transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3 lg:px-10">
        <div className="relative hidden h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-brand-sky-50 sm:block">
          <Image
            src="/brand/neuromag6-jar.png"
            alt=""
            fill
            sizes="48px"
            className="object-contain p-1"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-bold text-brand-navy-500">
            Neuromag 6™
          </p>
          <p className="text-xs text-brand-navy-500/60">
            от {formatEur(neuromag6.priceSubscribe)} · абонамент
          </p>
        </div>
        <Button onClick={scrollToBuy} className="shrink-0 !px-6 !py-2.5">
          Добави в количката
        </Button>
      </div>
    </div>
  );
}
