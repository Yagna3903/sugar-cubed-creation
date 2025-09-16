import BackLink from "../../../_components/BackLink";
import { createProduct } from "../actions";

export default function NewProductPage() {
  return (
    <section className="mx-auto max-w-3xl">
      <BackLink href="/admin/products">Back to Products</BackLink>

      <h1 className="mt-3 text-2xl font-semibold">New product</h1>

      <form
        action={createProduct}
        encType="multipart/form-data"
        className="mt-6 space-y-4"
      >
        <div>
          <label className="block text-sm text-zinc-600">Name</label>
          <input
            name="name"
            required
            className="w-full rounded-xl border px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-600">Slug</label>
          <input
            name="slug"
            placeholder="classic-vanilla-sugar"
            required
            className="w-full rounded-xl border px-4 py-2"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Letters, numbers, dashes only. Used in URLs.
          </p>
        </div>

        <div>
          <label className="block text-sm text-zinc-600">Price (CAD)</label>
          <input
            name="price"
            placeholder="4.25"
            inputMode="decimal"
            className="w-full rounded-xl border px-4 py-2"
            defaultValue="4.25"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-600">Description</label>
          <textarea
            name="description"
            rows={4}
            className="w-full rounded-xl border px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-600">
            Badges (comma separated)
          </label>
          <input
            name="badges" // e.g. "seasonal,best-seller"
            placeholder="seasonal, best-seller"
            className="w-full rounded-xl border px-4 py-2"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="active" defaultChecked /> Active
          </label>
          <div>
            <label className="block text-sm text-zinc-600">Stock</label>
            <input
              type="number"
              name="stock"
              min={0}
              defaultValue={0}
              className="w-full rounded-xl border px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-600">Max per order</label>
            <input
              type="number"
              name="maxPerOrder"
              min={1}
              defaultValue={12}
              className="w-full rounded-xl border px-4 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-600">Image</label>
          <input type="file" name="image" accept="image/*" className="block" />
        </div>

        <button className="rounded-xl bg-brand-brown px-4 py-2 text-white">
          Create product
        </button>
      </form>
    </section>
  );
}
