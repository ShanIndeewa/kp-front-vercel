"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import type { PlanetPosition } from "@/types/api";
import { getPlanetColor, getPlanetSymbol } from "@/lib/utils/astrology";

interface PlanetaryTableProps {
    planets: PlanetPosition[];
}

export default function PlanetaryTable({ planets }: PlanetaryTableProps) {
    return (
        <GlassCard noPadding>
            <div style={{ padding: "16px 16px 8px", borderBottom: "1px solid var(--border-glass)" }}>
                <h3 className="gradient-text" style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
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
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.3 }}
                            >
                                <td>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontSize: 18, color: getPlanetColor(p.name) }}>
                                            {getPlanetSymbol(p.name)}
                                        </span>
                                        <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>
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
                                    <span style={{ fontSize: 12, fontFamily: "monospace", color: "var(--accent-cyan)" }}>
                                        {p.longitude_dms}
                                    </span>
                                </td>
                                <td>
                                    <span style={{
                                        fontSize: 12, padding: "2px 8px", borderRadius: 999, fontWeight: 500,
                                        background: `${getPlanetColor(p.star_lord)}20`,
                                        color: getPlanetColor(p.star_lord),
                                    }}>
                                        {p.star_lord}
                                    </span>
                                </td>
                                <td>
                                    <span style={{
                                        fontSize: 12, padding: "2px 8px", borderRadius: 999, fontWeight: 500,
                                        background: `${getPlanetColor(p.sub_lord)}20`,
                                        color: getPlanetColor(p.sub_lord),
                                    }}>
                                        {p.sub_lord}
                                    </span>
                                </td>
                                <td style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                    {p.sub_sub_lord || "—"}
                                </td>
                                <td>
                                    {p.retrograde && (
                                        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-rose)" }}>
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
