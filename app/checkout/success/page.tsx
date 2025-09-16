// app/checkout/success/page.tsx
import { Suspense } from "react";
import SuccessClient from "./success-client";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      <SuccessClient />
    </Suspense>
  );
}
