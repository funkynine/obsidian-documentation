import { createClient } from "@/lib/supabase/server";
import { OrderForm } from "@/components/order-form/OrderForm";
import { Navbar } from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ variety?: string }>;
}

export default async function OrderPage({ searchParams }: PageProps) {
  const { variety: varietyId } = await searchParams;
  const supabase = await createClient();
  const { data: varieties } = await supabase
    .from("varieties")
    .select("id, name, price")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const varietyList = varieties ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container mx-auto flex-1 px-4 py-12">
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← На головну
        </Link>
      </div>
      {varietyList.length === 0 ? (
        <div className="mx-auto max-w-xl rounded-lg border bg-muted/50 p-8 text-center">
          <p className="text-muted-foreground">
            Зараз немає доступних сортів. Додайте сорти в адмін-панелі або
            зателефонуйте нам для замовлення.
          </p>
          <Button asChild className="mt-4 rounded-md">
            <Link href="/">На головну</Link>
          </Button>
        </div>
      ) : (
        <OrderForm
          varieties={varietyList}
          preselectedVarietyId={varietyId}
        />
      )}
      </div>
    </div>
  );
}
