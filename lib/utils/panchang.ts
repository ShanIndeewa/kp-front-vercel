// Derived birth-time details (tithi, karana, yoga, moon star progress, day lord)
// computed from sidereal Sun / Moon longitudes.

const NAKSHATRA_SPAN = 360 / 27;

const TITHI_NAMES = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashti", "Saptami",
    "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi",
];

const YOGA_NAMES = [
    "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma",
    "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
    "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha",
    "Shukla", "Brahma", "Indra", "Vaidhriti",
];

const MOVABLE_KARANAS = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"];
const FIXED_KARANAS = ["Shakuni", "Chatushpada", "Naga", "Kimstughna"];

const DAY_LORDS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const norm = (d: number) => ((d % 360) + 360) % 360;

export function getWeekday(dateStr: string): { day: string; lord: string } {
    // Parse as UTC so the weekday matches the calendar date entered
    const idx = new Date(`${dateStr}T00:00:00Z`).getUTCDay();
    return { day: DAY_NAMES[idx], lord: DAY_LORDS[idx] };
}

export function getTithi(sunLon: number, moonLon: number) {
    const elong = norm(moonLon - sunLon);
    const n = Math.floor(elong / 12); // 0..29
    const paksha = n < 15 ? "Shukla" : "Krishna";
    const num = n % 15;
    const name = n === 14 ? "Purnima" : n === 29 ? "Amavasya" : TITHI_NAMES[num];
    const half = Math.floor(elong / 6); // 0..59 karana index
    let karana: string;
    if (half === 0) karana = FIXED_KARANAS[3];
    else if (half >= 57) karana = FIXED_KARANAS[half - 57];
    else karana = MOVABLE_KARANAS[(half - 1) % 7];
    return { label: `${name} (${paksha})`, karana };
}

export function getYoga(sunLon: number, moonLon: number): string {
    return YOGA_NAMES[Math.floor(norm(sunLon + moonLon) / NAKSHATRA_SPAN) % 27];
}

/** Fraction of the Moon's nakshatra already traversed (0-1). */
export function moonStarProgress(moonLon: number): number {
    return (norm(moonLon) % NAKSHATRA_SPAN) / NAKSHATRA_SPAN;
}

/** Decimal years -> "5Y 5M 10D" (365.25-day year, 30.4375-day month). */
export function formatYMD(years: number): string {
    const totalDays = Math.round(years * 365.25);
    const y = Math.floor(totalDays / 365.25);
    const rem = totalDays - Math.round(y * 365.25);
    const m = Math.floor(rem / 30.4375);
    const d = Math.round(rem - m * 30.4375);
    return `${y}Y ${m}M ${d}D`;
}

export function formatCoordDMS(value: number, pos: string, neg: string): string {
    const hemi = value >= 0 ? pos : neg;
    const a = Math.abs(value);
    const d = Math.floor(a);
    const mFull = (a - d) * 60;
    const m = Math.floor(mFull);
    const s = Math.round((mFull - m) * 60);
    return `${String(d).padStart(3, "0")}° ${String(m).padStart(2, "0")}' ${String(s).padStart(2, "0")}" ${hemi}`;
}
