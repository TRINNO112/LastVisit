import React from 'react'

// ═══════════════════════════════════════════════════════════════════════════════
// PINE TREE (from ParallaxMountains)
// ═══════════════════════════════════════════════════════════════════════════════
export function PineTree({ x = 0, hillY = 0, h = 60, w = 20 }) {
    return (
        <g style={{ transformOrigin: `${x}px ${hillY}px` }}>
            {/* Ground shadow */}
            <ellipse cx={x + 6} cy={hillY + 1} rx={w * 0.75} ry={4.5} fill="black" fillOpacity="0.13" />
            {/* Trunk */}
            <rect x={x - 2.2} y={hillY - 10} width={4.4} height={20} fill="#091306" rx="1.2" />
            {/* Bottom foliage */}
            <polygon points={`${x},${hillY - h} ${x - w},${hillY + 2} ${x + w},${hillY + 2}`} fill="#142814" />
            {/* Bottom shading */}
            <polygon points={`${x - w * 0.4},${hillY - h * 0.3} ${x - w},${hillY + 2} ${x},${hillY - h * 0.55}`} fill="rgba(0,0,0,0.18)" />
            {/* Mid foliage */}
            <polygon points={`${x},${hillY - h - 14} ${x - w * 0.82},${hillY - h + 17} ${x + w * 0.82},${hillY - h + 17}`} fill="#1c4a1c" />
            {/* Top foliage */}
            <polygon points={`${x},${hillY - h - 28} ${x - w * 0.52},${hillY - h - 5} ${x + w * 0.52},${hillY - h - 5}`} fill="#286428" />
            {/* Tip highlight */}
            <circle cx={x} cy={hillY - h - 28} r={2.2} fill="rgba(55,110,50,0.55)" />
        </g>
    )
}

// ═══════════════════════════════════════════════════════════════════════════════
// DISTANT PINE TREE — optimized simple shape for deep background mountains
// ═══════════════════════════════════════════════════════════════════════════════
export function DistantPineTree({ x = 0, hillY = 0, h = 20, w = 8, swing = 0, delay = 0 }) {
    return (
        <g style={{
            transformOrigin: `${x}px ${hillY}px`,
            animation: swing ? `pm-sway ${swing}s ease-in-out infinite ${delay}s` : 'none'
        }}>
            {/* Tiny Trunk */}
            <rect x={x - 1} y={hillY - 4} width={2} height={4} fill="#091306" />
            {/* Simple stacked triangular foliage without complex shadowing rules */}
            <polygon points={`${x},${hillY - h} ${x - w},${hillY - 2} ${x + w},${hillY - 2}`} fill="#142814" />
            <polygon points={`${x},${hillY - h} ${x - w * 0.75},${hillY - 4} ${x + w * 0.75},${hillY - 4}`} fill="#193a19" />
        </g>
    )
}

