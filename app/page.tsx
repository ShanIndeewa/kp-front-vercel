"use client";

import { motion } from "framer-motion";
import { Github, Heart, Compass, Clock, Shield, BarChart3, Target, Book, Layout, FileText, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/layout/HeroSection";
import InputForm from "@/components/astrology/InputForm";

const FEATURES = [
  { icon: Target, title: "Sub-Lord Precision", desc: "KP system's unique sub-lord theory for pinpoint accuracy in predictions.", iconClass: "icon-bg-purple" },
  { icon: Compass, title: "Horary Charts", desc: "Instant horary analysis with 249 sub-division system for specific questions.", iconClass: "icon-bg-cyan" },
  { icon: Clock, title: "Vimshottari Dasha", desc: "Complete dasha timeline with Maha, Bhukti, Antara, and Sukshma periods.", iconClass: "icon-bg-amber" },
  { icon: Shield, title: "Standard Ayanamsa", desc: "Balachandran formula for the most accurate ayanamsa calculations.", iconClass: "icon-bg-rose" },
  { icon: BarChart3, title: "House Analysis", desc: "Placidus house system with detailed cusp positions and lords.", iconClass: "icon-bg-emerald" },
  { icon: FileText, title: "Instant Reports", desc: "Lightning-fast calculations powered by Swiss Ephemeris engine.", iconClass: "icon-bg-violet" },
];

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", position: "relative", background: "var(--bg-primary)" }}>
      {/* Background stars removed for a cleaner look */}

      <Navbar />
      <HeroSection />

      {/* ===== STORY SECTION (Connecting the Dots) ===== */}
      <section style={{ position: "relative", padding: "120px 24px", overflow: "hidden" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: 64, alignItems: "center" }} className="lg:!grid-cols-2">
          
          {/* Left: Illustration */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            style={{ position: "relative" }}
          >
            <div style={{ 
              position: "absolute", inset: -20, 
              background: "radial-gradient(circle, var(--accent-gold-glow) 0%, transparent 70%)",
              opacity: 0.3, zIndex: 0
            }} />
            <img 
              src="/assest/panastro_constellation_reach_1777805930346.png" 
              alt="Connecting the dots" 
              style={{ width: "100%", height: "auto", borderRadius: 16, boxShadow: "0 20px 50px rgba(0,0,0,0.5)", position: "relative", zIndex: 1 }} 
            />
          </motion.div>

          {/* Right: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
          >
            <span style={{ fontSize: 11, fontWeight: 800, color: "var(--accent-gold)", textTransform: "uppercase", letterSpacing: 3, marginBottom: 16, display: "block" }}>
              Analysis of your future
            </span>
            <h2 className="section-title" style={{ color: "white", marginBottom: 32 }}>
              Helping you connect the dots. <br />
              <span className="gradient-text-gold">So you can see clearly.</span>
            </h2>
            <p style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.9, marginBottom: 40, fontWeight: 500 }}>
              The KP system doesn't just show you potential—it reveals precise timing. 
              By connecting planetary influences with sub-lord accuracy, we provide a 
              roadmap that allows you to put your efforts where they matter most.
            </p>
            <div style={{ display: "flex", gap: 32 }}>
              <div>
                <h4 style={{ color: "white", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>98.4%</h4>
                <p style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Calculation Precision</p>
              </div>
              <div>
                <h4 style={{ color: "white", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>249+</h4>
                <p style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Sub-Lord Divisions</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES grid Modernized ===== */}
      <section id="features" style={{ padding: "120px 24px", background: "rgba(15, 23, 42, 0.4)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <h2 className="section-title">The <span className="gradient-text-gold">PanAstro</span> Advantage</h2>
            <p className="theme-text-muted" style={{ maxWidth: 640, margin: "0 auto", fontSize: 18, fontWeight: 500 }}>
              Precision tools built for the modern practitioner of Krishnamurti Paddhati.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 32 }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel rounded-premium"
                style={{ padding: "48px", textAlign: "center" }}
              >
                <div style={{ 
                  width: 64, height: 64, borderRadius: "50%", 
                  background: "rgba(180, 148, 92, 0.1)",
                  border: "1px solid var(--border-gold)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 32px"
                }}>
                  <f.icon style={{ width: 28, height: 28, color: "var(--accent-gold)" }} />
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: "white" }}>{f.title}</h3>
                <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.8 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CALCULATOR Section ===== */}
      <section id="dashboard" style={{ padding: "120px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "var(--accent-gold)", textTransform: "uppercase", letterSpacing: 3, marginBottom: 16, display: "block" }}>
              Celestial Engine
            </span>
            <h2 className="section-title">Generate Your <span className="gradient-text-gold">Analysis</span></h2>
          </div>
          <div style={{ maxWidth: 840, margin: "0 auto" }}>
            <InputForm />
          </div>
        </div>
      </section>

      {/* ===== FOOTER Modernized ===== */}
      <footer style={{ background: "var(--bg-deep)", borderTop: "1px solid var(--border-glass)", padding: "100px 24px 60px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 64, marginBottom: 80 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "var(--accent-gold)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Compass style={{ width: 20, height: 20, color: "#111" }} />
                </div>
                <span style={{ fontSize: 24, fontWeight: 800, color: "white", fontFamily: "var(--font-serif)" }}>
                  Pan<span className="gradient-text-gold">Astro</span>
                </span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: 16, lineHeight: 1.9, maxWidth: 360 }}>
                A luxury celestial interface providing high-fidelity KP Astrology calculations 
                powered by our proprietary Swiss Ephemeris engine.
              </p>
            </div>

            <div>
              <h4 style={{ color: "white", fontSize: 13, fontWeight: 800, marginBottom: 32, textTransform: "uppercase", letterSpacing: 2 }}>Exploration</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
                {["Home", "Charts", "Features", "About"].map(item => (
                  <li key={item}><a href="#" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 15, transition: "0.3s" }} className="hover:text-white">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ color: "white", fontSize: 13, fontWeight: 800, marginBottom: 32, textTransform: "uppercase", letterSpacing: 2 }}>Contact</h4>
              <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 16 }}>Support & Inquiry</p>
              <button className="rounded-button" style={{ 
                padding: "10px 24px", background: "transparent", border: "1px solid var(--border-gold)", 
                color: "var(--accent-gold)", fontWeight: 700, fontSize: 13, cursor: "pointer" 
              }}>
                GET IN TOUCH
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 24, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
             <p style={{ color: "var(--text-muted)", fontSize: 13 }}>© {new Date().getFullYear()} PanAstro System. All rights reserved.</p>
             <div style={{ display: "flex", gap: 24 }}>
                <Github style={{ width: 20, height: 20, color: "var(--text-muted)" }} />
                <Heart style={{ width: 20, height: 20, color: "var(--text-muted)" }} />
             </div>
          </div>
        </div>
      </footer>

    </main>
  );
}

