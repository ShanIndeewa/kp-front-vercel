"use client";

import GlassCard from "@/components/ui/GlassCard";
import type { AscendantInfo, AyanamsaInfo, LocationUsed } from "@/types/api";
import { getPlanetColor } from "@/lib/utils/astrology";
import { Compass, Globe, Star } from "lucide-react";

interface AscendantCardProps {
    ascendant: AscendantInfo;
    ayanamsa: AyanamsaInfo;
    location: LocationUsed;
    date: string;
    time: string;
}

export default function AscendantCard({ ascendant, ayanamsa, location, date, time }: AscendantCardProps) {
    const lords = [
        { label: "Sign Lord", value: ascendant.sign_lord },
        { label: "Star Lord", value: ascendant.star_lord },
        { label: "Sub Lord", value: ascendant.sub_lord },
        { label: "Sub-Sub", value: ascendant.sub_sub_lord || "—" },
    ];

    return (
        <GlassCard glow style={{ position: "relative", overflow: "hidden" }}>
            {/* Glow */}
            <div style={{ position: "absolute", top: 0, right: 0, width: 128, height: 128, background: "var(--accent-gold)", borderRadius: "50%", filter: "blur(80px)", opacity: 0.1, pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ padding: 10, borderRadius: 12, background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(250,204,21,0.1))", border: "1px solid rgba(245,158,11,0.2)" }}>
                    <Compass style={{ width: 20, height: 20, color: "var(--accent-gold)" }} />
                </div>
                <div>
                    <h3 className="gradient-text-gold" style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
                        Ascendant (Lagna)
                    </h3>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {ascendant.sign} — {ascendant.longitude_dms}
                    </p>
                </div>
            </div>

            {/* Lords */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {lords.map((l) => (
                    <div key={l.label} style={{ padding: 10, borderRadius: 12, background: "var(--bg-tertiary)", border: "1px solid var(--border-glass)" }}>
                        <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--text-muted)", marginBottom: 4 }}>
                            {l.label}
                        </p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: getPlanetColor(l.value) }}>
                            {l.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Meta */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 12, borderTop: "1px solid var(--border-glass)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-muted)" }}>
                    <Globe style={{ width: 14, height: 14 }} />
                    <span>
                        {location.name || `${location.latitude}, ${location.longitude}`} • TZ {location.timezone >= 0 ? "+" : ""}{location.timezone}
                    </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-muted)" }}>
                    <Star style={{ width: 14, height: 14 }} />
                    <span>{date} at {time} • Ayanamsa: {ayanamsa.dms}</span>
                </div>
            </div>
        </GlassCard>
    );
}
