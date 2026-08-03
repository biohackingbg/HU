"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  shippingCents,
} from "@/lib/checkout-config";
import { formatCentsBgn, formatCentsEur } from "@/lib/orders";

export function CartView() {
  const { items, subtotalCents, setQuantity, remove, ready } = useCart();

  if (!ready) {
    return <p className="text-brand-navy-500/50">Зареждане…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-brand-navy-500/10 bg-white p-10 text-center">
        <p className="text-lg text-brand-navy-500/60">Количката ти е празна.</p>
        <Link
          href="/produkt/neuromag-6"
          className="mt-5 inline-flex rounded-full bg-brand-navy-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-navy-700"
        >
          Разгледай продуктите
        </Link>
      </div>
    );
  }

  const shipping = shippingCents(subtotalCents);
  const total = subtotalCents + shipping;
  const toFreeShipping = FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Items */}
      <ul className="divide-y divide-brand-navy-500/8 rounded-3xl border border-brand-navy-500/10 bg-white px-6">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4 py-6">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-sky-50">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="80px"
                className="object-contain p-1.5"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-brand-navy-500">{item.name}</p>
                  <p className="text-sm text-brand-navy-500/55">
                    {item.variantLabel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="text-sm text-brand-navy-500/40 hover:text-red-600"
                >
                  Премахни
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center rounded-full border border-brand-navy-500/15">
                  <button
                    type="button"
                    aria-label="Намали"
                    onClick={() => setQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1.5 text-brand-navy-500/60 hover:text-brand-navy-500"
                  >
                    −
                  </button>
                  <span className="min-w-6 text-center text-sm font-semibold text-brand-navy-500">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Увеличи"
                    onClick={() => setQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1.5 text-brand-navy-500/60 hover:text-brand-navy-500"
                  >
                    +
                  </button>
                </div>
                <p className="font-semibold text-brand-navy-500">
                  {formatCentsEur(item.unitPriceCents * item.quantity)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Summary */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-3xl border border-brand-navy-500/10 bg-white p-6">
          <h2 className="font-display font-extrabold text-brand-navy-500">Обобщение</h2>

          {shipping > 0 && toFreeShipping > 0 && (
            <p className="mt-3 rounded-xl bg-brand-sky-50 px-4 py-3 text-sm text-brand-navy-500/70">
              Добави още {formatCentsEur(toFreeShipping)} за безплатна доставка.
            </p>
          )}

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-navy-500/60">Междинна сума</dt>
              <dd className="text-brand-navy-500">
                {formatCentsEur(subtotalCents)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-navy-500/60">Доставка</dt>
              <dd className="text-brand-navy-500">
                {shipping === 0 ? "Безплатна" : formatCentsEur(shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-brand-navy-500/8 pt-2 text-base font-semibold">
              <dt className="text-brand-navy-500">Общо</dt>
              <dd className="text-brand-navy-500">
                {formatCentsEur(total)}{" "}
                <span className="text-xs font-normal text-brand-navy-500/45">
                  ({formatCentsBgn(total)})
                </span>
              </dd>
            </div>
          </dl>

          <Link
            href="/plashtane"
            className="mt-6 flex w-full items-center justify-center rounded-full bg-brand-navy-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-700"
          >
            Към плащане
          </Link>
          <p className="mt-3 text-center text-xs text-brand-navy-500/45">
            Доставката е ориентировъчна. Крайната цена се изчислява при плащане.
          </p>
        </div>
      </div>
    </div>
  );
}
