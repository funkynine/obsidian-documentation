import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("varieties")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

  const { data: related } = await supabase
    .from("varieties")
    .select("*")
    .eq("is_active", true)
    .neq("id", id)
    .order("sort_order", { ascending: true })
    .limit(4);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
            {/* Left: Product image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-card lg:max-w-[50%]">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
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
                {product.name}
              </h1>
              <p className="mt-6 text-muted-foreground">
                {product.description ||
                  "Свіжі тюльпани, що розпускаються перед вашими очима. Доставляємо букети в бутонах — вони будуть довго радувати вас своїм цвітом."}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <span className="text-2xl font-bold text-foreground">
                  {Number(product.price).toFixed(0)} грн
                </span>
                <span className="text-sm text-muted-foreground">за букет</span>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="rounded-md">
                  <Link href={`/order?variety=${product.id}`}>
                    До кошика
                  </Link>
                </Button>
                <Link
                  href="/catalog"
                  className="flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Всі сорти ›
                </Link>
              </div>
            </div>
          </div>

          {/* Related products */}
          {related && related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-lg font-semibold text-foreground">
                Інші сорти
              </h2>
              <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
                {related.map((v) => (
                  <Link
                    key={v.id}
                    href={`/catalog/${v.id}`}
                    className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-lg bg-card transition-opacity hover:opacity-90 md:w-32"
                  >
                    {v.image_url ? (
                      <Image
                        src={v.image_url}
                        alt={v.name}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-3xl text-muted-foreground">
                        🌷
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
