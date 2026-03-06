import { useEffect, useRef, useState, useCallback } from 'react'

// Star color variation — warm, cool, and neutral
const STAR_COLORS = ['#ffffff', '#ffffff', '#ffffff', '#ffe8c0', '#ffe8c0', '#c0d8ff', '#c0d8ff', '#fff5e0', '#d0e0ff']

// Stable data generated once to ensure component purity
const STARS_DATA = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    width: Math.random() * 3 + 2,
    height: Math.random() * 3 + 2,
    top: `${Math.random() * 55}%`,
    left: `${Math.random() * 100}%`,
    opacity: Math.random() * 0.5 + 0.2,
    duration: 3 + Math.random() * 5,
    delay: Math.random() * 5,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]
}))

const TREES_X_POSITIONS = [80, 200, 330, 480, 600, 750, 880, 1020, 1150, 1280, 1380]
const TREE_DATA = TREES_X_POSITIONS.map((x, i) => {
    const baseY = 245 + Math.sin(x * 0.005) * 20
    const h = 55 + (i % 3) * 15
    const w = 18 + (i % 2) * 4
    return { x, baseY, h, w, delay: i * 0.3 }
})

// Mobile-only trees to fill the gaps on small screens
const MOBILE_TREES_X_POSITIONS = [30, 140, 260, 400, 540, 680]
const MOBILE_TREE_DATA = MOBILE_TREES_X_POSITIONS.map((x, i) => {
    const baseY = 245 + Math.sin(x * 0.005) * 20
    const h = 45 + (i % 2) * 10
    const w = 14 + (i % 2) * 3
    return { x, baseY, h, w, delay: i * 0.4 + 2 }
})

// Fireflies — gentle floating warm dots among the foreground
const FIREFLIES_COUNT = typeof window !== 'undefined' && window.innerWidth < 768 ? 10 : 12
const FIREFLIES_DATA = Array.from({ length: FIREFLIES_COUNT }).map((_, i) => ({
    id: i,
    left: 5 + Math.random() * 90,
    bottom: 15 + Math.random() * 35,
    size: 2.5 + Math.random() * 2,
    floatDuration: 6 + Math.random() * 8,
    glowDuration: 3 + Math.random() * 4,
    delay: Math.random() * 8,
    dx: (Math.random() - 0.5) * 30,
    dy: -(Math.random() * 20 + 5),
    dx2: (Math.random() - 0.5) * 20,
    dy2: -(Math.random() * 10 + 3),
    dx3: (Math.random() - 0.5) * 25,
    dy3: -(Math.random() * 18 + 8),
}))

