import { useEffect, useRef, useState, useCallback } from 'react'

export default function ParallaxMountains() {
    const containerRef = useRef(null)
    const layersRef = useRef([])
    const rafRef = useRef(null)
    const [visible, setVisible] = useState(false)

    // Direct RAF-based parallax for buttery smooth 60fps movement
    const handleScroll = useCallback(() => {
        if (!containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const windowH = window.innerHeight
        const containerH = rect.height

        // How far the section has scrolled: 0 = just entering, 1 = fully past
        const scrolled = -rect.top / (containerH + windowH)

        // Apply different speeds to each layer directly for extreme depth
        const speeds = [0.02, 0.05, 0.1, 0.2, 0.35, 0.55, 0.8, 1.1]
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

    const setLayerRef = (index) => (el) => {
        layersRef.current[index] = el
    }

    return (
        <section
            ref={containerRef}
            className="relative overflow-hidden bg-[#040814]"
            style={{ height: '120vh', minHeight: '800px' }}
        >
            {/* Global SVG Definitions for Reuse */}
            <svg width="0" height="0" className="absolute hidden">
                <defs>
                    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#040814" />
                        <stop offset="40%" stopColor="#0b1736" />
                        <stop offset="70%" stopColor="#142c52" />
                        <stop offset="100%" stopColor="#1e4d75" />
                    </linearGradient>
                    <linearGradient id="auroraGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgba(45,212,191,0)" />
                        <stop offset="50%" stopColor="rgba(45,212,191,0.15)" />
                        <stop offset="100%" stopColor="rgba(167,139,250,0)" />
                    </linearGradient>
                    <linearGradient id="mistGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                        <stop offset="50%" stopColor="rgba(200,230,255,0.05)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                    <linearGradient id="mountainBackGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#152642" />
                        <stop offset="100%" stopColor="#0b1526" />
                    </linearGradient>
                    <linearGradient id="mountainMidGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10364d" />
                        <stop offset="100%" stopColor="#081e2e" />
                    </linearGradient>
                    <linearGradient id="mountainFrontGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0e4147" />
                        <stop offset="100%" stopColor="#062226" />
                    </linearGradient>
                    <linearGradient id="forestGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#062e26" />
                        <stop offset="100%" stopColor="#02120f" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="moonGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="12" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
            </svg>

            {/* Layer 0: Deep Sky Gradient */}
            <div className="absolute inset-0 z-0">
                <svg className="w-full h-full" preserveAspectRatio="none">
                    <rect width="100%" height="100%" fill="url(#skyGrad)" />
                </svg>
            </div>

            {/* Layer 1: Aurora & Stars (Slowest Parallax) */}
            <div ref={setLayerRef(0)} className="absolute inset-0 z-0 will-change-transform">
                {/* Aurora Wave */}
                <svg className="absolute top-0 left-0 w-full h-[60%] opacity-70 animate-pulse" viewBox="0 0 1440 400" preserveAspectRatio="none">
                    <path
                        d="M0,200 C320,100 420,300 720,200 C1020,100 1120,300 1440,150 L1440,0 L0,0 Z"
                        fill="url(#auroraGrad)"
                    />
                </svg>

                {/* Twinkling Stars */}
                {Array.from({ length: 120 }).map((_, i) => {
                    const size = Math.random() * 2.5 + 0.5;
                    return (
                        <div
                            key={`star-${i}`}
                            className="absolute rounded-full bg-white"
                            style={{
                                width: size, height: size,
                                top: `${Math.random() * 60}%`,
                                left: `${Math.random() * 100}%`,
                                opacity: Math.random() * 0.6 + 0.1,
                                animation: `twinkle ${2 + Math.random() * 5}s ease-in-out infinite ${Math.random() * 5}s`,
                                boxShadow: size > 2 ? '0 0 4px rgba(255,255,255,0.8)' : 'none'
                            }}
                        />
                    )
                })}

                {/* Shooting Stars */}
                <div className="absolute top-[10%] left-[20%] w-32 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 -rotate-45 animate-[shooting-star_8s_linear_infinite]" />
                <div className="absolute top-[30%] left-[70%] w-48 h-[1px] bg-gradient-to-r from-transparent via-teal-200 to-transparent opacity-0 -rotate-45 animate-[shooting-star_12s_linear_infinite_4s]" />
            </div>

            {/* Layer 2: The Moon */}
            <div ref={setLayerRef(1)} className="absolute z-0 will-change-transform" style={{ top: '10%', right: '15%' }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="40" fill="#fdfae6" filter="url(#moonGlow)" opacity="0.9" />
                    {/* Craters */}
                    <circle cx="50" cy="45" r="8" fill="#e6dca1" opacity="0.3" />
                    <circle cx="75" cy="55" r="12" fill="#e6dca1" opacity="0.2" />
                    <circle cx="45" cy="70" r="6" fill="#e6dca1" opacity="0.25" />
                </svg>
            </div>

            {/* Layer 3: Farthest Mountains */}
            <div ref={setLayerRef(2)} className="absolute bottom-0 left-0 w-full z-10 will-change-transform" style={{ height: '75%' }}>
                <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1440 600" preserveAspectRatio="none">
                    <path
                        d="M0,600 L0,350 Q60,280 120,320 Q200,230 280,310 Q380,180 480,260 Q560,170 660,250 Q780,120 880,220 Q980,150 1080,240 Q1180,160 1280,240 Q1360,190 1440,250 L1440,600 Z"
                        fill="url(#mountainBackGrad)"
                    />
                    {/* Distant Highlights */}
                    <path d="M780,120 Q800,140 820,160 M380,180 Q400,200 420,220" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" />
                </svg>
            </div>

            {/* Mist Layer separating Back and Mid Mountains */}
            <div ref={setLayerRef(3)} className="absolute bottom-[30%] left-0 w-full h-[30%] z-10 will-change-transform opacity-60 pointer-events-none">
                <svg className="w-full h-full" preserveAspectRatio="none">
                    <rect width="100%" height="100%" fill="url(#mistGrad)" />
                </svg>
            </div>

            {/* Layer 4: Mid Mountains with Snowcaps */}
            <div ref={setLayerRef(4)} className="absolute bottom-0 left-0 w-full z-20 will-change-transform" style={{ height: '60%' }}>
                <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1440 450" preserveAspectRatio="none">
                    <path
                        d="M0,450 L0,250 Q80,160 180,230 Q300,90 420,180 Q520,100 640,210 Q740,80 840,170 Q960,60 1080,160 Q1200,80 1320,180 Q1380,130 1440,190 L1440,450 Z"
                        fill="url(#mountainMidGrad)"
                    />
                    {/* Shadow Side of Peaks */}
                    <path d="M300,90 Q310,130 350,150 L420,180 Q360,160 300,90 Z" fill="rgba(0,0,0,0.2)" />
                    <path d="M740,80 Q750,120 790,140 L840,170 Q780,140 740,80 Z" fill="rgba(0,0,0,0.2)" />
                    <path d="M960,60 Q970,100 1010,120 L1080,160 Q1020,130 960,60 Z" fill="rgba(0,0,0,0.2)" />

                    {/* Snow Caps */}
                    <path d="M300,90 Q315,100 330,95 Q340,110 350,105 L300,90 Z" fill="rgba(255,255,255,0.15)" />
                    <path d="M740,80 Q755,90 770,85 Q780,100 790,95 L740,80 Z" fill="rgba(255,255,255,0.15)" />
                    <path d="M960,60 Q975,70 990,65 Q1000,80 1010,75 L960,60 Z" fill="rgba(255,255,255,0.2)" />
                </svg>
            </div>

            {/* Layer 5: Front Mountains / Foothills */}
            <div ref={setLayerRef(5)} className="absolute bottom-0 left-0 w-full z-30 will-change-transform" style={{ height: '45%' }}>
                <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1440 350" preserveAspectRatio="none">
                    <path
                        d="M0,350 L0,220 Q120,130 240,190 Q360,110 480,180 Q620,90 760,170 Q900,100 1040,180 Q1180,110 1320,170 Q1380,140 1440,190 L1440,350 Z"
                        fill="url(#mountainFrontGrad)"
                    />
                    {/* Gentle Highlights */}
                    <path d="M620,90 Q660,110 700,115" stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M360,110 Q400,130 440,135" stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M900,100 Q940,120 980,125" stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
            </div>

            {/* Layer 6: Deep Pine Forest Foreground (Ultra Fast) */}
            <div ref={setLayerRef(6)} className="absolute bottom-0 left-0 w-full z-40 will-change-transform" style={{ height: '35%' }}>
                <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1440 250" preserveAspectRatio="none">
                    {/* Ground Base */}
                    <path
                        d="M0,250 L0,150 Q120,120 240,140 Q360,100 480,130 Q600,110 720,140 Q860,95 1000,135 Q1140,105 1280,140 L1440,120 L1440,250 Z"
                        fill="url(#forestGrad)"
                    />

                    {/* Complex Pine Trees Array */}
                    {[
                        { x: 40, s: 1.2 }, { x: 120, s: 0.8 }, { x: 200, s: 1.5 }, { x: 320, s: 0.9 },
                        { x: 420, s: 1.3 }, { x: 550, s: 1.8 }, { x: 650, s: 1.1 }, { x: 780, s: 1.4 },
                        { x: 900, s: 0.8 }, { x: 1020, s: 1.6 }, { x: 1150, s: 1.2 }, { x: 1280, s: 1.4 }, { x: 1380, s: 0.9 }
                    ].map((tree, i) => {
                        const baseY = 150 + Math.sin(tree.x * 0.01) * 20;
                        const h = 60 * tree.s;
                        const w = 22 * tree.s;
                        return (
                            <g key={`tree-${i}`}>
                                {/* Shadow/Trunk */}
                                <rect x={tree.x - 3 * tree.s} y={baseY - 10} width={6 * tree.s} height={20 * tree.s} fill="#020806" />
                                {/* Bottom Tier */}
                                <polygon points={`${tree.x},${baseY - h} ${tree.x - w},${baseY} ${tree.x + w},${baseY}`} fill="#05241e" />
                                {/* Mid Tier */}
                                <polygon points={`${tree.x},${baseY - h - 15 * tree.s} ${tree.x - w * 0.8},${baseY - h + 20 * tree.s} ${tree.x + w * 0.8},${baseY - h + 20 * tree.s}`} fill="#073027" />
                                {/* Top Tier */}
                                <polygon points={`${tree.x},${baseY - h - 35 * tree.s} ${tree.x - w * 0.55},${baseY - h} ${tree.x + w * 0.55},${baseY - h}`} fill="#0a4034" />
                            </g>
                        )
                    })}
                </svg>

                {/* Animated Fireflies in foreground */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div
                            key={`firefly-${i}`}
                            className="absolute rounded-full bg-[#a3ffbf]"
                            style={{
                                width: Math.random() * 3 + 2,
                                height: Math.random() * 3 + 2,
                                bottom: `${Math.random() * 80}%`,
                                left: `${Math.random() * 100}%`,
                                opacity: 0,
                                filter: 'blur(1px)',
                                boxShadow: '0 0 6px 2px rgba(163,255,191,0.6)',
                                animation: `firefly-float ${5 + Math.random() * 5}s ease-in-out infinite ${Math.random() * 5}s, firefly-flash ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 3}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Glowing Message Overlay */}
            <div
                className={`absolute inset-0 flex flex-col items-center z-[50] transition-all duration-[2000ms] ease-out pointer-events-none ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
                style={{ paddingTop: '15%' }}
            >
                <p className="font-[Caveat] text-5xl md:text-7xl text-white text-center font-bold leading-relaxed px-6 tracking-wide"
                    style={{
                        textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 0 60px rgba(45,212,191,0.4), 0 0 100px rgba(167,139,250,0.3)',
                    }}>
                    Beyond these mountains...
                </p>
                <p className="font-['Patrick_Hand'] text-xl md:text-3xl text-teal-100/90 text-center mt-6 max-w-2xl mx-auto px-6 tracking-wide"
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                    ...our memories will always travel with you, Ma'am
                </p>
            </div>

            {/* Bottom Seamless Gradient Transition */}
            <div
                className="absolute bottom-0 left-0 right-0 h-48 z-[60] pointer-events-none"
                style={{ background: 'linear-gradient(to top, #02120f 0%, #02120f99 40%, transparent 100%)' }}
            />

            <style jsx>{`
                @keyframes shooting-star {
                    0% { transform: translateX(0) translateY(0); opacity: 1; }
                    20% { opacity: 0; }
                    100% { transform: translateX(-500px) translateY(500px); opacity: 0; }
                }
                @keyframes firefly-float {
                    0%, 100% { transform: translate(0, 0); }
                    33% { transform: translate(15px, -20px); }
                    66% { transform: translate(-15px, -10px); }
                }
                @keyframes firefly-flash {
                    0%, 100% { opacity: 0; }
                    50% { opacity: Math.random() * 0.5 + 0.5; }
                }
            `}</style>
        </section>
    )
}
