import { ArrowUpRight, Check, Images, Plus, ShieldCheck, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatLKR } from '../config/shop'
import { catalogCategories, type CatalogProduct } from '../data/catalog'
import { useCart } from '../store/cart'
import CatalogImage from './CatalogImage'

export default function CatalogCard({ product }: { product: CatalogProduct }) {
  const warranty = [product.warrantyPeriod, product.warrantyType].filter(Boolean).join(' · ')
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  useEffect(() => {
    if (!added) return
    const timer = window.setTimeout(() => setAdded(false), 1500)
    return () => window.clearTimeout(timer)
  }, [added])

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/10">
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <CatalogImage
          src={product.cardImage}
          alt={product.name}
          className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-[1.04] sm:p-7"
        />
        {product.images.length > 1 && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-600 shadow-sm backdrop-blur">
            <Images className="h-3.5 w-3.5" /> {product.images.length} photos
          </span>
        )}
      </Link>
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-lime/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-navy">
            {catalogCategories.find(category => category.id === product.category)?.name ?? 'Product'}
          </span>
          <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-navy" />
        </div>
        <Link to={`/product/${product.id}`} className="mt-3 block min-h-[3.5rem] text-sm font-semibold leading-snug text-slate-900 hover:text-navy sm:text-base">
          {product.name}
        </Link>
        <p className="mt-3 text-base font-extrabold text-navy">
          {product.price === null ? 'Price to be confirmed' : `${product.priceFrom ? 'From ' : ''}${formatLKR(product.price)}`}
        </p>
        {warranty && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> {warranty}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between gap-2">
          <Link to={`/product/${product.id}`} className="text-xs font-bold text-navy underline decoration-lime decoration-2 underline-offset-4">
            See details <span aria-hidden="true">→</span>
          </Link>
          <button
            type="button"
            onClick={() => { add(product.id); setAdded(true) }}
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition ${added ? 'bg-emerald-600 text-white' : 'bg-navy text-white hover:bg-navy/90'}`}
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? <><Check className="h-4 w-4" /> Added</> : <><ShoppingBag className="h-4 w-4" /><Plus className="h-3 w-3" /></>}
          </button>
        </div>
      </div>
    </article>
  )
}
