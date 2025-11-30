import { PrismaClient } from "@prisma/client";
import { posts } from "../lib/data";

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
