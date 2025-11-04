// app/providers.tsx
"use client";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  // No global provider required; Supabase helpers handle auth.
  return <>{children}</>;
}
