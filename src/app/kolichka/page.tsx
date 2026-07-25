import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Количка | Health Upgrade",
};

export default function CartPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Container className="py-12 lg:py-16">
          <h1 className="mb-8 font-display text-3xl font-bold tracking-tight text-brand-navy-500">
            Твоята количка
          </h1>
          <CartView />
        </Container>
      </main>
      <Footer />
    </>
  );
}
