'use client';

import { useMemo, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Search } from 'lucide-react';
import type { PlanetPosition, HouseCusp, AscendantInfo } from '@/types/api';
import {
  ZODIAC_SIGNS,
  getPlanetColor,
  getPlanetSymbol,
} from '@/lib/utils/astrology';

// 27 Nakshatras with their lords
const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu', start: 0 },
  { name: 'Bharani', lord: 'Venus', start: 13.333 },
  { name: 'Krittika', lord: 'Sun', start: 26.667 },
  { name: 'Rohini', lord: 'Moon', start: 40 },
  { name: 'Mrigashira', lord: 'Mars', start: 53.333 },
  { name: 'Ardra', lord: 'Rahu', start: 66.667 },
  { name: 'Punarvasu', lord: 'Jupiter', start: 80 },
  { name: 'Pushya', lord: 'Saturn', start: 93.333 },
  { name: 'Ashlesha', lord: 'Mercury', start: 106.667 },
  { name: 'Magha', lord: 'Ketu', start: 120 },
  { name: 'P.Phalguni', lord: 'Venus', start: 133.333 },
  { name: 'U.Phalguni', lord: 'Sun', start: 146.667 },
  { name: 'Hasta', lord: 'Moon', start: 160 },
  { name: 'Chitra', lord: 'Mars', start: 173.333 },
  { name: 'Swati', lord: 'Rahu', start: 186.667 },
  { name: 'Vishakha', lord: 'Jupiter', start: 200 },
  { name: 'Anuradha', lord: 'Saturn', start: 213.333 },
  { name: 'Jyeshtha', lord: 'Mercury', start: 226.667 },
  { name: 'Mula', lord: 'Ketu', start: 240 },
  { name: 'P.Ashadha', lord: 'Venus', start: 253.333 },
  { name: 'U.Ashadha', lord: 'Sun', start: 266.667 },
  { name: 'Shravana', lord: 'Moon', start: 280 },
  { name: 'Dhanishta', lord: 'Mars', start: 293.333 },
  { name: 'Shatabhisha', lord: 'Rahu', start: 306.667 },
  { name: 'P.Bhadra', lord: 'Jupiter', start: 320 },
  { name: 'U.Bhadra', lord: 'Saturn', start: 333.333 },
  { name: 'Revati', lord: 'Mercury', start: 346.667 },
];

// Sub lord colors for visual distinction
const SUB_LORD_COLORS: Record<string, string> = {
  Sun: '#fbbf24',
  Moon: '#e0e7ff',
  Mars: '#ef4444',
  Mercury: '#22c55e',
  Jupiter: '#f59e0b',
  Venus: '#ec4899',
  Saturn: '#6366f1',
  Rahu: '#8b5cf6',
  Ketu: '#a78bfa',
};

interface PlanetLike {
  name: string;
  longitude: number;
  longitude_dms: string;
  sign: string;
  sign_lord: string;
  star: string;
  star_lord: string;
  sub_lord: string;
  sub_sub_lord?: string | null;
  retrograde?: boolean;
}

interface ChartPlanetPosition extends PlanetLike {
  angle: number;
  x: number;
  y: number;
  color: string;
  symbol: string;
}

