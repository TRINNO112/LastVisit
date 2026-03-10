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

function Petal({ index }) {
    const path = petalPaths[index % petalPaths.length]
    const color = petalColors[index % petalColors.length]

    // Randomized properties for natural movement
    const [props] = useState(() => ({
        startLeft: Math.random() * 100,                    // horizontal start (%)
        delay: Math.random() * 3,                          // stagger start (s)
        duration: 5 + Math.random() * 4,                   // fall duration (s)
        swayAmount: 40 + Math.random() * 60,               // horizontal sway (px)
        rotationSpeed: 2 + Math.random() * 4,              // rotation duration (s)
        scale: 0.6 + Math.random() * 0.6,                  // size variation
        opacity: 0.5 + Math.random() * 0.4,                // opacity variation
        swayDirection: Math.random() > 0.5 ? 1 : -1,
        swayDuration: 1.5 + Math.random() * 2,             // sway duration (s)
        startRotation: Math.random() * 360,                // initial rotation (deg)
        blur: Math.random() > 0.7 ? 1 : 0                  // randomly blurred
    }))
    return (
        <div
            className="absolute pointer-events-none"
            style={{
                left: `${props.startLeft}%`,
                top: '-30px',
                animationName: 'petalFall',
                animationDuration: `${props.duration}s`,
                animationDelay: `${props.delay}s`,
                animationTimingFunction: 'ease-in',
                animationFillMode: 'forwards',
                opacity: 0,
            }}
        >
            <div
                style={{
                    animationName: 'petalSway',
                    animationDuration: `${props.swayDuration}s`,
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                    animationDirection: 'alternate',
                    '--sway-amount': `${props.swayAmount * props.swayDirection}px`,
                }}
            >
                <svg
                    width="24"
                    height="32"
                    viewBox="-5 -28 20 32"
                    style={{
                        transform: `scale(${props.scale}) rotate(${props.startRotation}deg)`,
                        animationName: 'petalSpin',
                        animationDuration: `${props.rotationSpeed}s`,
                        animationTimingFunction: 'linear',
                        animationIterationCount: 'infinite',
                        filter: `blur(${props.blur}px)`,
                    }}
                >
                    <path
                        d={path}
                        fill={color}
                        opacity={props.opacity}
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
                <Petal key={i} index={i} />
            ))}
        </div>
    )
}
