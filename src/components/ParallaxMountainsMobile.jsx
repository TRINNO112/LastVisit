import { useEffect, useRef, useState, useCallback } from 'react'
import { PineTree, OakTree, BirchTree, DistantPineTree } from './TreeModels'

// ═══════════════════════════════════════════════════════════════════════════════
// SEEDED RANDOM — deterministic values across renders
// ═══════════════════════════════════════════════════════════════════════════════
function makeRand(seed) {
    let s = seed
    return () => {
        s = (s * 1664525 + 1013904223) & 0xffffffff
        return (s >>> 0) / 0xffffffff
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAR FIELD — 130 stars, layered size + color variation
// ═══════════════════════════════════════════════════════════════════════════════
const r0 = makeRand(42)
const STAR_COLORS = [
    '#ffffff', '#ffffff', '#ffffff',
    '#fff8f0', '#ffe8c0', '#ffe0a0',
    '#c0d8ff', '#d0e4ff', '#e8efff',
]
const STARS = Array.from({ length: 130 }, (_, i) => ({
    id: i,
    x: r0() * 100,
    y: r0() * 54,
    size: i < 6 ? r0() * 3 + 2.8 : i < 20 ? r0() * 2 + 1.4 : r0() * 1.4 + 0.5,
    opacity: i < 6 ? r0() * 0.3 + 0.65 : r0() * 0.5 + 0.12,
    twinkleDur: 2.5 + r0() * 7,
    twinkleDelay: r0() * 10,
    color: STAR_COLORS[Math.floor(r0() * STAR_COLORS.length)],
}))

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTELLATION LINES — sparse, barely visible star connectors
// ═══════════════════════════════════════════════════════════════════════════════
const CONSTELLATION_LINES = [
    { x1: '12%', y1: '8%', x2: '18%', y2: '14%' },
    { x1: '18%', y1: '14%', x2: '25%', y2: '10%' },
    { x1: '25%', y1: '10%', x2: '31%', y2: '17%' },
    { x1: '62%', y1: '6%', x2: '68%', y2: '12%' },
    { x1: '68%', y1: '12%', x2: '75%', y2: '9%' },
    { x1: '75%', y1: '9%', x2: '80%', y2: '15%' },
    { x1: '42%', y1: '20%', x2: '48%', y2: '15%' },
    { x1: '48%', y1: '15%', x2: '54%', y2: '22%' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// SHOOTING STARS
// ═══════════════════════════════════════════════════════════════════════════════
const SHOOTING_STARS = [
    { top: '7%', left: '12%', width: 180, angle: -33, delay: 0, dur: 9 },
    { top: '16%', left: '50%', width: 130, angle: -27, delay: 4, dur: 12 },
    { top: '4%', left: '72%', width: 100, angle: -40, delay: 8, dur: 14 },
    { top: '24%', left: '28%', width: 80, angle: -22, delay: 3, dur: 18 },
    { top: '11%', left: '85%', width: 60, angle: -36, delay: 11, dur: 20 },
]

// ═══════════════════════════════════════════════════════════════════════════════
// AURORA BANDS — green, teal, purple
// ═══════════════════════════════════════════════════════════════════════════════
const AURORA_BANDS = [
    {
        top: '18%', height: '16%', delay: 0, dur: 16,
        bg: 'radial-gradient(ellipse at 50% 50%, rgba(30,210,130,0.14) 0%, rgba(20,200,160,0.08) 50%, transparent 100%)',
    },
    {
        top: '12%', height: '12%', delay: 4, dur: 21,
        bg: 'radial-gradient(ellipse at 40% 50%, rgba(20,200,230,0.08) 0%, rgba(30,220,200,0.05) 60%, transparent 100%)',
    },
    {
        top: '28%', height: '9%', delay: 8, dur: 26,
        bg: 'radial-gradient(ellipse at 60% 50%, rgba(130,55,230,0.07) 0%, rgba(100,35,210,0.04) 70%, transparent 100%)',
    },
    {
        top: '22%', height: '8%', delay: 12, dur: 19,
        bg: 'radial-gradient(ellipse at 50% 50%, rgba(40,230,180,0.06) 0%, transparent 100%)',
    },
]

// ═══════════════════════════════════════════════════════════════════════════════
// DRIFTING CLOUDS / MIST
// ═══════════════════════════════════════════════════════════════════════════════
const r1 = makeRand(99)
const CLOUDS = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    y: 36 + r1() * 20,
    scaleX: 0.5 + r1() * 1.2,
    opacity: 0.03 + r1() * 0.06,
    dur: 90 + r1() * 70,
    delay: -(r1() * 100),
    widthPct: 25 + r1() * 20,
}))

// ═══════════════════════════════════════════════════════════════════════════════
// FALLING PARTICLES (snow / dust)
// ═══════════════════════════════════════════════════════════════════════════════
const r2 = makeRand(17)
const PARTICLES = Array.from({ length: 55 }, (_, i) => ({
    id: i,
    x: r2() * 100,
    size: 0.7 + r2() * 2.2,
    opacity: 0.08 + r2() * 0.2,
    dur: 18 + r2() * 28,
    delay: -(r2() * 40),
    drift: (r2() - 0.5) * 70,
    wobble: (r2() - 0.5) * 30,
}))

// ═══════════════════════════════════════════════════════════════════════════════
// TREES — desktop & mobile
// ═══════════════════════════════════════════════════════════════════════════════
const r3 = makeRand(77)
const DESKTOP_TREE_X = [60, 155, 270, 400, 530, 660, 790, 920, 1040, 1160, 1280, 1390, 1440]
const DESKTOP_TREES = DESKTOP_TREE_X.map((x, i) => ({
    x, h: 46 + (i % 4) * 14, w: 15 + (i % 3) * 5,
    delay: i * 0.26, swing: 3.4 + (i % 4) * 0.6,
}))
const MOBILE_TREE_X = [38, 115, 210, 300, 388]
const MOBILE_TREES = MOBILE_TREE_X.map((x, i) => ({
    x, h: 38 + (i % 3) * 11, w: 12 + (i % 2) * 4,
    delay: i * 0.32, swing: 3.8 + (i % 3) * 0.5,
}))

// ═══════════════════════════════════════════════════════════════════════════════
// FIREFLIES — 20 total
// ═══════════════════════════════════════════════════════════════════════════════
const r4 = makeRand(55)
const FIREFLIES = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: 3 + r4() * 94,
    bottom: 10 + r4() * 42,
    size: 1.8 + r4() * 2.8,
    floatDur: 7 + r4() * 10,
    glowDur: 2.5 + r4() * 5,
    delay: r4() * 12,
    dx: (r4() - 0.5) * 44, dy: -(r4() * 28 + 8),
    dx2: (r4() - 0.5) * 28, dy2: -(r4() * 14 + 4),
    dx3: (r4() - 0.5) * 36, dy3: -(r4() * 22 + 7),
}))

