import { useEffect, useState, useRef, useCallback } from 'react'
import FloatingDust from './FloatingDust'
import ChalkDoodles from './ChalkDoodles'
import PetalAnimation from './PetalAnimation'

function ChalkboardTexture() {
  const [dustSpecks] = useState(() => Array.from({ length: 80 }).map((_, i) => ({
    id: i,
    cx: `${Math.random() * 100}%`,
    cy: `${Math.random() * 100}%`,
    r: Math.random() * 2 + 0.5,
  })))
  return (
    <>
      {/* Base grain texture */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <filter id="chalkNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#chalkNoise)" opacity="0.14" />
      </svg>
      {/* Chalk dust specks */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.18]" xmlns="http://www.w3.org/2000/svg">
        {dustSpecks.map((speck) => (
          <circle
            key={speck.id}
            cx={speck.cx}
            cy={speck.cy}
            r={speck.r}
            fill="white"
          />
        ))}
      </svg>
      {/* Worn center area — lighter patch like a used chalkboard */}
      <div className="absolute top-[30%] left-[20%] w-[60%] h-[40%] bg-white/[0.015] rounded-[50%] blur-3xl pointer-events-none" />
      {/* Subtle eraser smudges */}
      <div className="absolute top-[20%] left-[10%] w-40 h-8 bg-white/[0.03] rounded-full blur-md rotate-[-5deg]" />
      <div className="absolute top-[60%] right-[15%] w-32 h-6 bg-white/[0.025] rounded-full blur-md rotate-[3deg]" />
      <div className="absolute bottom-[30%] left-[40%] w-48 h-6 bg-white/[0.02] rounded-full blur-lg rotate-[-2deg]" />
      <div className="absolute top-[40%] left-[60%] w-36 h-10 bg-white/[0.02] rounded-full blur-xl rotate-[8deg]" />
      <div className="absolute top-[70%] left-[25%] w-28 h-5 bg-white/[0.025] rounded-full blur-lg rotate-[-3deg]" />
      {/* Faint chalk line scratches */}
      <div className="absolute top-[15%] left-0 right-0 h-[1px] bg-white/[0.03]" />
      <div className="absolute top-[45%] left-[5%] right-[10%] h-[1px] bg-white/[0.025] rotate-[0.5deg]" />
      <div className="absolute top-[75%] left-[8%] right-[5%] h-[1px] bg-white/[0.03]" />
      <div className="absolute top-[55%] left-[15%] right-[20%] h-[1px] bg-white/[0.02] rotate-[-0.3deg]" />
      {/* Edge vignette for depth */}
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 120px rgba(0,0,0,0.25)' }} />
    </>
  )
}

function ChalkText({ text, className, style }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [dustParticles, setDustParticles] = useState([])

  useEffect(() => {
    if (visibleCount >= text.length) return
    const timeout = setTimeout(() => {
      setVisibleCount((c) => c + 1)
      setDustParticles((prev) => [
        ...prev.slice(-15),
        ...Array.from({ length: 5 }).map((_, i) => ({
          id: Date.now() + i,
          x: (visibleCount / text.length) * 100,
          offsetX: (Math.random() - 0.5) * 30,
          offsetY: -(Math.random() * 40 + 10),
          size: Math.random() * 3 + 3,
        })),
      ])
    }, 100)
    return () => clearTimeout(timeout)
  }, [visibleCount, text.length])

  return (
    <div className="relative">
      <h1 className={className} style={style}>
        {text.split('').map((char, i) => (
          <span
            key={i}
            className="inline-block transition-all duration-200"
            style={{
              opacity: i < visibleCount ? 1 : 0,
              transform: i < visibleCount ? 'translateY(0)' : 'translateY(8px)',
              transitionDelay: `${i * 20}ms`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
      {dustParticles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full chalk-dust bg-white/70"
          style={{
            left: `${p.x}%`,
            top: '50%',
            '--dx': `${p.offsetX}px`,
            '--dy': `${p.offsetY}px`,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  )
}

export default function Hero() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef(null)
  const layersRef = useRef([])
  const rafRef = useRef(null)
  const targetMousePos = useRef({ x: 0, y: 0 })
  const currentMousePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Wait longer so petals are clearly visible and falling before text/content fades in
    setTimeout(() => setVisible(true), 1200)
  }, [])

  const setLayerRef = useCallback((index) => (el) => {
    layersRef.current[index] = el
  }, [])

  // RAF-based parallax — direct DOM manipulation for smooth scroll & mousemove
  useEffect(() => {
    let scrollY = window.scrollY

    const updateParallax = () => {
      if (!sectionRef.current) {
        rafRef.current = requestAnimationFrame(updateParallax)
        return
      }

      // Smooth mouse interpolation
      currentMousePos.current.x += (targetMousePos.current.x - currentMousePos.current.x) * 0.05
      currentMousePos.current.y += (targetMousePos.current.y - currentMousePos.current.y) * 0.05

      const sectionH = sectionRef.current.offsetHeight
      const mx = currentMousePos.current.x
      const my = currentMousePos.current.y

      // Calculate parallax only if Hero is relatively visible
      if (scrollY <= sectionH * 1.5) {
        const speeds = [0.03, 0.06, 0.12, 0.08, 0.2]

        layersRef.current.forEach((el, i) => {
          if (!el) return
          const scrollMove = scrollY * speeds[i]
          let mouseMoveX = 0
          let mouseMoveY = 0

          // Apply mouse parallax mostly to background dust and floating symbols
          if (i === 0) {
            mouseMoveX = mx * -0.02
            mouseMoveY = my * -0.02
            el.style.transform = `translate3d(${mouseMoveX}px, ${-scrollMove + mouseMoveY}px, 0)`
          } else if (i === 2) {
            mouseMoveX = mx * -0.03
            mouseMoveY = my * -0.03
            const scale = 1 + scrollY * 0.0002
            el.style.transform = `translate3d(${mouseMoveX}px, ${-scrollMove + mouseMoveY}px, 0) scale(${scale})`
          } else if (i === 4) {
            el.style.transform = `translate3d(0, ${-scrollMove}px, 0)`
            el.style.opacity = Math.max(0, 1 - scrollY / (sectionH * 0.4))
          } else {
            mouseMoveX = mx * -0.015
            mouseMoveY = my * -0.015
            el.style.transform = `translate3d(${mouseMoveX}px, ${-scrollMove + mouseMoveY}px, 0)`
          }
        })
      }

      rafRef.current = requestAnimationFrame(updateParallax)
    }

    const onScroll = () => {
      scrollY = window.scrollY
    }

    const handleMouseMove = (e) => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      targetMousePos.current = { x, y }
    }

    rafRef.current = requestAnimationFrame(updateParallax)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-[#2d5a27]"
      style={{ background: 'linear-gradient(145deg, #2d5a27 0%, #1e4a1e 30%, #2a5525 60%, #234d20 100%)' }}>
      <ChalkboardTexture />

      {/* Layer 0 — Background dust & petals (slowest parallax) */}
      <div ref={setLayerRef(0)} className="absolute inset-0 will-change-transform">
        <FloatingDust count={30} />
        <PetalAnimation />
      </div>

      {/* Layer 1 — Chalk doodles (slow parallax) */}
      <div ref={setLayerRef(1)} className="absolute inset-0 will-change-transform">
        <ChalkDoodles indices={[0, 1, 4]} />
      </div>

      {/* Wooden frame border with inner shadow — stays fixed (no parallax) */}
      <div className="absolute inset-3 border-[10px] border-[#6B4F1D] rounded-md pointer-events-none z-[2]"
        style={{
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.4), inset 0 0 80px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.5)',
          borderImage: 'linear-gradient(135deg, #8B6914 0%, #6B4F1D 30%, #A07B28 50%, #6B4F1D 70%, #8B6914 100%) 1',
        }} />
      {/* Inner chalk tray shadow at bottom */}
      <div className="absolute bottom-3 left-3 right-3 h-6 bg-gradient-to-t from-[#5a3e14] to-transparent pointer-events-none rounded-b-md z-[2]" />

      {/* Layer 2 — Floating chalk symbols (medium parallax + scale) */}
      <div ref={setLayerRef(2)} className="absolute inset-0 z-[3] will-change-transform">
        <div className="absolute top-[15%] left-[8%] text-white/15 text-5xl select-none animate-[gentleFloat_4s_ease-in-out_infinite]">✿</div>
        <div className="absolute top-[10%] right-[10%] text-white/20 text-4xl select-none animate-[gentleFloat_5s_ease-in-out_infinite_0.5s]">★</div>
        <div className="absolute bottom-[20%] right-[12%] text-white/20 text-4xl select-none animate-[gentleFloat_3.5s_ease-in-out_infinite_1s]">♡</div>
        <div className="absolute top-[25%] left-[49%] text-white/15 text-6xl select-none animate-[gentleFloat_4.5s_ease-in-out_infinite_0.3s]">✿</div>
        <div className="absolute bottom-[25%] left-[10%] text-white/15 text-3xl select-none animate-[gentleFloat_5.5s_ease-in-out_infinite_0.8s]">☆</div>
        <div className="absolute top-[60%] right-[25%] text-white/10 text-5xl select-none animate-[gentleFloat_4s_ease-in-out_infinite_1.2s]">❀</div>
        <div className="absolute top-[70%] left-[30%] text-white/12 text-3xl select-none animate-[gentleFloat_3s_ease-in-out_infinite_0.6s]">✦</div>
        {/* Chalk-drawn underline decorations */}
        <svg className="absolute top-[45%] left-[10%] w-24 h-4 opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2,8 Q12,2 24,8 Q36,14 48,8 Q60,2 72,8 Q84,14 96,8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <svg className="absolute bottom-[35%] right-[8%] w-20 h-4 opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2,8 Q10,2 20,8 Q30,14 40,8 Q50,2 60,8 Q70,14 80,8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Layer 3 — Main content (medium-slow parallax) */}
      <div ref={setLayerRef(3)} className={`relative z-10 will-change-transform transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-[2px] bg-white/40" />
          <span className="text-white/50 font-[Caveat] text-2xl">Thank You</span>
          <div className="w-16 h-[2px] bg-white/40" />
        </div>

        <ChalkText
          text="Moumita Ma'am"
          className="font-[Caveat] text-6xl md:text-8xl text-white text-center font-bold leading-tight tracking-wide"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.1)' }}
        />

        <p className={`font-['Patrick_Hand'] text-xl md:text-2xl text-white/70 text-center mt-6 max-w-xl mx-auto leading-relaxed transition-all duration-1000 delay-[1500ms] ${visible ? 'opacity-100' : 'opacity-0'}`}>
          Our beloved Accounts teacher who made numbers feel like stories.
          <br />
          <span className="text-white/50 text-lg">Grade 11 & 12 &bull; OSEM, Morbi</span>
        </p>

        <div className="mt-10 flex justify-center">
          <div className="w-32 h-1 bg-white/20 rounded-full blur-sm" />
        </div>
      </div>

      {/* Layer 4 — "Scroll down" (fastest parallax — disappears quickly) */}
      <div ref={setLayerRef(4)} className={`relative z-10 mt-8 will-change-transform transition-opacity duration-1000 delay-[2000ms] ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <p className="font-['Patrick_Hand'] text-lg text-[#f5e6a3]/60 text-center animate-bounce">
          ↓ scroll down ↓
        </p>
      </div>
    </section>
  )
}
