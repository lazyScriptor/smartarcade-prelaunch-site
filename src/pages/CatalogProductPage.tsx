import { Check, ChevronLeft, ChevronRight, Images, ShieldCheck, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import QtyStepper from '../components/QtyStepper'
import { useCart } from '../store/cart'
import CatalogCard from '../components/CatalogCard'
import CatalogImage from '../components/CatalogImage'
import PageHeader from '../components/PageHeader'
import { formatLKR, shop, waLink } from '../config/shop'
import { catalogCategories, catalogProductById, catalogProducts } from '../data/catalog'
import NotFound from './NotFound'

export default function CatalogProductPage() {
  const { id = '' } = useParams()
  const product = catalogProductById(id)
  const [activeIndex, setActiveIndex] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { add } = useCart()

  useEffect(() => {
    setActiveIndex(0)
    setQty(1)
    setAdded(false)
  }, [id])

  if (!product) return <NotFound />

  const images = product.images.length ? product.images : [product.cardImage]
  const active = Math.min(activeIndex, images.length - 1)
  const category = catalogCategories.find(item => item.id === product.category)
  const warranty = [product.warrantyPeriod, product.warrantyType].filter(Boolean).join(' · ')
  const related = catalogProducts.filter(item => item.category === product.category && item.id !== product.id).slice(0, 4)
  const inquiry = waLink(`Hi ${shop.name}, I’m interested in ${product.name} (product ${product.id}). Please confirm the current price and availability.`)

  const move = (direction: -1 | 1) => setActiveIndex((active + direction + images.length) % images.length)

  return (
    <>
      <PageHeader title="Product details" crumbs={[{ label: 'Product catalogue', to: '/shop' }, ...(category ? [{ label: category.name, to: `/shop/${category.id}` }] : [])]}>
        <p className="mt-3 text-sm text-white/60">Product reference: {product.id}</p>
      </PageHeader>

      <section className="container-x grid gap-8 py-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,.9fr)] lg:gap-12">
        <div className="min-w-0">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 shadow-sm">
            <CatalogImage src={images[active]} alt={`${product.name}, photo ${active + 1}`} eager className="h-full w-full object-contain p-5 sm:p-10" />
            {images.length > 1 && (
              <>
                <button className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 shadow-md transition hover:bg-white" onClick={() => move(-1)} aria-label="Previous photo">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 shadow-md transition hover:bg-white" onClick={() => move(1)} aria-label="Next photo">
                  <ChevronRight className="h-5 w-5" />
                </button>
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-navy/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {active + 1} / {images.length}
                </span>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-2" aria-label="Product photos">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show photo ${index + 1}`}
                  aria-pressed={index === active}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-white p-1 transition sm:h-24 sm:w-24 ${index === active ? 'border-navy shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'}`}
                >
                  <CatalogImage src={image} alt="" className="h-full w-full rounded-xl object-contain" />
                </button>
              ))}
            </div>
          )}
          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400"><Images className="h-3.5 w-3.5" /> {images.length} product photos</p>
        </div>

        <div className="lg:pt-2">
          <span className="rounded-full bg-lime/35 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-navy">{category?.name ?? 'Product'}</span>
          <h1 className="mt-4 text-2xl font-extrabold leading-tight text-navy md:text-3xl">{product.name}</h1>
          {product.nameSi && product.nameSi !== product.name && <p className="mt-2 text-lg text-slate-500">{product.nameSi}</p>}

          {warranty && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
              <ShieldCheck className="h-4 w-4" /> {warranty}
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-800">Price</p>
            <p className="mt-1 text-xl font-extrabold text-navy">{product.price === null ? 'Price to be confirmed' : `${product.priceFrom ? 'From ' : ''}${formatLKR(product.price)}`}</p>
            {product.priceFrom && <p className="mt-1 text-xs text-amber-900">Price depends on the size or version. We confirm the exact price on WhatsApp.</p>}
            <p className="mt-2">Stock availability is confirmed by Smart Arcade.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <QtyStepper value={qty} onChange={n => setQty(Math.max(1, n))} />
              <button className="btn btn-navy flex-1" onClick={() => { add(product.id, qty); setAdded(true) }}>
                {added ? <><Check className="h-4 w-4" /> Added to cart</> : <><ShoppingBag className="h-4 w-4" /> Add to cart</>}
              </button>
            </div>
            {added && <Link to="/cart" className="mt-3 block text-sm font-semibold text-navy underline">View cart and send your request</Link>}
            <a href={inquiry} target="_blank" rel="noreferrer" className="btn btn-wa mt-3 w-full">Ask about this product on WhatsApp</a>
          </div>

          {product.description && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-navy">Product details</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{product.description}</p>
            </section>
          )}

          {product.highlights.length > 0 && (
            <section className="mt-7">
              <h2 className="text-lg font-bold text-navy">Highlights</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
                {product.highlights.slice(0, 8).map((highlight, index) => <li key={`${index}-${highlight}`} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime-600" />{highlight}</li>)}
              </ul>
            </section>
          )}

          {product.warrantyPolicy && (
            <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-bold text-navy">Warranty details from catalogue</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">{product.warrantyPolicy}</p>
            </section>
          )}

          <Link to="/shop" className="btn btn-navy mt-8">Back to all products</Link>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x pb-12">
          <h2 className="mb-5 text-2xl font-extrabold text-navy">More in {category?.name ?? 'the catalogue'}</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            {related.map(item => <CatalogCard key={item.id} product={item} />)}
          </div>
        </section>
      )}
    </>
  )
}
