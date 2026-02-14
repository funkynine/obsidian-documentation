import Link from "next/link";
import { Button } from "@/components/ui/button";

export function OccasionBlocks() {
  return (
    <section className="border-t border-border bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-8">
            <span className="text-xs font-medium uppercase tracking-wider text-destructive">
              Спеціальна пропозиція
            </span>
            <h3 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">
              14 лютого — День закоханих
            </h3>
            <p className="mt-4 text-muted-foreground">
              Подаруйте букет тюльпанів як знак любові та ніжності. Червоний,
              рожевий або мікс — ми зробимо ідеальний букет для вашого кохання.
            </p>
            <Button asChild size="lg" className="mt-6 rounded-md">
              <Link href="/order">Замовити на 14 лютого</Link>
            </Button>
          </div>
          <div className="rounded-lg border border-border bg-card p-8">
            <span className="text-xs font-medium uppercase tracking-wider text-destructive">
              Спеціальна пропозиція
            </span>
            <h3 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">
              8 березня — Міжнародний жіночий день
            </h3>
            <p className="mt-4 text-muted-foreground">
              Привітайте маму, дружину, подругу або колег свіжими тюльпанами.
              Весняні кольори та свіжий аромат — ідеальний весняний подарунок.
            </p>
            <Button asChild size="lg" className="mt-6 rounded-md">
              <Link href="/order">Замовити на 8 березня</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
