"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export default function AutoLogout() {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const resetTimer = () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(async () => {
                await supabase.auth.signOut();
                router.push("/admin/login");
                router.refresh();
            }, TIMEOUT_MS);
        };

        // Initial start
        resetTimer();

        // Listeners
        const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
        const handleActivity = () => resetTimer();

        events.forEach((event) => window.addEventListener(event, handleActivity));

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach((event) => window.removeEventListener(event, handleActivity));
        };
    }, [router, supabase]);

    return null;
}
