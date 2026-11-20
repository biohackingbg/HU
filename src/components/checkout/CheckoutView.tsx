"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { placeOrder, previewPromoCode } from "@/lib/actions/checkout";
import { shippingCents, shippingMethods } from "@/lib/checkout-config";
import { formatCentsBgn, formatCentsEur } from "@/lib/orders";

type Errors = Record<string, string>;
type AppliedPromo = { code: string; percentOff: number; label: string };

/** Sends the browser to myPOS Checkout with the server-signed form. */
function submitToMypos(redirect: { url: string; fields: [string, string][] }) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = redirect.url;
  form.acceptCharset = "UTF-8";
  for (const [name, value] of redirect.fields) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

export function CheckoutView({
  cardEnabled,
  paymentCancelled,
  initialPromoCode,
}: {
  cardEnabled: boolean;
  paymentCancelled?: boolean;
  initialPromoCode?: string;
}) {
  const { items, subtotalCents, clear, ready } = useCart();
  const router = useRouter();

  const [shippingMethod, setShippingMethod] = useState(shippingMethods[0].id);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(
    paymentCancelled
      ? "Плащането беше прекъснато и не е таксувано. Можеш да опиташ отново или да избереш наложен платеж."
      : null,
  );
  const [pending, setPending] = useState(false);

  const [promoInput, setPromoInput] = useState(initialPromoCode ?? "");
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoPending, setPromoPending] = useState(false);
  const autoAppliedRef = useRef(false);

  async function applyPromo(code: string) {
    const trimmed = code.trim();
    if (!trimmed) return;
    setPromoPending(true);
    setPromoError(null);
    const result = await previewPromoCode(trimmed);
    setPromoPending(false);
    if (!result.ok || !result.percentOff || !result.label) {
      setAppliedPromo(null);
      setPromoError(result.error ?? "Невалиден промо код.");
      return;
    }
    setAppliedPromo({
      code: trimmed.toUpperCase(),
      percentOff: result.percentOff,
      label: result.label,
    });
  }

  // Auto-apply a code passed in via ?promo=, or one earned earlier (e.g. from
  // the quiz) and remembered in localStorage so it survives PDP → cart → here.
  useEffect(() => {
    if (autoAppliedRef.current) return;
    const stored = (() => {
      try {
        return localStorage.getItem("hu_quiz_promo");
      } catch {
        return null;
      }
    })();
    const code = initialPromoCode || stored;
    if (code) {
      autoAppliedRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      applyPromo(code);
    }
  }, [initialPromoCode]);

  if (!ready) return <p className="text-brand-navy-500/50">Зареждане…</p>;

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

  const discount = appliedPromo
    ? Math.round((subtotalCents * appliedPromo.percentOff) / 100)
    : 0;
  const shipping = shippingCents(subtotalCents - discount);
  const total = subtotalCents - discount + shipping;
  const needsAddress = shippingMethod === "econt_address";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setErrors({});
    setFormError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      firstName: String(fd.get("firstName") ?? ""),
      lastName: String(fd.get("lastName") ?? ""),
      shippingMethod,
      city: String(fd.get("city") ?? ""),
      postcode: String(fd.get("postcode") ?? ""),
      address: String(fd.get("address") ?? ""),
      office: String(fd.get("office") ?? ""),
      paymentMethod,
      promoCode: appliedPromo?.code ?? "",
      items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
    };

    const result = await placeOrder(payload);

    if (!result.ok) {
      setPending(false);
      if (result.fieldErrors) setErrors(result.fieldErrors);
      if (result.error) setFormError(result.error);
      return;
    }

    if (result.redirect) {
      // Card / Apple Pay / Google Pay: keep the cart (cleared on the success
      // page) and leave for the myPOS payment page; stay "pending" meanwhile.
      submitToMypos(result.redirect);
      return;
    }

    setPending(false);

    // Cash on delivery: order placed.
    clear();
    router.push(`/plashtane/uspeh?n=${result.orderNumber ?? ""}`);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        {formError && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {formError}
          </p>
        )}

        {/* Contact */}
        <section className="rounded-3xl border border-brand-navy-500/10 bg-white p-6 sm:p-8">
          <h2 className="font-display font-extrabold text-brand-navy-500">
            Контакти
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Име" name="firstName" error={errors.firstName} />
            <Input label="Фамилия" name="lastName" />
            <Input
              label="Имейл"
              name="email"
              type="email"
              error={errors.email}
            />
            <Input label="Телефон" name="phone" error={errors.phone} />
          </div>
        </section>

        {/* Shipping */}
        <section className="rounded-3xl border border-brand-navy-500/10 bg-white p-6 sm:p-8">
          <h2 className="font-display font-extrabold text-brand-navy-500">
            Доставка с Еконт
          </h2>
          <div className="mt-4 space-y-2">
            {shippingMethods.map((m) => (
              <label
                key={m.id}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
                  shippingMethod === m.id
                    ? "border-brand-navy-500 bg-brand-sky-50"
                    : "border-brand-navy-500/15 hover:border-brand-navy-500/30"
                }`}
              >
                <input
                  type="radio"
                  name="shippingMethod"
                  checked={shippingMethod === m.id}
                  onChange={() => setShippingMethod(m.id)}
                  className="mt-1"
                />
                <span>
                  <span className="block font-medium text-brand-navy-500">
                    {m.label}
                  </span>
                  <span className="text-sm text-brand-navy-500/55">
                    {m.note}
                  </span>
                </span>
              </label>
            ))}
          </div>

          {needsAddress ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input label="Град" name="city" error={errors.city} />
              <Input label="Пощенски код" name="postcode" />
              <div className="sm:col-span-2">
                <Input
                  label="Адрес (улица, номер, ет., ап.)"
                  name="address"
                  error={errors.address}
                />
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="office"
                  className="text-sm font-medium text-brand-navy-500"
                >
                  Офис / автомат на Еконт
                </label>
                <a
                  href="https://offices.econt.com/?country=bg&source_url=healthupgrade.bg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-brand-sky-600 hover:underline"
                >
                  Виж картата на Еконт →
                </a>
              </div>
              <input
                id="office"
                name="office"
                placeholder="Град и офис/автомат (напр. София, Автомат Младост 1)"
                className={`w-full rounded-xl border bg-white px-4 py-2.5 text-brand-navy-500 outline-none transition-colors placeholder:text-brand-navy-500/35 focus:border-brand-navy-500 ${
                  errors.office ? "border-red-400" : "border-brand-navy-500/15"
                }`}
              />
              {errors.office && (
                <p className="mt-1.5 text-sm text-red-500">{errors.office}</p>
              )}
              <p className="mt-2 text-xs text-brand-navy-500/45">
                Избери от картата и въведи офиса/автомата тук. Автоматичен избор
                от картата предстои.
              </p>
            </div>
          )}
        </section>

        {/* Payment */}
        <section className="rounded-3xl border border-brand-navy-500/10 bg-white p-6 sm:p-8">
          <h2 className="font-display font-extrabold text-brand-navy-500">
            Плащане
          </h2>
          <div className="mt-4 space-y-2">
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
                paymentMethod === "cod"
                  ? "border-brand-navy-500 bg-brand-sky-50"
                  : "border-brand-navy-500/15 hover:border-brand-navy-500/30"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="mt-1"
              />
              <span>
                <span className="block font-medium text-brand-navy-500">
                  Наложен платеж
                </span>
                <span className="text-sm text-brand-navy-500/55">
                  Плащаш при получаване на пратката
                </span>
              </span>
            </label>

            {cardEnabled ? (
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
                  paymentMethod === "card"
                    ? "border-brand-navy-500 bg-brand-sky-50"
                    : "border-brand-navy-500/15 hover:border-brand-navy-500/30"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="mt-1"
                />
                <span>
                  <span className="block font-medium text-brand-navy-500">
                    Карта · Apple Pay · Google Pay
                  </span>
                  <span className="text-sm text-brand-navy-500/55">
                    Сигурно плащане чрез myPOS
                  </span>
                </span>
              </label>
            ) : (
              <p className="rounded-2xl border border-dashed border-brand-navy-500/15 p-4 text-sm text-brand-navy-500/45">
                Плащане с карта, Apple Pay и Google Pay — активира се след
                добавяне на ключовете за myPOS.
              </p>
            )}
          </div>
        </section>

        {/* Promo code */}
        <section className="rounded-3xl border border-brand-navy-500/10 bg-white p-6 sm:p-8">
          <h2 className="font-display font-extrabold text-brand-navy-500">
            Промо код
          </h2>
          {appliedPromo ? (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3">
              <div>
                <p className="font-semibold text-emerald-700">
                  {appliedPromo.code} приложен
                </p>
                <p className="text-sm text-emerald-600/80">
                  {appliedPromo.label}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAppliedPromo(null);
                  setPromoInput("");
                }}
                className="text-sm font-medium text-emerald-700 underline"
              >
                Премахни
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex gap-2">
                <input
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="напр. MAG10"
                  className="w-full rounded-xl border border-brand-navy-500/15 bg-white px-4 py-2.5 text-brand-navy-500 outline-none transition-colors placeholder:text-brand-navy-500/35 focus:border-brand-navy-500"
                />
                <button
                  type="button"
                  disabled={promoPending}
                  onClick={() => applyPromo(promoInput)}
                  className="shrink-0 rounded-xl border border-brand-navy-500/15 px-5 py-2.5 text-sm font-semibold text-brand-navy-500 transition-colors hover:border-brand-navy-500/40 disabled:opacity-60"
                >
                  {promoPending ? "…" : "Приложи"}
                </button>
              </div>
              {promoError && (
                <p className="mt-1.5 text-sm text-red-500">{promoError}</p>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Summary */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-3xl border border-brand-navy-500/10 bg-white p-6">
          <h2 className="font-display font-extrabold text-brand-navy-500">
            Поръчка
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3">
                <span className="text-brand-navy-500/70">
                  {i.name} × {i.quantity}
                </span>
                <span className="text-brand-navy-500">
                  {formatCentsEur(i.unitPriceCents * i.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-brand-navy-500/8 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-navy-500/60">Междинна сума</dt>
              <dd className="text-brand-navy-500">
                {formatCentsEur(subtotalCents)}
              </dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-emerald-600">
                  Отстъпка ({appliedPromo?.code})
                </dt>
                <dd className="text-emerald-600">
                  −{formatCentsEur(discount)}
                </dd>
              </div>
            )}
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

          <button
            type="submit"
            disabled={pending}
            className="mt-6 w-full rounded-full bg-brand-navy-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-700 disabled:opacity-60"
          >
            {pending
              ? "Обработка…"
              : paymentMethod === "card"
                ? "Продължи към плащане"
                : "Завърши поръчката"}
          </button>
          <p className="mt-3 text-center text-xs text-brand-navy-500/45">
            Доставката е ориентировъчна; изчислява се точно при обработка.
          </p>
        </div>
      </div>
    </form>
  );
}

function Input({
  label,
  name,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-brand-navy-500"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        aria-invalid={error ? true : undefined}
        className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-2.5 text-brand-navy-500 outline-none transition-colors placeholder:text-brand-navy-500/35 focus:border-brand-navy-500 ${
          error ? "border-red-400" : "border-brand-navy-500/15"
        }`}
      />
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}
