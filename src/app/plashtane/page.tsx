import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import { stripeEnabled } from "@/lib/checkout-config";

export const metadata: Metadata = {
  title: "Плащане | Health Upgrade",
};

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Container className="py-12 lg:py-16">
          <h1 className="mb-8 font-display text-3xl font-bold tracking-tight text-brand-navy-500">
            Плащане
          </h1>
          <CheckoutView
            stripeEnabled={stripeEnabled}
            publishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
          />
        </Container>
      </main>
      <Footer />
    </>
  );
}
