import PageHeader from "../../_components/PageHeader";
import OrdersTable from "../../_components/OrdersTable";

export default async function OrdersPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Orders"
        subtitle="Track orders and update their status."
      />
      <div className="rounded-2xl border bg-white p-0 shadow-soft">
        <OrdersTable />
      </div>
    </div>
  );
}
