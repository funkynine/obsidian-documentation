"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { sendTelegramNotification } from "@/lib/telegram";

const orderSchema = z.object({
  customer_name: z.string().min(2, "Введіть ім'я"),
  phone: z.string().min(10, "Введіть коректний телефон"),
  variety_id: z.string().uuid("Оберіть сорт"),
  quantity: z.coerce.number().min(1).max(50),
  city: z.enum(["Вінниця", "Жмеринка", "Бар"]),
  delivery_date: z.string().min(1, "Оберіть дату доставки"),
  delivery_time: z.string().optional(),
  notes: z.string().optional(),
});

export type OrderFormState = {
  error?: string;
};

export async function createOrder(
  _prevState: OrderFormState,
  formData: FormData
): Promise<OrderFormState> {
  const parsed = orderSchema.safeParse({
    customer_name: formData.get("customer_name"),
    phone: formData.get("phone"),
    variety_id: formData.get("variety_id"),
    quantity: formData.get("quantity"),
    city: formData.get("city"),
    delivery_date: formData.get("delivery_date"),
    delivery_time: formData.get("delivery_time") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    const firstError = parsed.error.flatten().fieldErrors;
    const msg = Object.values(firstError).flat()[0];
    return { error: msg || "Перевірте дані форми" };
  }

  const supabase = createAdminClient();
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      ...parsed.data,
      status: "new",
      delivery_time: parsed.data.delivery_time || null,
      notes: parsed.data.notes || null,
    })
    .select()
    .single();

  if (error) {
    console.error("[createOrder] Supabase error:", error);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? `Помилка: ${error.message}`
          : "Помилка при створенні замовлення. Спробуйте пізніше.",
    };
  }

  const { data: variety } = await supabase
    .from("varieties")
    .select("name")
    .eq("id", order.variety_id)
    .single();

  await sendTelegramNotification({
    ...order,
    varieties: variety,
  });
  revalidatePath("/");
  redirect("/order/thank-you");
}
