import { useEffect, useRef, useState } from 'react'

export default function FarewellQuote() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative py-24 px-6 bg-[#1e4a1e]">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[length:20px_20px]" />

      <div
        ref={ref}
        className={`max-w-3xl mx-auto text-center relative transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Decorative chalk lines */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-20 h-[1px] bg-white/30" />
          <span className="text-white/30 text-2xl">✦</span>
          <div className="w-20 h-[1px] bg-white/30" />
        </div>

        <blockquote className="font-[Caveat] text-3xl md:text-4xl text-white/90 leading-relaxed font-bold"
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
          "A good teacher can inspire hope, ignite the imagination, and instill a love of learning."
        </blockquote>

        <p className="font-['Patrick_Hand'] text-xl text-white/40 mt-6">— Brad Henry</p>

        <div className="mt-14 space-y-3">
          <p className="font-[Caveat] text-2xl text-[#f5e6a3]">
            We will miss you, Momita Ma'am 💛
          </p>
          <p className="font-['Patrick_Hand'] text-lg text-white/40">
            From your students in Morbi, with love — to Kolkata, with pride.
          </p>
        </div>

        {/* Decorative chalk lines */}
        <div className="flex items-center justify-center gap-4 mt-14">
          <div className="w-20 h-[1px] bg-white/30" />
          <span className="text-white/30 text-2xl">✦</span>
          <div className="w-20 h-[1px] bg-white/30" />
        </div>

        <p className="font-['Patrick_Hand'] text-sm text-white/20 mt-10">
          Made with ♡ by her students
        </p>
      </div>
    </section>
  )
}
