import { useEffect, useRef, useState } from 'react'

const memories = [
  {
    icon: '📚',
    title: 'The Beginning',
    text: 'When Ma\'am Momita first walked into our Grade 11 classroom in Morbi and made accounting feel less scary.',
  },
  {
    icon: '✏️',
    title: 'Accounts Made Simple',
    text: 'Those journal entries, balance sheets, and trial balances — she turned the toughest chapters into our favorites.',
  },
  {
    icon: '😂',
    title: 'The Fun Moments',
    text: 'The times she cracked jokes between debits and credits, making sure nobody ever dozed off in class.',
  },
  {
    icon: '💛',
    title: 'A Teacher Who Cared',
    text: 'She never just taught from the book. She made sure every single one of us understood — no student left behind.',
  },
  {
    icon: '🚂',
    title: 'Heading Back to Kolkata',
    text: 'As Grade 12 begins, Ma\'am heads home to Kolkata. Morbi will miss her, but Kolkata is lucky to have her back.',
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
