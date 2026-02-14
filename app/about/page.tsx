import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";

export const metadata = {
  title: "Про нас | TULIP GARDEN",
  description:
    "Ми самі вирощуємо тюльпани вже не перший рік. Відповідаємо за якість кожної квітки.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              Про нас
            </h1>
            <div className="mt-8 space-y-6 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                Ми самі вирощуємо ці тюльпани вже не перший рік — і відповідаємо
                за якість кожної квітки. Кожен букет збираємо з турботою і дбаємо,
                щоб він дійшов до вас свіжим.
              </p>
              <p>
                Доставляємо тюльпани у Вінниці, Жмеринці та Барі. Працюємо з
                перевіреними сортівками, щоб ви отримали найкращі букети на 14
                лютого та 8 березня.
              </p>
            </div>
            <Link
              href="/catalog"
              className="mt-10 inline-block text-sm font-medium text-primary hover:underline"
            >
              Переглянути каталог ›
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
