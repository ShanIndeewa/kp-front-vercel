"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PlanetPosition, HouseCusp, AscendantInfo } from "@/types/api";
import {
    ZODIAC_SIGNS,
    polarToCartesian,
    getPlanetColor,
    getPlanetSymbol,
    getPlanetAbbr,
} from "@/lib/utils/astrology";

interface AstrologyWheelProps {
    ascendant: AscendantInfo;
    planets: PlanetPosition[];
    houses: HouseCusp[];
    size?: number;
}

const VIEW = 500;
const CX = VIEW / 2;
const CY = VIEW / 2;
const R_OUTER = 230;
const R_SIGN_TEXT = 205;
const R_SIGN_INNER = 180;
const R_HOUSE_NUM = 155;
const R_PLANET = 130;
const R_INNER = 100;

/**
 * Convert zodiac longitude (0°=Aries) to SVG angle (°),
 * with the Ascendant pinned at the left (9 o'clock position),
 * and signs running ANTI-CLOCKWISE (traditional KP style).
 *
 * In traditional KP charts:
 * - Ascendant is at the left
 * - Signs increase counter-clockwise
 *
 * In SVG: 0° = right, 90° = down
 * We want Asc at left = 180° in SVG
 * Anti-clockwise = negate the zodiac angle
 */
function zodiacToSvg(zodiacDeg: number, ascDeg: number): number {
    // Negate for anti-clockwise, offset so Asc lands at 180° (left)
    return -(zodiacDeg - ascDeg) + 180;
}

function pt(r: number, svgAngle: number) {
    return polarToCartesian(CX, CY, r, svgAngle);
}

/**
 * Build an SVG arc path for a wedge (pie slice).
 * For anti-clockwise zodiac, we sweep counter-clockwise (flag=0).
 */
function wedgePath(
    rOuter: number,
    rInner: number,
    startAngle: number,
    endAngle: number
): string {
    // For anti-clockwise, arc goes from start to end with sweep=0
    const sweep = ((endAngle - startAngle + 360) % 360);
    const large = sweep > 180 ? 1 : 0;

    const oStart = pt(rOuter, startAngle);
    const oEnd = pt(rOuter, endAngle);
    const iStart = pt(rInner, endAngle);
    const iEnd = pt(rInner, startAngle);

    return [
        `M ${oStart.x} ${oStart.y}`,
        `A ${rOuter} ${rOuter} 0 ${large} 0 ${oEnd.x} ${oEnd.y}`,
        `L ${iStart.x} ${iStart.y}`,
        `A ${rInner} ${rInner} 0 ${large} 1 ${iEnd.x} ${iEnd.y}`,
        `Z`,
    ].join(" ");
}

/**
 * Spread planet positions to avoid overlapping labels.
 */
function spreadPlanets(
    planets: PlanetPosition[],
    ascDeg: number,
    minGap: number = 10
): Array<{ planet: PlanetPosition; svgAngle: number; renderAngle: number }> {
    const items = planets
        .map((p) => ({
            planet: p,
            svgAngle: zodiacToSvg(p.longitude, ascDeg),
        }))
        .sort((a, b) => a.svgAngle - b.svgAngle);

    const result = items.map((item) => ({ ...item, renderAngle: item.svgAngle }));
    for (let i = 1; i < result.length; i++) {
        const diff = result[i].renderAngle - result[i - 1].renderAngle;
        if (Math.abs(diff) < minGap) {
            result[i].renderAngle = result[i - 1].renderAngle + (diff >= 0 ? minGap : -minGap);
        }
    }
    return result;
}

