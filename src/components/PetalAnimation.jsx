import { useEffect, useState } from 'react'

// SVG petal shapes — soft, organic curves
const petalPaths = [
    // Teardrop petal
    'M0 0 C4 -6, 8 -14, 5 -22 C3 -18, 1 -10, 0 0 Z',
    // Round petal
    'M0 0 C6 -4, 10 -12, 6 -20 C2 -16, -2 -8, 0 0 Z',
    // Elongated petal
    'M0 0 C3 -8, 6 -18, 4 -26 C2 -20, 0 -10, 0 0 Z',
    // Wide petal
    'M0 0 C8 -5, 12 -10, 7 -18 C3 -14, -1 -7, 0 0 Z',
]

// Soft colors that complement the chalkboard green
const petalColors = [
    '#f8b4c8', // soft pink
    '#f5c6d0', // lighter pink
    '#fcd4a8', // warm peach
    '#f5e6a3', // golden (matches existing accent)
    '#e8c4d8', // mauve pink
    '#fdd5b1', // apricot
]

function Petal({ index, total }) {
    const path = petalPaths[index % petalPaths.length]
    const color = petalColors[index % petalColors.length]

    // Randomized properties for natural movement
    const startLeft = Math.random() * 100                    // horizontal start (%)
    const delay = Math.random() * 3                          // stagger start (s)
    const duration = 5 + Math.random() * 4                   // fall duration (s)
    const swayAmount = 40 + Math.random() * 60               // horizontal sway (px)
    const rotationSpeed = 2 + Math.random() * 4              // rotation duration (s)
    const scale = 0.6 + Math.random() * 0.6                  // size variation
    const opacity = 0.5 + Math.random() * 0.4                // opacity variation
    const swayDirection = Math.random() > 0.5 ? 1 : -1

    return (
        <div
            className="absolute pointer-events-none"
            style={{
                left: `${startLeft}%`,
                top: '-30px',
                animationName: 'petalFall',
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                animationTimingFunction: 'ease-in',
                animationFillMode: 'forwards',
                opacity: 0,
            }}
        >
            <div
                style={{
                    animationName: 'petalSway',
                    animationDuration: `${1.5 + Math.random() * 2}s`,
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                    animationDirection: 'alternate',
                    '--sway-amount': `${swayAmount * swayDirection}px`,
                }}
            >
                <svg
                    width="24"
                    height="32"
                    viewBox="-5 -28 20 32"
                    style={{
                        transform: `scale(${scale}) rotate(${Math.random() * 360}deg)`,
                        animationName: 'petalSpin',
                        animationDuration: `${rotationSpeed}s`,
                        animationTimingFunction: 'linear',
                        animationIterationCount: 'infinite',
                        filter: `blur(${Math.random() > 0.7 ? 1 : 0}px)`,
                    }}
                >
                    <path
                        d={path}
                        fill={color}
                        opacity={opacity}
                    />
                </svg>
            </div>
        </div>
    )
}

export default function PetalAnimation() {
    const [show, setShow] = useState(true)
    const petalCount = 32

    // Fade out the entire container after all petals have fallen
    useEffect(() => {
        const timer = setTimeout(() => setShow(false), 10000)
        return () => clearTimeout(timer)
    }, [])

    if (!show) return null

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
            {Array.from({ length: petalCount }).map((_, i) => (
                <Petal key={i} index={i} total={petalCount} />
            ))}
        </div>
    )
}
