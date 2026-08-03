"use client";

import type { CSSProperties } from "react";
import {
  REVEAL_EASE,
  REVEAL_STAGGER_MS,
  SplitWords,
  useRevealOnScroll,
  wordCount,
} from "@/components/ui/AnimatedHeading";

/**
 * Section eyebrow/title/intro block. The title reveals word-by-word through
 * a mask on scroll-in (once); eyebrow and intro fade/slide in alongside it.
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
  const { ref, visible, reducedMotion } = useRevealOnScroll<HTMLDivElement>();

  const fadeStyle = (delayMs: number): CSSProperties =>
    reducedMotion
      ? {}
      : {
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
          transition: `transform 600ms ${REVEAL_EASE}, opacity 600ms ${REVEAL_EASE}`,
          transitionDelay: `${delayMs}ms`,
        };

  const titleWordCount = wordCount(title);

  return (
    <div ref={ref} className={`mb-12 max-w-2xl ${className}`}>
      <span
        style={fadeStyle(0)}
        className={`block font-display text-sm font-semibold uppercase tracking-wider ${
          light ? "text-brand-sky-300" : "text-brand-sky-600"
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl ${
          light ? "text-white" : "text-brand-navy-500"
        }`}
      >
        <SplitWords
          text={title}
          visible={visible}
          reducedMotion={reducedMotion}
          startDelay={80}
        />
      </h2>
      {intro && (
        <p
          style={fadeStyle(80 + titleWordCount * REVEAL_STAGGER_MS + 100)}
          className={`mt-4 text-lg leading-relaxed ${
            light ? "text-white/70" : "text-brand-navy-500/70"
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
