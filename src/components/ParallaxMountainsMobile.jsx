import { useEffect, useRef, useState, useCallback } from 'react'

// Star color variation — warm, cool, and neutral
const STAR_COLORS = ['#ffffff', '#ffffff', '#ffffff', '#ffe8c0', '#ffe8c0', '#c0d8ff', '#c0d8ff', '#fff5e0', '#d0e0ff']

// Rich star field — varied sizes for depth
const STARS_DATA = Array.from({ length: 55 }).map((_, i) => ({
    id: i,
    width: i < 5 ? Math.random() * 3 + 2.5 : Math.random() * 2.5 + 1,
    height: i < 5 ? Math.random() * 3 + 2.5 : Math.random() * 2.5 + 1,
    top: `${Math.random() * 48}%`,
    left: `${Math.random() * 100}%`,
    opacity: i < 5 ? Math.random() * 0.3 + 0.5 : Math.random() * 0.4 + 0.15,
    duration: 3 + Math.random() * 5,
    delay: Math.random() * 5,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]
}))

// 5 trees, naturally spaced with size variation
const TREE_DATA = [
    { x: 55, h: 44, w: 13, delay: 0 },
    { x: 140, h: 36, w: 11, delay: 0.6 },
    { x: 230, h: 50, w: 14, delay: 1.2 },
    { x: 320, h: 38, w: 12, delay: 0.3 },
    { x: 395, h: 46, w: 13, delay: 0.9 },
]

// Fireflies for mobile — fewer but still magical
const FIREFLIES_DATA = Array.from({ length: 7 }).map((_, i) => ({
    id: i,
    left: 8 + Math.random() * 84,
    bottom: 18 + Math.random() * 30,
    size: 2 + Math.random() * 1.5,
    floatDuration: 6 + Math.random() * 8,
    glowDuration: 3 + Math.random() * 4,
    delay: Math.random() * 8,
    dx: (Math.random() - 0.5) * 20,
    dy: -(Math.random() * 15 + 4),
    dx2: (Math.random() - 0.5) * 14,
    dy2: -(Math.random() * 8 + 2),
    dx3: (Math.random() - 0.5) * 18,
    dy3: -(Math.random() * 12 + 5),
}))

