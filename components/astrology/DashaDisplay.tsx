"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Clock, Star, Calendar } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { getPlanetColor, getPlanetSymbol } from "@/lib/utils/astrology";

/* ---------- Vimshottari Dasha calculation ---------- */

// Standard Vimshottari dasha years and order
const DASHA_YEARS: Record<string, number> = {
    Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
    Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};
const DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
const TOTAL_YEARS = 120;

/** Get sub-period sequence starting from the lord planet */
function getSubPeriodSequence(lord: string): string[] {
    const idx = DASHA_ORDER.indexOf(lord);
    if (idx === -1) return DASHA_ORDER;
    return [...DASHA_ORDER.slice(idx), ...DASHA_ORDER.slice(0, idx)];
}

/** Add fractional days to a date string (YYYY-MM-DD) */
function addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + Math.round(days));
    return d.toISOString().split("T")[0];
}

interface SubPeriod {
    planet: string;
    start_date: string;
    end_date: string;
    duration_years: number;
}

/** Calculate sub-periods within a parent period */
function calcSubPeriods(lordPlanet: string, startDate: string, durationYears: number): SubPeriod[] {
    const sequence = getSubPeriodSequence(lordPlanet);
    const periods: SubPeriod[] = [];
    let currentDate = startDate;

    for (const planet of sequence) {
        const subDuration = (durationYears * DASHA_YEARS[planet]) / TOTAL_YEARS;
        const daysInPeriod = subDuration * 365.25;
        const endDate = addDays(currentDate, daysInPeriod);
        periods.push({
            planet,
            start_date: currentDate,
            end_date: endDate,
            duration_years: subDuration,
        });
        currentDate = endDate;
    }
    return periods;
}

/* ---------- local types matching real API ---------- */
interface AntardashaEntry {
    planet: string;
    start_date: string;
    end_date: string;
    duration_years: number;
}

interface MahadashaEntry {
    planet: string;
    start_date: string;
    end_date: string;
    duration_years: number;
    antardasha?: AntardashaEntry[];
}

interface CurrentDashaInfo {
    mahadasha?: { planet: string; start_date: string; end_date: string };
    dasha_string?: string;
    antardasha?: { planet: string; start_date: string; end_date: string };
    pratyantardasha?: { planet: string; start_date: string; end_date: string };
    sookshma_dasha?: { planet: string; start_date?: string; end_date?: string };
}

interface DashaDisplayProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dasha: any;
}

const LEVEL_LABELS = ["Maha Dasha", "Antardasha", "Pratyantardasha", "Sookshma"];
const LEVEL_COLORS = [
    "var(--accent-gold)",
    "var(--accent-purple)",
    "var(--accent-cyan)",
    "var(--accent-emerald)",
];

