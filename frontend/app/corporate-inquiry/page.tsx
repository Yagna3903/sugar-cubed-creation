"use client";
import { useState } from "react";
import Link from "next/link";

export default function CorporateInquiryPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    product: "",
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Front-end demo only. Hook this up to an API/email service later.
    setSent(true);
  };

  if (sent) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold">Thanks — message sent!</h1>
        <p className="mt-3 opacity-80">
          Your corporate inquiry has been submitted. A confirmation will be
          emailed to you shortly.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/" className="rounded-xl border px-5 py-3">
            Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Corporate inquiry</h1>
      <p className="mt-2 text-sm opacity-70">
        Printed logo cookies for events and corporate gifting. Fill this quick
        form and we’ll email you a confirmation.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-6 grid gap-4 rounded-2xl border bg-white p-6"
      >
        <label className="grid gap-1">
          <span className="text-sm font-medium">Full name</span>
          <input
            className="border rounded-xl px-3 py-2"
            name="name"
            value={form.name}
            onChange={onChange}
            required
            placeholder="Jane Doe"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Company name</span>
          <input
            className="border rounded-xl px-3 py-2"
            name="company"
            value={form.company}
            onChange={onChange}
            placeholder="Acme Inc."
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Email</span>
          <input
            className="border rounded-xl px-3 py-2"
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
            placeholder="you@company.com"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">
            What cookies are you inquiring about?
          </span>
          <select
            className="border rounded-xl px-3 py-2"
            name="product"
            value={form.product}
            onChange={onChange}
            required
          >
            <option value="" disabled>
              Select a cookie
            </option>
            <option>Printed Logo — Vanilla</option>
            <option>Printed Logo — Chocolate Chip</option>
            <option>Holiday Themed</option>
            <option>Classic Vanilla Sugar Cookie</option>
          </select>
        </label>

        <div className="mt-2">
          <button className="rounded-xl bg-brand-brown text-white px-6 py-3">
            Submit inquiry
          </button>
        </div>

        <p className="text-xs opacity-60">
          Custom cookies are printed on a food-safe printer (not hand-piped).
          Standard flavour is vanilla; corporate cookies also available in
          chocolate chip.
        </p>
      </form>
    </section>
  );
}
