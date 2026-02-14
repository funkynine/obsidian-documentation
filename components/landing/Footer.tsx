import Link from "next/link";
import { Phone, Mail } from "lucide-react";

const CITIES = ["Вінниця", "Жмеринка", "Бар"] as const;

export function Footer() {
  return (
    <footer id="contacts" className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-semibold text-foreground">
              TULIP GARDEN
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Доставка тюльпанів у {CITIES.join(", ")}
            </p>
            <Link href="/about" className="mt-2 inline-block text-sm text-primary hover:underline">
              Про нас ›
            </Link>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Міста доставки</p>
            <ul className="mt-2 space-y-1">
              {CITIES.map((city) => (
                <li
                  key={city}
                  className="text-sm text-muted-foreground"
                >
                  {city}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Контакти</p>
            <div className="mt-2 space-y-2 text-sm text-muted-foreground">
              <a href="tel:+380000000000" className="flex items-center gap-2 hover:text-foreground">
                <Phone className="size-4" />
                +38 000 000 00 00
              </a>
              <a href="mailto:info@example.com" className="flex items-center gap-2 hover:text-foreground">
                <Mail className="size-4" />
                info@example.com
              </a>
              <Link href="/contacts" className="flex items-center gap-2 hover:text-foreground">
                Всі контакти ›
              </Link>
            </div>
          </div>
          <div>
            <Link
              href="/order"
              className="inline-block text-sm font-medium text-primary hover:underline"
            >
              Зробити замовлення
            </Link>
          </div>
        </div>
        <p className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} TULIP GARDEN. Усі права захищені.
        </p>
      </div>
    </footer>
  );
}
