import { useEffect, useRef, useState } from 'react'
import ChalkboardTexture from './ChalkboardTexture'

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="bg-white/[0.06] border border-white/10 rounded-lg p-5 hover:bg-white/[0.09] transition-colors duration-300">
        <p className="font-[Caveat] text-2xl text-white/90 font-bold leading-snug">
          {item.text}
        </p>
        <p className="font-['Patrick_Hand'] text-base text-[#f5e6a3]/60 mt-2">
          — {item.context}
        </p>
      </div>
    </div>
  )
}

export default function MaamSaid() {
  return (
    <section className="relative py-20 px-6 bg-[#1e4a1e]" style={{ background: 'linear-gradient(180deg, #1e4a1e 0%, #1a4219 50%, #1e4a1e 100%)' }}>
      <ChalkboardTexture />

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
