// export default function OurStoryPage() {
//   return (
//     <section className="mx-auto max-w-5xl px-6 py-10">
//       <h1 className="text-3xl font-bold">My Story</h1>
//       <p className="mt-4 opacity-80">
//         Born from a tiny kitchen and a big love for cookies. Replace with your
//         client&apos;s real story.
//       </p>
//       <div className="mt-8 rounded-2xl bg-white p-6 shadow-soft">
//         <div className="aspect-video rounded-xl bg-black/5" />
//         <p className="mt-4 text-sm opacity-70">Video placeholder</p>
//       </div>
//     </section>
//   );
// }
export default function OurStoryPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 bg-gradient-to-b from-[#fff8f5] to-[#fff0eb] rounded-3xl shadow-inner">
      <h1 className="text-4xl font-serif font-bold text-center text-neutral-900">
        Our Story
      </h1>

      <p className="mt-4 text-center text-neutral-700 opacity-90 max-w-2xl mx-auto">
        What started as a small passion project in a cozy home kitchen quickly
        grew into a beloved brand. Sugar Cubed Creations was born from a love of
        baking, art, and spreading joy through handcrafted cookies — one smile
        at a time.
      </p>

      {/* Image grid */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl overflow-hidden shadow-card">
          <img
            src="/images/owner1.png"
            alt="Owner baking cookies"
            className="w-full h-[350px] object-cover"
          />
        </div>
        <div className="rounded-2xl overflow-hidden shadow-card">
          <img
            src="/images/owner2.png"
            alt="Decorating sugar cookies"
            className="w-full h-[350px] object-cover"
          />
        </div>
        <div className="rounded-2xl overflow-hidden shadow-card sm:block hidden">
          <img
            src="/images/owner3.png"
            alt="Packaging cookie boxes"
            className="w-full h-[350px] object-cover"
          />
        </div>
      </div>

      {/* Story paragraph */}
      <div className="mt-10 bg-white/70 backdrop-blur rounded-2xl p-6 sm:p-10 shadow-soft">
        <p className="text-lg leading-relaxed text-neutral-800">
          Hi! I’m <span className="font-semibold text-sugar-700">Heather</span>
          , the creator behind Sugar Cubed Creations. My journey began in a
          small kitchen where the scent of freshly baked cookies filled every
          corner. Each batch is made with love, care, and a touch of creativity.
          Over time, what started as a weekend hobby turned into a full-time
          dream — bringing sweet moments to families, celebrations, and friends
          across our community.
          <br />
          <br />
          From hand-piped icing to personalized designs, every treat reflects my
          belief that cookies aren’t just desserts — they’re tiny works of art
          that connect people. Thank you for supporting my small business and
          being part of this sugary adventure.
        </p>
      </div>
    </section>
  );
}
