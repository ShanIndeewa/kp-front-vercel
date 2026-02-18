"use client";

import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Palette } from "lucide-react";
import type { ThemeId, ThemeOption } from "@/types/api";

const THEMES: ThemeOption[] = [
    { id: "cosmic", name: "Cosmic Dark", icon: "🌌", preview: "#0a0e1a" },
    { id: "light", name: "Light", icon: "☀️", preview: "#f8fafc" },
    { id: "emerald", name: "Emerald", icon: "💚", preview: "#022c22" },
    { id: "amethyst", name: "Amethyst", icon: "💜", preview: "#1a0533" },
];

export default function ThemeSelector() {
    const { theme, setTheme } = useAppStore();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    return (
        <div style={{ position: "relative" }} ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 12px", borderRadius: 12,
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-glass)",
                    cursor: "pointer", transition: "all 0.3s",
                }}
                aria-label="Change theme"
            >
                <Palette style={{ width: 16, height: 16, color: "var(--accent-purple)" }} />
                <span className="hidden sm:inline" style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>
                    {THEMES.find((t) => t.id === theme)?.name}
                </span>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="glass-card"
                        style={{ position: "absolute", right: 0, top: "100%", marginTop: 8, padding: 8, minWidth: 180, zIndex: 50 }}
                    >
                        {THEMES.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => { setTheme(t.id as ThemeId); setOpen(false); }}
                                className={theme === t.id ? "loc-selected" : "loc-unselected"}
                                style={{
                                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                                    padding: "10px 12px", borderRadius: 8,
                                    border: "none", cursor: "pointer", transition: "all 0.2s",
                                    background: theme === t.id ? undefined : "transparent",
                                }}
                            >
                                <div style={{
                                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                                    backgroundColor: t.preview,
                                    border: `2px solid ${theme === t.id ? "var(--accent-purple)" : "var(--border-glass)"}`,
                                }} />
                                <span style={{ fontSize: 14, fontWeight: 500 }}>{t.icon} {t.name}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
