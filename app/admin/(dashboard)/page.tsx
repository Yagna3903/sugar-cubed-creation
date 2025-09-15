import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminHome() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Welcome Admin,</h1>
      <p className="mt-2 text-zinc-600">
        Use the nav to manage products, orders, and FAQ.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <a
          href="/admin/products"
          className="rounded-2xl border bg-white p-5 shadow-soft"
        >
          <div className="text-lg font-medium">Products</div>
          <div className="text-sm text-zinc-600 mt-1">
            Add, edit, archive items
          </div>
        </a>
        <a
          href="/admin/orders"
          className="rounded-2xl border bg-white p-5 shadow-soft"
        >
          <div className="text-lg font-medium">Orders</div>
          <div className="text-sm text-zinc-600 mt-1">Status & details</div>
        </a>
        <a
          href="/admin/faq"
          className="rounded-2xl border bg-white p-5 shadow-soft"
        >
          <div className="text-lg font-medium">FAQs</div>
          <div className="text-sm text-zinc-600 mt-1">Edit FAQ</div>
        </a>
      </div>
    </div>
  );
}
