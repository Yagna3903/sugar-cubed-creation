import BackLink from "../../_components/BackLink";

export default function AdminOrdersPage() {
  return (
    <div>
      <BackLink href="/admin">Back to Admin</BackLink>
      <h1 className="mt-2 text-2xl font-semibold">Orders</h1>
      {/* Orders table/list will go here */}
    </div>
  );
}
