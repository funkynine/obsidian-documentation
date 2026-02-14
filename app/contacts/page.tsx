import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

const CITIES = ["Вінниця", "Жмеринка", "Бар"] as const;

export const metadata = {
  title: "Контакти | TULIP GARDEN",
  description:
    "Зв'яжіться з нами. Доставка тюльпанів у Вінниці, Жмеринці та Барі.",
};

export default function ContactsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              Контакти
            </h1>
            <div className="mt-10 space-y-8">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Міста доставки
                </p>
                <p className="mt-2 text-muted-foreground">
                  {CITIES.join(", ")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Телефон</p>
                <a
                  href="tel:+380000000000"
                  className="mt-2 flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Phone className="size-4 shrink-0" />
                  +38 000 000 00 00
                </a>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Email</p>
                <a
                  href="mailto:info@example.com"
                  className="mt-2 flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Mail className="size-4 shrink-0" />
                  info@example.com
                </a>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Адреса</p>
                <p className="mt-2 flex items-start gap-2 text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  Вінницька область
                </p>
              </div>
            </div>
            <Link
              href="/order"
              className="mt-10 inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Зробити замовлення
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
