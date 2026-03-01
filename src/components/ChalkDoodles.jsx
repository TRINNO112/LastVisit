import { useEffect, useRef, useState } from 'react'

const doodles = [
  // Star
  { path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', viewBox: '0 0 24 24', size: 32 },
  // Heart
  { path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z', viewBox: '0 0 24 24', size: 28 },
  // Music note
  { path: 'M12 3v10.55A4 4 0 1014 17V7h4V3h-6z', viewBox: '0 0 24 24', size: 26 },
  // Plus/cross
  { path: 'M12 5v14M5 12h14', viewBox: '0 0 24 24', size: 22 },
  // Spiral
  { path: 'M12 12c0-1.1.9-2 2-2s2 .9 2 2-.9 3-3 3-4-.9-4-3 .9-5 4-5 6 .9 6 5-.9 7-6 7', viewBox: '0 0 24 24', size: 30 },
  // Triangle
  { path: 'M12 3L2 21h20L12 3z', viewBox: '0 0 24 24', size: 24 },
]

const positions = [
  { top: '8%', left: '3%' },
  { top: '15%', right: '4%' },
  { bottom: '20%', left: '5%' },
  { bottom: '12%', right: '3%' },
  { top: '45%', left: '2%' },
  { top: '55%', right: '2%' },
]

export default function ChalkDoodles({ indices = [0, 1, 2] }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden">
      {indices.map((doodleIndex, i) => {
        const d = doodles[doodleIndex % doodles.length]
        const pos = positions[i % positions.length]
        return (
          <svg
            key={i}
            className="absolute chalk-doodle"
            style={{
              ...pos,
              width: d.size,
              height: d.size,
              animationDelay: `${i * 0.4}s`,
              opacity: visible ? 1 : 0,
            }}
            viewBox={d.viewBox}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={d.path}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={visible ? 'chalk-doodle-draw' : ''}
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          </svg>
        )
      })}
    </div>
  )
}
