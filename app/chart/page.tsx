"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import InputForm from "@/components/astrology/InputForm";
import ScientificChart from "@/components/astrology/ScientificChart";
import AscendantCard from "@/components/astrology/AscendantCard";
import SouthIndianChart from "@/components/astrology/SouthIndianChart";
import RulingPlanetsPanel from "@/components/astrology/RulingPlanetsPanel";
import PlanetaryTable from "@/components/astrology/PlanetaryTable";
import HouseTable from "@/components/astrology/HouseTable";
import DashaDisplay from "@/components/astrology/DashaDisplay";
import { useAppStore } from "@/lib/store";

export default function ChartPage() {
    const router = useRouter();
    const chartData = useAppStore((s) => s.chartData);
    const horaryData = useAppStore((s) => s.horaryData);
    const [showForm, setShowForm] = useState(false); // birth-data sidebar
    const [hydrated, setHydrated] = useState(false);

    // Wait for zustand hydration
    useEffect(() => {
        setHydrated(true);
        if (window.innerWidth >= 1500) setShowForm(true);
    }, []);

    const data = chartData || horaryData;
    const displayTime = chartData?.time ?? horaryData?.calculated_time ?? "";

    // Redirect to home if no data available
    useEffect(() => {
        if (hydrated && !data) {
            router.replace("/");
        }
    }, [hydrated, data, router]);

    if (!hydrated || !data) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>♃</div>
                    <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading chart data...</p>
                </div>
            </div>
        );
    }

    return (
        <main style={{ minHeight: "100vh", position: "relative" }}>
            {/* Stars */}
            <div className="stars-bg">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="star"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 2 + 0.5}px`,
                            height: `${Math.random() * 2 + 0.5}px`,
                            "--duration": `${Math.random() * 5 + 3}s`,
                            "--delay": `${Math.random() * 5}s`,
                        } as React.CSSProperties}
                    />
                ))}
            </div>

            <Navbar />

            {/* Page Content */}
            <div style={{ position: "relative", zIndex: 10, maxWidth: 1800, margin: "0 auto", padding: "96px 16px 60px" }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <Link
                            href="/"
                            style={{
                                display: "flex", alignItems: "center", justifyContent: "center",
                                width: 40, height: 40, borderRadius: 12,
                                background: "var(--bg-tertiary)", border: "1px solid var(--border-glass)",
                                color: "var(--text-secondary)", textDecoration: "none", transition: "all 0.2s",
                            }}
                        >
                            <ArrowLeft style={{ width: 18, height: 18 }} />
                        </Link>
                        <div>
                            <h1 className="gradient-text" style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
                                Chart Results
                            </h1>
                            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                                {data.date} at {displayTime} •{" "}
                                {data.location.name || `${data.location.latitude}, ${data.location.longitude}`}
                                {horaryData && ` • Horary #${horaryData.horary.number}`}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "10px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600,
                            background: "var(--bg-tertiary)", border: "1px solid var(--border-glass)",
                            color: "var(--text-secondary)", cursor: "pointer", transition: "all 0.2s",
                        }}
                    >
                        {showForm ? <PanelLeftClose style={{ width: 16, height: 16 }} /> : <PanelLeftOpen style={{ width: 16, height: 16 }} />}
                        Birth Data
                    </button>
                </motion.div>

                <div
                    style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 24, alignItems: "start", marginBottom: 32 }}
                    className={showForm ? "xl:!grid-cols-[380px_minmax(0,1fr)]" : ""}
                >
                    {/* Hideable left sidebar: birth data changes only */}
                    {showForm && (
                        <aside className="xl:sticky" style={{ top: 88 }}>
                            <InputForm />
                        </aside>
                    )}

                    <div
                        style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 24, alignItems: "start", minWidth: 0 }}
                        className="lg:!grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
                    >
                        {/* Chart + ruling planets */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
                            <SouthIndianChart
                                planets={data.planets}
                                houses={data.houses}
                                location={data.location}
                                ayanamsa={data.ayanamsa}
                                date={data.date}
                                time={displayTime}
                            />
                            <RulingPlanetsPanel location={data.location} ayanamsa={data.ayanamsa} />

                            {horaryData && (
                                <div className="glass-card" style={{ padding: 20 }}>
                                    <h4 className="gradient-text" style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
                                        Horary Details
                                    </h4>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                        {[
                                            { label: "Number", value: `#${horaryData.horary.number}`, color: "var(--accent-gold)", bold: true },
                                            { label: "Calc. Time", value: horaryData.calculated_time, color: "var(--accent-cyan)", mono: true },
                                            { label: "Target Asc", value: horaryData.horary.target_ascendant_dms, color: "var(--text-secondary)" },
                                            { label: "Sign", value: horaryData.horary.sign, color: "var(--text-primary)" },
                                        ].map((row) => (
                                            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14 }}>
                                                <span style={{ color: "var(--text-muted)" }}>{row.label}</span>
                                                <span style={{ color: row.color, fontWeight: row.bold ? 700 : 500, fontFamily: row.mono ? "monospace" : "inherit" }}>
                                                    {row.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Tables on the right */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
                            <HouseTable houses={data.houses} />
                            <PlanetaryTable planets={data.planets} />
                        </motion.div>
                    </div>
                </div>

                {/* Wheel + Ascendant */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginBottom: 32 }}
                    className="lg:!grid-cols-[3fr_2fr]"
                >
                    <div className="glass-card" style={{ padding: 0, minHeight: 520, display: "flex", position: "relative", overflow: "hidden", borderRadius: 16 }}>
                        <ScientificChart ascendant={data.ascendant} planets={data.planets} houses={data.houses} />
                    </div>
                    <AscendantCard ascendant={data.ascendant} ayanamsa={data.ayanamsa} location={data.location} date={data.date} time={displayTime} />
                </motion.div>

                {/* Dasha */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <DashaDisplay dasha={chartData?.dasha || horaryData?.dasha || null} />
                </motion.div>
            </div>
        </main>
    );
}
