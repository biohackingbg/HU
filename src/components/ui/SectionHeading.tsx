"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const STAGGER_MS = 45;
const DURATION_MS = 700;

/**
 * Splits text into words, each masked in an overflow-hidden box so it can
 * slide up from below the baseline without clipping descenders. Words
 * animate in with a per-word stagger, like a title on motionpotion.co.
 */
function SplitWords({
  text,
  visible,
  reducedMotion,
  startDelay = 0,
}: {
  text: string;
  visible: boolean;
  reducedMotion: boolean;
  startDelay?: number;
}) {
  const words = text.split(" ");
  const nodes: ReactNode[] = [];

  words.forEach((word, i) => {
    const innerStyle: CSSProperties = reducedMotion
      ? {}
      : {
          transform: visible ? "translateY(0)" : "translateY(115%)",
          opacity: visible ? 1 : 0,
          transition: `transform ${DURATION_MS}ms ${EASE}, opacity ${DURATION_MS}ms ${EASE}`,
          transitionDelay: `${startDelay + i * STAGGER_MS}ms`,
        };
    nodes.push(
      <span
        key={i}
        className="inline-block -mb-[0.18em] overflow-hidden pb-[0.18em] align-top"
      >
        <span className="inline-block" style={innerStyle}>
          {word}
        </span>
      </span>,
    );
    if (i < words.length - 1) nodes.push(" ");
  });

  return <>{nodes}</>;
}

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
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReducedMotion(true);
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const fadeStyle = (delayMs: number): CSSProperties =>
    reducedMotion
      ? {}
      : {
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
          transition: `transform 600ms ${EASE}, opacity 600ms ${EASE}`,
          transitionDelay: `${delayMs}ms`,
        };

  const titleWordCount = title.split(" ").length;

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
          style={fadeStyle(80 + titleWordCount * STAGGER_MS + 100)}
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
