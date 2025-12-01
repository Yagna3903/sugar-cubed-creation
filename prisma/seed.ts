import { PrismaClient } from "@prisma/client";
import { posts, products } from "../lib/data";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding blog posts...");

    for (const post of posts) {
        const exists = await prisma.blogPost.findUnique({
            where: { slug: post.slug },
        });

        if (!exists) {
            await prisma.blogPost.create({
                data: {
                    title: post.title,
                    slug: post.slug,
                    excerpt: post.excerpt,
                    content: post.content,
                    coverImage: post.image,
                    published: true,
                    publishedAt: new Date(post.date),
                },
            });
            console.log(`Created post: ${post.title}`);
        } else {
            console.log(`Skipped existing post: ${post.title}`);
        }
    }

    console.log("Seeding products...");
    for (const p of products) {
        await prisma.product.upsert({
            where: { id: p.id },
            update: {
                slug: p.slug,
                name: p.name,
                description: p.description ?? null,
                priceCents: Math.round(p.price * 100),
                imageUrl: p.image,
                images: p.images,
                badges: p.badges ?? [],
                active: true,
            },
            create: {
                id: p.id,
                slug: p.slug,
                name: p.name,
                description: p.description ?? null,
                priceCents: Math.round(p.price * 100),
                imageUrl: p.image,
                images: p.images,
                badges: p.badges ?? [],
                active: true,
                inventory: {
                    create: { stock: 50, maxPerOrder: 12 },
                },
            },
        });
        console.log(`Seeded product: ${p.name}`);
    }

    console.log("Seeding complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
