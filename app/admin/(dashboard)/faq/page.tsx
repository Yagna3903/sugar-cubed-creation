import PageHeader from "../../_components/PageHeader";
import FaqTable from "../../_components/FaqTable";
import BackButton from "@/components/BackButton";
export default async function AdminFaqPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="FAQ"
        subtitle="Manage questions and answers shown on the public site."
        ctaHref="/admin/faq/new"
        ctaLabel="Add FAQ"
      />
      <div className="rounded-2xl border bg-white p-0 shadow-soft">
        <FaqTable />
      </div>
    </div>
  );
}
