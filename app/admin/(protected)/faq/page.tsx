
export const dynamic = "force-dynamic";
import Link from "next/link";
import BackLink from "@/app/admin/_components/BackLink";
import { prisma } from "@/lib/db";
import { archiveFaq, restoreFaq, deleteFaq } from "./actions";

type PageProps = { searchParams?: { status?: string } };
type Status = "all" | "active" | "archived";

export default async function AdminFaqPage({ searchParams }: PageProps) {
  const raw = (searchParams?.status || "active").toLowerCase();
  const status: Status = raw === "all" || raw === "archived" ? (raw as Status) : "active";

  const where = status === "all" ? {} : { active: status === "active" };

  const faqs = await prisma.fAQ.findMany({
    where,
    orderBy: [{ sort: "asc" }, { createdAt: "desc" }],
  });
  type Row = (typeof faqs)[number];

  const Filter = ({ href, label, active }: { href: string; label: string; active: boolean }) => (
    <Link
      href={href}
      className={[
        "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
        active ? "bg-white text-brand-brown shadow-sm" : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <BackLink href="/admin" />

      <div className="mb-8 mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-brown">FAQ</h1>
          <p className="text-zinc-500 mt-1">Manage frequently asked questions</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <nav className="flex p-1 bg-zinc-100/80 rounded-xl border border-zinc-200/50" aria-label="Filter FAQ">
            <Filter href="/admin/faq?status=all" label="All" active={status === "all"} />
            <Filter href="/admin/faq?status=active" label="Active" active={status === "active"} />
            <Filter href="/admin/faq?status=archived" label="Archived" active={status === "archived"} />
          </nav>

          <Link
            href="/admin/faq/new"
            className="btn-primary text-sm py-2.5 px-5 shadow-lg shadow-brand-brown/20"
          >
            + New Entry
          </Link>
        </div>
      </div>

      {faqs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-brand-brown/5 shadow-soft p-12 text-center">
          <div className="w-16 h-16 bg-brand-brown/5 text-brand-brown rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-display text-xl font-bold text-brand-brown mb-2">No entries found</h3>
          <p className="text-zinc-500">
            {status === "active" ? "No active FAQs found." : status === "archived" ? "No archived FAQs found." : "Get started by creating your first FAQ entry."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faqs.map((f: Row) => (
            <div
              key={f.id}
              className="group bg-white rounded-3xl p-6 border border-brand-brown/5 shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <span
                  className={[
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border",
                    f.active ? "bg-green-50 text-green-700 border-green-100" : "bg-zinc-100 text-zinc-600 border-zinc-200",
                  ].join(" ")}
                >
                  {f.active ? "Active" : "Archived"}
                </span>
                {typeof f.sort === "number" && (
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-100">
                    #{f.sort}
                  </span>
                )}
              </div>

              <h3 className="font-display font-bold text-lg text-brand-brown mb-3 line-clamp-2 min-h-[3.5rem]">
                {f.question}
              </h3>

              <p className="text-sm text-zinc-600 line-clamp-3 mb-6 flex-grow">
                {f.answer}
              </p>

              <div className="pt-4 border-t border-brand-brown/5 flex items-center gap-2 mt-auto">
                <Link
                  href={`/admin/faq/${f.id}`}
                  className="flex-1 text-center py-2.5 rounded-xl bg-brand-brown/5 text-brand-brown font-bold text-sm hover:bg-brand-brown/10 transition-colors"
                >
                  Edit
                </Link>

                {f.active ? (
                  <form action={archiveFaq.bind(null, f.id)}>
                    <button className="p-2.5 rounded-xl border border-zinc-200 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-colors" title="Archive">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </button>
                  </form>
                ) : (
                  <>
                    <form action={restoreFaq.bind(null, f.id)}>
                      <button className="p-2.5 rounded-xl border border-zinc-200 text-zinc-400 hover:text-green-600 hover:bg-green-50 hover:border-green-200 transition-colors" title="Restore">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </form>
                    <form action={deleteFaq.bind(null, f.id)}>
                      <button className="p-2.5 rounded-xl border border-zinc-200 text-zinc-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors" title="Delete Permanently">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
