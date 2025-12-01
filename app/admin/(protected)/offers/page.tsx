import Link from "next/link";
import { getAllOffers, isOfferValid, deactivateExpiredOffers } from "@/lib/server/offers";
import { deleteOffer, toggleOfferActive } from "./actions";
import { format } from "date-fns";
import DeleteButton from "./DeleteButton";
import { IconGift } from "@/components/ui/bakery-icons";

export const dynamic = "force-dynamic";

export default async function OffersAdminPage() {
    // Auto-deactivate expired offers before loading
    await deactivateExpiredOffers();

    const offers = await getAllOffers();

    return (
        <div className="max-w-7xl mx-auto p-8">
            {/* Back Button */}
            <div className="mb-8">
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-full text-sm font-medium text-brand-brown hover:bg-zinc-50 hover:border-brand-brown/20 transition-all shadow-sm group"
                >
                    <svg
                        className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </Link>
            </div>

            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="font-display font-bold text-3xl text-brand-brown mb-2">Manage Offers</h1>
                    <p className="text-zinc-500">Create and manage promotional discounts for your store.</p>
                </div>
                <Link
                    href="/admin/offers/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-brown text-white rounded-xl font-medium shadow-soft hover:shadow-medium hover:-translate-y-0.5 transition-all duration-200"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Offer
                </Link>
            </div>

            {offers.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-brand-brown/5 shadow-soft">
                    <div className="w-16 h-16 bg-brand-brown/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconGift className="w-8 h-8 text-brand-brown" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-brand-brown mb-2">No offers yet</h3>
                    <p className="text-zinc-500 mb-6 max-w-sm mx-auto">Start creating special deals to engage your customers and boost sales.</p>
                    <Link
                        href="/admin/offers/new"
                        className="text-brand-brown font-medium hover:underline"
                    >
                        Create your first offer
                    </Link>
                </div>
            ) : (
                <>
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {offers.map((offer) => {
                            const now = new Date();
                            const isExpired = offer.validUntil < now;
                            const isPending = offer.validFrom > now;

                            return (
                                <div key={offer.id} className="bg-white rounded-2xl p-5 border border-brand-brown/10 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-display font-bold text-lg text-brand-brown">{offer.title}</h3>
                                            {offer.badge && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-600 mt-1">
                                                    {offer.badge}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            {offer.active ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-medium border border-zinc-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                                                    Inactive
                                                </span>
                                            )}
                                            {isExpired && (
                                                <span className="text-[10px] font-medium text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Expired</span>
                                            )}
                                            {isPending && (
                                                <span className="text-[10px] font-medium text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">Pending</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-5">
                                        <div className="flex justify-between text-sm p-3 bg-brand-cream/20 rounded-xl border border-brand-brown/5">
                                            <span className="text-zinc-500 font-medium">Discount</span>
                                            <span className="font-bold text-brand-brown">{offer.discountText}</span>
                                        </div>
                                        <div className="flex justify-between text-sm px-1">
                                            <span className="text-zinc-500">Valid From</span>
                                            <span className="text-zinc-900 font-medium">{format(offer.validFrom, "MMM d, yyyy")}</span>
                                        </div>
                                        <div className="flex justify-between text-sm px-1">
                                            <span className="text-zinc-500">Valid Until</span>
                                            <span className="text-zinc-900 font-medium">{format(offer.validUntil, "MMM d, yyyy")}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-100">
                                        <Link
                                            href={`/admin/offers/${offer.id}`}
                                            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-50 text-zinc-700 text-sm font-medium hover:bg-zinc-100 transition-colors border border-zinc-200"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </Link>

                                        <form action={toggleOfferActive.bind(null, offer.id, offer.active)} className="w-full">
                                            <button
                                                type="submit"
                                                className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border ${offer.active
                                                    ? "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100"
                                                    : "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
                                                    }`}
                                            >
                                                {offer.active ? (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Hide
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        </svg>
                                                        Show
                                                    </>
                                                )}
                                            </button>
                                        </form>

                                        <form action={deleteOffer.bind(null, offer.id)} className="w-full">
                                            <DeleteButton />
                                        </form>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-3xl border border-brand-brown/5 shadow-soft overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-brand-cream/30 border-b border-brand-brown/5">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-brand-brown uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-brand-brown uppercase tracking-wider">Discount</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-brand-brown uppercase tracking-wider">Valid Period</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-brand-brown uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-brand-brown uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-brown/5">
                                    {offers.map((offer) => {
                                        const isValid = isOfferValid(offer);
                                        const now = new Date();
                                        const isExpired = offer.validUntil < now;
                                        const isPending = offer.validFrom > now;

                                        return (
                                            <tr key={offer.id} className="hover:bg-brand-cream/10 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-display font-bold text-brand-brown">{offer.title}</div>
                                                    {offer.badge && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-600 mt-1">
                                                            {offer.badge}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-brand-brown/5 text-brand-brown font-bold text-sm">
                                                        {offer.discountText}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-zinc-600">
                                                    <div className="font-medium">{format(offer.validFrom, "MMM d, yyyy")}</div>
                                                    <div className="text-xs opacity-70">to {format(offer.validUntil, "MMM d, yyyy")}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1 items-start">
                                                        {offer.active ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                                Active
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-medium border border-zinc-200">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                                                                Inactive
                                                            </span>
                                                        )}

                                                        {isExpired && (
                                                            <span className="text-[10px] font-medium text-red-500 bg-red-50 px-1.5 py-0.5 rounded ml-1">Expired</span>
                                                        )}
                                                        {isPending && (
                                                            <span className="text-[10px] font-medium text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded ml-1">Pending</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/admin/offers/${offer.id}`}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-brand-brown hover:bg-brand-brown/5 transition-colors"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                            Edit
                                                        </Link>

                                                        <form action={toggleOfferActive.bind(null, offer.id, offer.active)}>
                                                            <button
                                                                type="submit"
                                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${offer.active
                                                                    ? "text-amber-600 hover:bg-amber-50"
                                                                    : "text-green-600 hover:bg-green-50"
                                                                    }`}
                                                            >
                                                                {offer.active ? (
                                                                    <>
                                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        Deactivate
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                                        </svg>
                                                                        Activate
                                                                    </>
                                                                )}
                                                            </button>
                                                        </form>

                                                        <form action={deleteOffer.bind(null, offer.id)}>
                                                            <DeleteButton />
                                                        </form>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )
            }
        </div >
    );
}
