import { BadgeCheck, Check, ChevronRight, MessageCircle, ShieldCheck, ShoppingBag, Store, Truck, Zap } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { categories, productById, products, shippingWeightKg } from '../data/products'
import { cardGateway, formatLKR, payWays, shop, waLink } from '../config/shop'
import { feeForWeight, formatKg } from '../lib/totals'
import { useCart } from '../store/cart'
import ProductArt from '../components/ProductArt'
import ProductCard from '../components/ProductCard'
import QtyStepper from '../components/QtyStepper'
import StockBadge from '../components/StockBadge'
import NotFound from './NotFound'

export default function ProductPage() {
  const { id = '' } = useParams()
  const product = productById(id)
  if (!product) return <NotFound />
  return <ProductView key={product.id} id={product.id} />
}

function ProductView({ id }: { id: string }) {
  const product = productById(id)!
  const navigate = useNavigate()
  const { add } = useCart()
  const [variant, setVariant] = useState(product.variants?.[0]?.name)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<'overview' | 'specs' | 'delivery'>('overview')
  const cat = categories.find(c => c.id === product.category)!
  const off = product.compareAt ? product.compareAt - product.price : 0
  const related = (product.related ?? []).map(productById).filter(Boolean) as typeof products
  const more = related.length ? related : products.filter(p => p.category === product.category && p.id !== product.id)
  const out = product.stock === 'out'
  const cardCap = cardGateway.maxPerPayment
  const overCardCap = cardCap !== null && product.price > cardCap
  const weight = shippingWeightKg(product)
  const { baseKg, baseFee, perExtraKg } = shop.delivery.rates

  return (
    <>
      <div className="container-x py-5">
        <nav className="flex flex-wrap items-center gap-1 text-xs text-slate-500" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-navy">Home</Link><ChevronRight className="h-3 w-3" />
          <Link to={`/shop/${cat.id}`} className="hover:text-navy">{cat.name}</Link><ChevronRight className="h-3 w-3" />
          <span className="line-clamp-1 text-slate-700">{product.name}</span>
        </nav>
      </div>

      <section className="container-x grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="lg:sticky lg:top-40 lg:self-start">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-200/80">
            <ProductArt product={product} size="lg" />
            {product.condition === 'Pre-owned' && <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-navy">Pre-owned</span>}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={`aspect-square overflow-hidden rounded-xl border-2 ${i === 0 ? 'border-navy' : 'border-transparent opacity-60'}`}>
                <ProductArt product={product} size="sm" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">{product.brand}</p>
          <h1 className="mt-1 text-2xl font-extrabold leading-tight text-navy md:text-4xl">{product.name}</h1>
          <p className="mt-3 text-slate-600">{product.short}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <StockBadge stock={product.stock} />
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{product.condition}</span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700"><ShieldCheck className="h-3.5 w-3.5" /> {product.warranty}</span>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-display text-3xl font-extrabold text-navy">{formatLKR(product.price)}</span>
              {product.compareAt && <span className="text-lg text-slate-400 line-through">{formatLKR(product.compareAt)}</span>}
              {off > 0 && <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-sm font-bold text-rose-600">Save {formatLKR(off)}</span>}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {overCardCap
                ? `Pay by ${payWays({ card: false })}. Card payments are available for orders up to ${formatLKR(cardCap)}.`
                : `Pay by ${payWays()}.`}
            </p>

            {product.variants && (
              <div className="mt-5">
                <p className="mb-2 text-sm font-semibold text-slate-700">Colour: <span className="font-normal">{variant}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(v => (
                    <button
                      key={v.name}
                      onClick={() => setVariant(v.name)}
                      aria-label={v.name}
                      aria-pressed={variant === v.name}
                      className={`h-10 w-10 rounded-full border-2 p-0.5 transition ${variant === v.name ? 'border-navy' : 'border-slate-200 hover:border-slate-400'}`}
                    >
                      <span className="block h-full w-full rounded-full border border-black/10" style={{ background: v.swatch }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <QtyStepper value={qty} onChange={n => setQty(Math.max(1, n))} />
              <button disabled={out} onClick={() => add(product.id, variant, qty)} className="btn btn-navy flex-1">
                <ShoppingBag className="h-4 w-4" /> {out ? 'Out of stock' : 'Add to cart'}
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button disabled={out} onClick={() => { add(product.id, variant, qty); navigate('/checkout') }} className="btn btn-lime">
                <Zap className="h-4 w-4" /> Buy now
              </button>
              <a
                href={waLink(`Hi ${shop.name}, I'm interested in: ${product.name}${variant ? ` (${variant})` : ''} – ${formatLKR(product.price)}. Is it available?`)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-wa"
              >
                <MessageCircle className="h-4 w-4" /> {out ? 'Ask when it’s back' : 'Order on WhatsApp'}
              </a>
            </div>
          </div>

          <ul className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
            <li className="flex items-center gap-2 rounded-xl bg-white p-3 text-slate-600"><Truck className="h-5 w-5 shrink-0 text-navy" /> Island-wide delivery {formatLKR(feeForWeight(weight))}</li>
            <li className="flex items-center gap-2 rounded-xl bg-white p-3 text-slate-600"><Store className="h-5 w-5 shrink-0 text-navy" /> Free pickup in {shop.city}</li>
            <li className="flex items-center gap-2 rounded-xl bg-white p-3 text-slate-600"><BadgeCheck className="h-5 w-5 shrink-0 text-navy" /> 100% genuine</li>
          </ul>

          <div className="mt-8">
            <div className="flex gap-6 border-b border-slate-200" role="tablist">
              {(['overview', 'specs', 'delivery'] as const).map(t => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`-mb-px border-b-2 pb-3 text-sm font-semibold capitalize transition ${tab === t ? 'border-navy text-navy' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  {t === 'delivery' ? 'Delivery & returns' : t === 'specs' ? 'Specifications' : 'Overview'}
                </button>
              ))}
            </div>
            <div className="py-5 text-sm leading-relaxed text-slate-600">
              {tab === 'overview' && (
                <>
                  <p>{product.description}</p>
                  <ul className="mt-4 space-y-2">
                    {product.highlights.map(h => <li key={h} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {h}</li>)}
                  </ul>
                </>
              )}
              {tab === 'specs' && (
                <dl className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                  {[['Brand', product.brand], ['Condition', product.condition], ['Warranty', product.warranty], ...product.specs].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[140px_1fr] gap-3 px-4 py-3"><dt className="font-medium text-slate-500">{k}</dt><dd className="text-slate-800">{v}</dd></div>
                  ))}
                </dl>
              )}
              {tab === 'delivery' && (
                <ul className="space-y-2">
                  <li>• Island-wide delivery by {shop.delivery.courier} in {shop.delivery.days}: {formatLKR(feeForWeight(weight))} for this item ({formatKg(weight)}). Delivery is charged on the total order weight — {formatLKR(baseFee)} for up to {baseKg} kg, plus {formatLKR(perExtraKg)} for each extra kg or part of a kg.</li>
                  <li>• Free store pickup from our {shop.city} shop.</li>
                  <li>• We don’t accept change-of-mind returns or exchanges at the moment. If an item arrives damaged, faulty or not as ordered, tell us within {shop.returns.reportProblemHours} hours. Faults after that are covered by the product’s warranty.</li>
                  <li>• Read the full <Link to="/policies/delivery" className="font-semibold text-navy underline">Delivery</Link>, <Link to="/policies/refunds" className="font-semibold text-navy underline">Returns</Link> and <Link to="/policies/warranty" className="font-semibold text-navy underline">Warranty</Link> policies.</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="container-x mt-12">
          <h2 className="mb-5 text-2xl font-extrabold text-navy">{related.length ? 'Goes well with' : 'You may also like'}</h2>
          <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
            {more.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </>
  )
}
