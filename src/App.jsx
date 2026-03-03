import Hero from './components/Hero'
import ChalkWipe from './components/ChalkWipe'
import MemoryJourney from './components/MemoryJourney'
import MaamSaid from './components/MaamSaid'
import BalanceSheet from './components/BalanceSheet'
import MessageCards from './components/MessageCards'
import FarewellQuote from './components/FarewellQuote'
import AudioPlayer from './components/AudioPlayer'
import BackToTop from './components/BackToTop'
import ShareButton from './components/ShareButton'

function App() {
  return (
    <div className="min-h-screen bg-[#2d5a27]">
      <AudioPlayer />
      <BackToTop />
      <ShareButton />
      <Hero />
      <ChalkWipe />
      <MemoryJourney />
      <ChalkWipe />
      <MaamSaid />
      <ChalkWipe />
      <BalanceSheet />
      <ChalkWipe />
      <MessageCards />
      <ChalkWipe />
      <FarewellQuote />
    </div>
  )
}

export default App
