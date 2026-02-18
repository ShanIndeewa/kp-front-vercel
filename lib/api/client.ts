import type {
    CalculationRequest,
    CalculationResponse,
    HoraryRequest,
    HoraryResponse,
    LocationListResponse,
} from "@/types/api";

const BASE = "/api/v1";

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(error?.detail?.[0]?.msg ?? error?.detail ?? "API error");
    }
    return res.json() as Promise<T>;
}

export async function calculateChart(
    data: CalculationRequest
): Promise<CalculationResponse> {
    return fetchJSON<CalculationResponse>(`${BASE}/calculate`, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function calculateHorary(
    data: HoraryRequest
): Promise<HoraryResponse> {
    return fetchJSON<HoraryResponse>(`${BASE}/calculate-horary`, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function getLocations(): Promise<LocationListResponse> {
    return fetchJSON<LocationListResponse>(`${BASE}/locations`);
}