/* ---- Generic expandable period row (used at every level) ---- */
function PeriodRow({
    planet,
    startDate,
    endDate,
    durationYears,
    level,
    lordPlanet,
}: {
    planet: string;
    startDate: string;
    endDate: string;
    durationYears: number;
    level: number; // 0=Maha, 1=Antar, 2=Pratyantar, 3=Sookshma
    lordPlanet: string; // the planet whose sub-periods to calculate
}) {
    const [expanded, setExpanded] = useState(false);
    const canExpand = level < 3; // can expand up to sookshma

    const children = useMemo(() => {
        if (!expanded || !canExpand) return [];
        return calcSubPeriods(lordPlanet, startDate, durationYears);
    }, [expanded, canExpand, lordPlanet, startDate, durationYears]);

    const levelColor = LEVEL_COLORS[level] || LEVEL_COLORS[3];
    const levelLabel = LEVEL_LABELS[level] || "Sookshma";

    // Font sizes increase for planet names — bigger at top levels
    const symbolSize = [19, 17, 15, 14][level] || 14;
    const nameSize = [16, 15, 14, 13][level] || 13;
    const nameWeight = level === 0 ? 700 : level === 1 ? 600 : 500;

    // Duration display
    const durationStr = durationYears >= 1
        ? `${durationYears.toFixed(1)}y`
        : durationYears >= (1 / 12)
            ? `${(durationYears * 12).toFixed(1)}m`
            : `${(durationYears * 365.25).toFixed(0)}d`;

    return (
        <div>
            <button
                onClick={() => canExpand && setExpanded(!expanded)}
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: `${level <= 1 ? 10 : 7}px 12px`,
                    paddingLeft: `${level * 20 + 12}px`,
                    borderRadius: 6,
                    textAlign: "left",
                    border: "none",
                    transition: "all 0.2s",
                    background: expanded ? `rgba(139, 92, 246, ${0.08 - level * 0.015})` : "transparent",
                    cursor: canExpand ? "pointer" : "default",
                    borderLeft: level > 0
                        ? `2px solid color-mix(in srgb, ${levelColor} 35%, transparent)`
                        : "none",
                }}
                className="hover:bg-white/5"
            >
                {canExpand ? (
                    <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronRight style={{ width: 14, height: 14, color: "var(--text-muted)", flexShrink: 0 }} />
                    </motion.div>
                ) : (
                    <div style={{ width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: levelColor }} />
                    </div>
                )}

                <span style={{ fontSize: symbolSize, color: getPlanetColor(planet), flexShrink: 0, lineHeight: 1 }}>
                    {getPlanetSymbol(planet)}
                </span>
                <span style={{ fontSize: nameSize, fontWeight: nameWeight, color: "var(--text-primary)", flex: 1, minWidth: 0 }}>
                    {planet}
                </span>

                <span style={{
                    fontSize: 9, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600,
                    padding: "2px 6px", borderRadius: 4, flexShrink: 0, whiteSpace: "nowrap",
                    color: levelColor,
                    background: `color-mix(in srgb, ${levelColor} 15%, transparent)`,
                }}>
                    {levelLabel}
                </span>

                <span style={{
                    fontSize: 11, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums",
                    fontFamily: "monospace", whiteSpace: "nowrap", flexShrink: 0,
                }}>
                    {startDate} → {endDate}
                </span>

                <span style={{
                    fontSize: 10, color: "var(--text-muted)", whiteSpace: "nowrap", flexShrink: 0,
                    minWidth: 40, textAlign: "right",
                }}>
                    ({durationStr})
                </span>
            </button>

            <AnimatePresence>
                {expanded && children.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: "hidden" }}
                    >
                        {children.map((child, idx) => (
                            <PeriodRow
                                key={idx}
                                planet={child.planet}
                                startDate={child.start_date}
                                endDate={child.end_date}
                                durationYears={child.duration_years}
                                level={level + 1}
                                lordPlanet={child.planet}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ---- Mahadasha parent row (uses API data for antardasha) ---- */
function MahadashaRow({ entry }: { entry: MahadashaEntry }) {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = (entry.antardasha?.length ?? 0) > 0;

    return (
        <div>
            <button
                onClick={() => hasChildren && setExpanded(!expanded)}
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 12px",
                    borderRadius: 8,
                    textAlign: "left",
                    border: "none",
                    transition: "all 0.2s",
                    background: expanded ? "rgba(139, 92, 246, 0.08)" : "transparent",
                    cursor: hasChildren ? "pointer" : "default",
                }}
                className="hover:bg-white/5"
            >
                {hasChildren ? (
                    <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronRight style={{ width: 14, height: 14, color: "var(--text-muted)", flexShrink: 0 }} />
                    </motion.div>
                ) : (
                    <div style={{ width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent-gold)" }} />
                    </div>
                )}

                <span style={{ fontSize: 19, color: getPlanetColor(entry.planet), flexShrink: 0, lineHeight: 1 }}>
                    {getPlanetSymbol(entry.planet)}
                </span>
                <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", flex: 1, minWidth: 0 }}>
                    {entry.planet}
                </span>

                <span style={{
                    fontSize: 9, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 600,
                    padding: "2px 6px", borderRadius: 4, flexShrink: 0, whiteSpace: "nowrap",
                    color: "var(--accent-gold)",
                    background: "color-mix(in srgb, var(--accent-gold) 15%, transparent)",
                }}>
                    Maha Dasha
                </span>

                <span style={{
                    fontSize: 11, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums",
                    fontFamily: "monospace", whiteSpace: "nowrap", flexShrink: 0,
                }}>
                    {entry.start_date} → {entry.end_date}
                </span>

                <span style={{
                    fontSize: 10, color: "var(--text-muted)", whiteSpace: "nowrap", flexShrink: 0,
                    minWidth: 40, textAlign: "right",
                }}>
                    ({entry.duration_years.toFixed(1)}y)
                </span>
            </button>

            <AnimatePresence>
                {expanded && hasChildren && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: "hidden" }}
                    >
                        {/* Antardasha from API data — each one can expand into calculated Pratyantardasha */}
                        {entry.antardasha!.map((child, idx) => (
                            <PeriodRow
                                key={idx}
                                planet={child.planet}
                                startDate={child.start_date}
                                endDate={child.end_date}
                                durationYears={child.duration_years}
                                level={1}
                                lordPlanet={child.planet}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ---- Current Dasha badge row ---- */
function CurrentDashaBadge({ current }: { current: CurrentDashaInfo }) {
    const parts: { label: string; planet: string; dates?: string; color: string }[] = [];

    if (current.mahadasha) {
        parts.push({
            label: "Maha",
            planet: current.mahadasha.planet,
            dates: `${current.mahadasha.start_date} – ${current.mahadasha.end_date}`,
            color: "var(--accent-gold)",
        });
    }
    if (current.antardasha) {
        parts.push({
            label: "Antar",
            planet: current.antardasha.planet,
            dates: `${current.antardasha.start_date} – ${current.antardasha.end_date}`,
            color: "var(--accent-purple)",
        });
    }
    if (current.pratyantardasha) {
        parts.push({
            label: "Pratyantar",
            planet: current.pratyantardasha.planet,
            dates: current.pratyantardasha.start_date
                ? `${current.pratyantardasha.start_date} – ${current.pratyantardasha.end_date}`
                : undefined,
            color: "var(--accent-cyan)",
        });
    }
    if (current.sookshma_dasha) {
        parts.push({
            label: "Sookshma",
            planet: current.sookshma_dasha.planet,
            dates: current.sookshma_dasha.start_date
                ? `${current.sookshma_dasha.start_date} – ${current.sookshma_dasha.end_date}`
                : undefined,
            color: "var(--accent-emerald)",
        });
    }

    if (parts.length === 0) return null;

    return (
        <div style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--border-glass)",
            background: "rgba(245, 197, 66, 0.04)",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <Clock style={{ width: 14, height: 14, color: "var(--accent-gold)" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-gold)", textTransform: "uppercase", letterSpacing: 1 }}>
                    Current Running Dasha
                </span>
                {current.dasha_string && (
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginLeft: 8 }}>
                        {current.dasha_string}
                    </span>
                )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
                {parts.map((p) => (
                    <div key={p.label} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "6px 10px", borderRadius: 8,
                        background: `color-mix(in srgb, ${p.color} 8%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${p.color} 20%, transparent)`,
                    }}>
                        <span style={{ fontSize: 16, color: getPlanetColor(p.planet) }}>
                            {getPlanetSymbol(p.planet)}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, color: p.color }}>
                                    {p.label}
                                </span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                                    {p.planet}
                                </span>
                            </div>
                            {p.dates && (
                                <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "monospace" }}>
                                    {p.dates}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ============ MAIN COMPONENT ============ */
export default function DashaDisplay({ dasha }: DashaDisplayProps) {
    // Handle missing / empty dasha data
    if (!dasha || (typeof dasha === "object" && Object.keys(dasha).length === 0)) {
        return (
            <GlassCard noPadding>
                <div style={{ padding: 24, textAlign: "center" }}>
                    <h3 className="gradient-text" style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display', serif", marginBottom: 8 }}>
                        Vimshottari Dasha
                    </h3>
                    <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                        Dasha data not available for this calculation.
                    </p>
                </div>
            </GlassCard>
        );
    }

    // Support both field names
    const periods: MahadashaEntry[] = dasha.mahadasha_periods || dasha.maha_dasha || [];
    const current: CurrentDashaInfo | undefined = dasha.current_dasha;
    const birthLord: string | undefined = dasha.birth_dasha_lord;
    const balanceYears: number | undefined = dasha.birth_dasha_balance_years;
    const birthNakshatra: string | undefined = dasha.birth_nakshatra;

    if (periods.length === 0) {
        return (
            <GlassCard noPadding>
                <div style={{ padding: 24, textAlign: "center" }}>
                    <h3 className="gradient-text" style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display', serif", marginBottom: 8 }}>
                        Vimshottari Dasha
                    </h3>
                    <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                        No dasha periods found in the response.
                    </p>
                </div>
            </GlassCard>
        );
    }

    return (
        <GlassCard noPadding>
            {/* Header */}
            <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--border-glass)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <div>
                        <h3 className="gradient-text" style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
                            Vimshottari Dasha
                        </h3>
                        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                            Click to expand: Maha → Antar → Pratyantar → Sookshma
                        </p>
                    </div>
                </div>

                {/* Birth dasha info row */}
                {(birthLord || birthNakshatra) && (
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 10 }}>
                        {birthNakshatra && (
                            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                                <Star style={{ width: 12, height: 12, color: "var(--accent-cyan)" }} />
                                <span style={{ color: "var(--text-muted)" }}>Birth Star:</span>
                                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{birthNakshatra}</span>
                            </div>
                        )}
                        {birthLord && (
                            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                                <Calendar style={{ width: 12, height: 12, color: "var(--accent-gold)" }} />
                                <span style={{ color: "var(--text-muted)" }}>Dasha Lord:</span>
                                <span style={{ color: getPlanetColor(birthLord), fontWeight: 500 }}>
                                    {getPlanetSymbol(birthLord)} {birthLord}
                                </span>
                            </div>
                        )}
                        {balanceYears != null && (
                            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                                <span style={{ color: "var(--text-muted)" }}>Balance:</span>
                                <span style={{ color: "var(--text-secondary)", fontWeight: 500, fontFamily: "monospace" }}>
                                    {balanceYears.toFixed(4)} years
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Current running dasha */}
            {current && <CurrentDashaBadge current={current} />}

            {/* Legend */}
            <div style={{ padding: "8px 16px", display: "flex", gap: 12, flexWrap: "wrap", borderBottom: "1px solid var(--border-glass)" }}>
                {LEVEL_LABELS.map((label, i) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "var(--text-muted)" }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: LEVEL_COLORS[i] }} />
                        <span>{label}</span>
                    </div>
                ))}
            </div>

            {/* Maha Dasha list */}
            <div style={{ padding: 8, maxHeight: 500, overflowY: "auto" }}>
                {periods.map((p, i) => (
                    <MahadashaRow key={i} entry={p} />
                ))}
            </div>
        </GlassCard>
    );
}
