// app/admin/(protected)/products/new/page.tsx

import BackLink from "../../../_components/BackLink";
import ProductForm from "../_form";
import { createProduct } from "../actions";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <section className="mx-auto max-w-3xl">
      <BackLink href="/admin/products">Back to Products</BackLink>

      <h1 className="mt-3 text-2xl font-semibold">New product</h1>

      <div className="mt-6">
        <ProductForm mode="new" action={createProduct} />
      </div>
    </section>
  );
}
