// ========== ZODIAC SIGNS ==========

export interface ZodiacSign {
    index: number; // 0-11
    name: string;
    symbol: string;
    ruler: string;
    startDeg: number;
    endDeg: number;
    element: "Fire" | "Earth" | "Air" | "Water";
    color: string;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
    { index: 0, name: "Aries", symbol: "♈", ruler: "Mars", startDeg: 0, endDeg: 30, element: "Fire", color: "#ef4444" },
    { index: 1, name: "Taurus", symbol: "♉", ruler: "Venus", startDeg: 30, endDeg: 60, element: "Earth", color: "#22c55e" },
    { index: 2, name: "Gemini", symbol: "♊", ruler: "Mercury", startDeg: 60, endDeg: 90, element: "Air", color: "#eab308" },
    { index: 3, name: "Cancer", symbol: "♋", ruler: "Moon", startDeg: 90, endDeg: 120, element: "Water", color: "#3b82f6" },
    { index: 4, name: "Leo", symbol: "♌", ruler: "Sun", startDeg: 120, endDeg: 150, element: "Fire", color: "#f97316" },
    { index: 5, name: "Virgo", symbol: "♍", ruler: "Mercury", startDeg: 150, endDeg: 180, element: "Earth", color: "#84cc16" },
    { index: 6, name: "Libra", symbol: "♎", ruler: "Venus", startDeg: 180, endDeg: 210, element: "Air", color: "#ec4899" },
    { index: 7, name: "Scorpio", symbol: "♏", ruler: "Mars", startDeg: 210, endDeg: 240, element: "Water", color: "#dc2626" },
    { index: 8, name: "Sagittarius", symbol: "♐", ruler: "Jupiter", startDeg: 240, endDeg: 270, element: "Fire", color: "#a855f7" },
    { index: 9, name: "Capricorn", symbol: "♑", ruler: "Saturn", startDeg: 270, endDeg: 300, element: "Earth", color: "#6b7280" },
    { index: 10, name: "Aquarius", symbol: "♒", ruler: "Saturn", startDeg: 300, endDeg: 330, element: "Air", color: "#06b6d4" },
    { index: 11, name: "Pisces", symbol: "♓", ruler: "Jupiter", startDeg: 330, endDeg: 360, element: "Water", color: "#8b5cf6" },
];

// ========== PLANET DATA ==========

export interface PlanetMeta {
    name: string;
    abbr: string;
    symbol: string;
    color: string;
}

export const PLANET_META: Record<string, PlanetMeta> = {
    Sun: { name: "Sun", abbr: "Su", symbol: "☉", color: "#f59e0b" },
    Moon: { name: "Moon", abbr: "Mo", symbol: "☽", color: "#e2e8f0" },
    Mars: { name: "Mars", abbr: "Ma", symbol: "♂", color: "#ef4444" },
    Mercury: { name: "Mercury", abbr: "Me", symbol: "☿", color: "#22c55e" },
    Jupiter: { name: "Jupiter", abbr: "Ju", symbol: "♃", color: "#f59e0b" },
    Venus: { name: "Venus", abbr: "Ve", symbol: "♀", color: "#ec4899" },
    Saturn: { name: "Saturn", abbr: "Sa", symbol: "♄", color: "#6366f1" },
    Rahu: { name: "Rahu", abbr: "Ra", symbol: "☊", color: "#8b5cf6" },
    Ketu: { name: "Ketu", abbr: "Ke", symbol: "☋", color: "#94a3b8" },
};

// ========== HELPERS ==========

export function getSignFromDegree(deg: number): ZodiacSign {
    const normalized = ((deg % 360) + 360) % 360;
    const idx = Math.floor(normalized / 30);
    return ZODIAC_SIGNS[idx];
}

export function degreeInSign(deg: number): number {
    return ((deg % 360) + 360) % 360 % 30;
}

export function degToRad(deg: number): number {
    return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number): number {
    return (rad * 180) / Math.PI;
}

/**
 * Format decimal degrees to DMS string
 * e.g. 123.456 → "3° 27' 22\""   (within Aries: Cancer at 123.456)
 */
export function formatDMS(decimalDeg: number): string {
    const d = Math.floor(decimalDeg);
    const mFull = (decimalDeg - d) * 60;
    const m = Math.floor(mFull);
    const s = Math.round((mFull - m) * 60);
    return `${d}° ${m}' ${s}"`;
}

export function formatSignDMS(decimalDeg: number): string {
    const sign = getSignFromDegree(decimalDeg);
    const inSign = degreeInSign(decimalDeg);
    return `${sign.symbol} ${formatDMS(inSign)}`;
}

/**
 * Convert a zodiac longitude (0–360°, 0°=Aries) to the SVG angle
 * where the Ascendant is pinned at 12 o'clock (–90° in math convention).
 *
 * rotation = -(ascendantDeg) so that the Asc ends up at the top.
 * Then a planet at `deg` is drawn at (deg + rotation) mapped to SVG.
 */
export function zodiacToScreenAngle(
    deg: number,
    ascendantDeg: number
): number {
    // offset so ascendant goes to 0°, then subtract 90 so 0° is "up"
    return deg - ascendantDeg - 90;
}

/**
 * Get (x, y) on a circle of given radius, centered at (cx, cy).
 * angleDeg is in standard SVG degrees (0 = right, 90 = down).
 */
export function polarToCartesian(
    cx: number,
    cy: number,
    radius: number,
    angleDeg: number
): { x: number; y: number } {
    const rad = degToRad(angleDeg);
    return {
        x: cx + radius * Math.cos(rad),
        y: cy + radius * Math.sin(rad),
    };
}

/**
 * Build an SVG arc path segment from startAngle to endAngle (degrees).
 */
export function describeArc(
    cx: number,
    cy: number,
    radius: number,
    startAngle: number,
    endAngle: number
): string {
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export function getPlanetColor(name: string): string {
    return PLANET_META[name]?.color ?? "#94a3b8";
}

export function getPlanetSymbol(name: string): string {
    return PLANET_META[name]?.symbol ?? name.charAt(0);
}

export function getPlanetAbbr(name: string): string {
    return PLANET_META[name]?.abbr ?? name.substring(0, 2);
}
