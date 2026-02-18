"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { calculateChart, calculateHorary, getLocations } from "./client";
import type {
    CalculationRequest,
    CalculationResponse,
    HoraryRequest,
    HoraryResponse,
} from "@/types/api";

export function useLocations() {
    return useQuery({
        queryKey: ["locations"],
        queryFn: getLocations,
        staleTime: Infinity, // locations never change
    });
}

export function useCalculateChart() {
    return useMutation<CalculationResponse, Error, CalculationRequest>({
        mutationFn: calculateChart,
    });
}

export function useCalculateHorary() {
    return useMutation<HoraryResponse, Error, HoraryRequest>({
        mutationFn: calculateHorary,
    });
}
