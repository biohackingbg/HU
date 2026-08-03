"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Thin accent-colored bar fixed to the top of the viewport, scaled
 * horizontally to reflect how far the page has been scrolled — like the
 * one at the top of motionpotion.co's nav.
 */
export function ScrollProgressBar() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    function update() {
      ticking = false;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      bar!.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
      bar!.style.opacity = window.scrollY > 24 ? "1" : "0";
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-[#0088FF] opacity-0 transition-opacity duration-200"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
