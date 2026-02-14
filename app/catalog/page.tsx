import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default async function CatalogPage() {
  const supabase = await createClient();
  const { data: varieties } = await supabase
    .from("varieties")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Каталог тюльпанів
          </h1>
          <p className="mt-2 text-muted-foreground">
            Оберіть сорт для деталей та замовлення
          </p>
          {varieties && varieties.length > 0 ? (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {varieties.map((v) => (
                <Link
                  key={v.id}
                  href={`/catalog/${v.id}`}
                  className="group overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-square bg-muted/50">
                    {v.image_url ? (
                      <Image
                        src={v.image_url}
                        alt={v.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-muted/30 text-5xl text-muted-foreground">
                        🌷
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold uppercase tracking-wide text-foreground">
                      {v.name}
                    </h3>
                    {v.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {v.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-bold text-foreground">
                        {Number(v.price).toFixed(0)} грн
                      </span>
                      <span className="text-sm text-primary">Деталі ›</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-lg border border-border bg-muted/30 p-12 text-center">
              <p className="text-muted-foreground">
                Скоро тут з&apos;являться сорти тюльпанів
              </p>
              <Button asChild className="mt-6 rounded-md">
                <Link href="/order">Замовити</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
