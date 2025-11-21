import Link from "next/link";
import Image from "next/image";
import { Fraunces, Poppins } from "next/font/google";
export const dynamic = "force-dynamic";
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const poppins = Poppins({
  weight: ["300", "400", "600"],
  subsets: ["latin"],
  variable: "--font-poppins",
});
export function Hero() {
  return (
    <section className="bg-brand-pink/40">
      <div className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-brand-brown">
            Gift for your mood
          </h1>

          <p className="mt-5 font-body text-xl text-brand-brown/80 leading-relaxed">
            Freshly baked, mood-lifting cookies.
          </p>

          <div className="mt-10">
            <Link
              href="/shop"
              className="rounded-full bg-brand-brown text-white px-8 py-3.5 text-lg font-semibold shadow-sm 
              transition-all duration-200 
              hover:bg-white hover:text-brand-brown hover:ring-2 hover:ring-brand-brown"
            >
              Shop Now
            </Link>
          </div>
        </div>

        <div className="relative aspect-square rounded-2xl bg-white shadow-soft overflow-hidden group">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_30%_20%,#fce7ef_0_45%,transparent_60%)]" />
          <Image
            src="/images/image.png" // place file in /public/images/
            alt="Stack of holiday cookies"
            fill
            priority
            // className="object-contain p-6 transition-transform duration-300 ease-out
            //            group-hover:scale-105 group-hover:-rotate-0"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </section>
  );
}
