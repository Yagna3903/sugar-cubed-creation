"use client"
import { useState } from "react"

export default function CheckoutClient() {
  const [confirmed, setConfirmed] = useState(false)

  if (confirmed) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-bold">Order received 🎉</h1>
          <p className="mt-3 opacity-80">
            A confirmation email has been sent to the owner. They will review your order and <strong>approve or deny</strong> it.
            You will be notified about the status <strong>via email</strong>.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <p className="mt-2 opacity-80">
        UI only. After placing your order, an email is sent to the owner for approval.
        You'll be notified by email of approval/denial.
      </p>
      <form className="mt-6 grid gap-4" onSubmit={(e)=>{ e.preventDefault(); setConfirmed(true); }}>
        <input className="border rounded-xl px-3 py-2" placeholder="Full name" />
        <input className="border rounded-xl px-3 py-2" placeholder="Email" type="email" />
        <input className="border rounded-xl px-3 py-2" placeholder="Address" />
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded-xl px-3 py-2" placeholder="City" />
          <input className="border rounded-xl px-3 py-2" placeholder="Postal code" />
        </div>
        <button className="rounded-xl bg-brand-brown text-white px-6 py-3">Place order</button>
      </form>
    </section>
  )
}
