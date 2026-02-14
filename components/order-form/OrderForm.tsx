"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createOrder } from "@/actions/createOrder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CITIES = ["Вінниця", "Жмеринка", "Бар"] as const;
const TIME_SLOTS = [
  "09:00 - 12:00",
  "12:00 - 15:00",
  "15:00 - 18:00",
  "18:00 - 21:00",
  "Будь-який час",
  "Інше (вкажіть в примітках)",
] as const;

const selectClassName =
  "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

interface Variety {
  id: string;
  name: string;
  price: number;
}

interface OrderFormProps {
  varieties: Variety[];
  preselectedVarietyId?: string | null;
}

export function OrderForm({
  varieties,
  preselectedVarietyId,
}: OrderFormProps) {
  const [state, formAction] = useActionState(createOrder, {});

  return (
    <Card className="mx-auto max-w-xl border-border">
      <CardHeader>
        <h2 className="text-2xl font-bold">Оформлення замовлення</h2>
        <p className="text-sm text-muted-foreground">
          Заповніть форму — ми передзвонимо для уточнення деталей
        </p>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="variety_id">Сорт тюльпанів *</Label>
            <select
              id="variety_id"
              name="variety_id"
              required
              defaultValue={preselectedVarietyId || ""}
              className={cn(selectClassName, "cursor-pointer")}
            >
              <option value="">Оберіть сорт</option>
              {varieties.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} — {v.price} грн
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Кількість *</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min={1}
              max={50}
              defaultValue={1}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer_name">Ваше ім&apos;я *</Label>
            <Input
              id="customer_name"
              name="customer_name"
              placeholder="Олександр"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+38 050 123 45 67"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Місто доставки *</Label>
            <select
              id="city"
              name="city"
              required
              className={cn(selectClassName, "cursor-pointer")}
            >
              <option value="">Оберіть місто</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery_date">Дата доставки *</Label>
            <Input
              id="delivery_date"
              name="delivery_date"
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery_time">Бажаний час доставки</Label>
            <select
              id="delivery_time"
              name="delivery_time"
              className={cn(selectClassName, "cursor-pointer")}
            >
              <option value="">Оберіть інтервал</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Примітки</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Адреса, побажання до букета..."
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1 rounded-md">
              Відправити замовлення
            </Button>
            <Button variant="outline" className="rounded-md border-border" asChild>
              <Link href="/">Назад</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
