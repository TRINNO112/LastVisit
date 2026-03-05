import { useEffect, useRef, useState } from 'react'

export default function AudioPlayer() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    const tryPlay = () => {
      if (audioRef.current && !hasInteracted) {
        audioRef.current.volume = 0.3
        audioRef.current.play().then(() => {
          setPlaying(true)
          setHasInteracted(true)
        }).catch((err) => {
          console.warn('Audio autoplay blocked:', err.message)
          // Don't give up — the toggle button still works
        })
      }
    }

    // Listen on multiple user gesture events for broader browser support
    const events = ['click', 'touchstart', 'keydown']
    events.forEach(evt => window.addEventListener(evt, tryPlay, { once: true }))

    return () => {
      events.forEach(evt => window.removeEventListener(evt, tryPlay))
    }
  }, [hasInteracted])

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.volume = 0.3
      audioRef.current.play().then(() => {
        setPlaying(true)
        setHasInteracted(true)
      }).catch((err) => {
        console.warn('Audio play failed:', err.message)
      })
    }
  }

  // Use import.meta.env.BASE_URL so the path works in both dev and production
  const audioSrc = `${import.meta.env.BASE_URL}music/bg-music.mp3`

  return (
    <>
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#1e4a1e] border-2 border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-all duration-300 shadow-lg backdrop-blur-sm"
        title={playing ? 'Mute' : 'Play music'}
      >
        <span className="text-lg">{playing ? '♫' : '♪'}</span>
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-[2px] bg-white/50 rotate-45 absolute" />
          </div>
        )}
      </button>
      {!hasInteracted && (
        <div className="fixed bottom-20 right-4 z-50 font-['Patrick_Hand'] text-sm text-white/30 animate-pulse">
          click anywhere to play music
        </div>
      )}
    </>
  )
}
