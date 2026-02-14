import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { RelatedProducts } from "./RelatedProducts";

export async function ProductHero() {
  const supabase = await createClient();
  const { data: varieties } = await supabase
    .from("varieties")
    .select("id, name, description, image_url, price")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const featured = varieties?.[0];
  const related = varieties ?? [];

  if (!featured) {
    return (
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto flex flex-col items-center justify-center gap-8 px-4 md:flex-row">
          <div className="relative aspect-square w-full max-w-lg overflow-hidden rounded-lg bg-muted/50">
            <div className="flex h-full items-center justify-center text-8xl text-muted-foreground">
              🌷
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <h1 className="text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
              Свіжі тюльпани
            </h1>
            <p className="mt-4 text-muted-foreground">
              Скоро з&apos;являться наші сорти. Замовити можна вже зараз!
            </p>
            <Button asChild size="lg" className="mt-6 w-fit rounded-md">
              <Link href="/order">Замовити</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-muted/30 py-8 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Left: Product image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-card lg:max-w-[50%]">
            {featured.image_url ? (
              <Image
                src={featured.image_url}
                alt={featured.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted/30 text-8xl text-muted-foreground">
                🌷
              </div>
            )}
          </div>

          {/* Right: Product details */}
          <div className="flex flex-1 flex-col">
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                %
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-destructive">
                Спеціальна пропозиція
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {featured.name}
            </h1>
            <p className="mt-6 text-muted-foreground">
              {featured.description ||
                "Свіжі тюльпани, що розпускаються перед вашими очима. Доставляємо букети в бутонах — вони будуть довго радувати вас своїм цвітом."}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="text-2xl font-bold text-foreground">
                {Number(featured.price).toFixed(0)} грн
              </span>
              <span className="text-sm text-muted-foreground">за букет</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-md">
                <Link href={`/order?variety=${featured.id}`}>
                  До кошика
                </Link>
              </Button>
              <Link
                href={`/catalog/${featured.id}`}
                className="flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Деталі <span className="ml-1">›</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Related products carousel */}
        <RelatedProducts products={related} excludeId={featured?.id} />
      </div>
    </section>
  );
}
