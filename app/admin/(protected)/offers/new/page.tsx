import { createOffer } from "../actions";
import OfferForm from "../OfferForm";

export default function NewOfferPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Offer</h1>
            <div className="bg-white rounded-lg border p-6">
                <form action={createOffer}>
                    <OfferForm />
                </form>
            </div>
        </div>
    );
}
