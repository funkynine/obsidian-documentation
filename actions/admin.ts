"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { OrderStatus } from "@/types/database";

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  adminKey: string
) {
  if (adminKey !== process.env.ADMIN_SECRET) {
    return { error: "Unauthorized" };
  }
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/${adminKey}`);
  return {};
}

export async function updateOrderManagerNotes(
  orderId: string,
  managerNotes: string,
  adminKey: string
) {
  if (adminKey !== process.env.ADMIN_SECRET) {
    return { error: "Unauthorized" };
  }
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ manager_notes: managerNotes })
    .eq("id", orderId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/${adminKey}`);
  return {};
}

export async function createVariety(
  data: {
    name: string;
    description: string;
    image_url?: string;
    price: number;
    is_active: boolean;
    sort_order: number;
  },
  adminKey: string
) {
  if (adminKey !== process.env.ADMIN_SECRET) {
    return { error: "Unauthorized" };
  }
  const supabase = createAdminClient();
  const { error } = await supabase.from("varieties").insert(data);
  if (error) return { error: error.message };
  revalidatePath(`/admin/${adminKey}`);
  return {};
}

export async function updateVariety(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    image_url: string;
    price: number;
    is_active: boolean;
    sort_order: number;
  }>,
  adminKey: string
) {
  if (adminKey !== process.env.ADMIN_SECRET) {
    return { error: "Unauthorized" };
  }
  const supabase = createAdminClient();
  const { error } = await supabase.from("varieties").update(data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath(`/admin/${adminKey}`);
  return {};
}

export async function deleteVariety(id: string, adminKey: string) {
  if (adminKey !== process.env.ADMIN_SECRET) {
    return { error: "Unauthorized" };
  }
  const supabase = createAdminClient();
  const { error } = await supabase.from("varieties").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath(`/admin/${adminKey}`);
  return {};
}
