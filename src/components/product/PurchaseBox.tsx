"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatBgn, formatEur, neuromag6 } from "@/lib/product";
import { useCart } from "@/components/cart/CartProvider";

type PurchaseMode = "subscribe" | "onetime";
const frequencies = ["Всеки месец", "На всеки 2 месеца", "На всеки 3 месеца"];

export function PurchaseBox() {
  const [mode, setMode] = useState<PurchaseMode>("subscribe");
  const [frequency, setFrequency] = useState(frequencies[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { add } = useCart();

  const unitPrice =
    mode === "subscribe" ? neuromag6.priceSubscribe : neuromag6.priceOneTime;
  const totalPrice = useMemo(() => unitPrice * quantity, [unitPrice, quantity]);

  function handleAddToBag() {
    const recurring = mode === "subscribe";
    const variantLabel = recurring
      ? `60 капсули · абонамент (${frequency.toLowerCase()})`
      : "60 капсули · еднократна покупка";
    add(
      {
        id: `neuromag-6:${mode}`,
        productSlug: "neuromag-6",
        name: "Neuromag 6™",
        variantLabel,
        unitPriceCents: Math.round(unitPrice * 100),
        imageUrl: "/brand/neuromag6-jar.png",
        recurring,
      },
      quantity,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="rounded-3xl border border-brand-navy-500/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setMode("subscribe")}
          className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
            mode === "subscribe"
              ? "border-brand-navy-500 bg-brand-sky-50"
              : "border-brand-navy-500/15 hover:border-brand-navy-500/30"
          }`}
        >
          <span className="block text-xs font-semibold uppercase tracking-wide text-brand-sky-600">
            Абонамент · -{neuromag6.subscribeDiscountPct}%
          </span>
          <span className="mt-1 block font-display text-lg font-bold text-brand-navy-500">
            {formatEur(neuromag6.priceSubscribe)}
          </span>
          <span className="block text-xs text-brand-navy-500/50">
            ({formatBgn(neuromag6.priceSubscribe)})
          </span>
        </button>

        <button
          type="button"
          onClick={() => setMode("onetime")}
          className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
            mode === "onetime"
              ? "border-brand-navy-500 bg-brand-sky-50"
              : "border-brand-navy-500/15 hover:border-brand-navy-500/30"
          }`}
        >
          <span className="block text-xs font-semibold uppercase tracking-wide text-brand-navy-500/50">
            Еднократна покупка
          </span>
          <span className="mt-1 block font-display text-lg font-bold text-brand-navy-500">
            {formatEur(neuromag6.priceOneTime)}
          </span>
          <span className="block text-xs text-brand-navy-500/50">
            ({formatBgn(neuromag6.priceOneTime)})
          </span>
        </button>
      </div>

      {mode === "subscribe" && (
        <div className="mt-4">
          <label className="block text-xs font-semibold uppercase tracking-wide text-brand-navy-500/50">
            Доставка
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {frequencies.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFrequency(f)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  frequency === f
                    ? "border-brand-navy-500 bg-brand-navy-500 text-white"
                    : "border-brand-navy-500/15 text-brand-navy-500/70 hover:border-brand-navy-500/30"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <ul className="mt-4 space-y-1.5 text-sm text-brand-navy-500/60">
            <li>· Отказ или промяна на датата по всяко време</li>
            <li>· Гарантирана наличност за абонатите</li>
            <li>· -{neuromag6.subscribeDiscountPct}% за всяка следваща доставка</li>
          </ul>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center rounded-full border border-brand-navy-500/15">
          <button
            type="button"
            aria-label="Намали количеството"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-lg text-brand-navy-500/60 hover:text-brand-navy-500"
          >
            −
          </button>
          <span className="min-w-6 text-center font-semibold text-brand-navy-500">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Увеличи количеството"
            onClick={() => setQuantity((q) => Math.min(6, q + 1))}
            className="px-3 py-2 text-lg text-brand-navy-500/60 hover:text-brand-navy-500"
          >
            +
          </button>
        </div>

        <Button onClick={handleAddToBag} className="flex-1 !py-3.5">
          {added
            ? "Добавено ✓"
            : `Добави в количката · ${formatEur(totalPrice)}`}
        </Button>
      </div>

      <ul className="mt-5 grid gap-2 border-t border-brand-navy-500/8 pt-4 text-xs text-brand-navy-500/60">
        <li className="flex items-center gap-2">
          <TrustCheck />
          Безплатна доставка над 60 € · 60 растителни капсули на буркан
        </li>
        <li className="flex items-center gap-2">
          <TrustCheck />
          14-дневно право на отказ на незапечатан продукт
        </li>
        <li className="flex items-center gap-2">
          <TrustCheck />
          Само здравни твърдения, одобрени от EFSA
        </li>
      </ul>
    </div>
  );
}

function TrustCheck() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="h-3.5 w-3.5 shrink-0 text-brand-sky-600"
    >
      <path
        d="M4 10.5l3.5 3.5L16 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