interface ChartCuspLine {
  house: number;
  longitude: number;
  sign: string;
  sign_lord: string;
  star_lord: string;
  sub_lord: string;
  angle: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface ScientificChartProps {
  ascendant: AscendantInfo;
  planets: PlanetPosition[];
  houses: HouseCusp[];
}

export default function ScientificChart({ ascendant, planets, houses }: ScientificChartProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{ x: number; y: number; content: React.ReactNode } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const size = 600;
  const center = size / 2;
  const outerRadius = size * 0.44;
  
  // Ring widths
  const subLordRingWidth = 12;
  const nakshatraRingWidth = 16;
  const rashiRingWidth = 24;
  const innerRadius = 70;

  // Calculate chart elements with Lagna at TOP (270° in SVG)
  const chartElements = useMemo(() => {
    if (!houses || houses.length === 0 || !planets) return null;

    const ascendantDegree = houses[0]?.longitude || ascendant.longitude;
    
    // Convert astrological longitude to SVG angle
    // KEY CHANGE: Lagna should be at TOP (270° or -90° in SVG terms)
    // SVG: 0° = right (3 o'clock), 90° = bottom, 180° = left, 270° = top
    // Counter-clockwise movement for zodiac
    const toSvgAngle = (longitude: number) => {
      // Offset so Ascendant is at 270° (top), counter-clockwise
      return 270 - (longitude - ascendantDegree);
    };

    // Cusp lines
    const radiusAfterRings = outerRadius - subLordRingWidth - nakshatraRingWidth - rashiRingWidth;
    
    const cuspLines: ChartCuspLine[] = houses.map((house) => {
      const angle = toSvgAngle(house.longitude);
      const rad = (angle * Math.PI) / 180;
      return {
        house: house.house,
        longitude: house.longitude,
        sign: house.sign,
        sign_lord: house.sign_lord,
        star_lord: house.star_lord,
        sub_lord: house.sub_lord,
        angle,
        x1: center + Math.cos(rad) * innerRadius,
        y1: center + Math.sin(rad) * innerRadius,
        x2: center + Math.cos(rad) * radiusAfterRings,
        y2: center + Math.sin(rad) * radiusAfterRings,
      };
    });

    // Planet positions
    const planetRadius = radiusAfterRings - 55;

    // Merge planets + ascendant
    const allBodies: PlanetLike[] = [
      ...planets.map((p) => ({
        name: p.name,
        longitude: p.longitude,
        longitude_dms: p.longitude_dms,
        sign: p.sign,
        sign_lord: p.sign_lord,
        star: p.star,
        star_lord: p.star_lord,
        sub_lord: p.sub_lord,
        sub_sub_lord: p.sub_sub_lord,
        retrograde: p.retrograde,
      })),
      {
        name: 'Ascendant',
        longitude: ascendant.longitude,
        longitude_dms: ascendant.longitude_dms,
        sign: ascendant.sign,
        sign_lord: ascendant.sign_lord,
        star: ascendant.star,
        star_lord: ascendant.star_lord,
        sub_lord: ascendant.sub_lord,
        sub_sub_lord: ascendant.sub_sub_lord,
        retrograde: false,
      },
    ];

    const planetPositions: ChartPlanetPosition[] = allBodies.map((planet) => {
      const angle = toSvgAngle(planet.longitude);
      const rad = (angle * Math.PI) / 180;
      
      return {
        ...planet,
        angle,
        x: center + Math.cos(rad) * planetRadius,
        y: center + Math.sin(rad) * planetRadius,
        color: getPlanetColor(planet.name),
        symbol: getPlanetSymbol(planet.name),
      };
    });

    // Zodiac divisions (each 30°)
    const zodiacDivisions = ZODIAC_SIGNS.map((sign, index) => {
      const startAngle = toSvgAngle(index * 30);
      const endAngle = toSvgAngle((index + 1) * 30);
      return {
        ...sign,
        startAngle,
        endAngle,
        midAngle: startAngle - 15, // Midpoint for label
      };
    });

    // Nakshatra divisions (each 13.333°)
    const nakshatraDivisions = NAKSHATRAS.map((nak, index) => {
      const startAngle = toSvgAngle(nak.start);
      const endAngle = toSvgAngle(nak.start + 13.333);
      return {
        ...nak,
        index,
        startAngle,
        endAngle,
        midAngle: startAngle - 6.667,
      };
    });

    return { cuspLines, planetPositions, zodiacDivisions, nakshatraDivisions, ascendantDegree };
  }, [houses, planets, ascendant, center, outerRadius, innerRadius, subLordRingWidth, nakshatraRingWidth, rashiRingWidth]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || !showMagnifier) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMagnifierPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, [showMagnifier]);

