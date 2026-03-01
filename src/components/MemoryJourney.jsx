import { useEffect, useRef, useState } from 'react'

const memories = [
  {
    icon: '📚',
    title: 'The First Impression',
    text: 'When Ma\'am Momita first walked into our Grade 11 classroom at OSEM, it was honestly a bit strange. Her teaching style was completely different from what we were used to. We didn\'t really know what to make of it at first.',
  },
  {
    icon: '💡',
    title: 'Slowly, It All Clicked',
    text: 'But as days went by, we started adapting. She didn\'t just teach us what to write — she explained why things worked the way they did. Why journal entries happen, why debits and credits exist, the logic behind every concept. It all started making sense.',
  },
  {
    icon: '✏️',
    title: 'Concepts, Not Just Answers',
    text: 'She introduced us to various types of questions and concepts we\'d never encountered before. It wasn\'t about memorizing — it was about truly understanding. She made sure we knew the reasoning behind every single entry.',
  },
  {
    icon: '🌟',
    title: 'Stories That Inspired Us',
    text: 'She would often share stories from her own life — how she got to where she is, the challenges she faced. These stories truly inspired us, because we couldn\'t imagine achieving what she did at such a young age.',
  },
  {
    icon: '🤝',
    title: 'A Teacher Who Truly Cared',
    text: 'She always asked every single student about their doubts — nobody was left behind. She listened to our grievances and played a vital support role, not just as a teacher, but as someone who genuinely cared about each one of us.',
  },
  {
    icon: '🏢',
    title: 'Grade 12 — Company Accounts',
    text: 'As we entered Grade 12, she took us through Company Accounts — the very first chapter of the NCERT. Even the complex stuff felt manageable with her guidance.',
  },
  {
    icon: '🚂',
    title: 'Heading Back to Kolkata',
    text: 'And now, she\'s heading back home to Kolkata where she originally belongs. OSEM is losing one of its best teachers. But wherever she goes, she\'ll always be our Ma\'am.',
  },
]

function MemoryItem({ memory, index }) {
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
    <div ref={ref} className={`flex gap-6 items-start transition-all duration-700 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
      style={{ transitionDelay: `${index * 100}ms` }}>
      {/* Timeline dot */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center text-2xl">
          {memory.icon}
        </div>
        {index < memories.length - 1 && (
          <div className="w-[2px] h-16 bg-white/20 mt-2" />
        )}
      </div>

      {/* Content */}
      <div className="pb-10">
        <h3 className="font-[Caveat] text-2xl text-[#f5e6a3] font-bold">{memory.title}</h3>
        <p className="font-['Patrick_Hand'] text-lg text-white/70 mt-1 leading-relaxed">{memory.text}</p>
      </div>
    </div>
  )
}

export default function MemoryJourney() {
  return (
    <section className="relative py-20 px-6 bg-[#1e4a1e]">
      {/* Subtle chalk texture */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[length:20px_20px]" />

      <div className="max-w-2xl mx-auto relative">
        <h2 className="font-[Caveat] text-4xl md:text-5xl text-white text-center font-bold mb-4"
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
          Our Journey Together
        </h2>
        <div className="w-24 h-[2px] bg-white/30 mx-auto mb-14" />

        {memories.map((memory, i) => (
          <MemoryItem key={i} memory={memory} index={i} />
        ))}
      </div>
    </section>
  )
}
