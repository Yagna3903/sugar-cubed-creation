import PageHeader from "../../_components/PageHeader";
import ProductsTable from "../../_components/ProductsTable";

export default async function ProductsPage() {
  // In the future: fetch products on the server and pass as props.
  return (
    <div className="space-y-4">
      <PageHeader
        title="Products"
        subtitle="Add, edit, and archive products."
        ctaHref="/admin/products/new"
        ctaLabel="Add product"
      />
      <div className="rounded-2xl border bg-white p-0 shadow-soft">
        <ProductsTable />
      </div>
    </div>
  );
}
