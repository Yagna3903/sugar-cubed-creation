import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const faqs = [
    {
        question: "Do you ship nationwide?",
        answer: "Yes! We ship our chunky cookies all across Canada and the US. They are heat-sealed to ensure freshness during transit.",
        sort: 10,
    },
    {
        question: "How long do the cookies last?",
        answer: "Our cookies are best enjoyed within 5-7 days if kept at room temperature in an airtight container. If you want to save them for later, they freeze beautifully for up to 3 months!",
        sort: 20,
    },
    {
        question: "How should I warm them up?",
        answer: "For that fresh-out-of-the-oven experience, warm your cookies in the microwave for 10-15 seconds or in a 350°F oven for 2-3 minutes. Trust us, it's a game changer!",
        sort: 30,
    },
    {
        question: "Are your cookies nut-free?",
        answer: "We bake in a kitchen that handles peanuts, tree nuts, wheat, dairy, and eggs. While some of our flavors don't contain nuts, we cannot guarantee there is no cross-contamination. We recommend those with severe allergies to exercise caution.",
        sort: 40,
    },
    {
        question: "Can I freeze the cookies?",
        answer: "Absolutely! Wrap them tightly in plastic wrap or place them in a freezer-safe bag. When the craving hits, just let them thaw on the counter for an hour or warm them up directly!",
        sort: 50,
    },
    {
        question: "Do you offer corporate gifting?",
        answer: "We sure do! We love spreading joy to offices and events. Please check out our Corporate Inquiry page to get in touch with us for large orders.",
        sort: 60,
    },
];

async function main() {
    console.log("🌱 Seeding FAQs...");

    for (const faq of faqs) {
        await prisma.fAQ.create({
            data: {
                question: faq.question,
                answer: faq.answer,
                sort: faq.sort,
                active: true,
            },
        });
        console.log(`Created FAQ: ${faq.question}`);
    }

    console.log("✅ FAQ seeding completed!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
