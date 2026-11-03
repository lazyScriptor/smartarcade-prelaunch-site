import { useEffect, useRef, useState } from 'react'
import { shop } from '../config/shop'

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | ${shop.name}`
  }, [title])
}

export const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

export function useInView<T extends Element>(options: IntersectionObserverInit = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  const { threshold = 0.15, rootMargin = '0px' } = options
  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold, rootMargin })
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin])
  return [ref, inView] as const
}
