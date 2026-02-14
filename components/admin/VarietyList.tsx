"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { deleteVariety } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VarietyForm } from "./VarietyForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search } from "lucide-react";
import type { Variety } from "@/types/database";

const SORT_OPTIONS = [
  { value: "sort_order", label: "За порядком" },
  { value: "name_asc", label: "Назва (А–Я)" },
  { value: "name_desc", label: "Назва (Я–А)" },
  { value: "price_asc", label: "Ціна (зростання)" },
  { value: "price_desc", label: "Ціна (спадання)" },
  { value: "active_first", label: "Спочатку активні" },
] as const;

interface VarietyListProps {
  varieties: Variety[];
  adminKey: string;
}

export function VarietyList({ varieties: initial, adminKey }: VarietyListProps) {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Variety | null>(null);
  const [deleting, setDeleting] = useState<Variety | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<(typeof SORT_OPTIONS)[number]["value"]>("sort_order");

  const filteredAndSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = q
      ? initial.filter(
          (v) =>
            v.name.toLowerCase().includes(q) ||
            (v.description?.toLowerCase().includes(q) ?? false)
        )
      : [...initial];

    list.sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return a.name.localeCompare(b.name, "uk");
        case "name_desc":
          return b.name.localeCompare(a.name, "uk");
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "active_first":
          if (a.is_active !== b.is_active) return a.is_active ? -1 : 1;
          return a.sort_order - b.sort_order;
        default:
          return a.sort_order - b.sort_order;
      }
    });
    return list;
  }, [initial, search, sortBy]);

  function refresh() {
    router.refresh();
  }

  async function handleDelete() {
    if (!deleting) return;
    await deleteVariety(deleting.id, adminKey);
    setDeleting(null);
    refresh();
  }

  function handleSuccess() {
    setAddOpen(false);
    setEditing(null);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Продукти</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px] sm:min-w-[200px]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Пошук за назвою або описом..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Сортувати" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setAddOpen(true)} className="gap-2 shrink-0">
            <Plus className="size-4" />
            Додати продукт
          </Button>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Додати продукт</DialogTitle>
          </DialogHeader>
          <VarietyForm
            adminKey={adminKey}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редагувати продукт</DialogTitle>
          </DialogHeader>
          {editing && (
            <VarietyForm
              variety={editing}
              adminKey={adminKey}
              onSuccess={handleSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Видалити продукт?</AlertDialogTitle>
            <AlertDialogDescription>
              Ви впевнені, що хочете видалити продукт &quot;{deleting?.name}&quot;? Цю дію неможливо скасувати.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Скасувати</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete}>
              Видалити
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {initial.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 py-16 text-center">
          <p className="text-muted-foreground">Ще немає продуктів.</p>
          <Button onClick={() => setAddOpen(true)} className="mt-4">
            Додати перший продукт
          </Button>
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 py-12 text-center">
          <p className="text-muted-foreground">Нічого не знайдено за запитом &quot;{search}&quot;</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredAndSorted.map((v) => (
            <div key={v.id} className="rounded-lg border p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded bg-muted">
                {v.image_url ? (
                  <Image
                    src={v.image_url}
                    alt={v.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-2xl">
                    🌷
                  </span>
                )}
              </div>
              <div className="mt-2">
                <p className="truncate text-sm font-semibold">{v.name}</p>
                <p className="text-xs text-muted-foreground">
                  {v.price} грн • {v.is_active ? "Активний" : "Прихований"}
                </p>
              </div>
              <div className="mt-2 flex gap-1.5">
                <Button
                  variant="outline"
                  size="xs"
                  className="flex-1"
                  onClick={() => setEditing(v)}
                >
                  Редагувати
                </Button>
                <Button
                  variant="destructive"
                  size="xs"
                  className="flex-1"
                  onClick={() => setDeleting(v)}
                >
                  Видалити
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
