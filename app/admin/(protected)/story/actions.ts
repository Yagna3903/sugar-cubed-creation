"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/server/admin";
import { revalidatePath } from "next/cache";

export async function updateSiteContent(key: string, content: any) {
    await requireAdmin();

    await prisma.siteContent.upsert({
        where: { key },
        update: { content },
        create: { key, content },
    });

    revalidatePath("/admin/story");
    revalidatePath("/our-story");
}

export async function getSiteContent(key: string) {
    const data = await prisma.siteContent.findUnique({
        where: { key },
    });
    return data?.content || null;
}
