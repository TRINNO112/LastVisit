import { useEffect, useState } from 'react'

function getOrdinal(n) {
    const s = ['th', 'st', 'nd', 'rd']
    const v = n % 100
    return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export default function VisitCounter() {
    const [count, setCount] = useState(0)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        // Get current count
        const stored = parseInt(localStorage.getItem('lastvisit_count') || '0', 10)

        // Only increment once per session
        const alreadyCounted = sessionStorage.getItem('lastvisit_counted')
        let newCount = stored
        if (!alreadyCounted) {
            newCount = stored + 1
            localStorage.setItem('lastvisit_count', newCount.toString())
            sessionStorage.setItem('lastvisit_counted', 'true')
        }

        setCount(newCount)

        // Fade in after a short delay
        const timer = setTimeout(() => setVisible(true), 300)
        return () => clearTimeout(timer)
    }, [])

    if (count === 0) return null

    return (
        <div
            className={`text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
        >
            <p className="font-[Caveat] text-xl text-white/50">
                Ma'am, this is your{' '}
                <span className="text-[#f5e6a3] text-2xl font-bold">
                    {getOrdinal(count)}
                </span>{' '}
                visit to this page 💛
            </p>
            <p className="font-['Patrick_Hand'] text-sm text-white/25 mt-1">
                We're glad you came back
            </p>
        </div>
    )
}