  const handlePlanetHover = (planet: ChartPlanetPosition | null, event?: React.MouseEvent) => {
    if (planet && event && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setTooltipData({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        content: (
          <div className="text-left min-w-[180px]">
            <div className="font-bold text-amber-400 border-b border-purple-500/30 pb-1 mb-2 flex items-center gap-2">
              <span style={{ color: planet.color }}>{planet.symbol}</span>
              {planet.name} {planet.retrograde ? '(R)' : ''}
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-purple-400">Position:</span>
                <span>{planet.longitude_dms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">Rashi:</span>
                <span>{planet.sign}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">Sign Lord:</span>
                <span>{planet.sign_lord}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">Nakshatra:</span>
                <span>{planet.star}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">Star Lord:</span>
                <span>{planet.star_lord}</span>
              </div>
              <div className="flex justify-between text-amber-300 font-semibold">
                <span className="text-amber-400">Sub Lord:</span>
                <span>{planet.sub_lord}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">Sub-Sub:</span>
                <span>{planet.sub_sub_lord}</span>
              </div>
            </div>
          </div>
        ),
      });
      setHoveredItem(planet.name);
    } else {
      setTooltipData(null);
      setHoveredItem(null);
    }
  };

  const handleCuspHover = (cusp: ChartCuspLine | null, event?: React.MouseEvent) => {
    if (cusp && event && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setTooltipData({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        content: (
          <div className="text-left min-w-[160px]">
            <div className="font-bold text-violet-400 border-b border-purple-500/30 pb-1 mb-2">
              Bhava {cusp.house} Cusp
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-purple-400">Position:</span>
                <span>{cusp.longitude.toFixed(2)}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">Rashi:</span>
                <span>{cusp.sign}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">Sign Lord:</span>
                <span>{cusp.sign_lord}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">Star Lord:</span>
                <span>{cusp.star_lord}</span>
              </div>
              <div className="flex justify-between text-amber-300 font-semibold">
                <span className="text-amber-400">Sub Lord:</span>
                <span>{cusp.sub_lord}</span>
              </div>
            </div>
          </div>
        ),
      });
      setHoveredItem(`cusp-${cusp.house}`);
    } else {
      setTooltipData(null);
      setHoveredItem(null);
    }
  };

  if (!chartElements) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="text-6xl mb-4"
          >
            🌌
          </motion.div>
          <p className="text-purple-400/60">Calculate a chart to view</p>
        </div>
      </div>
    );
  }

  const { cuspLines, planetPositions, zodiacDivisions, nakshatraDivisions } = chartElements;

  // Arc path generator
  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + Math.cos(rad) * r, y: cy + Math.sin(rad) * r };
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setZoomLevel(Math.min(zoomLevel + 0.2, 2.5))}
          className="p-2 bg-purple-600/80 hover:bg-purple-500 rounded-lg text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={() => setZoomLevel(Math.max(zoomLevel - 0.2, 0.5))}
          className="p-2 bg-purple-600/80 hover:bg-purple-500 rounded-lg text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <button
          onClick={() => setZoomLevel(1)}
          className="p-2 bg-purple-600/80 hover:bg-purple-500 rounded-lg text-white transition-colors"
          title="Reset Zoom"
        >
          <RotateCcw size={18} />
        </button>
        <button
          onClick={() => setShowMagnifier(!showMagnifier)}
          className={`p-2 rounded-lg text-white transition-colors ${showMagnifier ? 'bg-amber-500' : 'bg-purple-600/80 hover:bg-purple-500'}`}
          title="Toggle Magnifier"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Zoom level indicator */}
      <div className="absolute top-4 left-4 z-20 text-xs text-purple-400 bg-slate-900/80 px-2 py-1 rounded">
        {Math.round(zoomLevel * 100)}%
      </div>

      {/* Chart Container */}
      <div 
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-auto p-4"
        onMouseMove={handleMouseMove}
      >
        <div 
          className="relative"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${size} ${size}`}
            width={size}
            height={size}
            className="max-w-full max-h-full"
            style={{ filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.3))' }}
          >
            <defs>
              {/* Gradients */}
              <radialGradient id="chartBgGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="60%" stopColor="#0f0a1e" />
                <stop offset="100%" stopColor="#030014" />
              </radialGradient>
              
              <linearGradient id="rashiRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.4" />
              </linearGradient>

              <linearGradient id="nakshatraRingGrad">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
              </linearGradient>

              <filter id="glowEffect">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="planetGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background */}
            <circle cx={center} cy={center} r={outerRadius + 5} fill="url(#chartBgGrad)" />
            
            {/* ====== OUTER RING: SUB LORD DIVISIONS (249 divisions) ====== */}
            <circle 
              cx={center} 
              cy={center} 
              r={outerRadius - subLordRingWidth / 2} 
              fill="none" 
              stroke="#4c1d95" 
              strokeWidth={subLordRingWidth}
              strokeOpacity="0.2"
            />
            <circle cx={center} cy={center} r={outerRadius} fill="none" stroke="#7c3aed" strokeWidth="1" strokeOpacity="0.5" />

            {/* ====== NAKSHATRA RING (27 divisions) ====== */}
            <circle 
              cx={center} 
              cy={center} 
              r={outerRadius - subLordRingWidth - nakshatraRingWidth / 2} 
              fill="none" 
              stroke="url(#nakshatraRingGrad)" 
              strokeWidth={nakshatraRingWidth}
            />
            
            {/* Nakshatra division lines and labels */}
            {nakshatraDivisions.map((nak) => {
              const r1 = outerRadius - subLordRingWidth;
              const r2 = outerRadius - subLordRingWidth - nakshatraRingWidth;
              const rad = (nak.startAngle * Math.PI) / 180;
              const x1 = center + Math.cos(rad) * r2;
              const y1 = center + Math.sin(rad) * r2;
              const x2 = center + Math.cos(rad) * r1;
              const y2 = center + Math.sin(rad) * r1;
              
              // Label position
              const labelR = r2 + nakshatraRingWidth / 2;
              const midRad = (nak.midAngle * Math.PI) / 180;
              const lx = center + Math.cos(midRad) * labelR;
              const ly = center + Math.sin(midRad) * labelR;

              return (
                <g key={nak.name}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.4" />
                  <text 
                    x={lx} y={ly} 
                    fill={SUB_LORD_COLORS[nak.lord] || '#60a5fa'} 
                    fontSize="6" 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    transform={`rotate(${nak.midAngle + 90}, ${lx}, ${ly})`}
                    opacity="0.7"
                  >
                    {nak.name.substring(0, 3)}
                  </text>
                </g>
              );
            })}

            {/* ====== RASHI RING (12 divisions) ====== */}
            <circle 
              cx={center} 
              cy={center} 
              r={outerRadius - subLordRingWidth - nakshatraRingWidth - rashiRingWidth / 2} 
              fill="none" 
              stroke="url(#rashiRingGrad)" 
              strokeWidth={rashiRingWidth}
            />

            {/* Rashi division lines and symbols */}
            {zodiacDivisions.map((sign) => {
              const r1 = outerRadius - subLordRingWidth - nakshatraRingWidth;
              const r2 = outerRadius - subLordRingWidth - nakshatraRingWidth - rashiRingWidth;
              const rad = (sign.startAngle * Math.PI) / 180;
              const x1 = center + Math.cos(rad) * r2;
              const y1 = center + Math.sin(rad) * r2;
              const x2 = center + Math.cos(rad) * r1;
              const y2 = center + Math.sin(rad) * r1;
              
              // Symbol position
              const midRad = (sign.midAngle * Math.PI) / 180;
              const symbolR = r2 + rashiRingWidth / 2;
              const sx = center + Math.cos(midRad) * symbolR;
              const sy = center + Math.sin(midRad) * symbolR;

              return (
                <g key={sign.name}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#7c3aed" strokeWidth="1" strokeOpacity="0.6" />
                  <text 
                    x={sx} y={sy} 
                    fill="#a855f7" 
                    fontSize="14" 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    style={{ fontFamily: 'serif' }}
                  >
                    {sign.symbol}
                  </text>
                </g>
              );
            })}

            {/* ====== BHAVA (HOUSE) AREA ====== */}
            <circle 
              cx={center} 
              cy={center} 
              r={outerRadius - subLordRingWidth - nakshatraRingWidth - rashiRingWidth} 
              fill="none" 
              stroke="#4c1d95" 
              strokeWidth="1.5"
            />

            {/* ====== LAGNA BHAVA (House 1) GOLDEN HIGHLIGHT ====== */}
            {cuspLines.length >= 2 && (() => {
              const house1 = cuspLines.find(c => c.house === 1);
              const house2 = cuspLines.find(c => c.house === 2);
              if (!house1 || !house2) return null;
              
              const bhavaRadius = outerRadius - subLordRingWidth - nakshatraRingWidth - rashiRingWidth;
              const startAngle = house1.angle;
              const endAngle = house2.angle;
              
              // Calculate arc path for Lagna Bhava highlight
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              
              const x1 = center + Math.cos(startRad) * bhavaRadius;
              const y1 = center + Math.sin(startRad) * bhavaRadius;
              const x2 = center + Math.cos(endRad) * bhavaRadius;
              const y2 = center + Math.sin(endRad) * bhavaRadius;
              
              const x1Inner = center + Math.cos(startRad) * innerRadius;
              const y1Inner = center + Math.sin(startRad) * innerRadius;
              const x2Inner = center + Math.cos(endRad) * innerRadius;
              const y2Inner = center + Math.sin(endRad) * innerRadius;
              
              // Determine arc sweep direction
              let angleDiff = endAngle - startAngle;
              if (angleDiff < 0) angleDiff += 360;
              const largeArc = angleDiff > 180 ? 1 : 0;
              
              const pathD = `
                M ${x1} ${y1}
                A ${bhavaRadius} ${bhavaRadius} 0 ${largeArc} 0 ${x2} ${y2}
                L ${x2Inner} ${y2Inner}
                A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${x1Inner} ${y1Inner}
                Z
              `;
              
              return (
                <g>
                  {/* Glowing golden fill for Lagna Bhava */}
                  <defs>
                    <radialGradient id="lagnaGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
                      <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#d97706" stopOpacity="0.1" />
                    </radialGradient>
                    <filter id="lagnaBlur">
                      <feGaussianBlur stdDeviation="4" />
                    </filter>
                  </defs>
                  
                  {/* Outer glow effect */}
                  <path 
                    d={pathD} 
                    fill="#fbbf24" 
                    fillOpacity="0.15"
                    filter="url(#lagnaBlur)"
                  />
                  
                  {/* Main highlight */}
                  <path 
                    d={pathD} 
                    fill="url(#lagnaGlow)"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    strokeOpacity="0.6"
                  />
                  
                  {/* Lagna label in the middle of the bhava */}
                  {(() => {
                    const midAngle = startAngle - angleDiff / 2;
                    const midRad = (midAngle * Math.PI) / 180;
                    const labelR = (bhavaRadius + innerRadius) / 2;
                    const lx = center + Math.cos(midRad) * labelR;
                    const ly = center + Math.sin(midRad) * labelR;
                    return (
                      <text
                        x={lx}
                        y={ly}
                        fill="#fbbf24"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        opacity="0.8"
                      >
                        LAGNA
                      </text>
                    );
                  })()}
                </g>
              );
            })()}

            {/* Inner circle */}
            <circle 
              cx={center} 
              cy={center} 
              r={innerRadius} 
              fill="#0c0a1d"
              stroke="#7c3aed" 
              strokeWidth="2"
              strokeOpacity="0.6"
            />

            {/* Bhava Cusp Lines */}
            {cuspLines.map((cusp) => {
              const isLagna = cusp.house === 1;
              const isAngular = cusp.house === 1 || cusp.house === 4 || cusp.house === 7 || cusp.house === 10;
              
              return (
                <g key={`cusp-${cusp.house}`}>
                  {/* Extra glow for Lagna cusp line */}
                  {isLagna && (
                    <line
                      x1={cusp.x1}
                      y1={cusp.y1}
                      x2={cusp.x2}
                      y2={cusp.y2}
                      stroke="#fbbf24"
                      strokeWidth="6"
                      strokeOpacity="0.3"
                      filter="url(#lagnaBlur)"
                    />
                  )}
                  <line
                    x1={cusp.x1}
                    y1={cusp.y1}
                    x2={cusp.x2}
                    y2={cusp.y2}
                    stroke={isLagna ? '#fbbf24' : (isAngular ? '#f59e0b' : '#6366f1')}
                    strokeWidth={isLagna ? 3.5 : (isAngular ? 2.5 : 1.5)}
                    strokeOpacity={hoveredItem === `cusp-${cusp.house}` ? 1 : (isLagna ? 1 : 0.7)}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={(e) => handleCuspHover(cusp, e)}
                    onMouseLeave={() => handleCuspHover(null)}
                  />
                  {/* House number label */}
                  <text
                    x={cusp.x1 + (cusp.x2 - cusp.x1) * 0.4}
                    y={cusp.y1 + (cusp.y2 - cusp.y1) * 0.4}
                    fill={isLagna ? '#fcd34d' : (isAngular ? '#fbbf24' : '#818cf8')}
                    fontSize={isLagna ? '13' : '11'}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none"
                    style={isLagna ? { textShadow: '0 0 8px rgba(251, 191, 36, 0.8)' } : undefined}
                  >
                    {cusp.house}
                  </text>
                </g>
              );
            })}

            {/* Planets */}
            {planetPositions.map((planet, idx) => {
              const isAsc = planet.name === 'Ascendant';
              
              return (
                <g
                  key={planet.name}
                  className="cursor-pointer"
                  onMouseEnter={(e) => handlePlanetHover(planet, e)}
                  onMouseLeave={() => handlePlanetHover(null)}
                >
                  <motion.circle
                    cx={planet.x}
                    cy={planet.y}
                    r={isAsc ? 12 : 16}
                    fill={planet.color}
                    fillOpacity={0.15}
                    stroke={planet.color}
                    strokeWidth={hoveredItem === planet.name ? 3 : 2}
                    filter={hoveredItem === planet.name ? 'url(#planetGlow)' : undefined}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                  />
                  <text
                    x={planet.x}
                    y={planet.y}
                    fill={planet.color}
                    fontSize={isAsc ? 10 : 14}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none"
                  >
                    {planet.symbol}
                  </text>
                  {/* Retrograde indicator */}
                  {planet.retrograde && (
                    <text
                      x={planet.x + 14}
                      y={planet.y - 10}
                      fill="#ef4444"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      R
                    </text>
                  )}
                </g>
              );
            })}

            {/* Center decoration with Lagna indicator */}
            <motion.circle
              cx={center}
              cy={center}
              r={12}
              fill="#fbbf24"
              fillOpacity="0.9"
              animate={{ 
                scale: [1, 1.15, 1],
                opacity: [0.9, 1, 0.9]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <text
              x={center}
              y={center}
              fill="#0c0a1d"
              fontSize="8"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              ASC
            </text>

            {/* TOP indicator for Lagna position */}
            <g transform={`translate(${center}, 20)`}>
              <polygon points="0,-8 6,4 -6,4" fill="#fbbf24" />
              <text y="16" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">
                ↑ LAGNA
              </text>
            </g>

            {/* Legend */}
            <g transform={`translate(10, ${size - 80})`} opacity="0.8">
              <text x="0" y="0" fill="#a855f7" fontSize="8" fontWeight="bold">RINGS (outer → inner):</text>
              <text x="0" y="12" fill="#4c1d95" fontSize="7">• Sub Lords (249)</text>
              <text x="0" y="22" fill="#3b82f6" fontSize="7">• Nakshatras (27)</text>
              <text x="0" y="32" fill="#7c3aed" fontSize="7">• Rashis (12)</text>
              <text x="0" y="42" fill="#6366f1" fontSize="7">• Bhavas (Houses)</text>
            </g>
          </svg>

          {/* Magnifier */}
          {showMagnifier && (
            <div
              className="absolute pointer-events-none border-2 border-amber-400 rounded-full overflow-hidden"
              style={{
                width: 120,
                height: 120,
                left: magnifierPos.x - 60,
                top: magnifierPos.y - 60,
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(30, 27, 75, 0.95) 100%)',
              }}
            >
              <div
                className="absolute"
                style={{
                  transform: `scale(2.5) translate(${-magnifierPos.x + 24}px, ${-magnifierPos.y + 24}px)`,
                }}
              >
                <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
                  {/* Simplified magnified view */}
                  <use href="#chartContent" />
                </svg>
              </div>
            </div>
          )}

          {/* Floating Tooltip */}
          {tooltipData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute z-50 pointer-events-none"
              style={{
                left: Math.min(tooltipData.x + 15, size - 200),
                top: Math.max(tooltipData.y - 10, 10),
              }}
            >
              <div className="px-4 py-3 bg-slate-900/98 backdrop-blur-sm border border-purple-500/40 rounded-xl shadow-2xl">
                {tooltipData.content}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
