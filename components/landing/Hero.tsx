import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="bg-muted/40 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Свіжі тюльпани
            <br />
            <span className="text-primary">на 14 лютого та 8 березня</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            Замовте букети тюльпанів у Вінниці, Жмеринці та Барі. Вибір сортів,
            швидка доставка, приємні ціни.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="rounded-md px-8">
              <Link href="/order">Замовити тюльпани</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-md border-border px-8"
            >
              <Link href="#catalog">Переглянути сорти</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
