"use client";

import type { HouseCusp, LocationUsed, AyanamsaInfo, PlanetPosition } from "@/types/api";
import { getPlanetAbbr, getPlanetColor } from "@/lib/utils/astrology";
import { formatCoordDMS, getWeekday } from "@/lib/utils/panchang";

interface Props {
    planets: PlanetPosition[];
    houses: HouseCusp[];
    location: LocationUsed;
    ayanamsa: AyanamsaInfo;
    date: string;
    time: string;
}

// Fixed South Indian layout: sign index (0 = Aries) -> [row, col] on the 4x4 grid
const SIGN_CELL: Record<number, [number, number]> = {
    11: [1, 1], 0: [1, 2], 1: [1, 3], 2: [1, 4],
    3: [2, 4], 4: [3, 4],
    5: [4, 4], 6: [4, 3], 7: [4, 2], 8: [4, 1],
    9: [3, 1], 10: [2, 1],
};

function dmsInSign(lon: number): string {
    const inSign = ((lon % 30) + 30) % 30;
    let total = Math.round(inSign * 3600);
    if (total >= 30 * 3600) total = 30 * 3600 - 1;
    const d = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${d}° ${String(m).padStart(2, "0")}' ${String(s).padStart(2, "0")}"`;
}

interface Entry { key: string; lon: number; node: React.ReactNode }

export default function SouthIndianChart({ planets, houses, location, ayanamsa, date, time }: Props) {
    const cells: Record<number, Entry[]> = {};
    const push = (lon: number, e: Omit<Entry, "lon">) => {
        const sign = Math.floor((((lon % 360) + 360) % 360) / 30);
        (cells[sign] ||= []).push({ ...e, lon });
    };

    planets.forEach((p) =>
        push(p.longitude, {
            key: `p-${p.name}`,
            node: (
                <span style={{ color: "var(--text-primary)" }}>
                    <b style={{ color: getPlanetColor(p.name) }}>{getPlanetAbbr(p.name)}{p.retrograde ? "®" : ""}</b>{" "}
                    {dmsInSign(p.longitude)}
                </span>
            ),
        })
    );
    houses.forEach((h) =>
        push(h.longitude, {
            key: `h-${h.house}`,
            node: <span style={{ color: "#f87171", fontWeight: 600 }}>{h.house}) {dmsInSign(h.longitude)}</span>,
        })
    );

    const moon = planets.find((p) => p.name === "Moon");
    const info: [string, string][] = [
        ["Date", `${date}  ${getWeekday(date).day}`],
        ["Birth Time", time],
        ["Birth Place", location.name?.split(",")[0] || "—"],
        ["Longitude", formatCoordDMS(location.longitude, "E", "W")],
        ["Latitude", formatCoordDMS(location.latitude, "N", "S")],
        ["Ayanamsa", ayanamsa.dms + (ayanamsa.type ? ` (${ayanamsa.type})` : "")],
    ];
    if (moon) info.push(["Star", `${moon.star} (${moon.pada})`]);

    return (
        <div
            className="glass-card"
            style={{
                padding: 0, borderRadius: 4, overflow: "hidden", width: "100%", aspectRatio: "1 / 1",
                display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "repeat(4, 1fr)",
            }}
        >
            {Array.from({ length: 12 }, (_, sign) => {
                const [row, col] = SIGN_CELL[sign];
                const entries = (cells[sign] || []).sort((a, b) => a.lon - b.lon);
                return (
                    <div
                        key={sign}
                        style={{
                            gridRow: row, gridColumn: col, border: "1px solid var(--border-glass)",
                            padding: 4, fontSize: "clamp(9px, 1vw, 12px)", lineHeight: 1.35,
                            display: "flex", flexDirection: "column", justifyContent: "flex-end",
                            overflow: "hidden", fontFamily: "monospace",
                        }}
                    >
                        {entries.map((e) => <div key={e.key} style={{ whiteSpace: "nowrap" }}>{e.node}</div>)}
                    </div>
                );
            })}

            {/* Centre info box */}
            <div
                style={{
                    gridRow: "2 / 4", gridColumn: "2 / 4", margin: 0, border: "1px solid var(--border-glass)",
                    background: "var(--bg-tertiary)", padding: "8px 12px", display: "flex",
                    flexDirection: "column", justifyContent: "center", gap: 4, overflow: "hidden",
                }}
            >
                {info.map(([k, v]) => (
                    <div key={k} style={{ display: "flex", gap: 8, fontSize: "clamp(10px, 1.1vw, 13px)" }}>
                        <span style={{ width: "34%", flexShrink: 0, fontWeight: 700, color: "var(--accent-gold)" }}>{k}</span>
                        <span style={{ color: "var(--text-primary)" }}>: {v}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
