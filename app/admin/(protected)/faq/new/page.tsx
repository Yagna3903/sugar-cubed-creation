export const dynamic = "force-dynamic";

import BackLink from "@/app/admin/_components/BackLink";
import FaqForm from "../_form";
import { createFaq } from "../actions";

export default function NewFaqPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href="/admin/faq">Back to FAQ</BackLink>
      <div className="mt-6 mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-brown">New FAQ Entry</h1>
        <p className="text-zinc-500 mt-1">Create a new question and answer for the FAQ page.</p>
      </div>

      <div className="mt-5">
        <FaqForm mode="create" action={createFaq} />
      </div>
    </div>
  );
}
