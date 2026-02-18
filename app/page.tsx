"use client";

import { motion } from "framer-motion";
import { Github, Heart, Sparkles, Zap, Target, Clock, Shield, BarChart3, Compass } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/layout/HeroSection";
import InputForm from "@/components/astrology/InputForm";

const FEATURES = [
  { icon: Target, title: "Sub-Lord Precision", desc: "KP system's unique sub-lord theory for pinpoint accuracy in predictions.", iconClass: "icon-bg-purple" },
  { icon: Compass, title: "Horary Charts", desc: "Instant horary analysis with 249 sub-division system for specific questions.", iconClass: "icon-bg-cyan" },
  { icon: Clock, title: "Vimshottari Dasha", desc: "Complete dasha timeline with Maha, Bhukti, Antara, and Sukshma periods.", iconClass: "icon-bg-amber" },
  { icon: Shield, title: "KP New Ayanamsa", desc: "Balachandran formula for the most accurate ayanamsa calculations.", iconClass: "icon-bg-rose" },
  { icon: BarChart3, title: "House Analysis", desc: "Placidus house system with detailed cusp positions and lords.", iconClass: "icon-bg-emerald" },
  { icon: Zap, title: "Instant Results", desc: "Lightning-fast calculations powered by Swiss Ephemeris engine.", iconClass: "icon-bg-violet" },
];

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      {/* Stars */}
      <div className="stars-bg">
        {Array.from({ length: 30 }).map((_, i) => (
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
      <HeroSection />

      {/* ===== FEATURES ===== */}
      <section id="features" style={{ position: "relative", zIndex: 10, padding: "80px 16px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <div
              className="glass"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 16px", borderRadius: 999, marginBottom: 20,
                fontSize: 12, fontWeight: 600, letterSpacing: 1,
                textTransform: "uppercase", color: "var(--accent-cyan)",
              }}
            >
              <Sparkles style={{ width: 14, height: 14 }} />
              Why Choose Us
            </div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, marginBottom: 16 }}>
              <span className="theme-text">Powered by </span>
              <span className="gradient-text">KP Science</span>
            </h2>
            <p className="theme-text-2" style={{ maxWidth: 640, margin: "0 auto", fontSize: 18, lineHeight: 1.6 }}>
              The most advanced Krishnamurti Paddhati calculator with features designed for serious astrologers.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card"
                style={{ padding: 24 }}
              >
                <div
                  className={f.iconClass}
                  style={{
                    width: 48, height: 48, borderRadius: 16,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 20, boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                  }}
                >
                  <f.icon style={{ width: 24, height: 24, color: "#fff" }} />
                </div>
                <h3 className="theme-text" style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, fontFamily: "Inter, sans-serif" }}>
                  {f.title}
                </h3>
                <p className="theme-text-2" style={{ fontSize: 14, lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CALCULATOR ===== */}
      <section id="dashboard" style={{ position: "relative", zIndex: 10, padding: "80px 16px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <div
              className="glass"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 16px", borderRadius: 999, marginBottom: 20,
                fontSize: 12, fontWeight: 600, letterSpacing: 1,
                textTransform: "uppercase", color: "var(--accent-gold)",
              }}
            >
              <Zap style={{ width: 14, height: 14 }} />
              Chart Calculator
            </div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, marginBottom: 16 }}>
              <span className="gradient-text">Calculate</span>{" "}
              <span className="theme-text">Your Chart</span>
            </h2>
            <p className="theme-text-2" style={{ maxWidth: 640, margin: "0 auto", fontSize: 18, lineHeight: 1.6 }}>
              Enter your birth details or horary number to generate a complete KP astrology analysis.
            </p>
          </motion.div>

          {/* Input Form — redirects to /chart on submit */}
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <InputForm />
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" style={{ position: "relative", zIndex: 10, padding: "80px 16px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, marginBottom: 16 }}>
                <span className="gradient-text">About</span>{" "}
                <span className="theme-text">KP System</span>
              </h2>
            </div>
            <div className="glass-card" style={{ padding: "32px 40px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32, marginBottom: 32 }}>
                <div>
                  <h3 className="theme-text" style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, fontFamily: "Inter, sans-serif" }}>
                    What is Krishnamurti Paddhati?
                  </h3>
                  <p className="theme-text-2" style={{ fontSize: 14, lineHeight: 1.7 }}>
                    <strong style={{ color: "var(--accent-gold)" }}>KP Astrology</strong> is a revolutionary system developed by{" "}
                    <strong className="theme-text">Prof. K.S. Krishnamurti</strong> that refines traditional Vedic astrology with the concept of{" "}
                    <span style={{ color: "var(--accent-cyan)" }}>Sub Lords</span>, providing remarkable precision.
                  </p>
                </div>
                <div>
                  <h3 className="theme-text" style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, fontFamily: "Inter, sans-serif" }}>
                    The Sub-Lord Theory
                  </h3>
                  <p className="theme-text-2" style={{ fontSize: 14, lineHeight: 1.7 }}>
                    Each Nakshatra is divided into sub-divisions based on the Vimshottari Dasha system, creating a unique{" "}
                    <span style={{ color: "var(--accent-purple)" }}>Sign Lord → Star Lord → Sub Lord</span>{" "}
                    hierarchy for every degree of the zodiac.
                  </p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
                {[
                  { label: "KP New Ayanamsa", value: "Balachandran Formula", icon: "🔭" },
                  { label: "House System", value: "Placidus (Semi-Arc)", icon: "🏛️" },
                  { label: "Dasha System", value: "Vimshottari (120yr)", icon: "⏳" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: 16, borderRadius: 16, textAlign: "center",
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-glass)",
                      transition: "border-color 0.3s",
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                    <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--text-muted)", marginBottom: 4, fontWeight: 600 }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-cyan)" }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ position: "relative", zIndex: 10, borderTop: "1px solid var(--border-glass)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, marginBottom: 32 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Sparkles style={{ width: 20, height: 20, color: "#fff" }} />
                </div>
                <span className="theme-text" style={{ fontSize: 18, fontWeight: 700 }}>
                  KP<span className="gradient-text">Astro</span>
                </span>
              </div>
              <p className="theme-text-muted" style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
                Premium KP Astrology calculator powered by Swiss Ephemeris.
              </p>
            </div>
            <div>
              <h4 className="theme-text" style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Quick Links</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Home", "Charts", "Features", "About"].map((link) => (
                  <a key={link} href={`#${link.toLowerCase()}`} className="theme-text-muted" style={{ fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="theme-text" style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>KP Resources</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }} className="theme-text-muted">
                <p>Sub-Lord Theory</p>
                <p>Vimshottari Dasha</p>
                <p>KP Ayanamsa</p>
                <p>Horary Astrology</p>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: 24, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text-muted)" }}>
              <Heart style={{ width: 16, height: 16, color: "var(--accent-rose)" }} />
              <span>Built with cosmic precision</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-muted)", transition: "color 0.2s" }}>
                <Github style={{ width: 20, height: 20 }} />
              </a>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                © {new Date().getFullYear()} KP Astrology. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
