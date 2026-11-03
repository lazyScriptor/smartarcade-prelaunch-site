import { Check, ChevronLeft, ChevronRight, MessageCircle, RotateCw, ShieldCheck, ShoppingBag, Store, Truck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CatalogCard, { priceText } from '../components/CatalogCard'
import CatalogImage from '../components/CatalogImage'
import PageHeader from '../components/PageHeader'
import QtyStepper from '../components/QtyStepper'
import { formatLKR, shop, waLink } from '../config/shop'
import { catalogProductById, catalogProducts, categoryById, loadProductDetails, type CatalogProduct, type ProductDetails } from '../data/catalog'
import { prefersReducedMotion, usePageTitle } from '../hooks/ui'
import { useCart } from '../store/cart'
import NotFound from './NotFound'

export default function CatalogProductPage() {
  const { id = '' } = useParams()
  const product = catalogProductById(id)
  if (!product) return <NotFound />
  return <ProductView key={product.id} product={product} />
}

function Gallery({ product, images }: { product: CatalogProduct; images: string[] }) {
  const rail = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const go = (index: number) => {
    const node = rail.current
    if (!node) return
    const next = (index + images.length) % images.length
    node.scrollTo({ left: next * node.clientWidth, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    setActive(next)
  }
  const onScroll = () => {
    const node = rail.current
    if (node) setActive(Math.round(node.scrollLeft / node.clientWidth))
  }
  return (
    <div className="min-w-0">
      <div className="relative overflow-hidden rounded-2xl bg-white">
        <div ref={rail} onScroll={onScroll} tabIndex={0} aria-label={`Photos of ${product.name}, ${images.length} in total`} className="snap-x-rail no-scrollbar flex aspect-square overflow-x-auto">
          {images.map((image, index) => (
            <div key={image} className="h-full w-full shrink-0 p-4 sm:p-8">
              <CatalogImage src={image} alt={index === 0 ? product.name : `${product.name}, photo ${index + 1}`} eager={index === 0} full sizes="(min-width: 1024px) 50vw, 100vw" className="h-full w-full object-contain" />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button onClick={() => go(active - 1)} aria-label="Previous photo" className="absolute left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy/90 text-ink hover:bg-navy sm:flex on-dark"><ChevronLeft className="h-5 w-5" /></button>
            <button onClick={() => go(active + 1)} aria-label="Next photo" className="absolute right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy/90 text-ink hover:bg-navy sm:flex on-dark"><ChevronRight className="h-5 w-5" /></button>
            <span className="hud absolute bottom-3 right-3 rounded-full bg-navy/90 px-3 py-1 text-[13px] tabular-nums text-ink on-dark">{active + 1} / {images.length}</span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Choose a photo">
          {images.map((image, index) => (
            <button key={image} onClick={() => go(index)} aria-label={`Show photo ${index + 1}`} aria-pressed={index === active} className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white p-1 transition-[border-color,opacity] sm:h-20 sm:w-20 ${index === active ? 'border-lime' : 'border-transparent opacity-70 hover:opacity-100'}`}>
              <CatalogImage src={image} alt="" sizes="80px" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ProductView({ product }: { product: CatalogProduct }) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [details, setDetails] = useState<ProductDetails | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading')
  const [attempt, setAttempt] = useState(0)
  const { add } = useCart()
  usePageTitle(product.name.slice(0, 60))

  useEffect(() => {
    let current = true
    setState('loading')
    loadProductDetails(product.id)
      .then(result => { if (current) { setDetails(result); setState('ready') } })
      .catch(() => { if (current) setState('failed') })
    return () => { current = false }
  }, [product.id, attempt])

  useEffect(() => {
    if (!added) return
    const timer = window.setTimeout(() => setAdded(false), 1800)
    return () => window.clearTimeout(timer)
  }, [added])

  const category = categoryById(product.category)
  const images = details?.images.length ? details.images : [product.cardImage]
  const related = catalogProducts
    .filter(item => item.category === product.category && item.id !== product.id)
    .sort((a, b) => Number(b.price !== null) - Number(a.price !== null))
    .slice(0, 4)
  const enquiry = waLink(`Hi ${shop.name}, I’m interested in ${product.name} (ref ${product.id}). Please confirm the price and availability.`)
  const addToCart = () => { add(product.id, qty); setAdded(true) }

  return (
    <>
      <PageHeader title={category?.name ?? 'Product'} crumbs={[{ label: 'Shop', to: '/shop' }, ...(category ? [{ label: category.name, to: `/shop/${category.id}` }] : [])]} />

      <section className="container-x grid grid-cols-1 gap-6 pt-5 md:pt-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:gap-10">
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          {state === 'loading' ? <div className="skeleton aspect-square rounded-2xl" role="status" aria-label="Loading photos" /> : <Gallery product={product} images={images} />}
        </div>

        <div className="min-w-0">
          {product.brand && <p className="eyebrow">{product.brand}</p>}
          <h2 className="mt-1 text-[1.5rem] leading-tight text-ink md:text-[2rem]">{product.name}</h2>
          {product.nameSi && <p className="mt-1 text-[15px] text-muted">{product.nameSi}</p>}

          <div className="surface mt-4 p-4">
            <p className={`price ${product.price === null ? 'text-2xl text-ink' : 'text-[2rem] leading-none text-accent'}`}>{priceText(product)}</p>
            <p className="mt-2 text-sm leading-snug text-body">
              {product.price === null
                ? 'Add it to your cart or ask us, and we’ll send you the price on WhatsApp.'
                : product.priceFrom
                  ? 'The price depends on the size or version. We confirm stock and the exact price on WhatsApp.'
                  : 'We confirm stock and the final price on WhatsApp before you pay.'}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <QtyStepper value={qty} onChange={value => setQty(Math.max(1, value))} />
              <button onClick={addToCart} className={`btn flex-1 whitespace-nowrap ${added ? 'bg-emerald-500 text-[#04210f]' : 'btn-lime'}`}>
                {added ? <><Check className="h-5 w-5" /> Added</> : <><ShoppingBag className="h-5 w-5" /> Add to cart</>}
              </button>
            </div>
            <a href={enquiry} target="_blank" rel="noreferrer" className="btn btn-wa mt-3 w-full"><MessageCircle className="h-5 w-5" /> Ask on WhatsApp</a>
          </div>

          <ul className="mt-4 divide-y divide-line rounded-2xl border border-line text-[15px] text-body">
            {product.warranty && <li className="flex items-center gap-3 p-3.5"><ShieldCheck className="h-5 w-5 shrink-0 text-accent" /> {product.warranty}</li>}
            <li className="flex items-center gap-3 p-3.5"><Truck className="h-5 w-5 shrink-0 text-accent" /> <span>Island-wide delivery, from {formatLKR(shop.delivery.rates.baseFee)} by weight. <Link to="/policies/delivery" className="text-accent underline">Details</Link></span></li>
            <li className="flex items-center gap-3 p-3.5"><Store className="h-5 w-5 shrink-0 text-accent" /> Free store pickup in {shop.city}</li>
          </ul>

          {state === 'failed' && (
            <div className="mt-5 rounded-2xl border border-line p-4">
              <p className="text-[15px] text-body">We couldn’t load the full details for this product.</p>
              <button onClick={() => setAttempt(value => value + 1)} className="btn btn-ghost mt-3"><RotateCw className="h-4 w-4" /> Try again</button>
            </div>
          )}
          {state === 'loading' && <div className="mt-6 space-y-2" aria-hidden="true"><div className="skeleton h-4 w-full" /><div className="skeleton h-4 w-5/6" /><div className="skeleton h-4 w-2/3" /></div>}

          {details && details.highlights.length > 0 && (
            <section className="mt-6">
              <h3 className="text-lg text-ink">Highlights</h3>
              <ul className="mt-2.5 space-y-2 text-[15px] leading-relaxed text-body">
                {details.highlights.slice(0, 8).map((highlight, index) => (
                  <li key={`${index}-${highlight}`} className="flex gap-2.5"><span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-[2px] bg-lime" />{highlight}</li>
                ))}
              </ul>
            </section>
          )}
          {details?.description && (
            <section className="mt-6">
              <h3 className="text-lg text-ink">Product details</h3>
              <p className="mt-2.5 whitespace-pre-line break-words text-[15px] leading-relaxed text-body">{details.description}</p>
            </section>
          )}
          {details?.warrantyPolicy && (
            <section className="mt-6 rounded-2xl border border-line p-4">
              <h3 className="text-base text-ink">Warranty details</h3>
              <p className="mt-1.5 whitespace-pre-line break-words text-sm leading-relaxed text-body">{details.warrantyPolicy}</p>
            </section>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x pt-12">
          <h2 className="mb-4 text-[1.5rem] text-ink md:text-3xl">More in {category?.name ?? 'the store'}</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {related.map(item => <CatalogCard key={item.id} product={item} />)}
          </div>
        </section>
      )}

      {/* Keeps Add to cart in reach on small screens, above the tab bar. */}
      <div className="fixed inset-x-0 bottom-[calc(var(--tabbar-h)+var(--safe-bottom))] z-20 border-t border-line bg-[rgba(17,17,65,0.97)] backdrop-blur-md lg:hidden on-dark">
        <div className="container-x flex items-center gap-3 py-2">
          <p className={`price min-w-0 flex-1 truncate ${product.price === null ? 'text-sm text-muted' : 'text-lg text-accent'}`}>{priceText(product)}</p>
          <button onClick={addToCart} className={`btn shrink-0 ${added ? 'bg-emerald-500 text-[#04210f]' : 'btn-lime'}`} style={{ minHeight: 44 }}>
            {added ? <><Check className="h-5 w-5" /> Added</> : <><ShoppingBag className="h-5 w-5" /> Add to cart</>}
          </button>
        </div>
      </div>
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </>
  )
}
