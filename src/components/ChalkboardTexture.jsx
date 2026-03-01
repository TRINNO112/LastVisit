export default function ChalkboardTexture() {
  return (
    <>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <filter id={`grain-${Math.random().toString(36).slice(2, 6)}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" style={{ filter: 'url(#' + 'grain)' }} opacity="0.05" />
      </svg>
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 40 }).map((_, i) => (
          <circle
            key={i}
            cx={`${Math.random() * 100}%`}
            cy={`${Math.random() * 100}%`}
            r={Math.random() * 1.2 + 0.3}
            fill="white"
          />
        ))}
      </svg>
    </>
  )
}
