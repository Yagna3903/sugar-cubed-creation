"use server";

import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/server/admin";

// Initialize Supabase Admin Client (for server-side uploads)
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function uploadImage(formData: FormData) {
    await requireAdmin();

    const file = formData.get("file") as File;
    if (!file) {
        throw new Error("No file provided");
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET || "product-images")
        .upload(filePath, file, {
            contentType: file.type,
            upsert: false,
        });

    if (error) {
        console.error("Upload error:", error);
        throw new Error("Failed to upload image");
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from(process.env.SUPABASE_BUCKET || "product-images")
        .getPublicUrl(filePath);

    return { url: publicUrl };
}
