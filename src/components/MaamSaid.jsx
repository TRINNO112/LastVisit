import { useEffect, useRef, useState } from 'react'
import ChalkboardTexture from './ChalkboardTexture'
import FloatingDust from './FloatingDust'

const dialogues = [
  {
    text: '"Kisi ko koi doubt hai?"',
    context: 'Every. Single. Class. Without fail.',
  },
  {
    text: '"Samajh aa raha hai sabko?"',
    context: 'She never moved on until everyone understood.',
  },
  {
    text: '"Yeh concept bahut important hai, dhyan se suno"',
    context: 'And she was always right — it would come in the exam.',
  },
  {
    text: '"Debit what comes in, credit what goes out"',
    context: 'The golden rule that she drilled into our heads.',
  },
  {
    text: '"Ek baar aur samjha deti hoon"',
    context: 'She never got tired of repeating things for us.',
  },
  {
    text: '"Yeh question exam mein zaroor aayega"',
    context: 'Spoiler: it always did.',
  },
]

function Dialogue({ item, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [typedCount, setTypedCount] = useState(0)
  const [typingDone, setTypingDone] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  // Typewriter effect
  useEffect(() => {
    if (!visible) return
    if (typedCount >= item.text.length) {
      setTypingDone(true)
      return
    }
    const timeout = setTimeout(() => {
      setTypedCount((c) => c + 1)
    }, 30)
    return () => clearTimeout(timeout)
  }, [visible, typedCount, item.text.length])

  return (
    <div
      ref={ref}
      className={`transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="relative bg-white/[0.04] border-l-4 border-white/30 rounded-r-lg p-6 hover:translate-y-[-4px] hover:border-white/50 hover:bg-white/[0.07] transition-all duration-300 overflow-hidden group">
        {/* Large decorative quote mark */}
        <span className="absolute top-2 left-3 font-[Caveat] text-7xl text-white/[0.06] leading-none select-none pointer-events-none">
          &ldquo;
        </span>

        {/* Diagonal chalk streak */}
        <div className="absolute top-0 right-0 w-[200%] h-[1px] bg-white/[0.04] rotate-[-15deg] origin-top-right pointer-events-none" />

        {/* Quote text with typewriter */}
        <p className="font-[Caveat] text-2xl text-white/90 font-bold leading-snug relative z-10 pl-2 min-h-[2em]">
          {visible ? item.text.slice(0, typedCount) : ''}
          {visible && !typingDone && (
            <span className="typing-cursor text-[#f5e6a3] ml-0.5">|</span>
          )}
        </p>

        {/* Context line - fades in after typing */}
        <p
          className={`font-['Patrick_Hand'] text-base text-[#f5e6a3]/60 mt-3 pl-4 italic transition-opacity duration-500 ${typingDone ? 'opacity-100' : 'opacity-0'}`}
        >
          — {item.context}
        </p>

        {/* Hover chalk dust */}
        <div className="absolute bottom-1 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-white/20" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function MaamSaid() {
  return (
    <section className="relative py-20 px-6 bg-[#1e4a1e]" style={{ background: 'linear-gradient(180deg, #1e4a1e 0%, #1a4219 50%, #1e4a1e 100%)' }}>
      <ChalkboardTexture />
      <FloatingDust count={20} />

      <div className="max-w-3xl mx-auto relative">
        <h2 className="font-[Caveat] text-4xl md:text-5xl text-white text-center font-bold mb-4"
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
          Things Ma'am Always Said
        </h2>
        <p className="font-['Patrick_Hand'] text-lg text-white/40 text-center mb-14">
          The lines we'll never forget ✎
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {dialogues.map((item, i) => (
            <Dialogue key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