// ═══════════════════════════════════════════════════════════════════════════════
// BIRDS — silhouettes flying across
// ═══════════════════════════════════════════════════════════════════════════════
const BIRDS = [
    { top: '20%', dur: 32, delay: 0, scale: 1.0, opacity: 0.55 },
    { top: '17%', dur: 44, delay: 12, scale: 0.7, opacity: 0.45 },
    { top: '24%', dur: 56, delay: 24, scale: 0.52, opacity: 0.38 },
    { top: '15%', dur: 68, delay: 38, scale: 0.38, opacity: 0.3 },
]

// ═══════════════════════════════════════════════════════════════════════════════
// CSS KEYFRAMES — injected once into document head
// ═══════════════════════════════════════════════════════════════════════════════
const KEYFRAMES_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700;800&family=Lora:ital,wght@1,400;1,500&display=swap');

/* ── Stars ── */
@keyframes pm-twinkle {
  0%, 100% { opacity: var(--s-op, 0.6); transform: scale(1); }
  50% { opacity: calc(var(--s-op, 0.6) * 0.25); transform: scale(0.65); }
}

/* ── Shooting star ── */
@keyframes pm-shoot {
  0%   { opacity: 0; transform: scaleX(0.05) translateX(0);   }
  2%   { opacity: 1;  }
  14%  { opacity: 0; transform: scaleX(1)    translateX(380px); }
  100% { opacity: 0; transform: scaleX(1)    translateX(380px); }
}

/* ── Aurora ── */
@keyframes pm-aurora {
  0%,100% { transform: translateX(-4%) scaleY(1) skewX(0deg); opacity: 0.55; }
  20%  { transform: translateX(2%) scaleY(1.18) skewX(2.5deg); opacity: 1; }
  45%  { transform: translateX(6%) scaleY(0.88) skewX(-1.5deg); opacity: 0.7; }
  70%  { transform: translateX(-1%) scaleY(1.22) skewX(1.5deg); opacity: 0.9; }
}

/* ── Cloud drift ── */
@keyframes pm-cloud {
  from { transform: translateX(-30vw) scaleX(var(--cx, 1)); }
  to   { transform: translateX(130vw) scaleX(var(--cx, 1)); }
}

/* ── Particle fall ── */
@keyframes pm-particle {
  0%   { transform: translateY(-15px) translateX(0) rotate(0deg); opacity: 0; }
  4%   { opacity: var(--p-op, 0.15); }
  88%  { opacity: var(--p-op, 0.15); }
  100% { transform: translateY(105vh) translateX(var(--p-drift, 20px)) rotate(360deg); opacity: 0; }
}

/* ── Firefly movement ── */
@keyframes pm-ff-float {
  0%   { transform: translate(0, 0); }
  25%  { transform: translate(var(--ff-dx), var(--ff-dy)); }
  50%  { transform: translate(var(--ff-dx2), var(--ff-dy2)); }
  75%  { transform: translate(var(--ff-dx3), var(--ff-dy3)); }
  100% { transform: translate(0, 0); }
}
@keyframes pm-ff-glow {
  0%, 100% { opacity: 0.15; transform: scale(0.8); }
  50%  { opacity: 0.95; transform: scale(1.4); }
}

/* ── Tree sway ── */
@keyframes pm-sway {
  0%,100% { transform: rotate(0deg); }
  28% { transform: rotate(1.6deg); }
  58% { transform: rotate(-1.1deg); }
  82% { transform: rotate(0.9deg); }
}

/* ── Moon ── */
@keyframes pm-moon-float {
  0%,100% { transform: translateY(0px); }
  50% { transform: translateY(-7px); }
}
@keyframes pm-moon-pulse {
  0%,100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(1.07); }
}
@keyframes pm-pulse-ring {
  0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.5; }
  100% { transform: translate(-50%,-50%) scale(2.8); opacity: 0; }
}

