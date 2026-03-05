import { useEffect, useState } from 'react'

export default function PageLoader({ onLoaded }) {
    const [progress, setProgress] = useState(0)
    const [fadeOut, setFadeOut] = useState(false)

    useEffect(() => {
        let cancelled = false

        async function waitForEverything() {
            // Step 1: Wait for DOM content
            setProgress(20)

            // Step 2: Wait for fonts to load
            try {
                await document.fonts.ready
            } catch {
                // fonts API not supported, continue
            }
            if (cancelled) return
            setProgress(50)

            // Step 3: Wait for all images and media
            const mediaElements = document.querySelectorAll('img, video, audio')
            const mediaPromises = Array.from(mediaElements).map(el => {
                if (el.complete || el.readyState >= 2) return Promise.resolve()
                return new Promise(resolve => {
                    el.addEventListener('loadeddata', resolve, { once: true })
                    el.addEventListener('load', resolve, { once: true })
                    el.addEventListener('error', resolve, { once: true })
                    // Timeout fallback
                    setTimeout(resolve, 3000)
                })
            })
            await Promise.all(mediaPromises)
            if (cancelled) return
            setProgress(80)

            // Step 4: Small delay for CSS/layout rendering
            await new Promise(r => setTimeout(r, 300))
            if (cancelled) return
            setProgress(100)

            // Step 5: Fade out
            await new Promise(r => setTimeout(r, 400))
            if (cancelled) return
            setFadeOut(true)

            // Step 6: Remove loader after animation
            await new Promise(r => setTimeout(r, 800))
            if (cancelled) return
            onLoaded()
        }

        waitForEverything()
        return () => { cancelled = true }
    }, [onLoaded])

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-700 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            style={{
                background: 'linear-gradient(145deg, #2d5a27 0%, #1e4a1e 40%, #234d20 100%)',
            }}
        >
            {/* Chalk texture overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <filter id="loaderNoise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#loaderNoise)" opacity="0.1" />
            </svg>

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 150px rgba(0,0,0,0.35)' }} />

            {/* Loading content */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Chalk-style loader */}
                <div className="relative mb-8">
                    <div className="text-5xl md:text-6xl animate-pulse">✿</div>
                </div>

                <h2 className="font-[Caveat] text-3xl md:text-4xl text-white/80 mb-3"
                    style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
                    Loading memories...
                </h2>

                <p className="font-['Patrick_Hand'] text-base text-white/40 mb-8">
                    Please wait while everything loads
                </p>

                {/* Progress bar */}
                <div className="w-56 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white/50 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <p className="font-['Patrick_Hand'] text-sm text-white/25 mt-3">
                    {progress}%
                </p>
            </div>
        </div>
    )
}
