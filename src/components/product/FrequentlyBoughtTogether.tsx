"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { catalogEntry } from "@/lib/catalog";
import { bundleCompanions } from "@/lib/bundles";
import { formatCentsEur } from "@/lib/orders";

type Props = {
  productSlug: string;
  catalogKey: string;
  name: string;
  variantLabel: string;
  imageUrl: string;
};

export function FrequentlyBoughtTogether({
  productSlug,
  catalogKey,
  name,
  variantLabel,
  imageUrl,
}: Props) {
  const companions = bundleCompanions[productSlug] ?? [];
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const availableCompanions = companions.filter((c) => c.catalogKey);
  const [checked, setChecked] = useState<Set<string>>(
    () => new Set(availableCompanions.map((c) => c.productSlug)),
  );

  if (companions.length === 0) return null;

  const baseEntry = catalogEntry(catalogKey);
  if (!baseEntry) return null;

  const selectedCompanions = availableCompanions.filter((c) =>
    checked.has(c.productSlug),
  );
  const totalCents =
    baseEntry.unitPriceCents +
    selectedCompanions.reduce((sum, c) => {
      const entry = catalogEntry(c.catalogKey!);
      return sum + (entry?.unitPriceCents ?? 0);
    }, 0);

  function toggle(slug: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function handleAdd() {
    add({
      id: catalogKey,
      productSlug,
      name,
      variantLabel,
      unitPriceCents: baseEntry!.unitPriceCents,
      imageUrl,
      recurring: baseEntry!.recurring,
    });
    for (const companion of selectedCompanions) {
      const entry = catalogEntry(companion.catalogKey!);
      if (!entry) continue;
      add({
        id: companion.catalogKey!,
        productSlug: companion.productSlug,
        name: companion.name,
        variantLabel: companion.variantLabel,
        unitPriceCents: entry.unitPriceCents,
        imageUrl: companion.imageUrl,
        recurring: entry.recurring,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const allItems = [
    { slug: productSlug, name, variantLabel, imageUrl, locked: true },
    ...companions.map((c) => ({
      slug: c.productSlug,
      name: c.name,
      variantLabel: c.variantLabel,
      imageUrl: c.imageUrl,
      locked: false,
      companion: c,
    })),
  ];

  return (
    <div className="rounded-3xl border border-brand-navy-500/10 bg-white p-6 sm:p-8">
      <span className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
        Купени заедно
      </span>
      <h3 className="mt-1.5 font-display text-xl font-extrabold text-brand-navy-500">
        Изгради своята система
      </h3>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {allItems.map((item, i) => (
          <div key={item.slug} className="flex items-center gap-3">
            {i > 0 && (
              <span className="text-xl font-light text-brand-navy-500/30">
                +
              </span>
            )}
            <div
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-brand-sky-50 ${
                "companion" in item && item.companion && !item.companion.catalogKey
                  ? "opacity-40"
                  : ""
              }`}
            >
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="64px"
                className="object-contain p-1.5"
              />
            </div>
          </div>
        ))}
      </div>

      <ul className="mt-6 space-y-3 border-t border-brand-navy-500/8 pt-5">
        {allItems.map((item) => {
          const companion = "companion" in item ? item.companion : undefined;
          const isUnavailable = companion && !companion.catalogKey;
          const isChecked = item.locked || checked.has(item.slug);
          const priceCents = item.locked
            ? baseEntry.unitPriceCents
            : companion?.catalogKey
              ? (catalogEntry(companion.catalogKey)?.unitPriceCents ?? 0)
              : null;

          return (
            <li key={item.slug} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isChecked}
                disabled={item.locked || isUnavailable}
                onChange={() => companion && toggle(item.slug)}
                aria-label={`Включи ${item.name}`}
                className="h-4 w-4 shrink-0 rounded border-brand-navy-500/30 text-brand-navy-500 accent-brand-navy-500 disabled:opacity-40"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-brand-navy-500">
                  {item.name}
                  {item.locked && (
                    <span className="ml-2 text-xs font-normal text-brand-navy-500/40">
                      (в тази поръчка)
                    </span>
                  )}
                </p>
                <p className="truncate text-xs text-brand-navy-500/50">
                  {item.variantLabel}
                </p>
              </div>
              {isUnavailable ? (
                <span className="shrink-0 rounded-full bg-brand-navy-500/5 px-2.5 py-1 text-xs font-medium text-brand-navy-500/50">
                  Очаквайте скоро
                </span>
              ) : (
                priceCents !== null && (
                  <span className="shrink-0 text-sm font-semibold text-brand-navy-500">
                    {formatCentsEur(priceCents)}
                  </span>
                )
              )}
              {companion && (
                <Link
                  href={companion.href}
                  className="shrink-0 text-xs font-medium text-brand-sky-600 hover:underline"
                >
                  Виж
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-brand-navy-500/8 pt-5">
        <div>
          <p className="text-xs text-brand-navy-500/50">Общо за избраните</p>
          <p className="font-display text-lg font-extrabold text-brand-navy-500">
            {formatCentsEur(totalCents)}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-full bg-brand-navy-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-500/90"
        >
          {added ? "Добавено ✓" : "Добави всички в количката"}
        </button>
      </div>
    </div>
  );
}