// ═══════════════════════════════════════════════════════════════════════════════
// OAK TREE — realistic gnarled trunk with lush, layered canopy
// ═══════════════════════════════════════════════════════════════════════════════
export function OakTree({ x = 0, hillY = 0, h = 50, w = 35, swing = 0, delay = 0 }) {
    const cY = hillY - h  // canopy center Y
    return (
        <g style={{
            transformOrigin: `${x}px ${hillY}px`,
            animation: swing ? `pm-sway ${swing}s ease-in-out infinite ${delay}s` : 'none'
        }}>
            {/* Ground shadow */}
            <ellipse cx={x + 4} cy={hillY + 2} rx={w * 1.3} ry={7} fill="black" fillOpacity="0.18" />

            {/* Exposed roots */}
            <path d={`M${x - 4},${hillY} Q${x - 14},${hillY + 3} ${x - 18},${hillY + 6}`} fill="none" stroke="#1a1408" strokeWidth="2.5" strokeLinecap="round" />
            <path d={`M${x + 3},${hillY} Q${x + 12},${hillY + 4} ${x + 16},${hillY + 5}`} fill="none" stroke="#1a1408" strokeWidth="2" strokeLinecap="round" />

            {/* Main trunk — thick, slightly bent */}
            <path d={`M${x - 5},${hillY} C${x - 6},${hillY - h * 0.4} ${x - 3},${hillY - h * 0.7} ${x - 2},${cY + 12} L${x + 4},${cY + 12} C${x + 5},${hillY - h * 0.7} ${x + 7},${hillY - h * 0.4} ${x + 5},${hillY}`} fill="#1e1810" />
            {/* Trunk bark texture */}
            <path d={`M${x - 3},${hillY - 8} Q${x - 1},${hillY - 14} ${x - 4},${hillY - 20}`} fill="none" stroke="#2a2018" strokeWidth="1" opacity="0.5" />
            <path d={`M${x + 2},${hillY - 12} Q${x + 4},${hillY - 18} ${x + 1},${hillY - 26}`} fill="none" stroke="#2a2018" strokeWidth="0.8" opacity="0.4" />

            {/* Major fork branches */}
            <path d={`M${x},${cY + 12} Q${x - 10},${cY + 2} ${x - 22},${cY - 8}`} fill="none" stroke="#1e1810" strokeWidth="4.5" strokeLinecap="round" />
            <path d={`M${x},${cY + 12} Q${x + 8},${cY + 2} ${x + 20},${cY - 5}`} fill="none" stroke="#1e1810" strokeWidth="4" strokeLinecap="round" />
            <path d={`M${x - 6},${cY + 5} Q${x - 16},${cY - 5} ${x - 28},${cY + 2}`} fill="none" stroke="#1e1810" strokeWidth="3" strokeLinecap="round" />
            <path d={`M${x + 5},${cY + 5} Q${x + 14},${cY - 5} ${x + 26},${cY + 5}`} fill="none" stroke="#1e1810" strokeWidth="2.8" strokeLinecap="round" />
            {/* Minor branches */}
            <path d={`M${x - 18},${cY - 5} Q${x - 22},${cY - 15} ${x - 18},${cY - 20}`} fill="none" stroke="#1e1810" strokeWidth="2" strokeLinecap="round" />
            <path d={`M${x + 16},${cY - 2} Q${x + 22},${cY - 12} ${x + 16},${cY - 18}`} fill="none" stroke="#1e1810" strokeWidth="1.8" strokeLinecap="round" />
            <path d={`M${x},${cY + 8} Q${x + 2},${cY - 5} ${x},${cY - 16}`} fill="none" stroke="#1e1810" strokeWidth="2.5" strokeLinecap="round" />

            {/* Deep shadow canopy (back layer) */}
            <ellipse cx={x - 18} cy={cY - 2} rx={w * 0.55} ry={w * 0.4} fill="#0f2a0f" />
            <ellipse cx={x + 20} cy={cY} rx={w * 0.5} ry={w * 0.38} fill="#0d220d" />
            <ellipse cx={x} cy={cY - 12} rx={w * 0.6} ry={w * 0.45} fill="#122812" />

            {/* Main canopy mass (mid layer — bumpy clusters) */}
            <ellipse cx={x - 22} cy={cY - 5} rx={w * 0.52} ry={w * 0.38} fill="#1a3f1a" />
            <ellipse cx={x + 18} cy={cY - 4} rx={w * 0.48} ry={w * 0.35} fill="#1c431c" />
            <ellipse cx={x - 8} cy={cY - 14} rx={w * 0.65} ry={w * 0.48} fill="#204820" />
            <ellipse cx={x + 8} cy={cY - 12} rx={w * 0.6} ry={w * 0.45} fill="#1e441e" />
            <ellipse cx={x} cy={cY - 20} rx={w * 0.55} ry={w * 0.4} fill="#265226" />
            <ellipse cx={x - 26} cy={cY + 5} rx={w * 0.38} ry={w * 0.3} fill="#183c18" />
            <ellipse cx={x + 24} cy={cY + 6} rx={w * 0.35} ry={w * 0.28} fill="#163818" />

            {/* Highlight canopy (front layer — sunlit) */}
            <ellipse cx={x - 10} cy={cY - 16} rx={w * 0.35} ry={w * 0.26} fill="#2d5e2d" opacity="0.9" />
            <ellipse cx={x + 6} cy={cY - 18} rx={w * 0.38} ry={w * 0.28} fill="#306030" opacity="0.85" />
            <ellipse cx={x} cy={cY - 24} rx={w * 0.3} ry={w * 0.22} fill="#3a723a" opacity="0.8" />
            <ellipse cx={x - 18} cy={cY - 8} rx={w * 0.22} ry={w * 0.16} fill="#3d783d" opacity="0.7" />
            <ellipse cx={x + 16} cy={cY - 8} rx={w * 0.2} ry={w * 0.15} fill="#3a723a" opacity="0.65" />

            {/* Sunlit specks */}
            <circle cx={x - 5} cy={cY - 22} r={2} fill="#50a050" opacity="0.5" />
            <circle cx={x + 10} cy={cY - 20} r={1.5} fill="#4a964a" opacity="0.4" />
            <circle cx={x - 16} cy={cY - 10} r={1.8} fill="#50a050" opacity="0.35" />
        </g>
    )
}

