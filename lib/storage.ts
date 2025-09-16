// lib/storage.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const bucket = process.env.SUPABASE_BUCKET || "product-images";

// Server-only Supabase client (uses service role)
export const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

/** Upload an image file and return its public URL. */
export async function uploadProductImage(file: File, productId: string) {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${productId}/${Date.now()}.${ext}`;

  const bytes = Buffer.from(await file.arrayBuffer());

  const { data, error } = await supabase.storage.from(bucket).upload(path, bytes, {
    cacheControl: "3600",
    contentType: file.type || "application/octet-stream",
    upsert: true,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  // Build public URL
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return urlData.publicUrl;
}
