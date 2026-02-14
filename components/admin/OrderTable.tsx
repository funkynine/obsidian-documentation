"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Phone } from "lucide-react";
import { updateOrderStatus, updateOrderManagerNotes } from "@/actions/admin";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "@/types/database";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "new", label: "Нове" },
  { value: "contacted", label: "Передзвонили" },
  { value: "in_progress", label: "В роботі" },
  { value: "completed", label: "Виконано" },
  { value: "cancelled", label: "Скасовано" },
];

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

interface OrderTableProps {
  initialOrders: OrderWithVariety[];
  adminKey: string;
}

export function OrderTable({
  initialOrders,
  adminKey,
}: OrderTableProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("orders-insert")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const newOrder = payload.new as OrderWithVariety;
          newOrder.varieties = null;
          setOrders((prev) => [newOrder, ...prev]);
          toast.success("Нове замовлення!", {
            description: `${newOrder.customer_name} — ${newOrder.phone}`,
          });
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    await updateOrderStatus(orderId, status, adminKey);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    toast.success("Статус оновлено");
    router.refresh();
  }

  async function handleSaveNotes(orderId: string) {
    await updateOrderManagerNotes(orderId, notesValue, adminKey);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, manager_notes: notesValue } : o
      )
    );
    setEditingNotes(null);
    toast.success("Нотатки збережено");
    router.refresh();
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Дата</TableHead>
          <TableHead>Ім&apos;я</TableHead>
          <TableHead>Телефон</TableHead>
          <TableHead>Продукт</TableHead>
          <TableHead>К-сть</TableHead>
          <TableHead>Місто</TableHead>
          <TableHead>Доставка</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Нотатки</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((o) => (
          <TableRow
            key={o.id}
            className={o.status === "new" ? "bg-primary/5" : undefined}
          >
            <TableCell className="text-sm text-muted-foreground">
              {new Date(o.created_at).toLocaleString("uk-UA", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {o.status === "new" && (
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                    Нове
                  </span>
                )}
                {o.customer_name}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <a
                  href={`tel:${o.phone}`}
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <Phone className="size-4" />
                  {o.phone}
                </a>
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(o.phone);
                    toast.success("Телефон скопійовано");
                  }}
                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Копіювати телефон"
                >
                  <Copy className="size-4" />
                </button>
              </div>
            </TableCell>
            <TableCell>{o.varieties?.name ?? "-"}</TableCell>
            <TableCell>{o.quantity}</TableCell>
            <TableCell>{o.city}</TableCell>
            <TableCell className="text-sm">
              {o.delivery_date}
              {o.delivery_time ? ` ${o.delivery_time}` : ""}
            </TableCell>
            <TableCell>
              <Select
                value={o.status}
                onValueChange={(v) =>
                  handleStatusChange(o.id, v as OrderStatus)
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              {editingNotes === o.id ? (
                <div className="flex gap-2">
                  <Input
                    value={notesValue}
                    onChange={(e) => setNotesValue(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSaveNotes(o.id)}
                  >
                    Зберегти
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingNotes(null)}
                  >
                    Скасувати
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingNotes(o.id);
                    setNotesValue(o.manager_notes || "");
                  }}
                >
                  {o.manager_notes || "+ Додати"}
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
