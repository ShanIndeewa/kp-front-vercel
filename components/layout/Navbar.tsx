"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Compass, Menu, X, ChevronRight } from "lucide-react";
import ThemeSelector from "@/components/ui/ThemeSelector";
import Link from "next/link";

const NAV_LINKS = [
    { label: "Home", href: "#" },
    { label: "Charts", href: "#dashboard" },
    { label: "Features", href: "#features" },
    { label: "About", href: "#about" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "nav-scrolled" : "bg-transparent"
                }`}
        >
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
                    {/* Logo */}
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                        <div
                            style={{
                                width: 36, height: 36, borderRadius: "50%",
                                background: "var(--accent-gold)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 0 20px var(--accent-gold-glow)",
                            }}
                        >
                            <Compass style={{ width: 18, height: 18, color: "#111" }} />
                        </div>
                        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: "white", fontFamily: "var(--font-serif)" }}>
                            Pan<span className="gradient-text-gold">Astro</span>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="hidden md:flex">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="theme-text-2 hover:text-white"
                                style={{
                                    padding: "8px 12px", fontSize: 13, fontWeight: 600,
                                    textTransform: "uppercase", letterSpacing: "1px",
                                    textDecoration: "none",
                                    transition: "all 0.3s",
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div className="hidden sm:block">
                            <ThemeSelector />
                        </div>

                        <Link
                            href="#dashboard"
                            className="hidden sm:inline-flex rounded-button pulse-gold"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: 8,
                                padding: "8px 20px", fontSize: 13, fontWeight: 700,
                                background: "var(--accent-gold)",
                                color: "#111", textDecoration: "none",
                                transition: "all 0.3s",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px"
                            }}
                        >
                            Get Started
                        </Link>

                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden theme-text-2"
                            style={{ padding: 8, borderRadius: 0, background: "transparent", border: "none", cursor: "pointer" }}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ background: "var(--nav-bg)", borderTop: "1px solid var(--border-glass)" }}
                    className="md:hidden"
                >
                    <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="theme-text-2"
                                style={{
                                    padding: "10px 12px", fontSize: 14, fontWeight: 500,
                                    borderRadius: 0, textDecoration: "none", display: "block",
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="#dashboard"
                            onClick={() => setMobileOpen(false)}
                            style={{
                                display: "block", marginTop: 12, textAlign: "center",
                                padding: "12px 0", borderRadius: 0, fontSize: 14, fontWeight: 700,
                                background: "var(--accent-gold)",
                                color: "#111", textDecoration: "none",
                            }}
                        >
                            Get Started
                        </Link>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}

