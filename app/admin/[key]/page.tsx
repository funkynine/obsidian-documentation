import { createAdminClient } from "@/lib/supabase/server";
import { OrdersSection } from "@/components/admin/OrdersSection";
import { VarietyList } from "@/components/admin/VarietyList";
import { AdminContent } from "@/components/admin/AdminContent";

interface PageProps {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function AdminPage({
  params,
  searchParams,
}: PageProps) {
  const { key } = await params;
  const { tab = "orders" } = await searchParams;
  const supabase = createAdminClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, varieties(name)")
    .order("created_at", { ascending: false });

  const { data: varieties } = await supabase
    .from("varieties")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <AdminContent tab={tab}>
      {tab === "varieties" ? (
        <VarietyList varieties={varieties ?? []} adminKey={key} />
      ) : (
        <div className="overflow-x-auto">
          <OrdersSection
            initialOrders={(orders ?? []) as any}
            adminKey={key}
          />
        </div>
      )}
    </AdminContent>
  );
}
