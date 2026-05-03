"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ZODIAC_SIGNS } from "@/lib/utils/astrology";

/* Small inline SVG zodiac ring that rotates inside the hero circle */
function ZodiacRing({ size = 200 }: { size?: number }) {
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 20;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
            {/* Outer ring */}
            <circle cx={cx} cy={cy} r={r + 8} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <circle cx={cx} cy={cy} r={r - 8} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

            {/* 12 zodiac symbols arranged in a circle */}
            {ZODIAC_SIGNS.map((sign, i) => {
                const angle = (i * 30 + 15) * (Math.PI / 180) - Math.PI / 2;
                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);
                return (
                    <text
                        key={sign.name}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={sign.color}
                        fontSize="18"
                        fontWeight="600"
                        style={{ pointerEvents: "none" }}
                    >
                        {sign.symbol}
                    </text>
                );
            })}

            {/* Divider lines between signs */}
            {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30) * (Math.PI / 180) - Math.PI / 2;
                const x1 = cx + (r - 12) * Math.cos(angle);
                const y1 = cy + (r - 12) * Math.sin(angle);
                const x2 = cx + (r + 12) * Math.cos(angle);
                const y2 = cy + (r + 12) * Math.sin(angle);
                return (
                    <line
                        key={i}
                        x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="0.5"
                    />
                );
            })}
        </svg>
    );
}

export default function HeroSection() {
    return (
        <section style={{ 
            position: "relative", 
            minHeight: "100vh", 
            display: "flex", 
            alignItems: "center", 
            overflow: "hidden", 
            background: "radial-gradient(circle at top right, var(--accent-indigo), var(--bg-deep))",
            paddingTop: 80
        }}>
            {/* Background Illustration Overlay */}
            <div 
                style={{ 
                    position: "absolute", 
                    top: 0, 
                    right: 0, 
                    width: "60%", 
                    height: "100%", 
                    backgroundImage: "url('/assest/panastro_hero_illustration_1777805903242.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center right",
                    opacity: 0.6,
                    maskImage: "linear-gradient(to left, black 40%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to left, black 40%, transparent 100%)",
                    zIndex: 1
                }} 
            />

            {/* Subtle Stardust particles could be added here */}

            {/* Content Container */}
            <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto", padding: "0 24px", width: "100%" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 48, alignItems: "center" }} className="lg:!grid-cols-2">
                    
                    {/* Left: Branding & Message */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                        {/* Elegant Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="glass-panel-gold"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: 10,
                                padding: "8px 20px", borderRadius: 999,
                                marginBottom: 32,
                            }}
                        >
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-gold)" }} />
                            <span style={{ fontSize: 12, fontWeight: 800, color: "var(--accent-gold)", textTransform: "uppercase", letterSpacing: 2 }}>
                                Precision Celestial Analysis
                            </span>
                        </motion.div>
 
                        {/* Large Headline */}
                        <h1 className="hero-title" style={{ marginBottom: 24, textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}>
                            Explore the life <br />
                            <span className="gradient-text-gold">you want to live.</span>
                        </h1>
 
                        <p style={{ fontSize: 19, color: "var(--text-secondary)", maxWidth: 540, marginBottom: 48, lineHeight: 1.8, fontWeight: 500 }}>
                            Harness the precision of traditional Krishnamurti Paddhati principles 
                            with our modern celestial interface. High-fidelity analytics for the discerning astrologer.
                        </p>
 
                        {/* CTA Bar - Refined */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                            className="glass-panel"
                            style={{
                                display: "flex", alignItems: "center",
                                borderRadius: 999, padding: 6,
                                maxWidth: 480,
                                border: "1px solid rgba(255,255,255,0.15)",
                            }}
                        >
                            <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: 12 }}>
                                <span className="theme-text-muted" style={{ fontSize: 13, fontWeight: 600 }}>READY TO START?</span>
                            </div>
                            <button
                                onClick={() => document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })}
                                className="rounded-button pulse-gold"
                                style={{
                                    flexShrink: 0, padding: "14px 36px",
                                    background: "var(--accent-gold)",
                                    color: "#111", fontSize: 13, fontWeight: 800,
                                    border: "none", cursor: "pointer",
                                    transition: "all 0.3s",
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                    borderRadius: 999
                                }}
                            >
                                Get Started
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Right Visual - Hidden on mobile, illustrative depth on desktop */}
                    <div className="hidden lg:block relative h-[600px]">
                        {/* This area is covered by the background illustration for a modern 'Wealthy' app look */}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                style={{ position: "absolute", bottom: 40, left: 48, zIndex: 10, display: "flex", alignItems: "center", gap: 16 }}
            >
                <div style={{ height: 1, width: 40, background: "var(--accent-gold)", opacity: 0.5 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-gold)", textTransform: "uppercase", letterSpacing: 2 }}>Scroll to Explore</span>
            </motion.div>
        </section>
    );
}