/* ── Mist ── */
@keyframes pm-mist {
  0%,100% { transform: translateX(0) scaleX(1); opacity: 0.4; }
  50% { transform: translateX(3.5%) scaleX(1.04); opacity: 0.72; }
}

/* ── Birds ── */
@keyframes pm-bird-fly {
  0%   { left: -8%; opacity: 0; }
  3%   { opacity: 1; }
  96%  { opacity: 1; }
  100% { left: 110%; opacity: 0; }
}
@keyframes pm-wing {
  0%,100% { transform: scaleY(1); }
  50% { transform: scaleY(-0.5); }
}

/* ── Text ── */
@keyframes pm-word-rise {
  from { opacity: 0; transform: translateY(28px) rotateX(18deg); filter: blur(5px); }
  to   { opacity: 1; transform: translateY(0)  rotateX(0deg);  filter: blur(0); }
}
@keyframes pm-shimmer {
  0%,100% { background-position: -300% center; }
  50% { background-position: 300% center; }
}
@keyframes pm-sub-rise {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pm-divider-grow {
  from { transform: scaleX(0); opacity: 0; }
  to   { transform: scaleX(1); opacity: 1; }
}

/* ── Scroll hint ── */
@keyframes pm-scroll-dot {
  0%,100% { transform: translateY(0); opacity: 0.8; }
  50% { transform: translateY(9px); opacity: 0.25; }
}

/* ── Lens flare ── */
@keyframes pm-flare {
  0%,100% { opacity: 0; transform: scale(0.6); }
  45%, 55% { opacity: 0.7; transform: scale(1); }
}

/* ── Ground fog ── */
@keyframes pm-gnd-fog {
  0%,100% { transform: translateX(0) scaleX(1); opacity: 0.5; }
  33% { transform: translateX(2%) scaleX(1.03); opacity: 0.75; }
  66% { transform: translateX(-1.5%) scaleX(0.98); opacity: 0.55; }
}
`

// ═══════════════════════════════════════════════════════════════════════════════
// TREE COMPONENT — imported from TreeModels
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// BIRD COMPONENT — minimal V silhouette
// ═══════════════════════════════════════════════════════════════════════════════
function Bird({ scale, opacity }) {
    return (
        <svg width={26 * scale} height={12 * scale} viewBox="0 0 26 12" fill="none">
            <path d="M13,6 Q9,1.5 2,4" stroke={`rgba(200,220,200,${opacity})`} strokeWidth="1.6" strokeLinecap="round" />
            <path d="M13,6 Q17,1.5 24,4" stroke={`rgba(200,220,200,${opacity})`} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function ParallaxMountainsMobile() {
    const containerRef = useRef(null)
    const layersRef = useRef([])
    const rafRef = useRef(null)

    const [visible, setVisible] = useState(false)
    const [scrollPct, setScrollPct] = useState(0)
    const isMobile = true
    const [cssReady, setCssReady] = useState(false)

    // ── CSS injection ────────────────────────────────────────────────────────
    useEffect(() => {
        const id = 'pm-global-css'
        if (!document.getElementById(id)) {
            const el = document.createElement('style')
            el.id = id
            el.textContent = KEYFRAMES_CSS
            document.head.appendChild(el)
        }
        setCssReady(true)
    }, [])

    // ── Responsive detection ─────────────────────────────────────────────────
    // Handled externally in App.jsx

    // ── RAF Parallax scroll ──────────────────────────────────────────────────
    const handleScroll = useCallback(() => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const wH = window.innerHeight
        const cH = rect.height
        const raw = -rect.top / (cH + wH)
        const ratio = Math.max(0, Math.min(1, raw))
        setScrollPct(ratio)

        // 9 independent parallax layers — each moves at a different speed
        const speeds = isMobile
            ? [0.02, 0.06, 0.12, 0.22, 0.34, 0.48, 0.64, 0.82, 1.05]
            : [0.012, 0.035, 0.075, 0.14, 0.22, 0.34, 0.48, 0.65, 0.86]

        const mult = isMobile ? 0.85 : 0.82
        layersRef.current.forEach((el, i) => {
            if (!el) return
            const move = ratio * speeds[i] * wH * mult
            el.style.transform = `translate3d(0,${move}px,0)`
        })
    }, [isMobile])

    useEffect(() => {
        const onScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            rafRef.current = requestAnimationFrame(handleScroll)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        handleScroll()
        return () => {
            window.removeEventListener('scroll', onScroll)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [handleScroll])

    // ── Intersection Observer (triggers text reveal) ─────────────────────────
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true) },
            { threshold: 0.06 }
        )
        if (containerRef.current) obs.observe(containerRef.current)
        return () => obs.disconnect()
    }, [])

    if (!cssReady) return null

    // ── Derived layout values ────────────────────────────────────────────────
    const vbW = isMobile ? 430 : 1440
    const vbH = isMobile ? 500 : 500
    const vb = `0 0 ${vbW} ${vbH}`
    const trees = isMobile ? MOBILE_TREES : DESKTOP_TREES
    const hillBaseY = isMobile ? 312 : 262
    const sectionH = isMobile ? '65vh' : '135vh'
    const sectionMin = isMobile ? 400 : 660

    // ── Ground path (foreground) ─────────────────────────────────────────────
    const groundPath = isMobile
        ? 'M0,450 L0,312 Q60,290 130,305 Q210,270 295,300 Q362,280 430,298 L430,500 L0,500 Z'
        : 'M0,400 L0,262 Q130,240 268,260 Q380,222 500,252 Q620,214 740,250 Q860,208 990,248 Q1110,214 1240,248 Q1340,228 1440,248 L1440,400 Z'

    // ── Ground ridge highlight ───────────────────────────────────────────────
    const ridgePath = isMobile
        ? 'M0,312 Q60,290 130,305 Q210,270 295,300 Q362,280 430,298'
        : 'M0,262 Q130,240 268,260 Q380,222 500,252 Q620,214 740,250 Q860,208 990,248 Q1110,214 1240,248 Q1340,228 1440,248'

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <section
            ref={containerRef}
            className="relative overflow-hidden"
            style={{
                height: sectionH,
                minHeight: sectionMin,
                contain: 'layout style paint',
                userSelect: 'none',
            }}
        >

            {/* ══════════════════════════════════════════════════════════════════
          SVG DEFS — filters + gradients
      ══════════════════════════════════════════════════════════════════ */}
            <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
                <defs>
                    {/* Moon glow fallback */}
                    {/* Atmospheric blur */}
                    <filter id="pm-atmos">
                        <feGaussianBlur stdDeviation="2.5" />
                    </filter>
                    {/* Moon surface */}
                    <radialGradient id="pm-moon-grad" cx="33%" cy="30%" r="100%">
                        <stop offset="0%" stopColor="#fdf2c5" />
                        <stop offset="40%" stopColor="#e8d48a" />
                        <stop offset="100%" stopColor="#c4aa52" />
                    </radialGradient>
                    {/* Sky */}
                    <linearGradient id="pm-sky-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#010804" />
                        <stop offset="12%" stopColor="#030e06" />
                        <stop offset="30%" stopColor="#071608" />
                        <stop offset="52%" stopColor="#0c2510" />
                        <stop offset="72%" stopColor="#112c12" />
                        <stop offset="100%" stopColor="#193c17" />
                    </linearGradient>
                    {/* Mountain layer gradients */}
                    <linearGradient id="pm-m1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#080e08" />
                        <stop offset="100%" stopColor="#0c160c" />
                    </linearGradient>
                    <linearGradient id="pm-m2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0c180c" />
                        <stop offset="100%" stopColor="#102010" />
                    </linearGradient>
                    <linearGradient id="pm-m3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#112011" />
                        <stop offset="100%" stopColor="#162a16" />
                    </linearGradient>
                    <linearGradient id="pm-m4" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#163216" />
                        <stop offset="100%" stopColor="#1c3e1c" />
                    </linearGradient>
                    <linearGradient id="pm-m5" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1a3c1a" />
                        <stop offset="100%" stopColor="#224422" />
                    </linearGradient>
                    {/* Ground */}
                    <linearGradient id="pm-ground" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#264e24" />
                        <stop offset="100%" stopColor="#1e3e1e" />
                    </linearGradient>
                    {/* Lens flare */}
                    <radialGradient id="pm-flare-grad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(255,248,200,0.9)" />
                        <stop offset="30%" stopColor="rgba(255,235,140,0.4)" />
                        <stop offset="100%" stopColor="rgba(255,220,100,0)" />
                    </radialGradient>
                </defs>
            </svg>

            {/* ══════════════════════════════════════════════════════════════════
          SCROLL PROGRESS BAR
      ══════════════════════════════════════════════════════════════════ */}
            <div
                className="absolute top-0 left-0 h-[2px] z-50 pointer-events-none"
                style={{
                    width: `${scrollPct * 100}%`,
                    background: 'linear-gradient(to right, rgba(245,230,163,0.0), rgba(245,230,163,0.5), rgba(200,224,80,0.3))',
                    transition: 'width 0.1s linear',
                    boxShadow: '0 0 8px rgba(245,230,163,0.3)',
                }}
            />

            {/* ══════════════════════════════════════════════════════════════════
          LAYER 0 — Sky gradient background
      ══════════════════════════════════════════════════════════════════ */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'linear-gradient(180deg, #010804 0%, #030e06 12%, #071608 30%, #0c2510 52%, #112c12 72%, #193c17 100%)',
                }}
            />

            {/* ══════════════════════════════════════════════════════════════════
          LAYER 1 — Stars + constellations + shooting stars
      ══════════════════════════════════════════════════════════════════ */}
            <div
                ref={el => { layersRef.current[0] = el }}
                className="absolute inset-0 will-change-transform"
            >
                {/* Constellation lines */}
                {!isMobile && CONSTELLATION_LINES.map((ln, i) => (
                    <div key={i} className="absolute inset-0 pointer-events-none">
                        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.08 }}>
                            <line
                                x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2}
                                stroke="rgba(200,220,255,0.6)"
                                strokeWidth="0.5"
                                strokeDasharray="2 4"
                            />
                        </svg>
                    </div>
                ))}

                {/* Shooting stars */}
                {SHOOTING_STARS.map((s, i) => (
                    <div key={i}
                        className="absolute"
                        style={{
                            top: s.top,
                            left: s.left,
                            width: isMobile ? s.width * 0.6 : s.width,
                            height: isMobile ? 1.5 : 2.2,
                            background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.95) 40%, rgba(255,248,200,0.7) 70%, transparent 100%)',
                            transform: `rotate(${s.angle}deg)`,
                            transformOrigin: 'left center',
                            opacity: 0,
                            animation: `pm-shoot ${s.dur}s linear infinite ${s.delay}s`,
                            boxShadow: '0 0 4px rgba(255,255,255,0.5)',
                        }}
                    />
                ))}

                {/* Star field */}
                {STARS.map(star => (
                    <div key={star.id}
                        className="absolute rounded-full"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: star.size,
                            height: star.size,
                            backgroundColor: star.color,
                            opacity: star.opacity,
                            '--s-op': star.opacity,
                            animation: `pm-twinkle ${star.twinkleDur}s ease-in-out infinite ${star.twinkleDelay}s`,
                            boxShadow: star.size > 2.5
                                ? `0 0 ${star.size * 2.5}px 1px ${star.color}`
                                : 'none',
                        }}
                    />
                ))}
            </div>

            {/* ══════════════════════════════════════════════════════════════════
          LAYER 2 — Aurora borealis
      ══════════════════════════════════════════════════════════════════ */}
            <div
                ref={el => { layersRef.current[1] = el }}
                className="absolute inset-0 will-change-transform pointer-events-none overflow-hidden"
            >
                {AURORA_BANDS.map((band, i) => (
                    <div key={i}
                        className="absolute w-full"
                        style={{
                            top: band.top,
                            height: band.height,
                            background: band.bg,
                            animation: `pm-aurora ${band.dur}s ease-in-out infinite ${band.delay}s`,
                        }}
                    />
                ))}
                {/* Static nebula smear — deep left */}
                <div
                    className="absolute"
                    style={{
                        top: '5%', left: '2%', width: '35%', height: '18%',
                        background: 'radial-gradient(ellipse 100% 50% at 40% 50%, rgba(20,60,40,0.14) 0%, transparent 70%)',
                        filter: 'blur(30px)',
                    }}
                />
            </div>

            {/* ══════════════════════════════════════════════════════════════════
          LAYER 3 — Moon with craters, halo rings, lens flare
      ══════════════════════════════════════════════════════════════════ */}
            <div
                ref={el => { layersRef.current[2] = el }}
                className="absolute will-change-transform"
                style={{
                    top: isMobile ? '5%' : '7%',
                    right: isMobile ? '8%' : '10%',
                }}
            >
                {/* Removed ambient glows based on feedback */}
                {/* Removed yellow pulse rings based on feedback */}

                {/* Moon body */}
                <svg
                    style={{
                        width: isMobile ? 46 : 72,
                        height: isMobile ? 46 : 72,
                        display: 'block',
                        borderRadius: '50%',
                        backgroundColor: '#fdf2c5',
                    }}
                    viewBox="0 0 100 100"
                >
                    {/* Main sphere */}
                    <circle cx="50" cy="50" r="40" fill="#fdf2c5" />
                    {/* Craters */}
                    <circle cx="36" cy="36" r="6.5" fill="black" fillOpacity="0.1" />
                    <circle cx="67" cy="50" r="9.5" fill="black" fillOpacity="0.075" />
                    <circle cx="52" cy="70" r="5.5" fill="black" fillOpacity="0.085" />
                    <circle cx="30" cy="63" r="4" fill="black" fillOpacity="0.065" />
                    <circle cx="75" cy="32" r="4.5" fill="black" fillOpacity="0.055" />
                    <circle cx="58" cy="28" r="2.8" fill="black" fillOpacity="0.07" />
                    <circle cx="44" cy="56" r="2.2" fill="black" fillOpacity="0.06" />
                    {/* Highlight gloss */}
                    <ellipse cx="38" cy="35" rx="13" ry="9" fill="white" fillOpacity="0.12" transform="rotate(-22 38 35)" />
                    <ellipse cx="42" cy="30" rx="5" ry="3" fill="white" fillOpacity="0.2" transform="rotate(-15 42 30)" />
                </svg>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
          LAYER 4 — Drifting clouds / high mist
      ══════════════════════════════════════════════════════════════════ */}
            <div
                ref={el => { layersRef.current[3] = el }}
                className="absolute inset-0 will-change-transform pointer-events-none overflow-hidden"
            >
                {CLOUDS.map(c => (
                    <div key={c.id}
                        className="absolute"
                        style={{
                            top: `${c.y}%`,
                            left: 0,
                            width: `${c.widthPct}%`,
                            height: '90px',
                            '--cx': c.scaleX,
                            background:
                                'radial-gradient(ellipse 100% 50% at 50% 50%, rgba(170,210,185,0.18) 0%, rgba(150,200,170,0.06) 55%, transparent 80%)',
                            opacity: c.opacity,
                            animation: `pm-cloud ${c.dur}s linear infinite ${c.delay}s`,
                        }}
                    />
                ))}
            </div>

            {/* ══════════════════════════════════════════════════════════════════
          LAYER 5 — Farthest mountains (barely visible silhouettes)
      ══════════════════════════════════════════════════════════════════ */}
            <div
                ref={el => { layersRef.current[4] = el }}
                className="absolute bottom-0 left-0 w-full will-change-transform"
                style={{ height: '68%', overflow: 'visible' }}
            >
                <svg className="absolute bottom-0 left-0 w-full h-full" viewBox={vb} preserveAspectRatio="xMidYMax slice" style={{ overflow: 'visible' }}>
                    <path
                        d={isMobile
                            ? 'M0,500 L0,218 Q70,152 148,200 Q218,108 300,172 Q368,128 430,165 L430,500 Z'
                            : 'M0,500 L0,198 Q90,128 200,185 Q288,98 408,162 Q490,90 614,152 Q696,96 816,158 Q900,90 1020,152 Q1104,98 1228,158 Q1316,112 1440,168 L1440,500 Z'
                        }
                        fill="url(#pm-m1)"
                        opacity="0.62"
                    />
                </svg>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
          LAYER 6 — Far-mid mountains
      ══════════════════════════════════════════════════════════════════ */}
            <div
                ref={el => { layersRef.current[5] = el }}
                className="absolute bottom-0 left-0 w-full will-change-transform"
                style={{ height: '62%', overflow: 'visible' }}
            >
                <svg className="absolute bottom-0 left-0 w-full h-full" viewBox={vb} preserveAspectRatio="xMidYMax slice" style={{ overflow: 'visible' }}>
                    <path
                        d={isMobile
                            ? 'M0,500 L0,230 Q92,158 180,220 Q264,88 348,176 Q396,138 430,178 L430,500 Z'
                            : 'M0,500 L0,222 Q108,148 236,212 Q338,118 458,186 Q548,110 668,176 Q752,108 872,172 Q958,108 1080,172 Q1168,118 1292,178 Q1376,142 1440,190 L1440,500 Z'
                        }
                        fill="url(#pm-m2)"
                        opacity="0.8"
                    />
                </svg>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
          LAYER 7 — Mid mountains + snow caps
      ══════════════════════════════════════════════════════════════════ */}
            <div
                ref={el => { layersRef.current[6] = el }}
                className="absolute bottom-0 left-0 w-full will-change-transform"
                style={{ height: '56%', overflow: 'visible' }}
            >
                <svg className="absolute bottom-0 left-0 w-full h-full" viewBox={vb} preserveAspectRatio="xMidYMax slice" style={{ overflow: 'visible' }}>
                    {/* Ridge body */}
                    <path
                        d={isMobile
                            ? 'M0,500 L0,245 Q90,185 180,255 Q264,158 348,236 Q396,198 430,242 L430,500 Z'
                            : 'M0,500 L0,238 Q108,158 232,226 Q352,118 476,196 Q572,110 696,180 Q792,102 916,174 Q1014,108 1140,178 Q1240,120 1364,182 Q1412,158 1440,178 L1440,500 Z'
                        }
                        fill="url(#pm-m3)"
                    />


                    {/* Farthest trees on Layer 7 */}
                    {Array.from({ length: 4 }).map((_, i) => {
                        const count = 4
                        const x = (vbW * i) / count + (i % 2 === 0 ? 15 : -10)
                        const t = x / vbW
                        const scatterY = Math.sin(i * 13.7) * 6
                        const layer7Y = 225 - 45 * Math.sin(t * Math.PI) + 5 + scatterY

                        // Sizing and delay
                        const h = 16
                        const w = 5
                        const delay = i * 0.15

                        return (
                            <DistantPineTree
                                key={`l7-${i}`}
                                x={x}
                                h={h * 0.9} // Optimized distant tree model
                                w={w * 0.9}
                                delay={delay}
                                swing={5.5 + (i % 3) * 0.5}
                                hillY={layer7Y}
                            />
                        )
                    })}
                </svg>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
          LAYER 8 — Near mountains
      ══════════════════════════════════════════════════════════════════ */}
            <div
                ref={el => { layersRef.current[7] = el }}
                className="absolute bottom-0 left-0 w-full will-change-transform"
                style={{ height: '50%', overflow: 'visible' }}
            >
                <svg className="absolute bottom-0 left-0 w-full h-full" viewBox={vb} preserveAspectRatio="xMidYMax slice" style={{ overflow: 'visible' }}>
                    <path
                        d={isMobile
                            ? 'M0,500 L0,265 Q72,190 152,265 Q228,180 316,250 Q380,210 430,240 L430,500 Z'
                            : 'M0,500 L0,252 Q118,178 252,248 Q374,158 500,228 Q604,158 732,228 Q832,158 964,228 Q1068,162 1200,228 Q1308,178 1440,238 L1440,500 Z'
                        }
                        fill="url(#pm-m4)"
                    />
                    {/* Atmospheric haze between near and mid */}
                    <rect x="0" y="0" width={vbW} height={vbH} fill="rgba(22,58,22,0.08)" />

                    {/* Distant trees on Layer 8 */}
                    {Array.from({ length: 6 }).map((_, i) => {
                        const count = 6
                        const x = (vbW * i) / count + (i % 2 === 0 ? 8 : -12)
                        const t = x / vbW
                        // Approximate the bezier curve + vertical scatter
                        const scatterY = Math.sin(i * 41.2) * 10
                        const layer8Y = 260 - 50 * Math.sin(t * Math.PI) + 6 + scatterY

                        const h = 24
                        const w = 7
                        const delay = i * 0.2

                        return (
                            <DistantPineTree
                                key={`l8-${i}`}
                                x={x}
                                h={h} // Optimized distant tree model
                                w={w}
                                delay={delay}
                                swing={4.5 + (i % 4) * 0.5}
                                hillY={layer8Y}
                            />
                        )
                    })}
                </svg>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
          LAYER 9 — Foreground hills + trees
      ══════════════════════════════════════════════════════════════════ */}
            <div
                ref={el => { layersRef.current[8] = el }}
                className="absolute bottom-0 left-0 w-full will-change-transform"
                style={{ height: '65%', overflow: 'visible' }}
            >
                <svg
                    className="absolute bottom-0 left-0 w-full h-full"
                    viewBox={isMobile ? '0 0 430 500' : '0 0 1440 500'}
                    preserveAspectRatio="xMidYMax slice"
                    style={{ overflow: 'visible' }}
                >
                    {/* Ground fill */}
                    <path d={groundPath} fill="url(#pm-ground)" />
                    {/* Ridge highlight */}
                    <path d={ridgePath} fill="none" stroke="rgba(65,115,60,0.32)" strokeWidth="2.5" />
                    {/* Subtle second ridge */}
                    {!isMobile && (
                        <path
                            d="M0,280 Q130,258 268,276 Q380,240 500,268 Q620,232 740,266"
                            fill="none" stroke="rgba(50,95,48,0.14)" strokeWidth="1.5"
                        />
                    )}

                    {/* Pine and Oak trees */}
                    {trees.map((tree, i) => {
                        const t = tree.x / vbW
                        const hillY = hillBaseY
                            - 34 * Math.sin(t * Math.PI)
                            + 9 * Math.sin(t * Math.PI * 2.8)
                            - 4 * Math.cos(t * Math.PI * 5)

                        // 1 in 3 trees is an Oak
                        if (i % 3 === 2) {
                            return (
                                <OakTree
                                    key={i}
                                    x={tree.x - (isMobile ? 10 : 20)}
                                    hillY={hillY + 6}
                                    h={tree.h * 0.9}
                                    w={tree.w * 2.2}
                                    delay={tree.delay}
                                    swing={tree.swing}
                                />
                            )
                        }

                        // Half of the remaining trees are Autumn Birches
                        if (i % 2 === 0) {
                            return (
                                <BirchTree
                                    key={i}
                                    x={tree.x}
                                    h={tree.h * 1.1} // Slightly taller
                                    w={tree.w * 1.4} // Wider canopy
                                    swing={tree.swing * 1.2}
                                    delay={tree.delay}
                                    hillY={hillY}
                                />
                            )
                        }

                        return (
                            <PineTree
                                key={i}
                                x={tree.x}
                                h={tree.h}
                                w={tree.w}
                                swing={tree.swing}
                                delay={tree.delay}
                                hillY={hillY}
                            />
                        )
                    })}
                </svg>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
          ATMOSPHERIC MIST — floating bands between mountain layers
      ══════════════════════════════════════════════════════════════════ */}
            {/* High mist band */}
            <div
                className="absolute left-0 right-0 pointer-events-none"
                style={{
                    bottom: '38%', height: '7%', zIndex: 4,
                    background: 'radial-gradient(ellipse at 50% 100%, rgba(150,200,160,0.065) 0%, rgba(150,200,160,0.03) 60%, transparent 100%)',
                    animation: 'pm-mist 20s ease-in-out infinite',
                }}
            />
            {/* Low mist band */}
            <div
                className="absolute left-0 right-0 pointer-events-none"
                style={{
                    bottom: '24%', height: '6%', zIndex: 4,
                    background: 'radial-gradient(ellipse at 50% 100%, rgba(130,185,145,0.085) 0%, transparent 100%)',
                    animation: 'pm-mist 28s ease-in-out infinite 9s',
                }}
            />
            {/* Ground fog */}
            <div
                className="absolute left-0 right-0 pointer-events-none"
                style={{
                    bottom: '12%', height: '8%', zIndex: 6,
                    background: 'radial-gradient(ellipse at 50% 100%, rgba(100,155,110,0.09) 0%, rgba(120,175,130,0.05) 50%, transparent 100%)',
                    animation: 'pm-gnd-fog 35s ease-in-out infinite 4s',
                }}
            />

            {/* ══════════════════════════════════════════════════════════════════
          FALLING PARTICLES — snow / pollen / dust
      ══════════════════════════════════════════════════════════════════ */}
            <div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{ zIndex: 3 }}
            >
                {PARTICLES.map(p => (
                    <div key={p.id}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: `${p.x}%`,
                            top: '-6px',
                            width: p.size,
                            height: p.size,
                            opacity: 0,
                            '--p-op': p.opacity,
                            '--p-drift': `${p.drift}px`,
                            animation: `pm-particle ${p.dur}s linear infinite ${p.delay}s`,
                        }}
                    />
                ))}
            </div>



            {/* ══════════════════════════════════════════════════════════════════
          FIREFLIES
      ══════════════════════════════════════════════════════════════════ */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: 8 }}
            >
                {(isMobile ? FIREFLIES.slice(0, 10) : FIREFLIES).map(ff => (
                    <div key={ff.id}
                        className="absolute rounded-full"
                        style={{
                            left: `${ff.left}%`,
                            bottom: `${ff.bottom}%`,
                            width: ff.size,
                            height: ff.size,
                            backgroundColor: '#c8dc64',
                            '--ff-dx': `${ff.dx}px`, '--ff-dy': `${ff.dy}px`,
                            '--ff-dx2': `${ff.dx2}px`, '--ff-dy2': `${ff.dy2}px`,
                            '--ff-dx3': `${ff.dx3}px`, '--ff-dy3': `${ff.dy3}px`,
                            animation:
                                `pm-ff-float ${ff.floatDur}s ease-in-out infinite ${ff.delay}s,` +
                                `pm-ff-glow  ${ff.glowDur}s  ease-in-out infinite ${ff.delay}s`,
                        }}
                    />
                ))}
            </div>

            {/* ══════════════════════════════════════════════════════════════════
          TEXT OVERLAY — cinematic staggered reveal
      ══════════════════════════════════════════════════════════════════ */}
            <div
                className="absolute inset-0 flex flex-col items-center pointer-events-none"
                style={{
                    paddingTop: isMobile ? '11%' : '9%',
                    zIndex: 15,
                }}
            >
                {/* Vignette behind text */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(ellipse 78% 38% at 50% 8%, rgba(0,0,0,0.55) 0%, transparent 100%)',
                    }}
                />

                {/* Main headline */}
                <h1
                    style={{
                        fontFamily: "'Caveat', cursive",
                        fontWeight: 800,
                        fontSize: isMobile ? '2.15rem' : '4.4rem',
                        color: 'transparent',
                        background:
                            'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(248,238,168,0.92) 38%, rgba(245,220,140,0.88) 60%, rgba(255,255,255,0.9) 100%)',
                        backgroundSize: '300% auto',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        letterSpacing: '0.025em',
                        lineHeight: 1.15,
                        textAlign: 'center',
                        paddingLeft: '1.5rem',
                        paddingRight: '1.5rem',
                        position: 'relative',
                        zIndex: 1,
                        filter:
                            'drop-shadow(2px 5px 22px rgba(0,0,0,0.92)) drop-shadow(0 0 50px rgba(245,230,163,0.22))',
                        opacity: visible ? 1 : 0,
                        animation: visible
                            ? 'pm-word-rise 1.3s cubic-bezier(0.16,1,0.3,1) both, pm-shimmer 10s linear infinite 2s'
                            : 'none',
                    }}
                >
                    Beyond these mountains...
                </h1>

                {/* Subtitle */}
                <p
                    style={{
                        fontFamily: "'Lora', serif",
                        fontStyle: 'italic',
                        fontWeight: 400,
                        fontSize: isMobile ? '0.9rem' : '1.32rem',
                        color: 'rgba(245,230,163,0.72)',
                        textAlign: 'center',
                        marginTop: isMobile ? '0.85rem' : '1.35rem',
                        maxWidth: isMobile ? '260px' : '500px',
                        padding: '0 1.5rem',
                        letterSpacing: '0.045em',
                        lineHeight: 1.65,
                        textShadow: '1px 2px 12px rgba(0,0,0,0.75)',
                        position: 'relative', zIndex: 1,
                        opacity: visible ? 1 : 0,
                        animation: visible
                            ? 'pm-sub-rise 1.6s cubic-bezier(0.16,1,0.3,1) 1.1s both'
                            : 'none',
                    }}
                >
                    ...our memories will always travel with you, Ma'am
                </p>

                {/* Decorative divider */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.7rem',
                        marginTop: isMobile ? '1.1rem' : '1.6rem',
                        position: 'relative', zIndex: 1,
                        opacity: visible ? 0.55 : 0,
                        animation: visible
                            ? 'pm-divider-grow 1.4s cubic-bezier(0.34,1.56,0.64,1) 1.9s both'
                            : 'none',
                        transformOrigin: 'center',
                    }}
                >
                    <div style={{ width: isMobile ? 28 : 52, height: 1, background: 'linear-gradient(to right, transparent, rgba(245,230,163,0.65))' }} />
                    <div style={{ width: 3.5, height: 3.5, borderRadius: '50%', backgroundColor: 'rgba(245,230,163,0.7)' }} />
                    <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'rgba(245,230,163,0.5)' }} />
                    <div style={{ width: 3.5, height: 3.5, borderRadius: '50%', backgroundColor: 'rgba(245,230,163,0.7)' }} />
                    <div style={{ width: isMobile ? 28 : 52, height: 1, background: 'linear-gradient(to left, transparent, rgba(245,230,163,0.65))' }} />
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
          BOTTOM GRADIENT FADE — seamless into next section
      ══════════════════════════════════════════════════════════════════ */}
            <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{
                    height: '32%',
                    zIndex: 20,
                    background:
                        'linear-gradient(to top, #193c17 0%, rgba(25,60,23,0.75) 35%, rgba(25,60,23,0.35) 65%, transparent 100%)',
                }}
            />

            {/* ══════════════════════════════════════════════════════════════════
          SCROLL HINT — fades out as you scroll
      ══════════════════════════════════════════════════════════════════ */}
            <div
                className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
                style={{
                    zIndex: 25,
                    opacity: visible ? Math.max(0, 1 - scrollPct * 14) : 0,
                    transition: 'opacity 0.4s ease',
                }}
            >
                <span
                    style={{
                        fontFamily: 'Lora, serif',
                        fontSize: '0.6rem',
                        color: 'rgba(245,230,163,0.65)',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                    }}
                >
                    scroll
                </span>
                <div
                    style={{
                        width: 20, height: 32,
                        border: '1.5px solid rgba(245,230,163,0.38)',
                        borderRadius: 10,
                        display: 'flex',
                        justifyContent: 'center',
                        paddingTop: 5,
                    }}
                >
                    <div
                        style={{
                            width: 3, height: 7,
                            backgroundColor: 'rgba(245,230,163,0.55)',
                            borderRadius: 2,
                            animation: 'pm-scroll-dot 2s ease-in-out infinite',
                        }}
                    />
                </div>
            </div>

        </section>
    )
}