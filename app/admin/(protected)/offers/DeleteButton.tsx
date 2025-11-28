"use client";

export default function DeleteButton() {
    return (
        <button
            type="submit"
            className="text-sm text-red-600 hover:underline"
            onClick={(e) => {
                if (!confirm("Delete this offer?")) e.preventDefault();
            }}
        >
            Delete
        </button>
    );
}
