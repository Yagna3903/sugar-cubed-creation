// lib/server/offers.ts
import { prisma } from "@/lib/db";
import type { Offer } from "@prisma/client";

/**
 * Get all active, non-expired offers
 */
export async function getActiveOffers(): Promise<Offer[]> {
    const now = new Date();

    return prisma.offer.findMany({
        where: {
            active: true,
            validFrom: { lte: now },
            validUntil: { gte: now },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

/**
 * Get all offers (for admin)
 */
export async function getAllOffers(): Promise<Offer[]> {
    return prisma.offer.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
}

/**
 * Get offer by ID
 */
export async function getOfferById(id: string): Promise<Offer | null> {
    return prisma.offer.findUnique({
        where: { id },
    });
}

/**
 * Check if an offer is currently valid
 */
export function isOfferValid(offer: Offer): boolean {
    const now = new Date();
    return (
        offer.active &&
        offer.validFrom <= now &&
        offer.validUntil >= now
    );
}

/**
 * Automatically deactivate expired offers
 */
export async function deactivateExpiredOffers(): Promise<void> {
    const now = new Date();
    await prisma.offer.updateMany({
        where: {
            active: true,
            validUntil: { lt: now },
        },
        data: {
            active: false,
        },
    });
}
