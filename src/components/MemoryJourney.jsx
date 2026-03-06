import { useEffect, useRef, useState } from 'react'
import ChalkboardTexture from './ChalkboardTexture'
import FloatingDust from './FloatingDust'
import ChalkDoodles from './ChalkDoodles'

const memories = [
  {
    icon: '📚',
    title: 'The First Impression',
    text: 'When Ma\'am Moumita first walked into our Grade 11 classroom at OSEM, it was honestly a bit strange. Her teaching style was completely different from what we were used to. We didn\'t really know what to make of it at first.',
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
  const isEven = index % 2 === 0

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.4 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`relative w-full flex flex-row justify-between items-center mb-16 md:mb-24 transition-all duration-1000 ease-[cubic-bezier(0.17,0.67,0.3,1.3)] ${visible
        ? 'opacity-100 scale-100 translate-x-0'
        : `opacity-0 scale-95 ${isEven ? '-translate-x-4 md:-translate-x-12' : 'translate-x-4 md:-translate-x-12'}`
        }`}
    >
      {/* Left Content (Desktop Only for Even) */}
      <div className={`hidden md:block w-[45%] ${isEven ? 'text-right' : 'opacity-0'}`}>
        {isEven && (
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-colors hover:bg-white/10">
            <h3 className="font-[Caveat] text-3xl text-[#f5e6a3] font-bold mb-2">{memory.title}</h3>
            <p className="font-['Patrick_Hand'] text-xl text-white/80 leading-relaxed">{memory.text}</p>
          </div>
        )}
      </div>

      {/* Timeline dot (Left on mobile, Center on desktop) */}
      <div className="absolute left-[38px] md:left-1/2 -translate-x-1/2 z-10 flex justify-center">
        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#1e4a1e] border-2 border-white/40 flex items-center justify-center text-xl md:text-3xl shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-transform duration-700 delay-300 ${visible ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}`}>
          {memory.icon}
        </div>
      </div>

      {/* Right Content (Desktop for Odd + All Mobile Content) */}
      <div className={`w-full pl-[88px] pr-4 md:px-0 md:w-[45%] ${isEven ? 'md:hidden' : 'md:text-left'}`}>
        <div className="bg-white/5 p-5 md:p-6 rounded-2xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-colors hover:bg-white/10">
          <h3 className="font-[Caveat] text-2xl md:text-3xl text-[#f5e6a3] font-bold mb-2">{memory.title}</h3>
          <p className="font-['Patrick_Hand'] text-lg md:text-xl text-white/80 leading-relaxed">{memory.text}</p>
        </div>
      </div>
    </div>
  )
}

export default function MemoryJourney() {
  const containerRef = useRef(null)
  const lineDesktopRef = useRef(null)
  const lineMobileRef = useRef(null)
  const rafRef = useRef(null)
  const targetProgress = useRef(0)
  const currentProgress = useRef(0)

  const [pathLengths, setPathLengths] = useState({ desktop: 2000, mobile: 2200 })

  useEffect(() => {
    // Measure actual path lengths on mount/resize for accurate drawing
    const measurePaths = () => {
      setPathLengths({
        desktop: lineDesktopRef.current?.getTotalLength() || 2000,
        mobile: lineMobileRef.current?.getTotalLength() || 2200
      })
    }

    measurePaths()
    window.addEventListener('resize', measurePaths)

    const updateLine = () => {
      currentProgress.current += (targetProgress.current - currentProgress.current) * 0.15 // Slightly snappier

      if (lineDesktopRef.current) {
        lineDesktopRef.current.style.strokeDashoffset = Math.max(0, pathLengths.desktop - (currentProgress.current * pathLengths.desktop))
      }
      if (lineMobileRef.current) {
        lineMobileRef.current.style.strokeDashoffset = Math.max(0, pathLengths.mobile - (currentProgress.current * pathLengths.mobile))
      }

      rafRef.current = requestAnimationFrame(updateLine)
    }

    const handleScroll = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()

      // Calculate scroll progress locally within the section
      // Start drawing as soon as the section header is visible
      const sectionStart = rect.top - window.innerHeight * 0.5
      const sectionHeight = rect.height

      // We want to finish drawing when the user is only 60% of the way through the section
      // This ensures the line is ALWAYS ahead of them and hits the final icon early.
      const drawFinishPoint = sectionHeight * 0.6
      const currentScroll = -rect.top + window.innerHeight * 0.8

      let progress = currentScroll / drawFinishPoint

      if (progress < 0) progress = 0
      if (progress > 1) progress = 1

      targetProgress.current = progress
    }

    rafRef.current = requestAnimationFrame(updateLine)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('resize', measurePaths)
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [pathLengths])

  return (
    <section ref={containerRef} className="relative py-20 px-6 bg-[#1e4a1e] overflow-hidden" style={{ background: 'linear-gradient(180deg, #1e4a1e 0%, #234d20 50%, #1e4a1e 100%)' }}>
      <ChalkboardTexture />
      <FloatingDust count={20} />
      <ChalkDoodles indices={[2, 3, 5]} />

      <div className="max-w-4xl mx-auto relative">
        <h2 className="font-[Caveat] text-5xl md:text-6xl text-white text-center font-bold mb-6"
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
          Our Journey Together
        </h2>
        <div className="w-32 h-[3px] bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mb-20 md:mb-32" />

        {/* Winding Chalk SVG Line Down the Middle (Desktop) / Left (Mobile) */}
        <div className="absolute top-40 bottom-0 left-[38px] md:left-1/2 md:-translate-x-1/2 md:w-40 w-10 pointer-events-none" style={{ zIndex: 0 }}>
          <svg className="w-full relative drop-shadow-[0_0_5px_rgba(255,255,255,0.4)] overflow-visible" preserveAspectRatio="xMidYMin slice" style={{ height: 'calc(100% - 10px)' }}>
            <path
              ref={lineMobileRef}
              className="md:hidden"
              d="M 6 0 L 6 2200"
              fill="none" stroke="url(#chalkGradient)" strokeWidth="3" strokeLinecap="round"
              style={{
                strokeDasharray: pathLengths.mobile,
                strokeDashoffset: pathLengths.mobile
              }}
            />
            <path
              ref={lineDesktopRef}
              className="hidden md:block"
              d={`M 80 0 C 120 100, 40 200, 80 300 C 120 400, 40 500, 80 600 C 120 700, 40 800, 80 900 C 120 1000, 40 1100, 80 1200 C 120 1300, 40 1400, 80 1500 C 120 1600, 40 1700, 80 1800 C 120 1900, 40 2000, 80 2100`}
              fill="none" stroke="url(#chalkGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
              style={{
                strokeDasharray: pathLengths.desktop,
                strokeDashoffset: pathLengths.desktop
              }}
            />
            <defs>
              <linearGradient id="chalkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.5)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-10">
          {memories.map((memory, i) => (
            <MemoryItem key={i} memory={memory} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
