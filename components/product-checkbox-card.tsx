import Image from "next/image";

interface ProductCheckboxCardProps {
    id: string;
    name: string;
    imageUrl: string;
    badges?: string[];
    selected: boolean;
    onToggle: (id: string) => void;
    customIcon?: React.ReactNode;
}

export default function ProductCheckboxCard({
    id,
    name,
    imageUrl,
    badges = [],
    selected,
    onToggle,
    customIcon,
}: ProductCheckboxCardProps) {
    return (
        <label
            className={`relative cursor-pointer group block rounded-xl border-2 transition-all duration-200 overflow-hidden ${selected
                ? "border-brand-brown bg-brand-cream/30 shadow-lg scale-[1.02]"
                : "border-zinc-200 bg-white hover:border-brand-brown/40 hover:shadow-md"
                }`}
        >
            <input
                type="checkbox"
                checked={selected}
                onChange={() => onToggle(id)}
                className="sr-only"
            />

            {/* Image or Custom Icon */}
            <div className={`relative aspect-square ${customIcon ? "bg-brand-cream/20 flex items-center justify-center" : "bg-zinc-100"}`}>
                {customIcon ? (
                    <div className="transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                        {customIcon}
                    </div>
                ) : (
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                )}
            </div>

            {/* Product info */}
            <div className="p-3 sm:p-4">
                <h3 className={`font-semibold text-sm sm:text-base mb-2 ${selected ? "text-brand-brown" : "text-zinc-900"}`}>
                    {name}
                </h3>

                {/* Badges */}
                {badges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {badges.map((badge) => (
                            <span
                                key={badge}
                                className="text-xs px-2 py-0.5 rounded-full bg-brand-pink/20 text-brand-brown font-medium"
                            >
                                {badge}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Selection indicator */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                <div
                    className={`h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${selected
                        ? "bg-brand-brown border-brand-brown"
                        : "bg-white border-zinc-300 group-hover:border-brand-brown/60"
                        }`}
                >
                    {selected && (
                        <svg className="h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
            </div>
        </label>
    );
}
