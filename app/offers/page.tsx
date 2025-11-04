import { promos } from "@/lib/data"
export default function OffersPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">Offers</h1>
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {promos.map(p => (
          <div key={p.title} className="rounded-2xl bg-white p-6 shadow-soft">
            <div className="text-xl font-semibold">{p.title}</div>
            <p className="mt-2 opacity-80">{p.blurb}</p>
            <a className="underline mt-3 inline-block" href={p.href}>{p.cta}</a>
          </div>
        ))}
      </div>
    </section>
  )
}
