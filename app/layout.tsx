// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Providers from "./providers";
import { Analytics } from "@vercel/analytics/react";

import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Sugar Cubed Creations",
  description: "Fresh, chunky, mood-lifting cookies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
