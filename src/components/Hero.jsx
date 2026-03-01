import { useEffect, useState } from 'react'
import FloatingDust from './FloatingDust'
import ChalkDoodles from './ChalkDoodles'
import useParallax from '../hooks/useParallax'

function ChalkboardTexture() {
  return (
    <>
      {/* Base grain texture */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <filter id="chalkNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#chalkNoise)" opacity="0.12" />
      </svg>
      {/* Chalk dust specks */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 60 }).map((_, i) => (
          <circle
            key={i}
            cx={`${Math.random() * 100}%`}
            cy={`${Math.random() * 100}%`}
            r={Math.random() * 2 + 0.5}
            fill="white"
          />
        ))}
      </svg>
      {/* Subtle eraser smudges */}
      <div className="absolute top-[20%] left-[10%] w-40 h-8 bg-white/[0.02] rounded-full blur-md rotate-[-5deg]" />
      <div className="absolute top-[60%] right-[15%] w-32 h-6 bg-white/[0.02] rounded-full blur-md rotate-[3deg]" />
      <div className="absolute bottom-[30%] left-[40%] w-48 h-6 bg-white/[0.015] rounded-full blur-lg rotate-[-2deg]" />
      {/* Faint chalk line scratches */}
      <div className="absolute top-[15%] left-0 right-0 h-[1px] bg-white/[0.03]" />
      <div className="absolute top-[45%] left-[5%] right-[10%] h-[1px] bg-white/[0.02] rotate-[0.5deg]" />
      <div className="absolute top-[75%] left-[8%] right-[5%] h-[1px] bg-white/[0.025]" />
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
  const { ref: parallaxRef, offset } = useParallax(0.12)

  useEffect(() => {
    setTimeout(() => setVisible(true), 200)
  }, [])

  return (
    <section ref={parallaxRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-[#2d5a27]"
      style={{ background: 'linear-gradient(145deg, #2d5a27 0%, #1e4a1e 30%, #2a5525 60%, #234d20 100%)' }}>
      <ChalkboardTexture />
      <FloatingDust count={30} />
      <ChalkDoodles indices={[0, 1, 4]} />

      {/* Wooden frame border with inner shadow */}
      <div className="absolute inset-3 border-[10px] border-[#6B4F1D] rounded-md pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.4), inset 0 0 80px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.5)',
          borderImage: 'linear-gradient(135deg, #8B6914 0%, #6B4F1D 30%, #A07B28 50%, #6B4F1D 70%, #8B6914 100%) 1',
        }} />
      {/* Inner chalk tray shadow at bottom */}
      <div className="absolute bottom-3 left-3 right-3 h-6 bg-gradient-to-t from-[#5a3e14] to-transparent pointer-events-none rounded-b-md" />

      {/* Chalk illustrations with parallax */}
      <div style={{ transform: `translateY(${offset}px)` }}>
        <div className="absolute top-8 left-10 text-white/20 text-6xl select-none">✿</div>
        <div className="absolute top-12 right-14 text-white/20 text-4xl select-none">★</div>
        <div className="absolute bottom-20 left-16 text-white/15 text-5xl select-none">📖</div>
        <div className="absolute bottom-16 right-12 text-white/20 text-4xl select-none">♡</div>
      </div>

      <div className={`relative z-10 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-[2px] bg-white/40" />
          <span className="text-white/50 font-[Caveat] text-2xl">Thank You</span>
          <div className="w-16 h-[2px] bg-white/40" />
        </div>

        <ChalkText
          text="Momita Ma'am"
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

        <p className={`font-['Patrick_Hand'] text-lg text-[#f5e6a3]/60 text-center mt-8 animate-bounce transition-opacity duration-1000 delay-[2000ms] ${visible ? 'opacity-100' : 'opacity-0'}`}>
          ↓ scroll down ↓
        </p>
      </div>
    </section>
  )
}
