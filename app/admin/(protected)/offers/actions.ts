"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Offer } from "@prisma/client";

export async function createOffer(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const discountText = formData.get("discountText") as string;
    const badge = formData.get("badge") as string || null;
    const colorScheme = formData.get("colorScheme") as string;
    const ctaText = formData.get("ctaText") as string;
    const ctaLink = formData.get("ctaLink") as string;
    const validFrom = new Date(formData.get("validFrom") as string);
    const validUntil = new Date(formData.get("validUntil") as string);
    const discountValue = parseInt(formData.get("discountValue") as string) || 0;
    const active = formData.get("active") === "on";

    await prisma.offer.create({
        data: {
            title,
            description,
            discountText,
            discountValue,
            badge,
            colorScheme,
            ctaText,
            ctaLink,
            validFrom,
            validUntil,
            active,
        },
    });

    revalidatePath("/admin/offers");
    revalidatePath("/offers");
    redirect("/admin/offers");
}

export async function updateOffer(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const discountText = formData.get("discountText") as string;
    const badge = formData.get("badge") as string || null;
    const colorScheme = formData.get("colorScheme") as string;
    const ctaText = formData.get("ctaText") as string;
    const ctaLink = formData.get("ctaLink") as string;
    const validFrom = new Date(formData.get("validFrom") as string);
    const validUntil = new Date(formData.get("validUntil") as string);
    const discountValue = parseInt(formData.get("discountValue") as string) || 0;
    const active = formData.get("active") === "on";

    await prisma.offer.update({
        where: { id },
        data: {
            title,
            description,
            discountText,
            discountValue,
            badge,
            colorScheme,
            ctaText,
            ctaLink,
            validFrom,
            validUntil,
            active,
        },
    });

    revalidatePath("/admin/offers");
    revalidatePath("/offers");
    redirect("/admin/offers");
}

export async function deleteOffer(id: string) {
    await prisma.offer.delete({
        where: { id },
    });

    revalidatePath("/admin/offers");
    revalidatePath("/offers");
}

export async function toggleOfferActive(id: string, currentlyActive: boolean) {
    await prisma.offer.update({
        where: { id },
        data: { active: !currentlyActive },
    });

    revalidatePath("/admin/offers");
    revalidatePath("/offers");
}
