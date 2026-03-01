import { useEffect, useState } from 'react'

const chalkDust = () => (
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

export default function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 200)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-[#2d5a27]">
      {chalkDust()}

      {/* Chalkboard border */}
      <div className="absolute inset-4 border-8 border-[#8B6914] rounded-lg shadow-[inset_0_0_30px_rgba(0,0,0,0.3)] pointer-events-none" />

      {/* Chalk illustrations */}
      <div className="absolute top-8 left-10 text-white/20 text-6xl">✿</div>
      <div className="absolute top-12 right-14 text-white/20 text-4xl">★</div>
      <div className="absolute bottom-16 left-16 text-white/15 text-5xl">📖</div>
      <div className="absolute bottom-12 right-12 text-white/20 text-4xl">♡</div>

      <div className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Chalk-style divider */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-[2px] bg-white/40" />
          <span className="text-white/50 font-[Caveat] text-2xl">Thank You</span>
          <div className="w-16 h-[2px] bg-white/40" />
        </div>

        <h1 className="font-[Caveat] text-6xl md:text-8xl text-white text-center font-bold leading-tight tracking-wide"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.1)' }}>
          Momita Ghosh
        </h1>

        <p className="font-['Patrick_Hand'] text-xl md:text-2xl text-white/70 text-center mt-6 max-w-xl mx-auto leading-relaxed">
          Our beloved Accounts teacher who made numbers feel like stories.
          <br />
          <span className="text-white/50 text-lg">Grade 11 &bull; Morbi, Gujarat</span>
        </p>

        {/* Chalk eraser smudge effect */}
        <div className="mt-10 flex justify-center">
          <div className="w-32 h-1 bg-white/20 rounded-full blur-sm" />
        </div>

        <p className="font-['Patrick_Hand'] text-lg text-[#f5e6a3]/60 text-center mt-8 animate-bounce">
          ↓ scroll down ↓
        </p>
      </div>
    </section>
  )
}
