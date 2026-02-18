"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { useAppStore } from "@/lib/store";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function ThemeInitializer({ children }: { children: ReactNode }) {
    const theme = useAppStore((s) => s.theme);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        setMounted(true);
    }, [theme]);

    if (!mounted) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: "#0a0e1a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        width: 40,
                        height: 40,
                        border: "3px solid rgba(168,85,247,0.3)",
                        borderTopColor: "#a855f7",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                    }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return <>{children}</>;
}

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeInitializer>{children}</ThemeInitializer>
        </QueryClientProvider>
    );
}
