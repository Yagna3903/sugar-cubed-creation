"use client";
import { useState } from "react";
import Link from "next/link";
import BackButton from "@/components/BackButton";
export default function CorporateInquiryPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    product: "",
  });
  function onChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const onChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => setForm({ ...form, [e.target.name]: e.target.value });
  }
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY || ""); // ✅ your Web3Forms key
    formData.append("name", form.name);
    formData.append("company", form.company);
    formData.append("email", form.email);
    formData.append("product", form.product);

    // Auto-responder setup
    formData.append("replyto", form.email); // ✅ customer gets confirmation
    formData.append("from_name", "Sugar Cubed Creations"); // your brand name

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSent(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending form. Try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold">Thanks — message sent!</h1>
        <p className="mt-3 opacity-80">
          Your corporate inquiry has been submitted. A confirmation has been
          emailed to <b>{form.email}</b>.
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
      <div className="mb-4">
        <BackButton fallbackHref="/" label="Back" />
      </div>
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
            What are you inquiring about?
          </span>
          <textarea
            name="product" // or rename to "inquiry" if you’ll update the backend too
            value={form.product}
            onChange={onChange}
            required
            rows={3}
            maxLength={500}
            placeholder="Tell us what you need (quantity, size, date, logo, flavours, etc.)"
            className="border rounded-xl px-3 py-2"
          />
        </label>

        <div className="mt-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-brand-brown text-white px-6 py-3"
          >
            {submitting ? "Sending..." : "Submit inquiry"}
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
