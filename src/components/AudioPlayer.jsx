import { useEffect, useRef, useState } from 'react'

export default function AudioPlayer() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    const handleClick = () => {
      if (!hasInteracted && audioRef.current) {
        audioRef.current.volume = 0.3
        audioRef.current.play().then(() => {
          setPlaying(true)
          setHasInteracted(true)
        }).catch(() => {})
      }
    }
    window.addEventListener('click', handleClick, { once: true })
    return () => window.removeEventListener('click', handleClick)
  }, [hasInteracted])

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.volume = 0.3
      audioRef.current.play().catch(() => {})
    }
    setPlaying(!playing)
  }

  return (
    <>
      <audio ref={audioRef} src="/music/bg-music.mp3" loop preload="auto" />
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
