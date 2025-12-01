import { createOffer } from "../actions";
import OfferForm from "../OfferForm";
import { BackButton } from "@/components/ui/back-button";

export default function NewOfferPage() {
    return (
        <div className="p-4 md:p-6 max-w-5xl mx-auto">
            <div className="mb-6">
                <BackButton href="/admin/offers">Back to Offers</BackButton>
            </div>
            <h1 className="text-2xl font-bold mb-6">Create New Offer</h1>
            <div className="md:bg-white md:rounded-lg md:border md:p-6">
                <form action={createOffer}>
                    <OfferForm />
                </form>
            </div>
        </div>
    );
}
