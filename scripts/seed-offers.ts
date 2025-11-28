// scripts/seed-offers.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding offers...");

    // Calculate dates
    const now = new Date();
    const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const twoMonthsFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

    const offers = [
        {
            title: "Weekend Batch Special",
            description:
                "Order 2 dozen or more on weekends and save 15%! Perfect for parties, gatherings, or just treating yourself to extra sweetness.",
            discountText: "15% OFF",
            discountValue: 15,
            badge: "Weekends Only",
            colorScheme: "brand-brown",
            ctaText: "Shop Now",
            ctaLink: "/shop",
            validFrom: now,
            validUntil: oneMonthFromNow,
            active: true,
        },
        {
            title: "Early Bird Pickup",
            description:
                "Schedule your pickup for before 10 AM and enjoy 10% off your entire order. Fresh cookies, early morning convenience!",
            discountText: "10% OFF",
            discountValue: 10,
            badge: "Morning Special",
            colorScheme: "brand-pink",
            ctaText: "Order Early",
            ctaLink: "/shop",
            validFrom: now,
            validUntil: twoMonthsFromNow,
            active: true,
        },
        {
            title: "Bulk Order Savings",
            description:
                "Planning an event? Order 5+ dozen cookies and unlock wholesale pricing. Great for corporate events, weddings, and celebrations!",
            discountText: "Up to 20% OFF",
            discountValue: 20,
            badge: "Bulk Pricing",
            colorScheme: "green",
            ctaText: "Get Quote",
            ctaLink: "/corporate-inquiry",
            validFrom: now,
            validUntil: twoMonthsFromNow,
            active: true,
        },
    ];

    for (const offer of offers) {
        await prisma.offer.create({
            data: offer,
        });
        console.log(`Created offer: ${offer.title}`);
    }

    console.log("✅ Seeding completed!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
