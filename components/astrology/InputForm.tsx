"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Hash, Compass, Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import { useLocations, useCalculateChart, useCalculateHorary } from "@/lib/api/hooks";
import { useAppStore } from "@/lib/store";

type TabId = "birth" | "horary";

export default function InputForm() {
    const router = useRouter();
    const { setChartData, setHoraryData, activeTab, setActiveTab } = useAppStore();

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [locationKey, setLocationKey] = useState("");
    const [locationSearch, setLocationSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [manualCoords, setManualCoords] = useState(false);
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [timezone, setTimezone] = useState("5.5");

    const [horaryNumber, setHoraryNumber] = useState("");
    const [horaryDate, setHoraryDate] = useState("");
    const [horaryLocation, setHoraryLocation] = useState("");
    const [horaryLocationSearch, setHoraryLocationSearch] = useState("");
    const [showHoraryDropdown, setShowHoraryDropdown] = useState(false);

    const { data: locData } = useLocations();
    const chartMutation = useCalculateChart();
    const horaryMutation = useCalculateHorary();

    const filteredLocations = useMemo(() => {
        const search = (activeTab === "birth" ? locationSearch : horaryLocationSearch).toLowerCase();
        if (!locData?.locations) return [];
        if (!search) return locData.locations;
        return locData.locations.filter((l) =>
            l.name.toLowerCase().includes(search) || l.key.toLowerCase().includes(search)
        );
    }, [locData, locationSearch, horaryLocationSearch, activeTab]);

    const handleBirthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await chartMutation.mutateAsync({
                date, time,
                location: manualCoords ? undefined : locationKey || undefined,
                latitude: manualCoords ? parseFloat(latitude) : undefined,
                longitude: manualCoords ? parseFloat(longitude) : undefined,
                timezone: manualCoords ? parseFloat(timezone) : undefined,
            });
            setChartData(result);
            setHoraryData(null);
            router.push("/chart");
        } catch { /* errors shown below */ }
    };

    const handleHorarySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await horaryMutation.mutateAsync({
                horary_number: parseInt(horaryNumber),
                date: horaryDate,
                location: horaryLocation || undefined,
            });
            setHoraryData(result);
            setChartData(null);
            router.push("/chart");
        } catch { /* errors shown below */ }
    };

    const labelStyle: React.CSSProperties = {
        display: "flex", alignItems: "center", gap: 8,
        fontSize: 11, fontWeight: 600, color: "var(--text-muted)",
        textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8,
    };

    const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
        { id: "birth", label: "Birth Chart", icon: <Sparkles style={{ width: 16, height: 16 }} /> },
        { id: "horary", label: "Horary Chart", icon: <Hash style={{ width: 16, height: 16 }} /> },
    ];

    return (
        <GlassCard className="w-full" style={{ maxWidth: 720, margin: "0 auto" }}>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 12, background: "var(--bg-tertiary)", marginBottom: 24 }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={activeTab === tab.id ? "tab-active" : "tab-inactive"}
                        style={{
                            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                            gap: 8, padding: "10px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                            border: "none", cursor: "pointer", transition: "all 0.3s",
                            background: activeTab === tab.id ? undefined : "transparent",
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "birth" ? (
                    <motion.form
                        key="birth"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleBirthSubmit}
                        style={{ display: "flex", flexDirection: "column", gap: 20 }}
                    >
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                                <label style={labelStyle}>
                                    <Calendar style={{ width: 14, height: 14 }} /> Birth Date
                                </label>
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" required />
                            </div>
                            <div>
                                <label style={labelStyle}>
                                    <Clock style={{ width: 14, height: 14 }} /> Birth Time
                                </label>
                                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input-field" required />
                            </div>
                        </div>

                        {/* Location Toggle */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <button
                                type="button" onClick={() => setManualCoords(false)}
                                className={!manualCoords ? "toggle-active" : "toggle-inactive"}
                                style={{ fontSize: 12, fontWeight: 500, padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer", transition: "all 0.2s", background: !manualCoords ? undefined : "transparent" }}
                            >
                                Sri Lanka Location
                            </button>
                            <button
                                type="button" onClick={() => setManualCoords(true)}
                                className={manualCoords ? "toggle-active" : "toggle-inactive"}
                                style={{ fontSize: 12, fontWeight: 500, padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer", transition: "all 0.2s", background: manualCoords ? undefined : "transparent" }}
                            >
                                Manual Coordinates
                            </button>
                        </div>

                        {!manualCoords ? (
                            <div style={{ position: "relative" }}>
                                <label style={labelStyle}>
                                    <MapPin style={{ width: 14, height: 14 }} /> Location
                                </label>
                                <div style={{ position: "relative" }}>
                                    <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "var(--text-muted)" }} />
                                    <input
                                        type="text" value={locationSearch}
                                        onChange={(e) => { setLocationSearch(e.target.value); setShowDropdown(true); }}
                                        onFocus={() => setShowDropdown(true)}
                                        placeholder="Search Sri Lanka locations..."
                                        className="input-field" style={{ paddingLeft: 40 }}
                                    />
                                </div>
                                {showDropdown && filteredLocations.length > 0 && (
                                    <div className="glass-card" style={{ position: "absolute", zIndex: 40, width: "100%", marginTop: 4, padding: 4, maxHeight: 192, overflowY: "auto" }}>
                                        {filteredLocations.map((loc) => (
                                            <button
                                                key={loc.key} type="button"
                                                onClick={() => { setLocationKey(loc.key); setLocationSearch(loc.name); setShowDropdown(false); }}
                                                className={locationKey === loc.key ? "loc-selected" : "loc-unselected"}
                                                style={{ width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: 8, fontSize: 14, border: "none", cursor: "pointer", transition: "all 0.2s", background: locationKey === loc.key ? undefined : "transparent" }}
                                            >
                                                <span style={{ fontWeight: 500 }}>{loc.name}</span>
                                                <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 8 }}>
                                                    ({loc.latitude.toFixed(2)}, {loc.longitude.toFixed(2)})
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                                <div>
                                    <label style={labelStyle}><Compass style={{ width: 14, height: 14 }} /> Lat</label>
                                    <input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="6.93" className="input-field" required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Lng</label>
                                    <input type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="79.85" className="input-field" required />
                                </div>
                                <div>
                                    <label style={labelStyle}>TZ</label>
                                    <input type="number" step="0.5" value={timezone} onChange={(e) => setTimezone(e.target.value)} className="input-field" required />
                                </div>
                            </div>
                        )}

                        {chartMutation.isError && (
                            <p style={{ fontSize: 14, color: "#f87171", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "8px 12px" }}>
                                {chartMutation.error.message}
                            </p>
                        )}

                        <Button type="submit" variant="primary" size="lg" className="w-full" loading={chartMutation.isPending}>
                            <Sparkles style={{ width: 16, height: 16 }} />
                            Calculate Birth Chart
                        </Button>
                    </motion.form>
                ) : (
                    <motion.form
                        key="horary"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleHorarySubmit}
                        style={{ display: "flex", flexDirection: "column", gap: 20 }}
                    >
                        <div>
                            <label style={labelStyle}><Hash style={{ width: 14, height: 14 }} /> Horary Number (1-249)</label>
                            <input type="number" min={1} max={249} value={horaryNumber} onChange={(e) => setHoraryNumber(e.target.value)} placeholder="Enter 1 - 249" className="input-field" required />
                        </div>

                        <div>
                            <label style={labelStyle}><Calendar style={{ width: 14, height: 14 }} /> Query Date</label>
                            <input type="date" value={horaryDate} onChange={(e) => setHoraryDate(e.target.value)} className="input-field" required />
                        </div>

                        <div style={{ position: "relative" }}>
                            <label style={labelStyle}><MapPin style={{ width: 14, height: 14 }} /> Location</label>
                            <div style={{ position: "relative" }}>
                                <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "var(--text-muted)" }} />
                                <input
                                    type="text" value={horaryLocationSearch}
                                    onChange={(e) => { setHoraryLocationSearch(e.target.value); setShowHoraryDropdown(true); }}
                                    onFocus={() => setShowHoraryDropdown(true)}
                                    placeholder="Search location..."
                                    className="input-field" style={{ paddingLeft: 40 }}
                                />
                            </div>
                            {showHoraryDropdown && filteredLocations.length > 0 && (
                                <div className="glass-card" style={{ position: "absolute", zIndex: 40, width: "100%", marginTop: 4, padding: 4, maxHeight: 192, overflowY: "auto" }}>
                                    {filteredLocations.map((loc) => (
                                        <button
                                            key={loc.key} type="button"
                                            onClick={() => { setHoraryLocation(loc.key); setHoraryLocationSearch(loc.name); setShowHoraryDropdown(false); }}
                                            className={horaryLocation === loc.key ? "loc-selected" : "loc-unselected"}
                                            style={{ width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: 8, fontSize: 14, border: "none", cursor: "pointer", transition: "all 0.2s", background: horaryLocation === loc.key ? undefined : "transparent" }}
                                        >
                                            {loc.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {horaryMutation.isError && (
                            <p style={{ fontSize: 14, color: "#f87171", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "8px 12px" }}>
                                {horaryMutation.error.message}
                            </p>
                        )}

                        <Button type="submit" variant="gold" size="lg" className="w-full" loading={horaryMutation.isPending}>
                            <Hash style={{ width: 16, height: 16 }} />
                            Calculate Horary Chart
                        </Button>
                    </motion.form>
                )}
            </AnimatePresence>
        </GlassCard>
    );
}
