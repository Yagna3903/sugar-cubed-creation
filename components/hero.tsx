import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export function Hero() {
  return (
    <section className="bg-brand-pink/40">
      <div className="mx-auto max-w-7xl px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Gift for your mood
          </h1>
          <p className="mt-4 text-lg opacity-80">
            Freshly baked, chunky, mood-lifting cookies.
          </p>
          <div className="mt-6">
            <Link
              href="/shop"
              className="rounded-xl bg-brand-brown text-white px-6 py-3"
            >
              Shop Now
            </Link>
          </div>
        </div>
        {/*<div className="aspect-square rounded-2xl bg-white shadow-soft" /> */}
        <div className="relative aspect-square rounded-2xl bg-white shadow-soft overflow-hidden group">
          {/* optional soft tint */}
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
