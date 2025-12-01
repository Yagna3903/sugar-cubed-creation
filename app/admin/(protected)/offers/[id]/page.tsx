import { notFound } from "next/navigation";
import { getOfferById } from "@/lib/server/offers";
import { updateOffer } from "../actions";
import OfferForm from "../OfferForm";
import { BackButton } from "@/components/ui/back-button";

export const dynamic = "force-dynamic";

export default async function EditOfferPage({ params }: { params: { id: string } }) {
    const offer = await getOfferById(params.id);

    if (!offer) {
        notFound();
    }

    const updateOfferWithId = updateOffer.bind(null, params.id);

    return (
        <div className="p-4 md:p-6 max-w-5xl mx-auto">
            <div className="mb-6">
                <BackButton href="/admin/offers">Back to Offers</BackButton>
            </div>
            <h1 className="text-2xl font-bold mb-6">Edit Offer</h1>
            <div className="md:bg-white md:rounded-lg md:border md:p-6">
                <form action={updateOfferWithId}>
                    <OfferForm offer={offer} />
                </form>
            </div>
        </div>
    );
}
