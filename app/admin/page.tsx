// app/admin/page.tsx (NextAuth v4)
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminHome() {
  const session = await getServerSession(authOptions); // Session | null

  return (
    <div>
      <h1 className="text-2xl font-semibold">
        Welcome{session?.user?.email ? `, ${session.user.email}` : ""} 
      </h1>
      <p className="mt-2 text-zinc-600">
        Use the nav to manage products, orders, and inventory.
      </p>
    </div>
  );
}
