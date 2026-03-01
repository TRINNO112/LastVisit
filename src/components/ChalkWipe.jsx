import { useEffect, useRef, useState } from 'react'

export default function ChalkWipe() {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProgress(1)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="relative h-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.15), transparent)' }}>
      {/* Chalk dust line */}
      <div
        className="absolute top-1/2 left-0 h-[2px] bg-white/20 transition-all duration-1000 ease-out"
        style={{ width: progress ? '100%' : '0%' }}
      />

      {/* Chalk dust particles along the wipe */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 20 }).map((_, i) => (
          <circle
            key={i}
            cx={`${(i / 20) * 100}%`}
            cy={`${45 + (Math.random() - 0.5) * 30}%`}
            r={Math.random() * 2 + 0.5}
            fill="white"
            className="transition-opacity duration-700"
            style={{
              opacity: progress ? 0.15 : 0,
              transitionDelay: `${i * 50}ms`,
            }}
          />
        ))}
      </svg>

      {/* Eraser smudge */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-12 bg-white/[0.03] rounded-full blur-lg transition-all duration-[1500ms] ease-out"
        style={{
          left: progress ? '0%' : '-10%',
          width: progress ? '100%' : '0%',
        }}
      />
    </div>
  )
}
