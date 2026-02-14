"use server";

import { createAdminClient } from "@/lib/supabase/server";

export async function uploadVarietyImage(
  formData: FormData,
  adminKey: string
): Promise<{ url?: string; error?: string }> {
  if (adminKey !== process.env.ADMIN_SECRET) {
    return { error: "Unauthorized" };
  }
  const file = formData.get("file") as File;
  if (!file) return { error: "No file" };

  const supabase = createAdminClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `varieties/${crypto.randomUUID()}.${ext}`;

  const { data, error } = await supabase.storage
    .from("tulip-photos")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) return { error: error.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("tulip-photos").getPublicUrl(data.path);
  return { url: publicUrl };
}
