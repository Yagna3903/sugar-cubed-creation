import Link from "next/link";
import { getAllOffers, isOfferValid } from "@/lib/server/offers";
import { deleteOffer, toggleOfferActive } from "./actions";
import { format } from "date-fns";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function OffersAdminPage() {
    const offers = await getAllOffers();

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Manage Offers</h1>
                <Link
                    href="/admin/offers/new"
                    className="px-4 py-2 bg-brand-brown text-white rounded-lg hover:bg-brand-brown/90 transition"
                >
                    + Create New Offer
                </Link>
            </div>

            {offers.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border">
                    <p className="text-zinc-500 mb-4">No offers yet</p>
                    <Link
                        href="/admin/offers/new"
                        className="text-brand-brown hover:underline"
                    >
                        Create your first offer
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-lg border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-zinc-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Discount</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Valid Period</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offers.map((offer) => {
                                const isValid = isOfferValid(offer);
                                const now = new Date();
                                const isExpired = offer.validUntil < now;
                                const isPending = offer.validFrom > now;

                                return (
                                    <tr key={offer.id} className="border-b last:border-0 hover:bg-zinc-50">
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{offer.title}</div>
                                            {offer.badge && (
                                                <span className="text-xs text-zinc-500">{offer.badge}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-brand-brown">
                                            {offer.discountText}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <div>{format(offer.validFrom, "MMM d, yyyy")}</div>
                                            <div className="text-zinc-500">to {format(offer.validUntil, "MMM d, yyyy")}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-1">
                                                {offer.active ? (
                                                    <span className="text-green-600 text-sm font-medium">Active</span>
                                                ) : (
                                                    <span className="text-zinc-400 text-sm font-medium">Inactive</span>
                                                )}
                                                {isExpired && <span className="text-red-600 text-xs">Expired</span>}
                                                {isPending && <span className="text-blue-600 text-xs">Pending</span>}
                                                {isValid && <span className="text-green-600 text-xs">✓ Live</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/admin/offers/${offer.id}`}
                                                    className="text-sm text-brand-brown hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <form action={toggleOfferActive.bind(null, offer.id, offer.active)}>
                                                    <button
                                                        type="submit"
                                                        className="text-sm text-blue-600 hover:underline"
                                                    >
                                                        {offer.active ? "Deactivate" : "Activate"}
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
            )}
        </div>
    );
}
