import { useEffect, useState } from 'react'

const ChalkDust = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" xmlns="http://www.w3.org/2000/svg">
    {Array.from({ length: 30 }).map((_, i) => (
      <circle
        key={i}
        cx={`${Math.random() * 100}%`}
        cy={`${Math.random() * 100}%`}
        r={Math.random() * 2 + 0.5}
        fill="white"
      />
    ))}
  </svg>
)

function ChalkText({ text, className, style }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [dustParticles, setDustParticles] = useState([])

  useEffect(() => {
    if (visibleCount >= text.length) return
    const timeout = setTimeout(() => {
      setVisibleCount((c) => c + 1)
      // Spawn chalk dust particles at the current letter
      setDustParticles((prev) => [
        ...prev.slice(-15), // keep last 15
        ...Array.from({ length: 3 }).map((_, i) => ({
          id: Date.now() + i,
          x: (visibleCount / text.length) * 100,
          offsetX: (Math.random() - 0.5) * 30,
          offsetY: -(Math.random() * 40 + 10),
          size: Math.random() * 3 + 1,
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
      {/* Chalk dust particles */}
      {dustParticles.map((p) => (
        <div
          key={p.id}
          className="absolute w-1 h-1 bg-white/40 rounded-full animate-[fadeUp_0.8s_ease-out_forwards]"
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

  useEffect(() => {
    setTimeout(() => setVisible(true), 200)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-[#2d5a27]">
      <ChalkDust />

      {/* Chalkboard border */}
      <div className="absolute inset-4 border-8 border-[#8B6914] rounded-lg shadow-[inset_0_0_30px_rgba(0,0,0,0.3)] pointer-events-none" />

      {/* Chalk illustrations */}
      <div className="absolute top-8 left-10 text-white/20 text-6xl select-none">✿</div>
      <div className="absolute top-12 right-14 text-white/20 text-4xl select-none">★</div>
      <div className="absolute bottom-16 left-16 text-white/15 text-5xl select-none">📖</div>
      <div className="absolute bottom-12 right-12 text-white/20 text-4xl select-none">♡</div>

      <div className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Chalk-style divider */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-[2px] bg-white/40" />
          <span className="text-white/50 font-[Caveat] text-2xl">Thank You</span>
          <div className="w-16 h-[2px] bg-white/40" />
        </div>

        <ChalkText
          text="Momita Ghosh"
          className="font-[Caveat] text-6xl md:text-8xl text-white text-center font-bold leading-tight tracking-wide"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.1)' }}
        />

        <p className={`font-['Patrick_Hand'] text-xl md:text-2xl text-white/70 text-center mt-6 max-w-xl mx-auto leading-relaxed transition-all duration-1000 delay-[1500ms] ${visible ? 'opacity-100' : 'opacity-0'}`}>
          Our beloved Accounts teacher who made numbers feel like stories.
          <br />
          <span className="text-white/50 text-lg">Grade 11 & 12 &bull; Morbi, Gujarat</span>
        </p>

        {/* Chalk eraser smudge effect */}
        <div className="mt-10 flex justify-center">
          <div className="w-32 h-1 bg-white/20 rounded-full blur-sm" />
        </div>

        <p className={`font-['Patrick_Hand'] text-lg text-[#f5e6a3]/60 text-center mt-8 animate-bounce transition-opacity duration-1000 delay-[2000ms] ${visible ? 'opacity-100' : 'opacity-0'}`}>
          ↓ scroll down ↓
        </p>
      </div>

      {/* Keyframe for chalk dust */}
      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0.8; transform: translate(0, 0); }
          100% { opacity: 0; transform: translate(var(--dx), var(--dy)); }
        }
      `}</style>
    </section>
  )
}
