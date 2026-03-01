import { useEffect, useRef, useState } from 'react'
import ChalkboardTexture from './ChalkboardTexture'
import FloatingDust from './FloatingDust'

const assets = [
  { particular: 'Memories with Ma\'am', amount: '∞' },
  { particular: 'Concepts Finally Understood', amount: '10,000' },
  { particular: 'Life Lessons Received', amount: '9,999' },
  { particular: 'Motivation & Inspiration', amount: '99,999' },
  { particular: 'Inside Jokes in Class', amount: '1,00,000' },
]

const liabilities = [
  { particular: 'Incomplete Homework', amount: '5,000' },
  { particular: 'Times We Didn\'t Pay Attention', amount: '2,500' },
  { particular: 'Unanswered Questions (sorry Ma\'am)', amount: '1,000' },
  { particular: 'Classes We Wished Were Longer', amount: '50,000' },
]

const capital = [
  { particular: 'Love & Respect for Ma\'am (Capital)', amount: '∞' },
]

// Format number with Indian comma system (1,00,000)
function formatIndian(num) {
  const s = Math.floor(num).toString()
  if (s.length <= 3) return s
  let result = s.slice(-3)
  let remaining = s.slice(0, -3)
  while (remaining.length > 0) {
    result = remaining.slice(-2) + ',' + result
    remaining = remaining.slice(0, -2)
  }
  return result
}

function CountUp({ target, visible }) {
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!visible) return
    if (target === '∞') {
      setDisplay('∞')
      return
    }

    const numeric = parseInt(target.replace(/,/g, ''), 10)
    if (isNaN(numeric)) {
      setDisplay(target)
      return
    }

    const duration = 1500
    const start = performance.now()

    function tick(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(numeric * eased)
      setDisplay(formatIndian(current))
      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        setDisplay(target)
      }
    }

    requestAnimationFrame(tick)
  }, [visible, target])

  return <>{display}</>
}

function AnimatedRow({ item, index, visible }) {
  return (
    <tr
      className={`transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <td className="font-['Patrick_Hand'] text-white/70 py-2 pr-4 text-left border-b border-white/10">
        {item.particular}
      </td>
      <td className="font-[Caveat] text-[#f5e6a3] text-xl py-2 text-right border-b border-white/10 tabular-nums">
        <CountUp target={item.amount} visible={visible} />
      </td>
    </tr>
  )
}

export default function BalanceSheet() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative py-20 px-6 bg-[#2d5a27]" style={{ background: 'linear-gradient(180deg, #2a5525 0%, #2d5a27 50%, #2a5525 100%)' }}>
      <ChalkboardTexture />
      <FloatingDust count={20} />

      <div ref={ref} className="max-w-4xl mx-auto relative">
        <h2 className="font-[Caveat] text-4xl md:text-5xl text-white text-center font-bold mb-2"
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
          The Final Balance Sheet
        </h2>
        <p className="font-['Patrick_Hand'] text-lg text-white/40 text-center mb-12">
          As on the last day of Ma'am's class at OSEM
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Liabilities & Capital Side */}
          <div className="bg-[#1e4a1e] border-2 border-white/15 rounded-lg p-6">
            <h3 className="font-[Caveat] text-2xl text-white font-bold mb-4 border-b-2 border-white/20 pb-2">
              Liabilities & Capital
            </h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="font-['Patrick_Hand'] text-white/40 text-left text-sm pb-2">Particulars</th>
                  <th className="font-['Patrick_Hand'] text-white/40 text-right text-sm pb-2">Amount (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {capital.map((item, i) => (
                  <AnimatedRow key={`c-${i}`} item={item} index={i} visible={visible} />
                ))}
                {liabilities.map((item, i) => (
                  <AnimatedRow key={`l-${i}`} item={item} index={i + capital.length} visible={visible} />
                ))}
                <tr className={`transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transitionDelay: '600ms' }}>
                  <td className="font-[Caveat] text-white text-xl pt-3 font-bold">Total</td>
                  <td className="font-[Caveat] text-[#f5e6a3] text-xl pt-3 text-right font-bold border-t-2 border-white/30">∞</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Assets Side */}
          <div className="bg-[#1e4a1e] border-2 border-white/15 rounded-lg p-6">
            <h3 className="font-[Caveat] text-2xl text-white font-bold mb-4 border-b-2 border-white/20 pb-2">
              Assets
            </h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="font-['Patrick_Hand'] text-white/40 text-left text-sm pb-2">Particulars</th>
                  <th className="font-['Patrick_Hand'] text-white/40 text-right text-sm pb-2">Amount (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((item, i) => (
                  <AnimatedRow key={`a-${i}`} item={item} index={i} visible={visible} />
                ))}
                <tr className={`transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transitionDelay: '600ms' }}>
                  <td className="font-[Caveat] text-white text-xl pt-3 font-bold">Total</td>
                  <td className="font-[Caveat] text-[#f5e6a3] text-xl pt-3 text-right font-bold border-t-2 border-white/30">∞</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Auditor's note */}
        <p className={`font-['Patrick_Hand'] text-center text-white/30 mt-8 text-sm italic transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '800ms' }}>
          Audited and verified by the students of OSEM. This balance sheet will never be closed.
        </p>
      </div>
    </section>
  )
}
