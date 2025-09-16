// app/admin/(protected)/page.tsx
import { getServerSession } from "next-auth"; // or "next-auth/next"
import { authOptions } from "@/lib/auth";

export default async function AdminHome() {
  const session = await getServerSession(authOptions);

  const name =
    (session?.user as { name?: string } | null)?.name ?? "Admin";
  const email =
    (session?.user as { email?: string } | null)?.email ?? undefined;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Welcome, {name}</h1>
      {email && (
        <p className="mt-2 text-zinc-600">
          Signed in as {email}. Use the nav to manage products, orders, and FAQ.
        </p>
      )}
    </div>
  );
}
