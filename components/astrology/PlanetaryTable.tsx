"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import type { PlanetPosition } from "@/types/api";
import { getPlanetColor, getPlanetSymbol, formatLevelsTitle } from "@/lib/utils/astrology";

interface PlanetaryTableProps {
    planets: PlanetPosition[];
}

export default function PlanetaryTable({ planets }: PlanetaryTableProps) {
    return (
        <GlassCard noPadding>
            <div style={{ padding: "20px 24px 12px", borderBottom: "1px solid var(--border-glass)" }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--accent-gold)", fontFamily: "'Playfair Display', serif", textTransform: "uppercase", letterSpacing: 1 }}>
                    Planetary Positions
                </h3>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                    Sidereal positions with KP lordships
                </p>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table className="kp-table">
                    <thead>
                        <tr>
                            <th>Planet</th>
                            <th>Sign</th>
                            <th>Longitude</th>
                            <th>Star Lord</th>
                            <th>Sub Lord</th>
                            <th>Sub-Sub</th>
                            <th>R</th>
                        </tr>
                    </thead>
                    <tbody>
                        {planets.map((p, i) => (
                            <motion.tr
                                key={p.name}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03, duration: 0.2 }}
                            >
                                <td>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontSize: 18, color: getPlanetColor(p.name) }}>
                                            {getPlanetSymbol(p.name)}
                                        </span>
                                        <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                                            {p.name}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                                        {p.sign}
                                    </span>
                                </td>
                                <td>
                                    <span style={{ fontSize: 12, fontFamily: "monospace", color: "var(--accent-gold)", fontWeight: 700 }}>
                                        {p.longitude_dms}
                                    </span>
                                </td>
                                <td>
                                    <span style={{
                                        fontSize: 11, padding: "3px 10px", borderRadius: 0, fontWeight: 700,
                                        border: `1px solid ${getPlanetColor(p.star_lord)}40`,
                                        background: `${getPlanetColor(p.star_lord)}10`,
                                        color: getPlanetColor(p.star_lord),
                                        textTransform: "uppercase",
                                    }}>
                                        {p.star_lord}
                                    </span>
                                </td>
                                <td>
                                    <span style={{
                                        fontSize: 11, padding: "3px 10px", borderRadius: 0, fontWeight: 700,
                                        border: `1px solid ${getPlanetColor(p.sub_lord)}40`,
                                        background: `${getPlanetColor(p.sub_lord)}10`,
                                        color: getPlanetColor(p.sub_lord),
                                        textTransform: "uppercase",
                                    }}>
                                        {p.sub_lord}
                                    </span>
                                </td>
                                <td title={formatLevelsTitle(p.levels)} style={{ fontSize: 12, fontWeight: 600, color: p.sub_sub_lord ? getPlanetColor(p.sub_sub_lord) : "var(--text-muted)" }}>
                                    {p.sub_sub_lord || "—"}
                                </td>
                                <td>
                                    {p.retrograde && (
                                        <span style={{ fontSize: 13, fontWeight: 800, color: "#ef4444" }}>
                                            ℞
                                        </span>
                                    )}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </GlassCard>
    );
}
