export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import BackLink from "@/app/admin/_components/BackLink";
import { prisma } from "@/lib/db";
import FaqForm from "../_form";
import { updateFaq } from "../actions";

export default async function EditFaqPage({ params }: { params: { id: string } }) {
  const f = await prisma.fAQ.findUnique({ where: { id: params.id } });
  if (!f) return notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href="/admin/faq">Back to FAQ</BackLink>
      <div className="mt-6 mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-brown">Edit FAQ</h1>
        <p className="text-zinc-500 mt-1">Update the details for this question.</p>
      </div>

      <div className="mt-5">
        <FaqForm
          mode="edit"
          action={updateFaq.bind(null, f.id) as any}
          initial={{
            id: f.id,
            question: f.question,
            answer: f.answer,
            active: f.active,
            sort: f.sort ?? null,
          }}
        />
      </div>
    </div>
  );
}
