"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  OrderFilters,
  filterOrders,
  DEFAULT_FILTERS,
  type OrderFiltersState,
} from "./OrderFilters";
import { OrderTable } from "./OrderTable";
import { OrderCard } from "./OrderCard";
import type { OrderStatus } from "@/types/database";

interface OrderWithVariety {
  id: string;
  customer_name: string;
  phone: string;
  variety_id: string;
  quantity: number;
  city: string;
  delivery_date: string;
  delivery_time: string | null;
  status: OrderStatus;
  notes: string | null;
  manager_notes: string | null;
  created_at: string;
  varieties: { name: string } | null;
}

interface OrdersSectionProps {
  initialOrders: OrderWithVariety[];
  adminKey: string;
}

export function OrdersSection({
  initialOrders,
  adminKey,
}: OrdersSectionProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<OrderFiltersState>(DEFAULT_FILTERS);

  const filteredOrders = useMemo(
    () => filterOrders(initialOrders, filters),
    [initialOrders, filters]
  );

  function refresh() {
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <OrderFilters filters={filters} onFiltersChange={setFilters} />

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 py-16 text-center">
          <p className="text-muted-foreground">Немає замовлень</p>
        </div>
      ) : (
        <>
          <div className="hidden lg:block">
            <OrderTable
              initialOrders={filteredOrders}
              adminKey={adminKey}
            />
          </div>
          <div className="space-y-4 lg:hidden">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                adminKey={adminKey}
                onUpdate={refresh}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
