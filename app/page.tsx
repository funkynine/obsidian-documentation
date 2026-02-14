import { Navbar } from "@/components/landing/Navbar";
import { ProductHero } from "@/components/landing/ProductHero";
import { OccasionBlocks } from "@/components/landing/OccasionBlocks";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <ProductHero />
        <OccasionBlocks />
        <section className="border-t border-border bg-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Про нас
              </h2>
              <p className="mt-6 text-muted-foreground">
                Ми самі вирощуємо тюльпани вже не перший рік і відповідаємо за
                якість кожної квітки.
              </p>
              <Link
                href="/about"
                className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
              >
                Дізнатись більше ›
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
