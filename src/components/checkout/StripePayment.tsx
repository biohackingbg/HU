"use client";

import { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

/**
 * Renders the Stripe Payment Element (cards + Apple Pay + Google Pay).
 * Only mounted once an order exists and a PaymentIntent client secret is
 * returned by the server.
 */
export function StripePayment({
  clientSecret,
  publishableKey,
  orderNumber,
}: {
  clientSecret: string;
  publishableKey: string;
  orderNumber: string;
}) {
  const stripePromise = useMemo(
    () => loadStripe(publishableKey),
    [publishableKey],
  );

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: { theme: "flat" } }}
    >
      <PaymentForm orderNumber={orderNumber} />
    </Elements>
  );
}

function PaymentForm({ orderNumber }: { orderNumber: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPending(true);
    setError(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/plashtane/uspeh?n=${orderNumber}`,
      },
    });

    // Only reached if there's an immediate error; otherwise Stripe redirects.
    if (error) {
      setError(error.message ?? "Плащането не бе успешно. Опитай отново.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || pending}
        className="w-full rounded-full bg-brand-navy-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-700 disabled:opacity-60"
      >
        {pending ? "Обработка…" : "Плати"}
      </button>
    </form>
  );
}
