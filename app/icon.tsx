import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
    width: 32,
    height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 24,
                    background: "transparent",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6b4226", // brand-brown
                }}
            >
                {/* Simple Cookie SVG */}
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M21.5 12a9.5 9.5 0 1 1-19 0 9.5 9.5 0 0 1 19 0Z" fill="#6b4226" />
                    <path d="M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="#fef5ed" />
                    <path d="M15.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="#fef5ed" />
                    <path d="M12 16a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="#fef5ed" />
                    <path d="M12 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="#fef5ed" />
                </svg>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    );
}
