"use client";

export function BakingCookie() {
  return (
    <div className="absolute top-12 right-8 animate-float-gentle">
      <div className="relative w-24 h-24">
        {/* Cookie base - animates through baking stages */}
        <div className="absolute inset-0 rounded-full animate-baking-cookie">
          {/* Raw dough stage */}
          <div className="absolute inset-0 rounded-full bg-amber-100 border-4 border-amber-200 animate-baking-stage-1" />
          
          {/* Baking stage */}
          <div className="absolute inset-0 rounded-full bg-amber-200 border-4 border-amber-300 animate-baking-stage-2" />
          
          {/* Golden brown stage */}
          <div className="absolute inset-0 rounded-full bg-amber-400 border-4 border-amber-500 animate-baking-stage-3" />
          
          {/* Chocolate chips - appear during baking */}
          <div className="absolute inset-0 animate-chips-appear">
            {/* Chip 1 */}
            <div className="absolute top-1/4 left-1/4 w-2.5 h-2.5 rounded-full bg-brand-brown" />
            {/* Chip 2 */}
            <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-brand-brown" />
            {/* Chip 3 */}
            <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-brand-brown" />
            {/* Chip 4 */}
            <div className="absolute bottom-1/4 right-1/3 w-2.5 h-2.5 rounded-full bg-brand-brown" />
            {/* Chip 5 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-brown" />
          </div>
          
          {/* Steam effect when hot */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-steam">
            <div className="w-1 h-6 bg-gradient-to-t from-zinc-400/40 to-transparent rounded-full blur-sm" />
          </div>
          <div className="absolute -top-10 left-1/3 animate-steam" style={{ animationDelay: '0.3s' }}>
            <div className="w-1 h-8 bg-gradient-to-t from-zinc-400/30 to-transparent rounded-full blur-sm" />
          </div>
          <div className="absolute -top-9 right-1/3 animate-steam" style={{ animationDelay: '0.6s' }}>
            <div className="w-1 h-7 bg-gradient-to-t from-zinc-400/35 to-transparent rounded-full blur-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
