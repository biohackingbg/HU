"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export type Slide = {
  id: string;
  content: ReactNode;
  thumb: ReactNode;
};

export function ProductGallery({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);
  const current = slides[active] ?? slides[0];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-brand-navy-500/8 bg-white">
        {current.content}
      </div>

      {slides.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Покажи изображение ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white transition-colors ${
                i === active
                  ? "border-brand-navy-500"
                  : "border-brand-navy-500/10 hover:border-brand-navy-500/30"
              }`}
            >
              {slide.thumb}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
