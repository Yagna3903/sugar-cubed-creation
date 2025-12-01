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
        <div className="max-w-7xl mx-auto p-4 sm:p-8">
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

            <div className="mb-10">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="font-display font-bold text-3xl text-brand-brown">Manage Offers</h1>
                    <Link
                        href="/admin/offers/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-brown text-white rounded-md font-medium shadow-soft hover:shadow-medium hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                    >
                        Create + New Offer
                    </Link>
                </div>
                <p className="text-zinc-500 text-sm mt-2">Create and manage promotional discounts for your store.</p>
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
                <div className="bg-white rounded-3xl border border-brand-brown/5 shadow-soft overflow-hidden">
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
                                                <div className="font-display font-bold text-brand-brown text-sm">{offer.title}</div>
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
                                            <td className="px-6 py-4 text-xs text-zinc-600">
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
            )}
        </div>
    );
}
