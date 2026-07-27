import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { QuizFlow } from "@/components/quiz/QuizFlow";

export const metadata: Metadata = {
  title: "Направи теста | Health Upgrade",
  description:
    "Кратък тест за твоите навици и цели, свързани с магнезия — с персонализирана препоръка и код за отстъпка за Neuromag 6.",
};

export default function QuizPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-sky-50/40 py-14 lg:py-20">
        <Container>
          <QuizFlow />
        </Container>
      </main>
      <Footer />
    </>
  );
}
