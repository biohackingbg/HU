"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

export function CartButton() {
  const { count, ready } = useCart();

  return (
    <Link
      href="/kolichka"
      aria-label={`Количка${ready && count ? ` (${count})` : ""}`}
      className="relative rounded-full p-2 text-brand-navy-500/70 transition-colors hover:bg-brand-navy-500/5 hover:text-brand-navy-500"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
        <path
          d="M4 5h2l1.4 10.3a1.5 1.5 0 0 0 1.5 1.3h7.6a1.5 1.5 0 0 0 1.5-1.2L20 8H7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9.5" cy="20" r="1.3" fill="currentColor" />
        <circle cx="17.5" cy="20" r="1.3" fill="currentColor" />
      </svg>
      {ready && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-navy-500 px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
