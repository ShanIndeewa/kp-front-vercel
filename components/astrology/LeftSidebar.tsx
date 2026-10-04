"use client";

import type { AscendantInfo, AyanamsaInfo, DashaInfo, LocationUsed, PlanetPosition } from "@/types/api";
import { getPlanetAbbr, getPlanetColor } from "@/lib/utils/astrology";
import {
    formatCoordDMS, formatYMD, getTithi, getWeekday, getYoga, moonStarProgress,
} from "@/lib/utils/panchang";

interface Props {
    ascendant: AscendantInfo;
    planets: PlanetPosition[];
    ayanamsa: AyanamsaInfo;
    location: LocationUsed;
    date: string;
    time: string;
    dasha?: DashaInfo | null;
}

const panel: React.CSSProperties = { padding: 0, overflow: "hidden", borderRadius: 12 };
const panelHead: React.CSSProperties = {
    padding: "8px 12px", fontSize: 12, fontWeight: 700, letterSpacing: 1.2,
    textTransform: "uppercase", background: "var(--accent-gold)", color: "#111",
};

function Lord({ name }: { name?: string | null }) {
    if (!name) return <span style={{ color: "var(--text-muted)" }}>—</span>;
    return <span style={{ fontWeight: 700, color: getPlanetColor(name) }} title={name}>{getPlanetAbbr(name)}</span>;
}

function formatTimezone(tz: number, name?: string | null): string {
    const sign = tz >= 0 ? "+" : "-";
    const h = String(Math.floor(Math.abs(tz))).padStart(2, "0");
    const m = String(Math.round((Math.abs(tz) % 1) * 60)).padStart(2, "0");
    return `${sign}${h}:${m} GMT${name ? ` (${name})` : ""}`;
}

export default function LeftSidebar({ ascendant, planets, ayanamsa, location, date, time, dasha }: Props) {
    const moon = planets.find((p) => p.name === "Moon");
    const sun = planets.find((p) => p.name === "Sun");
    const { day, lord: dayLord } = getWeekday(date);
    const d = dasha ?? {};

    // Ruling planets rows: Lagna, Moon (sign / star / sub / SSL / SSSL lords), Day lord
    const rows: { label: string; cells: (string | null | undefined)[] }[] = [
        { label: "Lagna", cells: [ascendant.sign_lord, ascendant.star_lord, ascendant.sub_lord, ascendant.sub_sub_lord, ascendant.sub_sub_sub_lord] },
    ];
    if (moon) rows.push({ label: "Moon", cells: [moon.sign_lord, moon.star_lord, moon.sub_lord, moon.sub_sub_lord, moon.sub_sub_sub_lord] });
    rows.push({ label: "Day Lord", cells: [dayLord, null, null, null, null] });

    const details: [string, React.ReactNode][] = [
        ["Date", date],
        ["Day", day],
        ["Time", time],
        ["Place", location.name || "—"],
        ["Latitude", formatCoordDMS(location.latitude, "N", "S")],
        ["Longitude", formatCoordDMS(location.longitude, "E", "W")],
        ["Time Zone", formatTimezone(location.timezone, location.timezone_name)],
        ["Ayanamsa", `${ayanamsa.dms}${ayanamsa.type ? ` (${ayanamsa.type})` : ""}`],
        ["Lagna", `${ascendant.sign}, ${ascendant.longitude_dms}`],
    ];
    if (moon) {
        details.push(["Rasi", moon.sign]);
        details.push(["Star", `${moon.star} (${moon.pada})`]);
        details.push(["Moon Star Done", `${(moonStarProgress(moon.longitude) * 100).toFixed(2)}%`]);
        if (sun) {
            const t = getTithi(sun.longitude, moon.longitude);
            details.push(["Tithi", t.label]);
            details.push(["Yogam", getYoga(sun.longitude, moon.longitude)]);
            details.push(["Karana", t.karana]);
        }
    }
    if (d.birth_dasha_lord && d.birth_dasha_balance_years != null) {
        details.push(["Dasa Balance", `${getPlanetAbbr(d.birth_dasha_lord)} ${formatYMD(d.birth_dasha_balance_years)}`]);
    }
    if (d.current_dasha?.dasha_string) details.push(["Current Dasa", d.current_dasha.dasha_string]);

    return (
        <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Ruling Planets */}
            <div className="glass-card" style={panel}>
                <div style={panelHead}>Ruling Planets</div>
                <div style={{ overflowX: "auto" }}>
                    <table className="kp-table" style={{ width: "100%", fontSize: 12 }}>
                        <thead>
                            <tr>
                                <th>Planet</th><th title="Sign Lord">Rsl</th><th title="Star Lord">Stl</th>
                                <th title="Sub Lord">Sbl</th><th>SSL</th><th>SSSL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.label}>
                                    <td style={{ fontWeight: 600 }}>{r.label}</td>
                                    {r.cells.map((c, i) => <td key={i}><Lord name={c} /></td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p style={{ fontSize: 10, color: "var(--text-muted)", padding: "6px 12px 8px" }}>
                    Day lord follows the calendar day (not sunrise).
                </p>
            </div>

            {/* Birth / Judgment time details */}
            <div className="glass-card" style={panel}>
                <div style={panelHead}>Birth Time Details</div>
                <dl style={{ margin: 0, padding: "6px 12px 10px" }}>
                    {details.map(([k, v]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "5px 0", borderBottom: "1px solid var(--border-glass)", fontSize: 12 }}>
                            <dt style={{ color: "var(--text-muted)", fontWeight: 600, whiteSpace: "nowrap" }}>{k}</dt>
                            <dd style={{ margin: 0, textAlign: "right", color: "var(--text-primary)", fontWeight: 500 }}>{v}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </aside>
    );
}
