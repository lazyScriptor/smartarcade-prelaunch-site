import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../store/cart'
import CatalogImage from './CatalogImage'

export default function AddedToast() {
  const { lastAdded } = useCart()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!lastAdded) return
    setVisible(true)
    const timer = window.setTimeout(() => setVisible(false), 3500)
    return () => window.clearTimeout(timer)
  }, [lastAdded])

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 top-[72px] z-50 px-3 lg:left-auto lg:right-4 lg:top-20 lg:w-96">
      {visible && lastAdded && (
        <div key={lastAdded.at} className="toast-in pointer-events-auto flex items-center gap-3 rounded-2xl border border-lime/60 bg-navy p-2.5 shadow-2xl shadow-black/60 on-dark">
          <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white"><CatalogImage src={lastAdded.image} alt="" sizes="48px" className="h-full w-full object-contain p-1" /></span>
          <span className="min-w-0 flex-1">
            <span className="hud flex items-center gap-1 text-[13px] text-accent"><Check className="h-4 w-4" /> Added to cart</span>
            <span className="block truncate text-sm text-ink">{lastAdded.name}</span>
          </span>
          <Link to="/cart" className="btn btn-lime shrink-0 px-3 text-sm" style={{ minHeight: 44 }}>View cart</Link>
        </div>
      )}
    </div>
  )
}
