
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
        "rounded-full border px-3 py-1.5 text-sm transition",
        active ? "bg-zinc-900 text-white border-zinc-900" : "bg-white hover:bg-zinc-50",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );

  return (
    <div>
      <BackLink href="/admin" />

      <div className="mb-4 mt-3 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">FAQ</h1>

        <nav className="flex items-center gap-2" aria-label="Filter FAQ">
          <Filter href="/admin/faq?status=all" label="All" active={status === "all"} />
          <Filter href="/admin/faq?status=active" label="Active" active={status === "active"} />
          <Filter href="/admin/faq?status=archived" label="Archived" active={status === "archived"} />
        </nav>

        <Link href="/admin/faq/new" className="rounded-xl bg-brand-brown px-4 py-2 text-white">
          New entry
        </Link>
      </div>

      {faqs.length === 0 ? (
        <p className="text-zinc-600">
          {status === "active" ? "No active entries." : status === "archived" ? "No archived entries." : "No entries yet."}
        </p>
      ) : (
        <div className="divide-y rounded-2xl border bg-white">
          {faqs.map((f: Row) => (
            <div key={f.id} className="grid grid-cols-12 items-start gap-4 p-4">
              <div className="col-span-8">
                <div className="flex items-center gap-2">
                  <Link href={`/admin/faq/${f.id}`} className="font-medium hover:underline">
                    {f.question}
                  </Link>
                  <span
                    className={[
                      "rounded-full px-2 py-0.5 text-xs",
                      f.active ? "bg-green-100 text-green-800" : "bg-zinc-100 text-zinc-700",
                    ].join(" ")}
                  >
                    {f.active ? "Active" : "Archived"}
                  </span>
                  {typeof f.sort === "number" && (
                    <span className="text-xs text-zinc-500">• sort {f.sort}</span>
                  )}
                </div>
                <div className="mt-1 line-clamp-2 text-sm text-zinc-600">{f.answer}</div>
              </div>

              <div className="col-span-4 flex justify-end gap-2">
                <Link href={`/admin/faq/${f.id}`} className="rounded-xl border px-3 py-1.5 text-sm">
                  Edit
                </Link>
                {f.active ? (
                  <form action={archiveFaq.bind(null, f.id)}>
                    <button className="rounded-xl border px-3 py-1.5 text-sm text-zinc-700">Archive</button>
                  </form>
                ) : (
                  <>
                    <form action={restoreFaq.bind(null, f.id)}>
                      <button className="rounded-xl border px-3 py-1.5 text-sm text-zinc-700">Restore</button>
                    </form>
                    <form action={deleteFaq.bind(null, f.id)}>
                      <button className="rounded-xl border px-3 py-1.5 text-sm text-red-700">
                        Delete permanently
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
