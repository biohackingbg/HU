"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

export const REVEAL_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
export const REVEAL_STAGGER_MS = 45;
export const REVEAL_DURATION_MS = 700;

/**
 * Splits text into words, each masked in an overflow-hidden box so it can
 * slide up from below the baseline without clipping descenders. Words
 * animate in with a per-word stagger, like a title on motionpotion.co.
 */
export function SplitWords({
  text,
  visible,
  reducedMotion,
  startDelay = 0,
  wordOffset = 0,
}: {
  text: string;
  visible: boolean;
  reducedMotion: boolean;
  startDelay?: number;
  /** How many words came before this call, for continuing a stagger across lines. */
  wordOffset?: number;
}) {
  const words = text.split(" ");
  const nodes: ReactNode[] = [];

  words.forEach((word, i) => {
    const innerStyle: CSSProperties = reducedMotion
      ? {}
      : {
          transform: visible ? "translateY(0)" : "translateY(115%)",
          opacity: visible ? 1 : 0,
          transition: `transform ${REVEAL_DURATION_MS}ms ${REVEAL_EASE}, opacity ${REVEAL_DURATION_MS}ms ${REVEAL_EASE}`,
          transitionDelay: `${startDelay + (wordOffset + i) * REVEAL_STAGGER_MS}ms`,
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

/** Word count helper, so callers can continue a stagger after a SplitWords line. */
export function wordCount(text: string) {
  return text.split(" ").length;
}

/** Fires once when the element scrolls into view; respects prefers-reduced-motion. */
export function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
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

  return { ref, visible, reducedMotion };
}

/**
 * Drop-in heading with the same word-by-word mask reveal as SectionHeading,
 * for standalone h1/h2 titles outside that component (hero, PDP, etc).
 * Pass `lines` for a heading with a forced line break; the stagger carries
 * on continuously across lines.
 */
export function AnimatedHeading({
  as = "h1",
  text,
  lines,
  className = "",
  startDelay = 0,
}: {
  as?: ElementType;
  text?: string;
  lines?: string[];
  className?: string;
  startDelay?: number;
}) {
  const { ref, visible, reducedMotion } = useRevealOnScroll<HTMLHeadingElement>();
  const Tag = as;
  const parts = lines ?? (text ? [text] : []);
  const offsets = parts.reduce<number[]>((acc, line, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + wordCount(parts[i - 1]));
    return acc;
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {parts.map((line, i) => (
        <span key={i}>
          <SplitWords
            text={line}
            visible={visible}
            reducedMotion={reducedMotion}
            startDelay={startDelay}
            wordOffset={offsets[i]}
          />
          {i < parts.length - 1 && <br />}
        </span>
      ))}
    </Tag>
  );
}
