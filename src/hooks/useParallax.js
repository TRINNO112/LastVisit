import { useEffect, useRef, useState } from 'react'

export default function useParallax(speed = 0.1) {
  const ref = useRef(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    function handleScroll() {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const center = rect.top + rect.height / 2
      const viewCenter = window.innerHeight / 2
      setOffset((center - viewCenter) * speed)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return { ref, offset }
}