// ═══════════════════════════════════════════════════════════════════════════════
// BIRCH TREE — slender white trunk, bright autumn leaves
// ═══════════════════════════════════════════════════════════════════════════════
export function BirchTree({ x = 0, hillY = 0, h = 60, w = 22, swing = 0, delay = 0 }) {
    const cY = hillY - h
    return (
        <g style={{
            transformOrigin: `${x}px ${hillY}px`,
            animation: swing ? `pm-sway ${swing}s ease-in-out infinite ${delay}s` : 'none'
        }}>
            {/* Ground shadow */}
            <ellipse cx={x + 3} cy={hillY + 1} rx={w * 1.1} ry={5} fill="black" fillOpacity="0.12" />

            {/* Trunk — slender, white/grey with a slight curve */}
            <path d={`M${x - 2},${hillY} C${x - 1},${hillY - h * 0.4} ${x + 2},${hillY - h * 0.8} ${x + 1},${cY} L${x + 3.5},${cY} C${x + 4.5},${hillY - h * 0.8} ${x + 1.5},${hillY - h * 0.4} ${x + 1},${hillY}`} fill="#dcdedd" />

            {/* Trunk shading and black bark scars */}
            <path d={`M${x + 1},${hillY} C${x + 1.5},${hillY - h * 0.4} ${x + 4.5},${hillY - h * 0.8} ${x + 3.5},${cY}`} fill="none" stroke="#a0a4a0" strokeWidth="0.8" opacity="0.6" />

            {/* Bark horizontal lines/scars */}
            <line x1={x - 1} y1={hillY - 10} x2={x + 1.5} y2={hillY - 11} stroke="#2e302e" strokeWidth="1.2" strokeLinecap="round" />
            <line x1={x} y1={hillY - 18} x2={x + 2.5} y2={hillY - 18.5} stroke="#2e302e" strokeWidth="1" strokeLinecap="round" />
            <line x1={x - 0.5} y1={hillY - 26} x2={x + 2} y2={hillY - 25.5} stroke="#2e302e" strokeWidth="1.5" strokeLinecap="round" />
            <line x1={x + 1} y1={hillY - 34} x2={x + 3} y2={hillY - 35} stroke="#2e302e" strokeWidth="0.8" strokeLinecap="round" />
            <line x1={x + 1} y1={hillY - 45} x2={x + 2.5} y2={hillY - 44} stroke="#2e302e" strokeWidth="1.2" strokeLinecap="round" />

            {/* Branches — thin, reaching upward and outward */}
            <path d={`M${x + 2.5},${hillY - 40} Q${x - 6},${hillY - 50} ${x - 12},${hillY - 58}`} fill="none" stroke="#2e302e" strokeWidth="1.2" strokeLinecap="round" />
            <path d={`M${x + 3},${hillY - 48} Q${x + 10},${hillY - 55} ${x + 14},${hillY - 62}`} fill="none" stroke="#2e302e" strokeWidth="1" strokeLinecap="round" />

            {/* Top branch forks */}
            <path d={`M${x - 6},${hillY - 50} Q${x - 10},${hillY - 60} ${x - 6},${hillY - 65}`} fill="none" stroke="#2e302e" strokeWidth="0.8" strokeLinecap="round" />
            <path d={`M${x + 10},${hillY - 55} Q${x + 15},${hillY - 65} ${x + 10},${hillY - 70}`} fill="none" stroke="#2e302e" strokeWidth="0.8" strokeLinecap="round" />

            {/* Leaves — Bright Gold / Orange autumn clusters */}
            {/* Back layer deep orange/brown */}
            <circle cx={x - 12} cy={cY + 10} r={w * 0.45} fill="#a45811" opacity="0.9" />
            <circle cx={x + 15} cy={cY + 8} r={w * 0.4} fill="#8c440a" opacity="0.9" />
            <circle cx={x - 8} cy={cY - 5} r={w * 0.5} fill="#9c4a08" opacity="0.95" />
            <circle cx={x + 10} cy={cY - 8} r={w * 0.45} fill="#8c440a" opacity="0.9" />
            <circle cx={x - 18} cy={cY + 2} r={w * 0.35} fill="#a45811" opacity="0.85" />
            <circle cx={x + 20} cy={cY - 2} r={w * 0.35} fill="#8c440a" opacity="0.9" />

            {/* Mid layer bright gold */}
            <circle cx={x - 16} cy={cY + 15} r={w * 0.35} fill="#d99b18" />
            <circle cx={x + 18} cy={cY + 12} r={w * 0.3} fill="#c18312" />
            <circle cx={x - 12} cy={cY + 2} r={w * 0.45} fill="#e5b122" />
            <circle cx={x + 12} cy={cY} r={w * 0.4} fill="#d99b18" />
            <circle cx={x} cy={cY - 5} r={w * 0.55} fill="#eebf2d" />
            <circle cx={x - 6} cy={cY - 15} r={w * 0.4} fill="#f4ce42" />
            <circle cx={x + 8} cy={cY - 12} r={w * 0.35} fill="#e5b122" />
            <circle cx={x - 22} cy={cY + 8} r={w * 0.25} fill="#e5b122" />
            <circle cx={x + 24} cy={cY + 4} r={w * 0.25} fill="#d99b18" />
            <circle cx={x} cy={cY + 12} r={w * 0.3} fill="#eebf2d" />

            {/* Highlight yellow/gold tip leaves */}
            <circle cx={x - 14} cy={cY + 12} r={w * 0.2} fill="#ffeb73" opacity="0.85" />
            <circle cx={x + 15} cy={cY + 6} r={w * 0.2} fill="#ffeb73" opacity="0.8" />
            <circle cx={x - 8} cy={cY - 2} r={w * 0.3} fill="#ffdd55" opacity="0.9" />
            <circle cx={x + 8} cy={cY - 4} r={w * 0.25} fill="#ffdd55" opacity="0.85" />
            <circle cx={x} cy={cY - 10} r={w * 0.35} fill="#ffee66" opacity="0.9" />
            <circle cx={x - 4} cy={cY - 18} r={w * 0.2} fill="#fffa99" opacity="0.9" />
            <circle cx={x + 6} cy={cY - 16} r={w * 0.18} fill="#ffeb73" opacity="0.85" />
            <circle cx={x - 20} cy={cY + 10} r={w * 0.15} fill="#fffa99" opacity="0.9" />
            <circle cx={x + 22} cy={cY + 2} r={w * 0.15} fill="#ffee66" opacity="0.85" />
            <circle cx={x} cy={cY + 8} r={w * 0.2} fill="#ffdd55" opacity="0.9" />

            {/* Loose falling leaves (just a few nearby) */}
            <rect x={x - 20} y={cY + 30} width={2.5} height={1.5} fill="#d99b18" transform={`rotate(25 ${x - 20} ${cY + 30})`} />
            <rect x={x + 22} y={cY + 40} width={2.5} height={1.5} fill="#e5b122" transform={`rotate(-15 ${x + 22} ${cY + 40})`} />
        </g>
    )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHOWCASE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function TreeModels() {
    return (
        <div className="min-h-[100dvh] bg-[#071608] flex flex-col items-center justify-center p-8 font-sans text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#e8f5e9] tracking-tight text-center">Procedural Trees</h1>
            <p className="text-[#a5d6a7] mb-12 max-w-xl text-center leading-relaxed md:text-lg">
                These are three distinct SVG-based tree variants. You can swap the current PineTree in your Parallax components with OakTree or WillowTree for a completely different forest atmosphere.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full max-w-6xl">
                {/* PINE */}
                <div className="bg-[#112c12] rounded-3xl p-8 shadow-2xl border border-[#2e7d32]/30 flex flex-col items-center group transition-colors duration-500 hover:bg-[#153416]">
                    <div className="w-full aspect-[4/3] bg-gradient-to-b from-[#193c17] to-[#0c2510] rounded-2xl flex items-end justify-center overflow-hidden border border-[#2e7d32]/20 relative shadow-inner">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(245,230,163,0.06)_0%,_transparent_75%)]" />
                        <svg className="w-full h-full relative z-10" viewBox="0 0 100 120" preserveAspectRatio="xMidYMax meet">
                            <line x1="0" y1="100" x2="100" y2="100" stroke="#1f421f" strokeWidth="2.5" />
                            <PineTree x={50} hillY={100} h={55} w={18} />
                        </svg>
                    </div>
                    <div className="mt-8 text-center flex-1">
                        <h2 className="text-2xl font-semibold text-[#c8e6c9]">Pine (Spruce)</h2>
                        <p className="text-[#81c784] mt-3 leading-relaxed">Sharp, tiered triangle layout. Great for deep, snowy or mountain scenes.</p>
                    </div>
                </div>

                {/* OAK */}
                <div className="bg-[#112c12] rounded-3xl p-8 shadow-2xl border border-[#2e7d32]/30 flex flex-col items-center group transition-colors duration-500 hover:bg-[#153416]">
                    <div className="w-full aspect-[4/3] bg-gradient-to-b from-[#193c17] to-[#0c2510] rounded-2xl flex items-end justify-center overflow-hidden border border-[#2e7d32]/20 relative shadow-inner">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(245,230,163,0.06)_0%,_transparent_75%)]" />
                        <svg className="w-full h-full relative z-10" viewBox="-10 0 120 130" preserveAspectRatio="xMidYMax meet">
                            <line x1="-10" y1="100" x2="120" y2="100" stroke="#1f421f" strokeWidth="2.5" />
                            <OakTree x={55} hillY={100} h={55} w={38} />
                        </svg>
                    </div>
                    <div className="mt-8 text-center flex-1">
                        <h2 className="text-2xl font-semibold text-[#c8e6c9]">Oak (Broadleaf)</h2>
                        <p className="text-[#81c784] mt-3 leading-relaxed">Rounded, thick canopy using intersecting clusters. Excellent for lush, dense forests.</p>
                    </div>
                </div>

                {/* WILLOW */}
                <div className="bg-[#112c12] rounded-3xl p-8 shadow-2xl border border-[#2e7d32]/30 flex flex-col items-center group transition-colors duration-500 hover:bg-[#153416]">
                    <div className="w-full aspect-[4/3] bg-gradient-to-b from-[#193c17] to-[#0c2510] rounded-2xl flex items-end justify-center overflow-hidden border border-[#2e7d32]/20 relative shadow-inner">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(245,230,163,0.06)_0%,_transparent_75%)]" />
                        <svg className="w-full h-full relative z-10" viewBox="0 0 100 120" preserveAspectRatio="xMidYMax meet">
                            <line x1="0" y1="100" x2="100" y2="100" stroke="#1f421f" strokeWidth="2.5" />
                            <BirchTree x={50} hillY={100} h={58} w={22} />
                        </svg>
                    </div>
                    <div className="mt-8 text-center flex-1">
                        <h2 className="text-2xl font-semibold text-[#f4ce42]">Autumn Birch</h2>
                        <p className="text-[#81c784] mt-3 leading-relaxed">Slender white textured trunk with elegant, scattered golden leaves. Perfect for breaking up dark greens.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
