"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createVariety, updateVariety } from "@/actions/admin";
import type { Variety } from "@/types/database";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface VarietyFormProps {
  variety?: Variety | null;
  adminKey: string;
  onSuccess?: () => void;
}

export function VarietyForm({
  variety,
  adminKey,
  onSuccess,
}: VarietyFormProps) {
  const [name, setName] = useState(variety?.name ?? "");
  const [description, setDescription] = useState(
    variety?.description ?? ""
  );
  const [imageUrl, setImageUrl] = useState(variety?.image_url ?? "");
  const [price, setPrice] = useState(String(variety?.price ?? ""));
  const [isActive, setIsActive] = useState(variety?.is_active ?? true);
  const [sortOrder, setSortOrder] = useState(
    String(variety?.sort_order ?? 0)
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (variety) {
      const res = await updateVariety(
        variety.id,
        {
          name,
          description: description || undefined,
          image_url: imageUrl || undefined,
          price: parseFloat(price),
          is_active: isActive,
          sort_order: parseInt(sortOrder, 10),
        },
        adminKey
      );
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Зміни збережено");
        onSuccess?.();
      }
    } else {
      const res = await createVariety(
        {
          name,
          description: description || "",
          image_url: imageUrl || undefined,
          price: parseFloat(price),
          is_active: isActive,
          sort_order: parseInt(sortOrder, 10),
        },
        adminKey
      );
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Продукт додано");
        setName("");
        setDescription("");
        setImageUrl("");
        setPrice("");
        setSortOrder("0");
        onSuccess?.();
      }
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Назва *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Опис</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>
      <ImageUploader value={imageUrl} onChange={setImageUrl} adminKey={adminKey} />
      <div>
        <Label htmlFor="price">Ціна (грн) *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="sort_order">Порядок</Label>
        <Input
          id="sort_order"
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        <Label htmlFor="is_active">Показувати на сайті</Label>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Збереження…" : variety ? "Зберегти" : "Додати продукт"}
      </Button>
    </form>
  );
}
