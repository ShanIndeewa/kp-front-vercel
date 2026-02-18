"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import type { HouseCusp } from "@/types/api";
import { getPlanetColor } from "@/lib/utils/astrology";

interface HouseTableProps {
    houses: HouseCusp[];
}

export default function HouseTable({ houses }: HouseTableProps) {
    return (
        <GlassCard noPadding>
            <div style={{ padding: "16px 16px 8px", borderBottom: "1px solid var(--border-glass)" }}>
                <h3 className="gradient-text-gold" style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
                    House Cusps (Bhawa)
                </h3>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                    Placidus house system with KP lordships
                </p>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table className="kp-table">
                    <thead>
                        <tr>
                            <th>House</th>
                            <th>Sign</th>
                            <th>Longitude</th>
                            <th>Sign Lord</th>
                            <th>Star Lord</th>
                            <th>Sub Lord</th>
                        </tr>
                    </thead>
                    <tbody>
                        {houses.map((h, i) => (
                            <motion.tr
                                key={h.house}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04, duration: 0.3 }}
                                style={h.house === 1 ? { background: "var(--lagna-glow)" } : undefined}
                            >
                                <td>
                                    <span style={{
                                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                                        width: 28, height: 28, borderRadius: 8, fontSize: 12, fontWeight: 700,
                                        background: h.house === 1 ? "var(--accent-gold)" : "var(--bg-tertiary)",
                                        color: h.house === 1 ? "#111827" : "var(--text-secondary)",
                                    }}>
                                        {h.house}
                                    </span>
                                </td>
                                <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                                    {h.sign}
                                </td>
                                <td>
                                    <span style={{ fontSize: 12, fontFamily: "monospace", color: "var(--accent-cyan)" }}>
                                        {h.longitude_dms}
                                    </span>
                                </td>
                                <td>
                                    <span style={{
                                        fontSize: 12, padding: "2px 8px", borderRadius: 999, fontWeight: 500,
                                        background: `${getPlanetColor(h.sign_lord)}20`,
                                        color: getPlanetColor(h.sign_lord),
                                    }}>
                                        {h.sign_lord}
                                    </span>
                                </td>
                                <td>
                                    <span style={{
                                        fontSize: 12, padding: "2px 8px", borderRadius: 999, fontWeight: 500,
                                        background: `${getPlanetColor(h.star_lord)}20`,
                                        color: getPlanetColor(h.star_lord),
                                    }}>
                                        {h.star_lord}
                                    </span>
                                </td>
                                <td>
                                    <span style={{
                                        fontSize: 12, padding: "2px 8px", borderRadius: 999, fontWeight: 500,
                                        background: `${getPlanetColor(h.sub_lord)}20`,
                                        color: getPlanetColor(h.sub_lord),
                                    }}>
                                        {h.sub_lord}
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    );
}
