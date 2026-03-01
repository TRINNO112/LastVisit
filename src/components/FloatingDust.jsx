import { useMemo } from 'react'

export default function FloatingDust({ count = 25 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 2 + 2,
      opacity: Math.random() * 0.15 + 0.1,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * -20,
      sway: Math.random() * 40 + 20,
    })),
    [count]
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white floating-dust"
          style={{
            left: `${p.left}%`,
            bottom: `-${p.size}px`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            '--sway': `${p.sway}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
