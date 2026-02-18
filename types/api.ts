// ========== REQUEST TYPES ==========

export interface CalculationRequest {
    date: string; // YYYY-MM-DD
    time: string; // HH:MM (24h)
    latitude?: number | null;
    longitude?: number | null;
    timezone?: number | null; // default 5.5
    location?: string | null; // e.g. 'colombo'
    ayanamsa_type?: string | null; // 'old' | 'new' | 'manual'
    manual_ayanamsa?: number | null;
}

export interface HoraryRequest {
    horary_number: number; // 1-249
    date: string;
    time?: string; // default '12:00'
    latitude?: number | null;
    longitude?: number | null;
    timezone?: number | null;
    location?: string | null;
    ayanamsa_type?: string | null;
    manual_ayanamsa?: number | null;
}

// ========== RESPONSE TYPES ==========

export interface PlanetPosition {
    name: string;
    longitude: number; // 0-360
    longitude_dms: string;
    sign: string;
    sign_lord: string;
    star: string;
    star_lord: string;
    sub_lord: string;
    sub_sub_lord?: string | null;
    pada: number;
    retrograde?: boolean;
}

export interface HouseCusp {
    house: number; // 1-12
    bhawa: number;
    longitude: number;
    longitude_dms: string;
    sign: string;
    sign_lord: string;
    star: string;
    star_lord: string;
    sub_lord: string;
    sub_sub_lord?: string | null;
    pada: number;
}

export interface AscendantInfo {
    longitude: number;
    longitude_dms: string;
    sign: string;
    sign_lord: string;
    star: string;
    star_lord: string;
    sub_lord: string;
    sub_sub_lord?: string | null;
}

export interface AyanamsaInfo {
    value: number;
    dms: string;
    type?: string;
}

export interface LocationUsed {
    name?: string | null;
    latitude: number;
    longitude: number;
    timezone: number;
}

export interface LocationInfo {
    key: string;
    name: string;
    latitude: number;
    longitude: number;
}

export interface LocationListResponse {
    success: boolean;
    count: number;
    locations: LocationInfo[];
}

export interface AntardashaEntry {
    planet: string;
    start_date: string;
    end_date: string;
    duration_years: number;
}

export interface MahadashaEntry {
    planet: string;
    start_date: string;
    end_date: string;
    duration_years: number;
    antardasha?: AntardashaEntry[];
}

export interface CurrentDashaInfo {
    mahadasha?: { planet: string; start_date: string; end_date: string };
    dasha_string?: string;
    antardasha?: { planet: string; start_date: string; end_date: string };
    pratyantardasha?: { planet: string; start_date: string; end_date: string };
    sookshma_dasha?: { planet: string; start_date?: string; end_date?: string };
}

export interface DashaInfo {
    birth_dasha_lord?: string;
    birth_dasha_balance_years?: number;
    birth_nakshatra?: string;
    mahadasha_periods?: MahadashaEntry[];
    current_dasha?: CurrentDashaInfo;
    // Legacy compat
    maha_dasha?: MahadashaEntry[];
}

export interface CalculationResponse {
    success: boolean;
    date: string;
    time: string;
    location: LocationUsed;
    julian_day: number;
    ayanamsa: AyanamsaInfo;
    ascendant: AscendantInfo;
    planets: PlanetPosition[];
    houses: HouseCusp[];
    house_system?: string;
    dasha?: DashaInfo | Record<string, unknown> | null;
}

export interface HoraryInfo {
    number: number;
    target_ascendant: number;
    target_ascendant_dms: string;
    sign: string;
    sign_lord: string;
    star: string;
    star_lord: string;
    sub_lord: string;
}

export interface HoraryResponse {
    success: boolean;
    horary: HoraryInfo;
    calculated_time: string;
    date: string;
    location: LocationUsed;
    julian_day: number;
    ayanamsa: AyanamsaInfo;
    ascendant: AscendantInfo;
    planets: PlanetPosition[];
    houses: HouseCusp[];
    house_system?: string;
    dasha?: DashaInfo | Record<string, unknown> | null;
}

export interface ValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
}

export interface HTTPValidationError {
    detail: ValidationError[];
}

// ========== THEME ==========

export type ThemeId = 'cosmic' | 'light' | 'emerald' | 'amethyst';

export interface ThemeOption {
    id: ThemeId;
    name: string;
    icon: string;
    preview: string; // color for preview swatch
}
