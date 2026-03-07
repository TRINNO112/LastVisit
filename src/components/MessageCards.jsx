import { useCallback, useEffect, useRef, useState } from 'react'
import ChalkboardTexture from './ChalkboardTexture'
import FloatingDust from './FloatingDust'

const messages = [
  {
    name: 'Sufiyan',
    emoji: '🎮',
    message: "Ma'am kaash aap humare sath akhri baar ludo khel pati !\nMa'am aap jab saap se kat jaati hain toh gir jaati hain, so never give up.",
  },
  {
    name: 'Ashish',
    emoji: '📈',
    message: "Dear Maumita Mam,\nAap sirf ek Accounts teacher nahi, balki ek amazing mentor ho. Aapki explanation se har tough concept bhi easy lagta tha. Class me meri thodi masti bhi chalti thi, par aapne hamesha support kiya. Aap ja rahi ho par aapki classes aur teachings hamesha yaad rahengi. We will miss you. 😊",
  },
  {
    name: 'Yuvraj',
    emoji: '📖',
    message: "Ma'am,\nToday, as we look back, we feel incredibly fortunate to have learned Accounts from you. You did not just teach us the subject; you made us fall in love with it.",
  },
]

function Card({ data, index }) {
  const ref = useRef(null)
  const cardRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const x = (e.clientX - cx) / (rect.width / 2)
    const y = (e.clientY - cy) / (rect.height / 2)
    setTilt({ x: y * -8, y: x * 8 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
  }, [])

  const rotations = [-2, 1.5, -1, 2, -1.5]
  const rotation = rotations[index % rotations.length]

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${index * 150}ms`, perspective: '800px' }}
    >
      <div
        ref={cardRef}
        className="bg-[#3a6b35] border-2 border-white/15 rounded-lg p-6 shadow-lg relative transition-all duration-200 cursor-default"
        style={{
          transform: `rotate(${rotation}deg) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
          boxShadow: tilt.x || tilt.y
            ? `${tilt.y * -2}px ${tilt.x * 2}px 20px rgba(0,0,0,0.3)`
            : '0 10px 15px -3px rgba(0,0,0,0.1)',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Pin */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-400 rounded-full border-2 border-red-600 shadow-md" />

        {/* Emoji */}
        <div className="text-3xl mb-3">{data.emoji}</div>

        {/* Message */}
        <p className="font-['Patrick_Hand'] text-lg text-white/80 leading-relaxed mb-4">
          "{data.message}"
        </p>

        {/* Name */}
        <div className="flex items-center gap-2 border-t border-white/10 pt-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm text-white/60 font-[Caveat]">
            {data.name.charAt(0)}
          </div>
          <span className="font-[Caveat] text-xl text-[#f5e6a3]">— {data.name}</span>
        </div>
      </div>
    </div>
  )
}

export default function MessageCards() {
  return (
    <section className="relative py-20 px-6 bg-[#2d5a27]">
      <ChalkboardTexture />
      <FloatingDust count={20} />

      <div className="max-w-5xl mx-auto relative">
        <h2 className="font-[Caveat] text-4xl md:text-5xl text-white text-center font-bold mb-4"
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
          Messages from Your Students
        </h2>
        <p className="font-['Patrick_Hand'] text-lg text-white/50 text-center mb-14">
          Words straight from the heart, written in chalk ✎
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {messages.map((msg, i) => (
            <Card key={i} data={msg} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
