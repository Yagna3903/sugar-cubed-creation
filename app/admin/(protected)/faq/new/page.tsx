import BackLink from "@/app/admin/_components/BackLink";
import FaqForm from "../_form";
import { createFaq } from "../actions";

export default function NewFaqPage() {
  return (
    <section className="mx-auto max-w-3xl">
      <BackLink href="/admin/faq">Back to FAQ</BackLink>
      <h1 className="mt-3 text-2xl font-semibold">New FAQ entry</h1>

      <div className="mt-5">
        <FaqForm mode="create" action={createFaq} />
      </div>
    </section>
  );
}
