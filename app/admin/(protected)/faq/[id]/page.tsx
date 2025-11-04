export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import BackLink from "@/app/admin/_components/BackLink";
import { prisma } from "@/lib/db";
import FaqForm from "../_form";
import { updateFaq } from "../actions";

export default async function EditFaqPage({ params }: { params: { id: string } }) {
  const f = await prisma.faq.findUnique({ where: { id: params.id } });
  if (!f) return notFound();

  return (
    <section className="mx-auto max-w-3xl">
      <BackLink href="/admin/faq">Back to FAQ</BackLink>
      <h1 className="mt-3 text-2xl font-semibold">Edit FAQ</h1>

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
    </section>
  );
}
