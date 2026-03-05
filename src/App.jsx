import { useState, useCallback, useEffect } from 'react'
import PageLoader from './components/PageLoader'
import Hero from './components/Hero'
import ChalkWipe from './components/ChalkWipe'
import MemoryJourney from './components/MemoryJourney'
import MaamSaid from './components/MaamSaid'
import BalanceSheet from './components/BalanceSheet'
import MessageCards from './components/MessageCards'
import ParallaxMountains from './components/ParallaxMountains'
import ParallaxMountainsMobile from './components/ParallaxMountainsMobile'
import FarewellQuote from './components/FarewellQuote'
import AudioPlayer from './components/AudioPlayer'
import BackToTop from './components/BackToTop'

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint)
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const onChange = (e) => setIsMobile(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [breakpoint])
  return isMobile
}

function App() {
  const [loaded, setLoaded] = useState(false)
  const handleLoaded = useCallback(() => setLoaded(true), [])
  const isMobile = useIsMobile()

  return (
    <>
      {!loaded && <PageLoader onLoaded={handleLoaded} />}
      <div className={`min-h-screen bg-[#2d5a27] ${!loaded ? 'overflow-hidden max-h-screen' : ''}`}>
        <AudioPlayer />
        <BackToTop />
        <Hero />
        <ChalkWipe />
        <MemoryJourney />
        <ChalkWipe />
        <MaamSaid />
        <ChalkWipe />
        <BalanceSheet />
        <ChalkWipe />
        <MessageCards />
        {isMobile ? <ParallaxMountainsMobile /> : <ParallaxMountains />}
        <FarewellQuote />
      </div>
    </>
  )
}

export default App
