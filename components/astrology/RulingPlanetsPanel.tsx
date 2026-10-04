"use client";

import { useCallback, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useCalculateChart } from "@/lib/api/hooks";
import { getPlanetAbbr, getPlanetColor } from "@/lib/utils/astrology";
import { getWeekday } from "@/lib/utils/panchang";
import type { AyanamsaInfo, AyanamsaType, LocationUsed } from "@/types/api";

interface Props {
    location: LocationUsed;
    ayanamsa: AyanamsaInfo;
}

function ayanamsaTypeFromLabel(label?: string): AyanamsaType {
    const l = (label || "").toLowerCase();
    if (l.includes("khullar")) return "khullar";
    if (l.includes("straight")) return "straight";
    if (l.includes("old")) return "old";
    if (l.includes("manual")) return "manual";
    return "new";
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "Now" expressed in the chart location's own time zone. */
function localNow(tz: number) {
    const t = new Date(Date.now() + tz * 3600_000);
    return {
        date: `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`,
        time: `${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}:${pad(t.getUTCSeconds())}`,
    };
}

function Lord({ name }: { name?: string | null }) {
    if (!name) return <span style={{ color: "var(--text-muted)" }}>—</span>;
    return <span style={{ fontWeight: 700, color: getPlanetColor(name) }} title={name}>{getPlanetAbbr(name)}</span>;
}

export default function RulingPlanetsPanel({ location, ayanamsa }: Props) {
    const mutation = useCalculateChart();
    const { mutate } = mutation;
    const type = ayanamsaTypeFromLabel(ayanamsa.type);

    const load = useCallback(() => {
        const now = localNow(location.timezone);
        mutate({
            date: now.date,
            time: now.time,
            latitude: location.latitude,
            longitude: location.longitude,
            timezone: location.timezone,
            ayanamsa_type: type,
            manual_ayanamsa: type === "manual" ? ayanamsa.value : undefined,
        });
    }, [mutate, location.timezone, location.latitude, location.longitude, type, ayanamsa.value]);

    useEffect(() => { load(); }, [load]);

    const now = mutation.data;
    const moon = now?.planets.find((p) => p.name === "Moon");
    const asc = now?.ascendant;
    const rows = [
        asc && { label: "Lagna", sign: asc.sign, star: asc.star, pada: null as number | null, l: [asc.sign_lord, asc.star_lord, asc.sub_lord, asc.sub_sub_lord, asc.sub_sub_sub_lord] },
        moon && { label: "Moon", sign: moon.sign, star: moon.star, pada: moon.pada, l: [moon.sign_lord, moon.star_lord, moon.sub_lord, moon.sub_sub_lord, moon.sub_sub_sub_lord] },
    ].filter(Boolean) as { label: string; sign: string; star: string; pada: number | null; l: (string | null | undefined)[] }[];

    return (
        <div className="glass-card" style={{ padding: 0, overflow: "hidden", borderRadius: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap", padding: "8px 12px", background: "var(--accent-gold)", color: "#111" }}>
                <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>Ruling Planets</span>
                <span style={{ fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                    {now ? `${now.date} ${now.time}` : "…"}
                    <button type="button" onClick={load} title="Recalculate for current time" style={{ background: "none", border: "none", cursor: "pointer", color: "#111", display: "flex" }}>
                        <RefreshCw style={{ width: 14, height: 14 }} />
                    </button>
                </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", fontSize: 12, borderBottom: "1px solid var(--border-glass)", color: "var(--text-secondary)" }}>
                <span>{location.name?.split(",").slice(0, 2).join(",") || `${location.latitude}, ${location.longitude}`}</span>
                <span>Day Lord: <b style={{ color: getPlanetColor(getWeekday(now?.date ?? localNow(location.timezone).date).lord) }}>{getWeekday(now?.date ?? localNow(location.timezone).date).lord}</b></span>
            </div>
            <div style={{ overflowX: "auto" }}>
                <table className="kp-table" style={{ width: "100%", fontSize: 12 }}>
                    <thead>
                        <tr><th>Planet</th><th>Rasi</th><th>Star(Padham)</th><th>Ral</th><th>Stl</th><th>Sbl</th><th>SSL</th><th>SSSL</th></tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.label}>
                                <td style={{ fontWeight: 600 }}>{r.label}</td>
                                <td>{r.sign}</td>
                                <td>{r.star}{r.pada ? ` (${r.pada})` : ""}</td>
                                {r.l.map((c, i) => <td key={i}><Lord name={c} /></td>)}
                            </tr>
                        ))}
                        {!rows.length && (
                            <tr><td colSpan={8} style={{ color: "var(--text-muted)", textAlign: "center" }}>
                                {mutation.isError ? mutation.error.message : "Calculating…"}
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <p style={{ fontSize: 10, color: "var(--text-muted)", padding: "4px 12px 6px" }}>
                Calculated for the current moment at this location. Day lord follows the calendar day (not sunrise).
            </p>
        </div>
    );
}
