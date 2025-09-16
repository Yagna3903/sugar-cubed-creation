// app/admin/(protected)/products/new/page.tsx
import ProductForm from "../_form";
import { createProduct } from "../actions";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold">New product</h1>
      <ProductForm mode="create" action={createProduct as any} />
    </div>
  );
}
