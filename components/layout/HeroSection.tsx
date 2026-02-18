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
        <section style={{ position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
            {/* Gradient Background */}
            <div className="hero-gradient" style={{ position: "absolute", inset: 0 }} />

            {/* Wave at Bottom */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
                    <path d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 82.5C1248 75 1344 60 1392 52.5L1440 45V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="var(--bg-primary)" />
                </svg>
            </div>

            {/* Floating Particles */}
            <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        style={{
                            position: "absolute", borderRadius: "50%", background: "rgba(255,255,255,0.08)",
                            width: `${150 + i * 50}px`, height: `${150 + i * 50}px`,
                            left: `${10 + i * 15}%`, top: `${5 + i * 12}%`,
                        }}
                        animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.05, 1] }}
                        transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                    />
                ))}
            </div>

            {/* Content */}
            <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto", padding: "0 24px", width: "100%" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 48, alignItems: "center" }} className="lg:!grid-cols-2">
                    {/* Left Text */}
                    <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            style={{
                                display: "inline-flex", alignItems: "center", gap: 8,
                                padding: "8px 16px", borderRadius: 999,
                                background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
                                border: "1px solid rgba(255,255,255,0.2)", marginBottom: 32,
                            }}
                        >
                            <span style={{ fontSize: 16 }}>♃</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                                Premium KP Astrology System
                            </span>
                        </motion.div>

                        {/* Heading */}
                        <h1 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 24, fontFamily: "'Playfair Display', serif" }}>
                            Unlock Your <br />
                            <span style={{ background: "linear-gradient(90deg, #fde047, #fbbf24, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Cosmic Path
                            </span>
                        </h1>

                        {/* Description */}
                        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", maxWidth: 500, marginBottom: 32, lineHeight: 1.7 }}>
                            Experience precision birth charts and horary analysis powered by KP
                            sub-lord theory. The most accurate Krishnamurti Paddhati calculator.
                        </p>

                        {/* CTA Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                            style={{
                                display: "flex", alignItems: "center",
                                background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)",
                                borderRadius: 16, padding: 8,
                                border: "1px solid rgba(255,255,255,0.15)", maxWidth: 440,
                            }}
                        >
                            <input
                                type="text" placeholder="Enter your birth date..." readOnly
                                onClick={() => document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })}
                                style={{ flex: 1, background: "transparent", color: "#fff", padding: "12px 16px", fontSize: 14, outline: "none", border: "none" }}
                            />
                            <button
                                onClick={() => document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })}
                                style={{
                                    flexShrink: 0, padding: "12px 24px", borderRadius: 12,
                                    background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                                    color: "#111827", fontSize: 14, fontWeight: 700,
                                    border: "none", cursor: "pointer",
                                    boxShadow: "0 4px 15px rgba(251,191,36,0.3)",
                                }}
                            >
                                Calculate
                            </button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                            style={{ display: "flex", alignItems: "center", gap: 32, marginTop: 40 }}
                        >
                            {[
                                { value: "249+", label: "Horary Subs" },
                                { value: "10K+", label: "Users" },
                                { value: "99.9%", label: "Accuracy" },
                            ].map((stat, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div>
                                        <span style={{ fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 800, color: "#fff" }}>{stat.value}</span>
                                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 500, marginTop: 2 }}>{stat.label}</p>
                                    </div>
                                    {i < 2 && <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.15)", marginLeft: 20 }} />}
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Visual — Zodiac Wheel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="hidden lg:flex"
                        style={{ position: "relative", alignItems: "center", justifyContent: "center" }}
                    >
                        {/* Orbiting rings */}
                        <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.08)", animation: "rotate-slow 50s linear infinite" }} />
                        <div style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)", animation: "rotate-slow 70s linear infinite reverse" }} />

                        {/* Main Circle with Zodiac Wheel */}
                        <div style={{
                            position: "relative", width: 340, height: 340, borderRadius: "50%",
                            background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.03))",
                            backdropFilter: "blur(8px)",
                            border: "4px solid rgba(255,255,255,0.15)",
                            boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
                            overflow: "hidden",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            {/* Inner glow overlay */}
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(139,92,246,0.3), transparent, rgba(6,182,212,0.2))" }} />

                            {/* Slowly rotating zodiac ring */}
                            <div style={{ position: "relative", zIndex: 2, animation: "rotate-slow 60s linear infinite" }}>
                                <ZodiacRing size={260} />
                            </div>

                            {/* Center text */}
                            <div style={{ position: "absolute", zIndex: 3, textAlign: "center" }}>
                                <p style={{ color: "#fff", fontWeight: 700, fontSize: 16, letterSpacing: 3, fontFamily: "'Playfair Display', serif" }}>KP</p>
                                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, marginTop: 2, letterSpacing: 2 }}>JYOTISH</p>
                            </div>
                        </div>

                        {/* Floating badges — zodiac glyphs */}
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            style={{
                                position: "absolute", top: -8, right: 48,
                                width: 52, height: 52, borderRadius: 16,
                                background: "linear-gradient(135deg, #fbbf24, #ea580c)",
                                boxShadow: "0 8px 25px rgba(251,191,36,0.3)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 24, color: "#fff",
                            }}
                        >
                            ☉
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            style={{
                                position: "absolute", bottom: 32, left: 16,
                                width: 52, height: 52, borderRadius: 16,
                                background: "linear-gradient(135deg, #a855f7, #4f46e5)",
                                boxShadow: "0 8px 25px rgba(139,92,246,0.3)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 24, color: "#fff",
                            }}
                        >
                            ☽
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            style={{
                                position: "absolute", top: "50%", right: -16,
                                width: 52, height: 52, borderRadius: 16,
                                background: "linear-gradient(135deg, #06b6d4, #0d9488)",
                                boxShadow: "0 8px 25px rgba(6,182,212,0.3)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 24, color: "#fff",
                            }}
                        >
                            ♃
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                style={{ position: "absolute", bottom: 96, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}
            >
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <ChevronDown style={{ width: 24, height: 24, color: "rgba(255,255,255,0.4)" }} />
                </motion.div>
            </motion.div>
        </section>
    );
}
