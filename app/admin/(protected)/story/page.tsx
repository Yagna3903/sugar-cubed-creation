import { prisma } from "@/lib/db";
import BackLink from "@/app/admin/_components/BackLink";
import StoryForm from "./StoryForm";

export const dynamic = "force-dynamic";

export default async function StoryAdminPage() {
    const content = await prisma.siteContent.findUnique({
        where: { key: "our-story" },
    });

    const data = (content?.content as any) || {
        title: "Baked with Heart",
        subtitle: "Since 2024",
        body: `It started with a simple craving for the perfect chocolate chip cookie—crispy on the edges, chewy in the center, and loaded with premium chocolate. Disappointed by store-bought options, we took to the kitchen.\n\nHundreds of batches later (and many happy taste-testers), Sugar Cubed Creation was born. We realized that the secret ingredient wasn't just butter or sugar—it was the patience to get it right.\n\nWe believe in quality over quantity. That's why every batch is made to order, ensuring that what you receive is as fresh as if you pulled it from your own oven. No preservatives, no shortcuts, just pure cookie joy.`,
        imageUrl: "/images/story-placeholder.png",
    };

    return (
        <div className="mx-auto max-w-3xl">
            <BackLink href="/admin">Back to Dashboard</BackLink>
            <div className="mt-6">
                <h1 className="text-2xl font-bold text-brand-brown">Manage Our Story</h1>
                <p className="text-zinc-500">Update the content for the Our Story page.</p>
            </div>

            <div className="mt-8 bg-white p-6 rounded-3xl shadow-soft border border-brand-brown/5">
                <StoryForm initialData={data} />
            </div>
        </div>
    );
}
