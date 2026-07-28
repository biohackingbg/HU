"use client";

import { useEffect, useRef } from "react";

const ENTER_AT = 0.92; // fraction of viewport height where reveal starts
const DONE_AT = 0.45; // fraction of viewport height where reveal completes
const MIN_OPACITY = 0.3;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Section eyebrow/title/intro block. Opacity is a continuous function of the
 * element's scroll position — it fades in as the section approaches the
 * upper viewport and fades back out on scroll-up, rather than firing once.
 * Respects prefers-reduced-motion.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  light = false,
  className = "",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  light?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let ticking = false;
    function update() {
      ticking = false;
      const rect = el!.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = clamp(
        (ENTER_AT * vh - rect.top) / ((ENTER_AT - DONE_AT) * vh),
        0,
        1,
      );
      const opacity = MIN_OPACITY + (1 - MIN_OPACITY) * progress;
      el!.style.setProperty("--reveal", opacity.toFixed(3));
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
  }, []);

  return (
    <div ref={ref} className={`mb-12 max-w-2xl ${className}`}>
      <span
        style={{ opacity: "var(--reveal, 1)" }}
        className={`block font-display text-sm font-semibold uppercase tracking-wider transition-opacity duration-100 ease-out ${
          light ? "text-brand-sky-300" : "text-brand-sky-600"
        }`}
      >
        {eyebrow}
      </span>
      <h2
        style={{ opacity: "var(--reveal, 1)" }}
        className={`mt-2 font-display text-3xl font-bold tracking-tight transition-opacity duration-100 ease-out sm:text-4xl ${
          light ? "text-white" : "text-brand-navy-500"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p
          style={{ opacity: "var(--reveal, 1)" }}
          className={`mt-4 text-lg leading-relaxed transition-opacity duration-100 ease-out ${
            light ? "text-white/70" : "text-brand-navy-500/70"
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
