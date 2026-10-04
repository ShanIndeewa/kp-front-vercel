"use client";

import type { AscendantInfo, AyanamsaInfo, LocationUsed } from "@/types/api";
import { getPlanetAbbr, getPlanetColor } from "@/lib/utils/astrology";

interface AscendantCardProps {
    ascendant: AscendantInfo;
    ayanamsa: AyanamsaInfo;
    location: LocationUsed;
    date: string;
    time: string;
}

/** Long, compact Ascendant (Lagna) strip shown above the Ruling Planets panel. */
export default function AscendantCard({ ascendant, ayanamsa, location, date, time }: AscendantCardProps) {
    const lords = [
        { label: "Sign", value: ascendant.sign_lord },
        { label: "Star", value: ascendant.star_lord },
        { label: "Sub", value: ascendant.sub_lord },
        { label: "SSL", value: ascendant.sub_sub_lord },
        { label: "SSSL", value: ascendant.sub_sub_sub_lord },
    ];

    return (
        <div className="glass-card" style={{ padding: 0, overflow: "hidden", borderRadius: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap", padding: "8px 12px", background: "var(--accent-gold)", color: "#111" }}>
                <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>Ascendant (Lagna)</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{ascendant.sign} — {ascendant.longitude_dms}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", borderBottom: "1px solid var(--border-glass)" }}>
                {lords.map((l) => (
                    <div key={l.label} style={{ padding: "6px 8px", textAlign: "center", borderRight: "1px solid var(--border-glass)" }}>
                        <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-muted)" }}>{l.label}</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: l.value ? getPlanetColor(l.value) : "var(--text-muted)" }} title={l.value ?? undefined}>
                            {l.value ? getPlanetAbbr(l.value) : "—"}
                        </p>
                    </div>
                ))}
            </div>

            <p style={{ fontSize: 11, color: "var(--text-muted)", padding: "5px 12px" }}>
                {location.name?.split(",").slice(0, 2).join(",") || `${location.latitude}, ${location.longitude}`} • TZ {location.timezone >= 0 ? "+" : ""}{location.timezone}
                {" • "}{date} {time} • Ayanamsa {ayanamsa.dms}{ayanamsa.type ? ` (${ayanamsa.type})` : ""}
            </p>
        </div>
    );
}
