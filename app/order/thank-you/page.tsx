import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";

export default function ThankYouPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Дякуємо за замовлення!
        </h1>
        <p className="mt-4 text-muted-foreground">
          Ми отримали ваше замовлення. Наш менеджер передзвонить вам найближчим
          часом для уточнення деталей.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild className="rounded-md">
            <Link href="/">На головну</Link>
          </Button>
          <Button variant="outline" className="rounded-md border-border" asChild>
            <Link href="/order">Зробити ще замовлення</Link>
          </Button>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