export default function ParallaxMountainsMobile() {
    const containerRef = useRef(null)
    const layersRef = useRef([])
    const rafRef = useRef(null)
    const [visible, setVisible] = useState(false)

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const windowH = window.innerHeight
        const containerH = rect.height
        const scrolled = -rect.top / (containerH + windowH)

        const speeds = [0.02, 0.04, 0.1, 0.18, 0.28, 0.38, 0.5]
        layersRef.current.forEach((el, i) => {
            if (!el) return
            const move = scrolled * speeds[i] * windowH * 0.5
            el.style.transform = `translate3d(0, ${move}px, 0)`
        })
    }, [])

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
            style={{ height: '60vh', minHeight: '400px', contain: 'layout style paint' }}
        >
            {/* SVG Definitions */}
            <svg className="absolute w-0 h-0" aria-hidden="true">
                <defs>
                    <filter id="moon-glow-m">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
                        <feFlood floodColor="#f5e6a3" floodOpacity="0.4" result="color" />
                        <feComposite in="color" in2="blur" operator="in" result="glow" />
                        <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <radialGradient id="moon-surface-m" cx="35%" cy="35%" r="100%">
                        <stop offset="0%" stopColor="#f5e6a3" />
                        <stop offset="40%" stopColor="#e8d48b" />
                        <stop offset="100%" stopColor="#d4be6a" />
                    </radialGradient>
                </defs>
            </svg>

            {/* Sky gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(180deg, #040a05 0%, #06120a 15%, #08180a 25%, #0d2310 40%, #102e12 55%, #163516 68%, #1a3c1b 80%, #1e4a1e 100%)',
                }}
            />

            {/* Layer 0 — Stars + shooting stars */}
            <div ref={el => layersRef.current[0] = el} className="absolute inset-0 will-change-transform">
                {/* Two shooting stars at different angles and timings */}
                <div className="absolute top-[8%] left-[15%] w-[60px] h-[1.5px] bg-gradient-to-r from-transparent via-white/70 to-transparent rotate-[-35deg] opacity-0 animate-[shooting-star_10s_linear_infinite]" />
                <div className="absolute top-[22%] left-[55%] w-[45px] h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent rotate-[-25deg] opacity-0 animate-[shooting-star_14s_linear_infinite_5s]" />

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

            {/* Layer 1 — Moon with ambient halo */}
            <div ref={el => layersRef.current[1] = el} className="absolute will-change-transform" style={{ top: '4%', right: '8%' }}>
                {/* Ambient halo glow behind the moon */}
                <div
                    className="absolute rounded-full"
                    style={{
                        width: 120,
                        height: 120,
                        top: -38,
                        left: -38,
                        background: 'radial-gradient(circle, rgba(245,230,163,0.07) 0%, rgba(245,230,163,0.03) 40%, transparent 70%)',
                    }}
                />
                <svg className="w-[44px] h-[44px]" viewBox="0 0 100 100" style={{ filter: 'url(#moon-glow-m)' }}>
                    <circle cx="50" cy="50" r="35" fill="url(#moon-surface-m)" />
                    <circle cx="42" cy="40" r="5" fill="black" fillOpacity="0.08" />
                    <circle cx="65" cy="55" r="8" fill="black" fillOpacity="0.06" />
                    <circle cx="55" cy="68" r="4" fill="black" fillOpacity="0.07" />
                    <circle cx="35" cy="60" r="3" fill="black" fillOpacity="0.05" />
                </svg>
            </div>

            {/* Layer 2 — Farthest mountains */}
            <div ref={el => layersRef.current[2] = el} className="absolute left-0 w-full will-change-transform" style={{ bottom: 0, height: '250%' }}>
                <svg className="absolute bottom-0 left-0 w-full" style={{ height: '50%' }} viewBox="0 0 430 500" preserveAspectRatio="none">
                    <path
                        d="M0,140 Q60,95 120,125 Q180,60 250,110 Q330,50 400,95 L430,105 L430,500 L0,500 Z"
                        fill="#0a1a0b"
                        opacity="0.55"
                    />
                </svg>
            </div>

            {/* Layer 3 — Far-mid mountains */}
            <div ref={el => layersRef.current[3] = el} className="absolute left-0 w-full will-change-transform" style={{ bottom: 0, height: '250%' }}>
                <svg className="absolute bottom-0 left-0 w-full" style={{ height: '45%' }} viewBox="0 0 430 500" preserveAspectRatio="none">
                    <path
                        d="M0,155 Q80,90 160,140 Q230,55 310,120 Q370,70 430,115 L430,500 L0,500 Z"
                        fill="#0f240f"
                        opacity="0.75"
                    />
                </svg>
            </div>


            {/* Layer 4 — Middle mountains + snow */}
            <div ref={el => layersRef.current[4] = el} className="absolute left-0 w-full will-change-transform" style={{ bottom: 0, height: '250%' }}>
                <svg className="absolute bottom-0 left-0 w-full" style={{ height: '40%' }} viewBox="0 0 430 500" preserveAspectRatio="none">
                    <path
                        d="M0,175 Q70,105 140,160 Q200,60 275,140 Q340,75 430,135 L430,500 L0,500 Z"
                        fill="#163518"
                    />
                    <path d="M200,60 Q215,52 230,63 Q238,56 245,62" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M340,75 Q352,68 362,77" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </div>


            {/* Layer 5 — Near mountains */}
            <div ref={el => layersRef.current[5] = el} className="absolute left-0 w-full will-change-transform" style={{ bottom: 0, height: '250%' }}>
                <svg className="absolute bottom-0 left-0 w-full" style={{ height: '36%' }} viewBox="0 0 430 500" preserveAspectRatio="none">
                    <path
                        d="M0,180 Q55,130 120,170 Q190,95 270,155 Q340,110 430,150 L430,500 L0,500 Z"
                        fill="#1c441c"
                    />
                </svg>
            </div>

            {/* Layer 6 — Foreground hills + trees */}
            <div ref={el => layersRef.current[6] = el} className="absolute left-0 w-full will-change-transform" style={{ bottom: 0, height: '250%' }}>
                <svg
                    className="absolute bottom-0 left-0 w-full"
                    style={{ height: '32%' }}
                    viewBox="0 0 430 500"
                    preserveAspectRatio="none"
                    overflow="visible"
                >
                    {/* Rolling foreground hill */}
                    <path
                        d="M0,225 Q55,200 120,218 Q200,185 280,215 Q350,195 430,210 L430,500 L0,500 Z"
                        fill="#265724"
                    />
                    {/* Subtle lighter ridge highlight */}
                    <path
                        d="M0,225 Q55,200 120,218 Q200,185 280,215 Q350,195 430,210"
                        fill="none"
                        stroke="rgba(60,110,55,0.4)"
                        strokeWidth="3"
                    />

                    {/* Trees */}
                    {TREE_DATA.map((tree, i) => {
                        const t = tree.x / 430
                        const hillY = 225 - 40 * Math.sin(t * Math.PI) + 10 * Math.sin(t * Math.PI * 2.5)
                        return (
                            <g key={i} className="animate-[tree-sway_4s_ease-in-out_infinite]" style={{ transformOrigin: `${tree.x}px ${hillY}px`, animationDelay: `${tree.delay}s` }}>
                                <rect x={tree.x - 1.5} y={hillY - 6} width={3} height={12} fill="#0d1a08" opacity="0.7" rx="1" />
                                <polygon points={`${tree.x},${hillY - tree.h} ${tree.x - tree.w},${hillY} ${tree.x + tree.w},${hillY}`} fill="#173a17" />
                                <polygon points={`${tree.x},${hillY - tree.h - 10} ${tree.x - tree.w * 0.78},${hillY - tree.h + 12} ${tree.x + tree.w * 0.78},${hillY - tree.h + 12}`} fill="#1f5220" />
                                <polygon points={`${tree.x},${hillY - tree.h - 20} ${tree.x - tree.w * 0.45},${hillY - tree.h - 2} ${tree.x + tree.w * 0.45},${hillY - tree.h - 2}`} fill="#2a6a2a" />
                            </g>
                        )
                    })}
                </svg>
            </div>

            {/* Fireflies — floating warm glowing dots above the hills */}
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
                className={`absolute inset-0 flex flex-col items-center z-10 transition-all duration-[2000ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ paddingTop: '10%' }}
            >
                {/* Dark backdrop so text doesn't compete with mountain peaks */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 90% 45% at 50% 12%, rgba(0,0,0,0.5) 0%, transparent 100%)' }} />
                <p className={`font-[Caveat] text-[2rem] text-white/90 text-center font-bold px-5 leading-tight tracking-wide transition-all duration-[2000ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                    style={{ textShadow: '2px 4px 15px rgba(0,0,0,0.85), 0 0 50px rgba(245,230,163,0.12)' }}>
                    Beyond these mountains...
                </p>
                <p className={`font-['Patrick_Hand'] text-[0.95rem] text-[#f5e6a3]/65 text-center mt-3 max-w-[270px] mx-auto px-4 tracking-wide leading-relaxed transition-all duration-[2000ms] delay-[1000ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                    style={{ textShadow: '1px 2px 10px rgba(0,0,0,0.6)' }}>
                    ...our memories will always travel with you, Ma'am
                </p>
            </div>

            {/* Bottom seamless transition */}
            <div
                className="absolute bottom-0 left-0 right-0 h-36 z-20 pointer-events-none"
                style={{ background: 'linear-gradient(to top, #1e4a1e 0%, #1e4a1ecc 30%, #1e4a1e66 60%, transparent 100%)' }}
            />
        </section>
    )
}
