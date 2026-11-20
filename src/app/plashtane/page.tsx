import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import { myposEnabled } from "@/lib/mypos";

export const metadata: Metadata = {
  title: "Плащане | Health Upgrade",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ promo?: string; payment?: string }>;
}) {
  const { promo, payment } = await searchParams;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Container className="py-12 lg:py-16">
          <h1 className="mb-8 font-display text-3xl font-extrabold tracking-tight text-brand-navy-500">
            Плащане
          </h1>
          <CheckoutView
            cardEnabled={myposEnabled()}
            paymentCancelled={payment === "cancelled"}
            initialPromoCode={promo}
          />
        </Container>
      </main>
      <Footer />
    </>
  );
}
