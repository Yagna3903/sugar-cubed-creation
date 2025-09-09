import dynamic from "next/dynamic"

const CheckoutClient = dynamic(() => import("@/components/checkout-client"), { ssr: false })

export default function CheckoutPage() {
  // Server Component wrapper: no event handlers here.
  return <CheckoutClient />
}
