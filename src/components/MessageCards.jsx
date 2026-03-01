import { useEffect, useRef, useState } from 'react'

const messages = [
  {
    name: 'Student 1',
    emoji: '💛',
    message: 'Ma\'am, you made accounts my favourite subject. I\'ll never forget how patiently you explained everything. Thank you for believing in us!',
  },
  {
    name: 'Student 2',
    emoji: '🌟',
    message: 'From balance sheets to life lessons, you taught us so much more than just a subject. Morbi won\'t be the same without you, Ma\'am.',
  },
  {
    name: 'Student 3',
    emoji: '📝',
    message: 'I used to hate numbers until you made them make sense. Thank you for every extra class and every patient explanation, Ma\'am.',
  },
  {
    name: 'Student 4',
    emoji: '🎓',
    message: 'You didn\'t just teach us accounts — you taught us discipline, hard work, and how to never give up. We\'ll miss you so much!',
  },
  {
    name: 'Student 5',
    emoji: '🌻',
    message: 'Kolkata is getting back one of the best teachers in the world. Thank you for everything, Ma\'am. Grade 11 was special because of you.',
  },
]

function Card({ data, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  // Slight random rotation for a pinned-note feel
  const rotations = [-2, 1.5, -1, 2, -1.5]
  const rotation = rotations[index % rotations.length]

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div
        className="bg-[#3a6b35] border-2 border-white/15 rounded-lg p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 relative"
        style={{ transform: `rotate(${rotation}deg)` }}
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
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[length:25px_25px]" />

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
