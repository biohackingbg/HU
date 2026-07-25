"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { CheckItem } from "@/components/ui/CheckItem";
import { hydra, hydraFlavors } from "@/lib/hydra";

export function HydraProductTop() {
  const [flavorIndex, setFlavorIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  const flavor = hydraFlavors[flavorIndex];
  const image = flavor.images[imageIndex] ?? flavor.images[0];

  function selectFlavor(i: number) {
    setFlavorIndex(i);
    setImageIndex(0);
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      {/* Gallery */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-brand-sky-50">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-contain p-6"
          />
        </div>

        {flavor.images.length > 1 && (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {flavor.images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setImageIndex(i)}
                aria-label={`Покажи изображение ${i + 1}`}
                aria-current={i === imageIndex}
                className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-brand-sky-50 transition-colors ${
                  i === imageIndex
                    ? "border-brand-navy-500"
                    : "border-transparent hover:border-brand-navy-500/20"
                }`}
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-contain p-1.5"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        <Badge>Очаквайте скоро</Badge>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-brand-navy-500 sm:text-5xl">
          {hydra.name}
        </h1>
        <p className="mt-2 text-lg text-brand-navy-500/60">
          {hydra.subtitle} — {hydra.tagline}
        </p>

        <ul className="mt-6 space-y-2.5">
          {hydra.keyPoints.map((point) => (
            <CheckItem key={point}>{point}</CheckItem>
          ))}
        </ul>

        {/* Flavor selector */}
        <div className="mt-8">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-navy-500/50">
            Вкус
          </span>
          <div className="mt-3 flex flex-wrap gap-3">
            {hydraFlavors.map((f, i) => (
              <button
                key={f.id}
                type="button"
                onClick={() => selectFlavor(i)}
                className={`flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm transition-colors ${
                  i === flavorIndex
                    ? "border-brand-navy-500 bg-brand-sky-50"
                    : "border-brand-navy-500/15 hover:border-brand-navy-500/30"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-4 w-4 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: f.swatch }}
                />
                <span className="font-semibold text-brand-navy-500">
                  {f.name}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-brand-navy-500/55">{flavor.note}</p>
        </div>

        {/* Coming soon state */}
        <div className="mt-8 rounded-3xl border border-brand-navy-500/10 bg-brand-sky-50 p-6">
          <p className="font-display font-bold text-brand-navy-500">
            Очаквайте скоро
          </p>
          <p className="mt-1 text-sm leading-relaxed text-brand-navy-500/70">
            Hydra+ е в процес на финализиране. {hydra.scoops} дози на опаковка ·{" "}
            {hydra.netWeight}. Все още не приемаме поръчки за този продукт.
          </p>
        </div>
      </div>
    </div>
  );
}
