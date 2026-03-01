import Hero from './components/Hero'
import MessageCards from './components/MessageCards'
import MemoryJourney from './components/MemoryJourney'
import BalanceSheet from './components/BalanceSheet'
import FarewellQuote from './components/FarewellQuote'

function App() {
  return (
    <div className="min-h-screen bg-[#2d5a27]">
      <Hero />
      <MemoryJourney />
      <BalanceSheet />
      <MessageCards />
      <FarewellQuote />
    </div>
  )
}

export default App
