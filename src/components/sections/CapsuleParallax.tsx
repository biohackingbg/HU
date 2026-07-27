"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * Decorative capsules that drift at different rates as the section scrolls
 * through the viewport (parallax). Respects prefers-reduced-motion.
 */
type Capsule = {
  top: string;
  left: string;
  width: string;
  rotate: number;
  /** Parallax strength — higher moves more (front layers). */
  speed: number;
  opacity: number;
  /** Depth-of-field blur in px (back layers are softer). */
  blur: number;
};

// Ordered back → front so nearer capsules paint on top.
const capsules: Capsule[] = [
  // Back layer: soft, slow, one drifts under the text for depth.
  { top: "40%", left: "43%", width: "clamp(90px, 13vw, 190px)", rotate: -18, speed: 0.1, opacity: 0.4, blur: 8 },
  { top: "18%", left: "70%", width: "clamp(38px, 6vw, 78px)", rotate: 26, speed: 0.16, opacity: 0.55, blur: 4 },
  // Mid layer.
  { top: "15%", left: "18%", width: "clamp(52px, 8vw, 118px)", rotate: -40, speed: 0.4, opacity: 0.92, blur: 1.5 },
  { top: "24%", left: "84%", width: "clamp(44px, 7vw, 102px)", rotate: 14, speed: 0.46, opacity: 0.92, blur: 1 },
  // Front layer: sharp, larger, faster, strong shadow.
  { top: "6%", left: "3%", width: "clamp(52px, 8vw, 112px)", rotate: -12, speed: 0.9, opacity: 1, blur: 0 },
  { top: "63%", left: "23%", width: "clamp(66px, 11vw, 156px)", rotate: 42, speed: 1, opacity: 1, blur: 0 },
  { top: "61%", left: "78%", width: "clamp(54px, 9vw, 128px)", rotate: 58, speed: 0.86, opacity: 1, blur: 0 },
];

export function CapsuleParallax() {
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 as the section enters from the bottom → 1 as it leaves the top.
      const progress = (vh - rect.top) / (vh + rect.height);
      const centered = progress - 0.5;

      capsules.forEach((c, i) => {
        const el = itemRefs.current[i];
        if (!el) return;
        const ty = centered * c.speed * 260;
        el.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0) rotate(${c.rotate}deg)`;
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {capsules.map((c, i) => (
        <div
          key={i}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          className="absolute select-none will-change-transform"
          style={{
            top: c.top,
            left: c.left,
            width: c.width,
            opacity: c.opacity,
            transform: `rotate(${c.rotate}deg)`,
          }}
        >
          <Image
            src="/brand/capsule.png"
            alt=""
            width={1024}
            height={1536}
            sizes="190px"
            className="h-auto w-full"
            style={{
              filter: c.blur
                ? `blur(${c.blur}px) drop-shadow(0 10px 18px rgba(0,0,0,0.25))`
                : "drop-shadow(0 22px 38px rgba(0,0,0,0.45))",
            }}
          />
        </div>
      ))}
    </div>
  );
}
