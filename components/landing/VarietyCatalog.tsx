import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export async function VarietyCatalog() {
  const supabase = await createClient();
  const { data: varieties } = await supabase
    .from("varieties")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (!varieties || varieties.length === 0) {
    return (
      <section id="catalog" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Каталог сортів
          </h2>
          <p className="mt-4 text-muted-foreground">
            Скоро тут з&apos;являться наші тюльпани. Перегляньте пізніше або
            замовте вже зараз — ми підберемо для вас найкращі букети!
          </p>
          <Button asChild className="mt-6 rounded-md">
            <Link href="/order">Замовити зараз</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="catalog" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          Оберіть сорт тюльпанів
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Класичні червоні, ніжні рожеві, сонячні жовті — у нас є різноманіття
          сортів для кожного смаку.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {varieties.map((v) => (
            <Card
              key={v.id}
              className="overflow-hidden border-border bg-card transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-square bg-muted/50">
                {v.image_url ? (
                  <Image
                    src={v.image_url}
                    alt={v.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted/30 text-5xl text-muted-foreground">
                    🌷
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <h3 className="text-lg font-bold uppercase tracking-wide text-foreground">
                  {v.name}
                </h3>
                {v.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {v.description}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex items-center justify-between gap-4 border-t border-border/60 p-5">
                <span className="text-lg font-bold text-foreground">
                  {Number(v.price).toFixed(0)} грн
                </span>
                <Button asChild size="default" className="rounded-md">
                  <Link href={`/order?variety=${v.id}`}>До кошика</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
