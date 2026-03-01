import { useEffect, useRef, useState } from 'react'
import ChalkboardTexture from './ChalkboardTexture'

export default function FarewellQuote() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative py-24 px-6 bg-[#1e4a1e]">
      <ChalkboardTexture />

      <div
        ref={ref}
        className={`max-w-3xl mx-auto text-center relative transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Decorative chalk lines */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-20 h-[1px] bg-white/30" />
          <span className="text-white/30 text-2xl">✦</span>
          <div className="w-20 h-[1px] bg-white/30" />
        </div>

        <blockquote className="font-[Caveat] text-3xl md:text-4xl text-white/90 leading-relaxed font-bold"
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
          "A good teacher can inspire hope, ignite the imagination, and instill a love of learning."
        </blockquote>

        <p className="font-['Patrick_Hand'] text-xl text-white/40 mt-6">— Brad Henry</p>

        <div className="mt-14 space-y-3">
          <p className="font-[Caveat] text-2xl text-[#f5e6a3]">
            We will miss you, Momita Ma'am
          </p>
          <p className="font-['Patrick_Hand'] text-lg text-white/40">
            From your students in Morbi, with love — to Kolkata, with pride.
          </p>
          <p className="font-['Patrick_Hand'] text-base text-white/30 mt-2">
            Remember us, Ma'am. Whenever you visit this page — here we are.
          </p>
        </div>

        {/* Decorative chalk lines */}
        <div className="flex items-center justify-center gap-4 mt-14">
          <div className="w-20 h-[1px] bg-white/30" />
          <span className="text-white/30 text-2xl">✦</span>
          <div className="w-20 h-[1px] bg-white/30" />
        </div>

        {/* Developer note - placeholder for Hinglish message */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="font-['Patrick_Hand'] text-sm text-white/25">
            Made with ♡ by her students
          </p>
          <p className="font-[Caveat] text-lg text-white/40 mt-4 italic leading-relaxed whitespace-pre-line text-left max-w-2xl mx-auto">
            Ma'am, mujhe lagta hai shayad yeh aapke liye mera aakhri message hoga, kyunki aap ab Morbi se jaa rahe ho. Main dil se umeed karta hoon ki aapka jo sapna hai Professor banne ka, woh zaroor poora ho. Humein aapki bahut yaad aayegi.
            {'\n\n'}
            Aapne hume Accounts padhaya aur bahut saari important cheezein sikhayi. Ab jab aap jaa rahe ho, toh aisa lag raha hai jaise kuch important humse door ho raha hai. Waise toh hum aapko zyada kuch de nahi sakte, lekin maine yeh page isliye banaya hai taaki hum aapke liye ek chhota sa message chhod sake.
            {'\n\n'}
            Bas itna hi kehna tha ki aap hamare liye bahut acche teacher rahe ho. Aapki yaad hamesha aayegi. Aur kabhi bhi agar aapko hamari yaad aaye, toh is page ko zaroor open kar lena. Yeh hamesha online rahega — bas link save karke rakh lena.
            {'\n\n'}
            Main aur kya bolun… bas dil se thank you, Ma'am.
          </p>
        </div>
      </div>
    </section>
  )
}
