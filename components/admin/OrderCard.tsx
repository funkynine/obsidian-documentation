"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Phone, Copy } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateOrderStatus, updateOrderManagerNotes } from "@/actions/admin";
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

interface OrderCardProps {
  order: OrderWithVariety;
  adminKey: string;
  onUpdate: () => void;
}

export function OrderCard({ order, adminKey, onUpdate }: OrderCardProps) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(order.manager_notes || "");

  async function copyPhone() {
    await navigator.clipboard.writeText(order.phone);
    toast.success("Телефон скопійовано");
  }

  async function handleStatusChange(status: OrderStatus) {
    await updateOrderStatus(order.id, status, adminKey);
    toast.success("Статус оновлено");
    onUpdate();
  }

  async function handleSaveNotes() {
    await updateOrderManagerNotes(order.id, notesValue, adminKey);
    setEditingNotes(false);
    toast.success("Нотатки збережено");
    onUpdate();
  }

  const isNew = order.status === "new";

  return (
    <div
      className={`rounded-lg border p-4 ${
        isNew ? "border-primary/30 bg-primary/5" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold">{order.customer_name}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(order.created_at).toLocaleString("uk-UA", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        {isNew && (
          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
            Нове
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <a
          href={`tel:${order.phone}`}
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <Phone className="size-4" />
          {order.phone}
        </a>
        <button
          type="button"
          onClick={copyPhone}
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Копіювати телефон"
        >
          <Copy className="size-4" />
        </button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {order.varieties?.name ?? "-"} • {order.quantity} шт. • {order.city}
      </p>
      <p className="text-sm">
        {order.delivery_date}
        {order.delivery_time ? `, ${order.delivery_time}` : ""}
      </p>
      <div className="mt-3">
        <Select
          value={order.status}
          onValueChange={(v) => handleStatusChange(v as OrderStatus)}
        >
          <SelectTrigger className="w-full">
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
      </div>
      <div className="mt-3">
        {editingNotes ? (
          <div className="flex gap-2">
            <Input
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              placeholder="Нотатки менеджера..."
              className="flex-1"
            />
            <Button size="sm" onClick={handleSaveNotes}>
              Зберегти
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setEditingNotes(false);
                setNotesValue(order.manager_notes || "");
              }}
            >
              Скасувати
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground"
            onClick={() => {
              setEditingNotes(true);
              setNotesValue(order.manager_notes || "");
            }}
          >
            {order.manager_notes || "+ Додати нотатки"}
          </Button>
        )}
      </div>
    </div>
  );
}
