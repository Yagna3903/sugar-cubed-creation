// app/admin/login/layout.tsx
//export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
//  return <>{children}</>;
//  }
// app/admin/(auth)/login/layout.tsx
// export default function AdminLoginLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // No header here on purpose. This avoids the dashboard nav on the login page.
//   return <div className="min-h-screen bg-cream">{children}</div>;
// }
export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // bare layout, no admin header here
  return <div className="min-h-screen bg-cream">{children}</div>;
}
