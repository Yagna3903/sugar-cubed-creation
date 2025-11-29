"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Helper to determine step status
    const getStepStatus = (stepPath: string) => {
        if (pathname === stepPath) return "current";

        const order = ["/cart", "/checkout", "/checkout/payment", "/checkout/success"];
        const currentIndex = order.indexOf(pathname);
        const stepIndex = order.indexOf(stepPath);

        if (currentIndex > stepIndex) return "completed";
        return "upcoming";
    };

    const steps = [
        { name: "Cart", href: "/cart", status: "completed" }, // Cart is always completed when in checkout
        { name: "Info", href: "/checkout", status: getStepStatus("/checkout") },
        { name: "Payment", href: "/checkout/payment", status: getStepStatus("/checkout/payment") },
        { name: "Done", href: "/checkout/success", status: getStepStatus("/checkout/success") },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-brand-cream/20 to-white">
            <div className="mx-auto max-w-3xl px-4 pt-8 pb-16">
                {/* Progress Stepper */}
                <nav aria-label="Progress" className="mb-12 select-none">
                    <ol role="list" className="flex items-center justify-center w-full relative z-0">
                        {steps.map((step, stepIdx) => (
                            <li key={step.name} className="relative flex flex-col items-center flex-1">
                                {/* Connector Line */}
                                {stepIdx !== 0 && (
                                    <div
                                        className={cn(
                                            "absolute top-4 left-[calc(-50%+1rem)] right-[calc(50%+1rem)] h-[2px] -z-10 transition-colors duration-300",
                                            step.status === "completed" || step.status === "current"
                                                ? "bg-brand-brown"
                                                : "bg-zinc-200"
                                        )}
                                        aria-hidden="true"
                                    />
                                )}

                                {/* Step Circle */}
                                <div className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 bg-white",
                                    step.status === "completed" ? "border-brand-brown bg-brand-brown text-white" :
                                        step.status === "current" ? "border-brand-brown text-brand-brown" :
                                            "border-zinc-200 text-zinc-300"
                                )}>
                                    {step.status === "completed" ? (
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <span>{stepIdx + 1}</span>
                                    )}
                                </div>

                                {/* Step Label */}
                                <span className={cn(
                                    "mt-2 text-[10px] uppercase tracking-wider font-bold transition-colors duration-300",
                                    step.status === "upcoming" ? "text-zinc-300" : "text-brand-brown"
                                )}>
                                    {step.name}
                                </span>
                            </li>
                        ))}
                    </ol>
                </nav>

                {children}
            </div>
        </div>
    );
}
