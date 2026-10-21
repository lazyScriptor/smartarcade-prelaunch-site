import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { formatLKR } from '../config/shop'
import { useCart } from '../store/cart'
import ProductArt from './ProductArt'
import StockBadge from './StockBadge'

const badgeColour: Record<NonNullable<Product['badge']>, string> = {
  New: 'bg-lime text-navy',
  Hot: 'bg-rose-500 text-white',
  Sale: 'bg-amber-400 text-navy',
  Limited: 'bg-violet-500 text-white',
}

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  const off = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/10">
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden">
        <div className="h-full w-full transition duration-500 group-hover:scale-105">
          <ProductArt product={product} />
        </div>
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.badge && <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${badgeColour[product.badge]}`}>{product.badge}</span>}
          {off > 0 && <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-rose-600">-{off}%</span>}
        </div>
        {product.condition === 'Pre-owned' && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-navy">Pre-owned</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{product.brand}</span>
        <Link to={`/product/${product.id}`} className="mt-1 line-clamp-2 font-semibold leading-snug text-slate-900 hover:text-navy">
          {product.name}
        </Link>
        <div className="mt-2"><StockBadge stock={product.stock} /></div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            {product.compareAt && <div className="text-xs text-slate-400 line-through">{formatLKR(product.compareAt)}</div>}
            <div className="whitespace-nowrap font-display text-base font-bold text-navy md:text-lg">{formatLKR(product.price)}</div>
          </div>
          <button
            disabled={product.stock === 'out'}
            onClick={() => add(product.id, product.variants?.[0]?.name)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-white transition hover:bg-lime hover:text-navy disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