export default function AstrologyWheel({
    ascendant,
    planets,
    houses,
    size = 500,
}: AstrologyWheelProps) {
    const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
    const ascDeg = ascendant.longitude;

    const lagnaHouse = houses.find((h) => h.house === 1);
    const lagnaNextHouse = houses.find((h) => h.house === 2);

    const spreadItems = useMemo(
        () => spreadPlanets(planets, ascDeg, 12),
        [planets, ascDeg]
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ position: "relative", width: size, height: size, margin: "0 auto" }}
        >
            <svg viewBox={`0 0 ${VIEW} ${VIEW}`} style={{ width: "100%", height: "100%" }}>
                <defs>
                    <filter id="lagnaGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id="planetGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <radialGradient id="wheelBg">
                        <stop offset="0%" stopColor="var(--wheel-bg)" />
                        <stop offset="100%" stopColor="var(--bg-primary)" stopOpacity="0.5" />
                    </radialGradient>
                </defs>

                {/* Background */}
                <circle cx={CX} cy={CY} r={R_OUTER + 5} fill="url(#wheelBg)" />
                <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="var(--wheel-line)" strokeWidth="1.5" />
                <circle cx={CX} cy={CY} r={R_SIGN_INNER} fill="none" stroke="var(--wheel-line)" strokeWidth="1" />
                <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="var(--wheel-line)" strokeWidth="0.8" />

                {/* Lagna Highlight */}
                {lagnaHouse && lagnaNextHouse && (
                    <path
                        d={wedgePath(
                            R_SIGN_INNER,
                            R_INNER,
                            zodiacToSvg(lagnaHouse.longitude, ascDeg),
                            zodiacToSvg(lagnaNextHouse.longitude, ascDeg)
                        )}
                        fill="var(--lagna-glow)"
                        filter="url(#lagnaGlow)"
                    />
                )}

                {/* Zodiac Sign Segments (anti-clockwise) */}
                {ZODIAC_SIGNS.map((sign) => {
                    const startAngle = zodiacToSvg(sign.startDeg, ascDeg);
                    const endAngle = zodiacToSvg(sign.endDeg, ascDeg);
                    const midAngle = (startAngle + endAngle) / 2;
                    const textPt = pt(R_SIGN_TEXT, midAngle);
                    const lineStart = pt(R_OUTER, startAngle);
                    const lineEnd = pt(R_SIGN_INNER, startAngle);

                    return (
                        <g key={sign.name}>
                            <path
                                d={wedgePath(R_OUTER, R_SIGN_INNER, startAngle, endAngle)}
                                fill={`${sign.color}08`}
                                stroke="var(--wheel-line)"
                                strokeWidth="0.5"
                            />
                            <line
                                x1={lineStart.x} y1={lineStart.y}
                                x2={lineEnd.x} y2={lineEnd.y}
                                stroke="var(--wheel-line)" strokeWidth="0.8"
                            />
                            <text
                                x={textPt.x} y={textPt.y}
                                textAnchor="middle" dominantBaseline="central"
                                fill={sign.color} fontSize="14" fontWeight="600"
                                style={{ pointerEvents: "none" }}
                            >
                                {sign.symbol}
                            </text>
                        </g>
                    );
                })}

                {/* House Cusp Lines */}
                {houses.map((h) => {
                    const angle = zodiacToSvg(h.longitude, ascDeg);
                    const outer = pt(R_SIGN_INNER, angle);
                    const inner = pt(R_INNER, angle);
                    // Offset house number slightly into the house sector
                    const numPt = pt(R_HOUSE_NUM, angle - 5);
                    const isLagna = h.house === 1;

                    return (
                        <g key={`h${h.house}`}>
                            <line
                                x1={outer.x} y1={outer.y}
                                x2={inner.x} y2={inner.y}
                                stroke={isLagna ? "var(--accent-gold)" : "var(--wheel-line)"}
                                strokeWidth={isLagna ? 2 : 0.6}
                                strokeDasharray={isLagna ? "none" : "3,3"}
                            />
                            <text
                                x={numPt.x} y={numPt.y}
                                textAnchor="middle" dominantBaseline="central"
                                fill={isLagna ? "var(--accent-gold)" : "var(--wheel-sign-text)"}
                                fontSize={isLagna ? "11" : "9"}
                                fontWeight={isLagna ? "700" : "500"}
                                fontFamily="Inter, sans-serif"
                            >
                                {h.house}
                            </text>
                        </g>
                    );
                })}

                {/* ASC marker at left (180°) */}
                {(() => {
                    const ascAngle = zodiacToSvg(ascDeg, ascDeg); // = 180° left
                    const tip = pt(R_OUTER + 10, ascAngle);
                    const left = pt(R_OUTER + 20, ascAngle - 4);
                    const right = pt(R_OUTER + 20, ascAngle + 4);
                    return (
                        <polygon
                            points={`${tip.x},${tip.y} ${left.x},${left.y} ${right.x},${right.y}`}
                            fill="var(--accent-gold)"
                            filter="url(#lagnaGlow)"
                        />
                    );
                })()}

                {/* ASC label */}
                <text
                    x={CX - R_OUTER - 28}
                    y={CY}
                    textAnchor="middle"
                    fill="var(--accent-gold)"
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="Inter, sans-serif"
                >
                    ASC
                </text>

                {/* Planets */}
                {spreadItems.map(({ planet, svgAngle, renderAngle }) => {
                    const isHovered = hoveredPlanet === planet.name;
                    const pos = pt(R_PLANET, renderAngle);
                    const dotPos = pt(R_PLANET, svgAngle);
                    const color = getPlanetColor(planet.name);

                    return (
                        <g
                            key={planet.name}
                            onMouseEnter={() => setHoveredPlanet(planet.name)}
                            onMouseLeave={() => setHoveredPlanet(null)}
                            style={{ cursor: "pointer" }}
                        >
                            {Math.abs(renderAngle - svgAngle) > 2 && (
                                <line
                                    x1={dotPos.x} y1={dotPos.y}
                                    x2={pos.x} y2={pos.y}
                                    stroke={color} strokeWidth="0.5" strokeOpacity="0.4"
                                />
                            )}
                            <circle cx={dotPos.x} cy={dotPos.y} r={3} fill={color}
                                filter={isHovered ? "url(#planetGlow)" : undefined}
                            />
                            <circle cx={pos.x} cy={pos.y} r={isHovered ? 16 : 14}
                                fill="var(--planet-label-bg)"
                                stroke={color} strokeWidth={isHovered ? 2 : 1}
                            />
                            <text x={pos.x} y={pos.y - 3}
                                textAnchor="middle" dominantBaseline="central"
                                fill={color} fontSize="11" fontWeight="700"
                                fontFamily="Inter, sans-serif"
                            >
                                {getPlanetAbbr(planet.name)}
                            </text>
                            <text x={pos.x} y={pos.y + 8}
                                textAnchor="middle" dominantBaseline="central"
                                fill="var(--text-muted)" fontSize="6"
                                fontFamily="Inter, sans-serif"
                            >
                                {planet.retrograde ? "℞" : ""}
                            </text>
                        </g>
                    );
                })}

                {/* Center */}
                <circle cx={CX} cy={CY} r={30}
                    fill="var(--bg-primary)" stroke="var(--wheel-line)" strokeWidth="1"
                />
                <text x={CX} y={CY - 4}
                    textAnchor="middle" dominantBaseline="central"
                    fill="var(--accent-gold)" fontSize="12" fontWeight="700"
                    fontFamily="'Playfair Display', serif"
                >
                    KP
                </text>
                <text x={CX} y={CY + 8}
                    textAnchor="middle" dominantBaseline="central"
                    fill="var(--text-muted)" fontSize="7"
                    fontFamily="Inter, sans-serif"
                >
                    CHART
                </text>
            </svg>

            {/* Tooltip */}
            <AnimatePresence>
                {hoveredPlanet && (() => {
                    const planet = planets.find((p) => p.name === hoveredPlanet);
                    if (!planet) return null;
                    const item = spreadItems.find((s) => s.planet.name === hoveredPlanet);
                    if (!item) return null;
                    const pos = pt(R_PLANET - 35, item.renderAngle);

                    return (
                        <motion.div
                            key={hoveredPlanet}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.15 }}
                            className="glass-card"
                            style={{
                                position: "absolute", pointerEvents: "none",
                                padding: 12, minWidth: 160, zIndex: 50,
                                left: `${(pos.x / VIEW) * 100}%`,
                                top: `${(pos.y / VIEW) * 100}%`,
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                <span style={{ fontSize: 20, color: getPlanetColor(planet.name) }}>
                                    {getPlanetSymbol(planet.name)}
                                </span>
                                <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 14 }}>
                                    {planet.name}
                                    {planet.retrograde && (
                                        <span style={{ color: "var(--accent-rose)", marginLeft: 4, fontSize: 12 }}>℞</span>
                                    )}
                                </span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
                                {[
                                    { label: "Sign", value: planet.sign, style: { fontWeight: 500, color: "var(--text-primary)" } },
                                    { label: "Position", value: planet.longitude_dms, style: { fontFamily: "monospace", color: "var(--accent-cyan)" } },
                                    { label: "Star Lord", value: planet.star_lord, style: { color: getPlanetColor(planet.star_lord) } },
                                    { label: "Sub Lord", value: planet.sub_lord, style: { color: getPlanetColor(planet.sub_lord) } },
                                    ...(planet.sub_sub_lord ? [{ label: "Sub-Sub", value: planet.sub_sub_lord, style: { color: "var(--text-secondary)" } }] : []),
                                ].map((row) => (
                                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ color: "var(--text-muted)" }}>{row.label}</span>
                                        <span style={row.style}>{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>
        </motion.div>
    );
}
