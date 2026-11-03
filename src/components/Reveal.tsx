import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { useInView } from '../hooks/ui'

// Fades content in the first time it scrolls into view. Stays visible afterwards.
export default function Reveal({ children, className = '', index = 0 }: { children: ReactNode; className?: string; index?: number }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.08, rootMargin: '0px 0px -5% 0px' })
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    if (inView) setSeen(true)
  }, [inView])
  return (
    <div ref={ref} className={`reveal ${seen ? 'is-in' : ''} ${className}`} style={{ '--i': Math.min(index, 8) } as CSSProperties}>
      {children}
    </div>
  )
}
