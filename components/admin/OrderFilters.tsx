"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const CITIES = ["Вінниця", "Жмеринка", "Бар"] as const;
const STATUSES = [
  { value: "all", label: "Всі статуси" },
  { value: "new", label: "Нове" },
  { value: "contacted", label: "Передзвонили" },
  { value: "in_progress", label: "В роботі" },
  { value: "completed", label: "Виконано" },
  { value: "cancelled", label: "Скасовано" },
];
const DATE_FILTERS = [
  { value: "all", label: "Всі дати" },
  { value: "today", label: "Сьогодні" },
  { value: "week", label: "Цей тиждень" },
  { value: "month", label: "Цей місяць" },
];

export interface OrderFiltersState {
  search: string;
  status: string;
  city: string;
  date: string;
}

interface OrderFiltersProps {
  filters: OrderFiltersState;
  onFiltersChange: (f: OrderFiltersState) => void;
}

export function OrderFilters({ filters, onFiltersChange }: OrderFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Пошук за ім'ям або телефоном..."
          value={filters.search}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value })
          }
          className="pl-9"
        />
      </div>
      <Select
        value={filters.status}
        onValueChange={(v) => onFiltersChange({ ...filters, status: v })}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Статус" />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.city}
        onValueChange={(v) => onFiltersChange({ ...filters, city: v })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Місто" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Всі міста</SelectItem>
          {CITIES.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.date}
        onValueChange={(v) => onFiltersChange({ ...filters, date: v })}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Дата" />
        </SelectTrigger>
        <SelectContent>
          {DATE_FILTERS.map((d) => (
            <SelectItem key={d.value} value={d.value}>
              {d.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function filterOrders<
  T extends { customer_name: string; phone: string; status: string; city: string; created_at: string }
>(
  orders: T[],
  filters: OrderFiltersState
): T[] {
  const search = filters.search.trim().toLowerCase();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return orders.filter((o) => {
    if (search) {
      const matchesSearch =
        o.customer_name.toLowerCase().includes(search) ||
        o.phone.replace(/\s/g, "").includes(search.replace(/\s/g, ""));
      if (!matchesSearch) return false;
    }
    if (filters.status !== "all" && o.status !== filters.status) return false;
    if (filters.city !== "all" && o.city !== filters.city) return false;
    if (filters.date !== "all") {
      const d = new Date(o.created_at);
      if (filters.date === "today" && d < todayStart) return false;
      if (filters.date === "week" && d < weekStart) return false;
      if (filters.date === "month" && d < monthStart) return false;
    }
    return true;
  });
}

export const DEFAULT_FILTERS: OrderFiltersState = {
  search: "",
  status: "all",
  city: "all",
  date: "all",
};
