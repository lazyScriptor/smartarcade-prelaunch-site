import { Check, Plus, ShieldCheck } from 'lucide-react'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { formatLKR } from '../config/shop'
import { categoryById, type CatalogProduct } from '../data/catalog'
import { prefersReducedMotion } from '../hooks/ui'
import { useCart } from '../store/cart'
import CatalogImage from './CatalogImage'

export const priceText = (product: CatalogProduct) =>
  product.price === null ? 'Price on request' : `${product.priceFrom ? 'From ' : ''}${formatLKR(product.price)}`

export default function CatalogCard({ product, eager = false }: { product: CatalogProduct; eager?: boolean }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const tiltRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!added) return
    const timer = window.setTimeout(() => setAdded(false), 1500)
    return () => window.clearTimeout(timer)
  }, [added])

  // A slight tilt that follows the mouse. Touch screens keep the card still so scrolling stays calm.
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const node = tiltRef.current
    if (!node || event.pointerType !== 'mouse' || prefersReducedMotion()) return
    const box = node.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width - 0.5
    const y = (event.clientY - box.top) / box.height - 0.5
    node.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg) translateY(-3px)`
  }
  const onLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = ''
  }

  return (
    <div ref={tiltRef} onPointerMove={onMove} onPointerLeave={onLeave} className="hud-frame flex h-full flex-col rounded-2xl border border-line bg-surface transition-transform duration-200 ease-out">
      <Link to={`/product/${product.id}`} className="group block overflow-hidden rounded-t-[15px] bg-white" aria-label={product.name}>
        <div className="aspect-square p-3 sm:p-5">
          <CatalogImage src={product.cardImage} alt="" eager={eager} className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105" />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="hud truncate text-xs uppercase tracking-wider text-muted">{product.brand || categoryById(product.category)?.name}</p>
        <Link to={`/product/${product.id}`} className="mt-1 line-clamp-2 min-h-[2.6em] text-sm font-medium leading-[1.3] text-ink hover:text-accent sm:text-[15px]">{product.name}</Link>
        {product.warranty && (
          <p className="mt-2 flex items-start gap-1 text-xs leading-snug text-muted"><ShieldCheck className="h-3.5 w-3.5 shrink-0 text-accent" /> <span className="line-clamp-1">{product.warranty}</span></p>
        )}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-1 gap-y-2 pt-3">
          <p className={`price whitespace-nowrap leading-tight ${product.price === null ? 'text-[13px] text-muted' : 'text-[15px] text-accent sm:text-lg'}`}>{priceText(product)}</p>
          <button
            type="button"
            onClick={() => { add(product.id); setAdded(true) }}
            aria-label={`Add ${product.name} to cart`}
            className={`ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] transition-colors duration-150 active:scale-95 ${added ? 'bg-emerald-500 text-[#04210f]' : 'bg-lime text-navy hover:brightness-110'}`}
          >
            {added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  )
}
