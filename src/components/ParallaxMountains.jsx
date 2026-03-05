import { useEffect, useRef, useState, useCallback } from 'react'

export default function ParallaxMountains() {
    const containerRef = useRef(null)
    const layersRef = useRef([])
    const rafRef = useRef(null)
    const [visible, setVisible] = useState(false)

    // Direct RAF-based parallax for buttery smooth movement
    const handleScroll = useCallback(() => {
        if (!containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const windowH = window.innerHeight
        const containerH = rect.height

        // How far the section has scrolled: 0 = just entering, 1 = fully past
        const scrolled = -rect.top / (containerH + windowH)

        // Apply different speeds to each layer directly (no React state = no re-renders)
        const speeds = [0.02, 0.06, 0.15, 0.3, 0.5, 0.75, 1.0]
        layersRef.current.forEach((el, i) => {
            if (!el) return
            const move = scrolled * speeds[i] * windowH * 0.8
            el.style.transform = `translateY(${move}px)`
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

    const setLayerRef = (index) => (el) => {
        layersRef.current[index] = el
    }

    return (
        <section
            ref={containerRef}
            className="relative overflow-hidden"
            style={{ height: '110vh', minHeight: '700px' }}
        >
            {/* Sky gradient — dark green to deep twilight */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(180deg, #071209 0%, #0d1b0e 15%, #132a14 35%, #1a3a1a 55%, #1e4a1e 75%, #234d20 100%)',
                }}
            />

            {/* Stars layer — slowest */}
            <div ref={setLayerRef(0)} className="absolute inset-0 will-change-transform">
                {Array.from({ length: 50 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            width: Math.random() * 2.5 + 1,
                            height: Math.random() * 2.5 + 1,
                            top: `${Math.random() * 50}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.5 + 0.1,
                            animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            {/* Moon */}
            <div ref={setLayerRef(1)} className="absolute will-change-transform" style={{ top: '6%', right: '15%' }}>
                <div
                    className="w-16 h-16 md:w-24 md:h-24 rounded-full relative"
                    style={{
                        background: 'radial-gradient(circle at 35% 35%, #f5e6a3 0%, #e8d48b 40%, #d4be6a 100%)',
                        boxShadow: '0 0 50px rgba(245,230,163,0.35), 0 0 100px rgba(245,230,163,0.15), 0 0 150px rgba(245,230,163,0.08)',
                    }}
                >
                    <div className="absolute top-[30%] left-[25%] w-3 h-3 rounded-full bg-black/10" />
                    <div className="absolute top-[50%] left-[55%] w-2 h-2 rounded-full bg-black/[0.08]" />
                    <div className="absolute top-[20%] left-[60%] w-1.5 h-1.5 rounded-full bg-black/[0.08]" />
                </div>
            </div>

            {/* Layer 5 — Farthest mountains (slowest) */}
            <div ref={setLayerRef(2)} className="absolute bottom-0 left-0 w-full will-change-transform" style={{ height: '70%' }}>
                <svg
                    className="absolute bottom-0 left-0 w-full h-full"
                    viewBox="0 0 1440 500"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0,500 L0,320 Q40,260 80,290 Q140,220 200,270 Q260,190 340,250 Q400,170 480,230 Q540,150 620,210 Q700,130 780,190 Q840,120 920,170 Q1000,100 1060,160 Q1120,110 1200,170 Q1280,130 1360,180 Q1400,160 1440,200 L1440,500 Z"
                        fill="#132a14"
                        opacity="0.6"
                    />
                </svg>
            </div>

            {/* Layer 4 — Far-mid mountains */}
            <div ref={setLayerRef(3)} className="absolute bottom-0 left-0 w-full will-change-transform" style={{ height: '60%' }}>
                <svg
                    className="absolute bottom-0 left-0 w-full h-full"
                    viewBox="0 0 1440 450"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0,450 L0,280 Q60,220 140,260 Q220,170 320,230 Q400,140 500,210 Q580,120 680,190 Q760,100 840,170 Q920,120 1000,180 Q1080,100 1160,170 Q1240,130 1320,190 Q1380,150 1440,210 L1440,450 Z"
                        fill="#183318"
                        opacity="0.8"
                    />
                </svg>
            </div>

            {/* Layer 3 — Middle mountains */}
            <div ref={setLayerRef(4)} className="absolute bottom-0 left-0 w-full will-change-transform" style={{ height: '50%' }}>
                <svg
                    className="absolute bottom-0 left-0 w-full h-full"
                    viewBox="0 0 1440 400"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0,400 L0,240 Q80,170 180,220 Q280,120 380,190 Q460,100 560,170 Q640,80 740,150 Q820,100 920,170 Q1000,80 1100,160 Q1180,110 1280,180 Q1360,130 1440,190 L1440,400 Z"
                        fill="#1e4a1e"
                    />
                    {/* Snow caps on tallest peaks */}
                    <path
                        d="M640,80 Q660,75 680,85 Q690,78 700,82"
                        fill="none"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="3"
                    />
                    <path
                        d="M1000,80 Q1020,74 1040,84 Q1050,76 1060,82"
                        fill="none"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="3"
                    />
                </svg>
            </div>

            {/* Layer 2 — Near mountains */}
            <div ref={setLayerRef(5)} className="absolute bottom-0 left-0 w-full will-change-transform" style={{ height: '40%' }}>
                <svg
                    className="absolute bottom-0 left-0 w-full h-full"
                    viewBox="0 0 1440 350"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0,350 L0,200 Q100,130 220,180 Q340,90 460,160 Q540,80 660,140 Q760,60 880,130 Q960,80 1080,140 Q1180,70 1300,130 Q1380,100 1440,150 L1440,350 Z"
                        fill="#234d20"
                    />
                </svg>
            </div>

            {/* Layer 1 — Foreground hills + trees (fastest) */}
            <div ref={setLayerRef(6)} className="absolute bottom-0 left-0 w-full will-change-transform" style={{ height: '35%' }}>
                <svg
                    className="absolute bottom-0 left-0 w-full h-full"
                    viewBox="0 0 1440 350"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Ground */}
                    <path
                        d="M0,350 L0,220 Q120,170 240,200 Q360,140 480,190 Q600,130 720,180 Q840,120 960,170 Q1080,130 1200,175 Q1320,145 1440,180 L1440,350 Z"
                        fill="#2a5525"
                    />

                    {/* Trees — large, fully visible */}
                    {[80, 200, 330, 480, 600, 750, 880, 1020, 1150, 1280, 1380].map((x, i) => {
                        const baseY = 195 + Math.sin(x * 0.005) * 20
                        const h = 50 + (i % 3) * 20
                        const w = 18 + (i % 2) * 6
                        return (
                            <g key={i}>
                                {/* Trunk */}
                                <rect x={x - 2} y={baseY - 8} width={4} height={16} fill="#1a3010" opacity="0.6" />
                                {/* Bottom foliage */}
                                <polygon
                                    points={`${x},${baseY - h} ${x - w},${baseY} ${x + w},${baseY}`}
                                    fill="#1a3a1a"
                                    opacity="0.9"
                                />
                                {/* Middle foliage */}
                                <polygon
                                    points={`${x},${baseY - h - 15} ${x - w * 0.75},${baseY - h + 15} ${x + w * 0.75},${baseY - h + 15}`}
                                    fill="#15301a"
                                    opacity="0.85"
                                />
                                {/* Top foliage */}
                                <polygon
                                    points={`${x},${baseY - h - 28} ${x - w * 0.5},${baseY - h - 5} ${x + w * 0.5},${baseY - h - 5}`}
                                    fill="#122818"
                                    opacity="0.8"
                                />
                            </g>
                        )
                    })}

                    {/* Small bushes */}
                    {[140, 420, 680, 960, 1200].map((x, i) => (
                        <ellipse key={`bush-${i}`} cx={x} cy={210 + (i % 2) * 10} rx={16} ry={10} fill="#1e4020" opacity="0.7" />
                    ))}
                </svg>
            </div>

            {/* Floating text in the sky */}
            <div
                className={`absolute inset-0 flex flex-col items-center z-10 transition-all duration-[1500ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ paddingTop: '12%' }}
            >
                <p className="font-[Caveat] text-4xl md:text-6xl text-white/80 text-center font-bold leading-relaxed px-6"
                    style={{ textShadow: '2px 3px 12px rgba(0,0,0,0.6), 0 0 40px rgba(245,230,163,0.12)' }}>
                    Beyond these mountains...
                </p>
                <p className="font-['Patrick_Hand'] text-lg md:text-2xl text-[#f5e6a3]/50 text-center mt-5 max-w-lg mx-auto px-6"
                    style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.4)' }}>
                    ...our memories will always travel with you, Ma'am
                </p>
            </div>

            {/* Mist between mountain layers */}
            <div className="absolute bottom-[30%] left-0 right-0 h-20 z-[3] pointer-events-none">
                <div className="w-full h-full" style={{
                    background: 'linear-gradient(to top, transparent 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.06) 60%, transparent 100%)',
                }} />
            </div>

            {/* Bottom fog for seamless transition to next section */}
            <div
                className="absolute bottom-0 left-0 right-0 h-40 z-20 pointer-events-none"
                style={{
                    background: 'linear-gradient(to top, #1e4a1e 0%, #1e4a1e80 30%, transparent 100%)',
                }}
            />
        </section>
    )
}
