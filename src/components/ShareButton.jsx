import { useState } from 'react'

export default function ShareButton() {
    const [copied, setCopied] = useState(false)
    const [showMenu, setShowMenu] = useState(false)

    const pageUrl = 'https://trinno112.github.io/LastVisit/'
    const shareText = 'Check out this beautiful farewell tribute to our teacher Momita Ma\'am 💛'

    const handleShare = async () => {
        // Use native share if available (mobile devices)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Thank You, Momita Ma\'am',
                    text: shareText,
                    url: pageUrl,
                })
            } catch {
                // User cancelled share or error — do nothing
            }
            return
        }

        // Fallback: show menu on desktop
        setShowMenu(!showMenu)
    }

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(pageUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            setShowMenu(false)
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement('textarea')
            textArea.value = pageUrl
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            setShowMenu(false)
        }
    }

    const shareWhatsApp = () => {
        window.open(
            `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + pageUrl)}`,
            '_blank'
        )
        setShowMenu(false)
    }

    const shareTelegram = () => {
        window.open(
            `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`,
            '_blank'
        )
        setShowMenu(false)
    }

    return (
        <div className="fixed bottom-6 right-22 z-50">
            {/* Share menu popup */}
            {showMenu && (
                <div className="absolute bottom-14 right-0 bg-[#1e4a1e] border-2 border-white/20 rounded-lg p-3 shadow-xl min-w-[180px] space-y-2">
                    <button
                        onClick={shareWhatsApp}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 font-['Patrick_Hand'] text-base"
                    >
                        <span className="text-lg">💬</span> WhatsApp
                    </button>
                    <button
                        onClick={shareTelegram}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 font-['Patrick_Hand'] text-base"
                    >
                        <span className="text-lg">✈️</span> Telegram
                    </button>
                    <button
                        onClick={copyLink}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 font-['Patrick_Hand'] text-base"
                    >
                        <span className="text-lg">🔗</span> {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                </div>
            )}

            {/* Share button */}
            <button
                onClick={handleShare}
                className="w-12 h-12 rounded-full bg-[#1e4a1e] border-2 border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-all duration-300 shadow-lg backdrop-blur-sm"
                title="Share this page"
                aria-label="Share"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
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
            </button>

            {/* Copied toast */}
            {copied && (
                <div className="absolute -top-10 right-0 bg-[#f5e6a3] text-[#1e4a1e] font-[Caveat] text-lg px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
                    Link copied! ✓
                </div>
            )}
        </div>
    )
}
