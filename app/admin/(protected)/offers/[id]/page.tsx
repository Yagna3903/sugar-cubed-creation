import { notFound } from "next/navigation";
import { getOfferById } from "@/lib/server/offers";
import { updateOffer } from "../actions";
import OfferForm from "../OfferForm";

export const dynamic = "force-dynamic";

export default async function EditOfferPage({ params }: { params: { id: string } }) {
    const offer = await getOfferById(params.id);

    if (!offer) {
        notFound();
    }

    const updateOfferWithId = updateOffer.bind(null, params.id);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Offer</h1>
            <div className="bg-white rounded-lg border p-6">
                <form action={updateOfferWithId}>
                    <OfferForm offer={offer} />
                </form>
            </div>
        </div>
    );
}