export default function ParallaxMountains() {
    const containerRef = useRef(null)
    const layersRef = useRef([])
    const rafRef = useRef(null)
    const [visible, setVisible] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Direct RAF-based parallax for buttery smooth movement
    const handleScroll = useCallback(() => {
        if (!containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const windowH = window.innerHeight
        const containerH = rect.height

        // How far the section has scrolled: 0 = just entering, 1 = fully past
        const scrolled = -rect.top / (containerH + windowH)

        // Apply different speeds to each layer directly (no React state = no re-renders)
        // Using translate3d for hardware acceleration
        const speeds = [0.02, 0.06, 0.15, 0.3, 0.5, 0.75, 1.0]
        layersRef.current.forEach((el, i) => {
            if (!el) return
            const move = scrolled * speeds[i] * windowH * 0.8
            el.style.transform = `translate3d(0, ${move}px, 0)`
        })
    }, [])

    useEffect(() => {
        const onScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            rafRef.current = requestAnimationFrame(handleScroll)
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        handleScroll() // Initial call to set positions
        return () => {
            window.removeEventListener('scroll', onScroll)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [handleScroll])

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true) },
            { threshold: 0.05 }
        )
        if (containerRef.current) observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <section
            ref={containerRef}
            className="relative overflow-hidden"
            style={{ height: '120vh', minHeight: '600px', contain: 'layout style paint' }}
        >
            {/* SVG Definitions for Filters and Gradients */}
            <svg className="absolute w-0 h-0" aria-hidden="true">
                <defs>
                    <filter id="moon-glow">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
                        <feFlood floodColor="#f5e6a3" floodOpacity="0.4" result="color" />
                        <feComposite in="color" in2="blur" operator="in" result="glow" />
                        <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <linearGradient id="sky-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#040a05" />
                        <stop offset="20%" stopColor="#08180a" />
                        <stop offset="50%" stopColor="#102e12" />
                        <stop offset="100%" stopColor="#1e4a1e" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Sky gradient — refined for depth */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'url(#sky-gradient), linear-gradient(180deg, #040a05 0%, #08180a 20%, #102e12 50%, #1a3c1b 75%, #1e4a1e 100%)',
                }}
            />

            {/* Stars layer — slowest */}
            <div ref={el => layersRef.current[0] = el} className="absolute inset-0 will-change-transform">
                {/* Shooting Stars */}
                <div className="absolute top-[10%] left-[20%] w-[80px] md:w-[150px] h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent rotate-[-35deg] opacity-0 animate-[shooting-star_10s_linear_infinite]" />
                <div className="absolute top-[25%] left-[60%] w-[100px] md:w-[200px] h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent rotate-[-25deg] opacity-0 animate-[shooting-star_15s_linear_infinite_4s]" />

                {STARS_DATA.map((star) => (
                    <div
                        key={star.id}
                        className="absolute rounded-full"
                        style={{
                            width: star.width,
                            height: star.height,
                            top: star.top,
                            left: star.left,
                            opacity: star.opacity,
                            backgroundColor: star.color,
                            animation: `twinkle ${star.duration}s ease-in-out infinite ${star.delay}s`,
                        }}
                    />
                ))}
            </div>

            {/* Moon with better glow */}
            <div ref={el => layersRef.current[1] = el} className="absolute will-change-transform" style={{ top: '8%', right: '12%' }}>
                <svg className="w-16 h-16 md:w-[100px] md:h-[100px]" viewBox="0 0 100 100" style={{ filter: 'url(#moon-glow)' }}>
                    <circle cx="50" cy="50" r="35" fill="radial-gradient(circle at 35% 35%, #f5e6a3 0%, #e8d48b 40%, #d4be6a 100%)" />
                    <circle cx="50" cy="50" r="35" fill="url(#moon-surface)" />
                    <defs>
                        <radialGradient id="moon-surface" cx="35%" cy="35%" r="100%">
                            <stop offset="0%" stopColor="#f5e6a3" />
                            <stop offset="40%" stopColor="#e8d48b" />
                            <stop offset="100%" stopColor="#d4be6a" />
                        </radialGradient>
                    </defs>
                    {/* Craters */}
                    <circle cx="42" cy="40" r="5" fill="black" fillOpacity="0.08" />
                    <circle cx="65" cy="55" r="8" fill="black" fillOpacity="0.06" />
                    <circle cx="55" cy="68" r="4" fill="black" fillOpacity="0.07" />
                </svg>
            </div>

            {/* Layer 5 — Farthest mountains */}
            <div ref={el => layersRef.current[2] = el} className="absolute bottom-0 left-0 w-full will-change-transform" style={{ height: '70%', overflow: 'visible' }}>
                <svg
                    className="absolute bottom-0 left-0 w-full h-full object-cover origin-bottom md:object-fill"
                    viewBox={isMobile ? "0 0 800 500" : "0 0 1440 500"}
                    preserveAspectRatio="xMidYMax slice"
                    style={{ overflow: 'visible' }}
                >
                    <path
                        d={isMobile
                            ? "M0,500 L0,350 L150,220 L300,320 L450,180 L600,280 L750,150 L800,190 L800,500 Z"
                            : "M0,500 L0,320 Q40,260 80,290 Q140,220 200,270 Q260,190 340,250 Q400,170 480,230 Q540,150 620,210 Q700,130 780,190 Q840,120 920,170 Q1000,100 1060,160 Q1120,110 1200,170 Q1280,130 1360,180 Q1400,160 1440,200 L1440,500 Z"
                        }
                        fill="#0d1f0e"
                        opacity="0.6"
                    />
                </svg>
            </div>

            {/* Layer 4 — Far-mid mountains */}
            <div ref={el => layersRef.current[3] = el} className="absolute bottom-0 left-0 w-full will-change-transform" style={{ height: '60%', overflow: 'visible' }}>
                <svg
                    className="absolute bottom-0 left-0 w-full h-full object-cover origin-bottom md:object-fill"
                    viewBox={isMobile ? "0 0 800 450" : "0 0 1440 450"}
                    preserveAspectRatio="xMidYMax slice"
                    style={{ overflow: 'visible' }}
                >
                    <path
                        d={isMobile
                            ? "M0,450 L0,300 L120,160 L240,260 L380,120 L520,240 L680,100 L800,180 L800,450 Z"
                            : "M0,450 L0,280 Q60,220 140,260 Q220,170 320,230 Q400,140 500,210 Q580,120 680,190 Q760,100 840,170 Q920,120 1000,180 Q1080,100 1160,170 Q1240,130 1320,190 Q1380,150 1440,210 L1440,450 Z"
                        }
                        fill="#122a12"
                        opacity="0.8"
                    />
                </svg>
            </div>

            {/* Layer 3 — Middle mountains */}
            <div ref={el => layersRef.current[4] = el} className="absolute bottom-0 left-0 w-full will-change-transform" style={{ height: '50%', overflow: 'visible' }}>
                <svg
                    className="absolute bottom-0 left-0 w-full h-full object-cover origin-bottom md:object-fill"
                    viewBox={isMobile ? "0 0 800 400" : "0 0 1440 400"}
                    preserveAspectRatio="xMidYMax slice"
                    style={{ overflow: 'visible' }}
                >
                    <path
                        d={isMobile
                            ? "M0,400 L0,260 L180,100 L340,220 L500,80 L660,200 L800,120 L800,400 Z"
                            : "M0,400 L0,240 Q80,170 180,220 Q280,120 380,190 Q460,100 560,170 Q640,80 740,150 Q820,100 920,170 Q1000,80 1100,160 Q1180,110 1280,180 Q1360,130 1440,190 L1440,400 Z"
                        }
                        fill="#1a3c1b"
                    />
                    {/* Snow caps */}
                    <path d="M640,80 Q660,75 680,85 Q690,78 700,82" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                    <path d="M1000,80 Q1020,74 1040,84 Q1050,76 1060,82" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
                    <path d="M380,120 Q400,115 420,125" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                </svg>
            </div>

            {/* Layer 2 — Near mountains */}
            <div ref={el => layersRef.current[5] = el} className="absolute bottom-0 left-0 w-full will-change-transform" style={{ height: '40%', overflow: 'visible' }}>
                <svg
                    className="absolute bottom-0 left-0 w-full h-full object-cover origin-bottom md:object-fill"
                    viewBox={isMobile ? "0 0 800 350" : "0 0 1440 350"}
                    preserveAspectRatio="xMidYMax slice"
                    style={{ overflow: 'visible' }}
                >
                    <path
                        d={isMobile
                            ? "M0,350 L0,220 L200,80 L380,180 L560,60 L740,160 L800,100 L800,350 Z"
                            : "M0,350 L0,200 Q100,130 220,180 Q340,90 460,160 Q540,80 660,140 Q760,60 880,130 Q960,80 1080,140 Q1180,70 1300,130 Q1380,100 1440,150 L1440,350 Z"
                        }
                        fill="#1e4a1e"
                    />
                </svg>
            </div>

            {/* Layer 1 — Foreground hills + trees */}
            <div ref={el => layersRef.current[6] = el} className="absolute bottom-0 left-0 w-full will-change-transform" style={{ height: '45%', overflow: 'visible' }}>
                <svg
                    className="absolute bottom-0 left-0 w-full h-full object-cover origin-bottom md:object-fill"
                    viewBox={isMobile ? "0 0 800 400" : "0 0 1440 400"}
                    preserveAspectRatio="xMidYMax slice"
                    style={{ overflow: 'visible' }}
                >
                    {/* Ground */}
                    <path
                        d={isMobile
                            ? "M0,400 L0,240 Q100,190 200,220 Q300,180 400,210 Q500,160 600,200 Q700,150 800,190 L800,400 Z"
                            : "M0,400 L0,270 Q120,220 240,250 Q360,190 480,240 Q600,180 720,230 Q840,170 960,220 Q1080,180 1200,225 Q1320,195 1440,230 L1440,400 Z"
                        }
                        fill="#2a5525"
                    />

                    {/* Trees with Sway Animation */}
                    {TREE_DATA.map((tree, i) => (
                        <g key={`dt-${i}`} className="animate-[tree-sway_4s_ease-in-out_infinite]" style={{ transformOrigin: `${tree.x}px ${tree.baseY}px`, animationDelay: `${tree.delay}s` }}>
                            {/* Trunk */}
                            <rect x={tree.x - 2} y={tree.baseY - 8} width={4} height={16} fill="#0d1a08" opacity="0.7" />
                            {/* Bottom foliage */}
                            <polygon points={`${tree.x},${tree.baseY - tree.h} ${tree.x - tree.w},${tree.baseY} ${tree.x + tree.w},${tree.baseY}`} fill="#1a3a1a" />
                            {/* Middle foliage */}
                            <polygon points={`${tree.x},${tree.baseY - tree.h - 12} ${tree.x - tree.w * 0.8},${tree.baseY - tree.h + 15} ${tree.x + tree.w * 0.8},${tree.baseY - tree.h + 15}`} fill="#245a24" />
                            {/* Top foliage */}
                            <polygon points={`${tree.x},${tree.baseY - tree.h - 24} ${tree.x - tree.w * 0.5},${tree.baseY - tree.h - 2} ${tree.x + tree.w * 0.5},${tree.baseY - tree.h - 2}`} fill="#2e6e2e" />
                        </g>
                    ))}

                    {/* Mobile-only supplement trees */}
                    {isMobile && MOBILE_TREE_DATA.map((tree, i) => (
                        <g key={`mt-${i}`} className="animate-[tree-sway_4.5s_ease-in-out_infinite]" style={{ transformOrigin: `${tree.x}px ${tree.baseY}px`, animationDelay: `${tree.delay}s` }}>
                            <rect x={tree.x - 1.5} y={tree.baseY - 6} width={3} height={12} fill="#0d1a08" opacity="0.6" />
                            <polygon points={`${tree.x},${tree.baseY - tree.h} ${tree.x - tree.w},${tree.baseY} ${tree.x + tree.w},${tree.baseY}`} fill="#1a3a1a" />
                            <polygon points={`${tree.x},${tree.baseY - tree.h - 10} ${tree.x - tree.w * 0.8},${tree.baseY - tree.h + 12} ${tree.x + tree.w * 0.8},${tree.baseY - tree.h + 12}`} fill="#245a24" />
                        </g>
                    ))}
                </svg>
            </div>

            {/* Fireflies — floating warm glowing dots above the foreground */}
            <div className="absolute inset-0 z-[5] pointer-events-none">
                {FIREFLIES_DATA.map((ff) => (
                    <div
                        key={ff.id}
                        className="absolute rounded-full"
                        style={{
                            left: `${ff.left}%`,
                            bottom: `${ff.bottom}%`,
                            width: ff.size,
                            height: ff.size,
                            backgroundColor: '#c8dc64',
                            animation: `firefly-float ${ff.floatDuration}s ease-in-out infinite ${ff.delay}s, firefly-glow ${ff.glowDuration}s ease-in-out infinite ${ff.delay}s`,
                            '--ff-dx': `${ff.dx}px`,
                            '--ff-dy': `${ff.dy}px`,
                            '--ff-dx2': `${ff.dx2}px`,
                            '--ff-dy2': `${ff.dy2}px`,
                            '--ff-dx3': `${ff.dx3}px`,
                            '--ff-dy3': `${ff.dy3}px`,
                        }}
                    />
                ))}
            </div>

            {/* Glowing Message Overlay — staggered reveal */}
            <div
                className={`absolute inset-0 flex flex-col items-center z-10 transition-all duration-[2000ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ paddingTop: '12%' }}
            >
                <p className={`font-[Caveat] text-5xl md:text-7xl text-white/90 text-center font-bold px-6 leading-tight tracking-wide transition-all duration-[2000ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ textShadow: '2px 4px 15px rgba(0,0,0,0.8), 0 0 60px rgba(245,230,163,0.15)' }}>
                    Beyond these mountains...
                </p>
                <p className={`font-['Patrick_Hand'] text-xl md:text-3xl text-[#f5e6a3]/70 text-center mt-6 max-w-2xl mx-auto px-6 tracking-wide transition-all duration-[2000ms] delay-[1000ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ textShadow: '1px 2px 8px rgba(0,0,0,0.5)' }}>
                    ...our memories will always travel with you, Ma'am
                </p>
            </div>

            {/* Mist Layers for depth */}
            <div className="absolute bottom-[30%] left-0 right-0 h-32 z-[3] pointer-events-none">
                <div className="w-full h-full" style={{ background: 'linear-gradient(to top, transparent 0%, rgba(200,220,200,0.12) 50%, transparent 100%)' }} />
            </div>

            {/* Bottom seamless transition */}
            <div
                className="absolute bottom-0 left-0 right-0 h-48 z-20 pointer-events-none"
                style={{ background: 'linear-gradient(to top, #1e4a1e 0%, #1e4a1e99 40%, transparent 100%)' }}
            />

        </section>
    )
}
