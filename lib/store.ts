"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
    ThemeId,
    CalculationResponse,
    HoraryResponse,
} from "@/types/api";

interface AppState {
    // Theme
    theme: ThemeId;
    setTheme: (theme: ThemeId) => void;

    // Chart data
    chartData: CalculationResponse | null;
    setChartData: (data: CalculationResponse | null) => void;

    horaryData: HoraryResponse | null;
    setHoraryData: (data: HoraryResponse | null) => void;

    // Active tab
    activeTab: "birth" | "horary";
    setActiveTab: (tab: "birth" | "horary") => void;

    // Loading
    isCalculating: boolean;
    setIsCalculating: (v: boolean) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            theme: "cosmic",
            setTheme: (theme) => {
                document.documentElement.setAttribute("data-theme", theme);
                set({ theme });
            },

            chartData: null,
            setChartData: (chartData) => set({ chartData }),

            horaryData: null,
            setHoraryData: (horaryData) => set({ horaryData }),

            activeTab: "birth",
            setActiveTab: (activeTab) => set({ activeTab }),

            isCalculating: false,
            setIsCalculating: (isCalculating) => set({ isCalculating }),
        }),
        {
            name: "kp-astrology-storage",
            partialize: (state) => ({
                theme: state.theme,
                chartData: state.chartData,
                horaryData: state.horaryData,
                activeTab: state.activeTab,
            }),
        }
    )
);
