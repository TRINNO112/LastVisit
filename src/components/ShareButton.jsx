import { useState } from 'react'

export default function ShareButton() {
    const [copied, setCopied] = useState(false)

    const pageUrl = 'https://trinno112.github.io/LastVisit/'
    const shareText = 'Check out this beautiful farewell tribute to our teacher Momita Ma\'am 💛'

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Thank You, Momita Ma\'am',
                    text: shareText,
                    url: pageUrl,
                })
            } catch {
                // User cancelled
            }
            return
        }
        copyLink()
    }

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(pageUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        } catch {
            const textArea = document.createElement('textarea')
            textArea.value = pageUrl
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        }
    }

    const shareWhatsApp = () => {
        window.open(
            `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + pageUrl)}`,
            '_blank'
        )
    }

    return (
        <div className="text-center space-y-4">
            <p className="font-[Caveat] text-xl text-white/40">
                Share this page
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap">
                {/* WhatsApp */}
                <button
                    onClick={shareWhatsApp}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/15 text-white/70 hover:text-white hover:bg-white/[0.12] hover:border-white/30 transition-all duration-300 font-['Patrick_Hand'] text-base"
                >
                    WhatsApp
                </button>

                {/* Share (native on mobile) / Copy Link (desktop) */}
                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/15 text-white/70 hover:text-white hover:bg-white/[0.12] hover:border-white/30 transition-all duration-300 font-['Patrick_Hand'] text-base"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    {copied ? 'Link Copied!' : 'Copy Link'}
                </button>
            </div>
        </div>
    )
}
