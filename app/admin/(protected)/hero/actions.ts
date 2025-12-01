"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/server/admin";

const HeroSchema = z.object({
    images: z.array(z.string()).default([]),
});

export async function updateHeroContent(formData: FormData) {
    await requireAdmin();

    const rawImages = formData.getAll("images");
    const images = rawImages.map((img) => img.toString()).filter(Boolean);

    const parsed = HeroSchema.parse({ images });

    await prisma.siteContent.upsert({
        where: { key: "hero" },
        update: {
            content: parsed,
        },
        create: {
            key: "hero",
            content: parsed,
        },
    });

    revalidatePath("/");
    revalidatePath("/admin/hero");
}

export async function getHeroContent() {
    await requireAdmin();

    const content = await prisma.siteContent.findUnique({
        where: { key: "hero" },
    });

    if (!content) return { images: ["/images/Main-Cookie.png"] };

    // Type guard for the JSON content
    const data = content.content as { images?: string[] };
    const images = Array.isArray(data.images) && data.images.length > 0
        ? data.images
        : ["/images/Main-Cookie.png"];

    return { images };
}
