import { ArrowRight, BadgeCheck, CircleHelp, Headphones as Support, MapPin, ShieldCheck, Truck, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories, products } from '../data/products'
import { formatLKR, payWays, shop, waLink } from '../config/shop'
import ProductCard from '../components/ProductCard'
import ProductArt, { artIcons } from '../components/ProductArt'

const perks = [
  { icon: BadgeCheck, title: '100% genuine', text: 'Sealed, original products from trusted sources.' },
  { icon: ShieldCheck, title: 'Warranty on everything', text: 'Every unit recorded by serial number.' },
  { icon: Truck, title: 'Island-wide delivery', text: `From ${formatLKR(shop.delivery.rates.baseFee)} (by weight), or free store pickup in ${shop.city}.` },
  { icon: Wallet, title: 'Pay your way', text: `Pay by ${payWays()}.` },
]

export default function Home() {
  const hero = products.find(p => p.id === 'ps5-slim-disc')!
  const featured = products.filter(p => p.featured)
  const deals = products.filter(p => p.compareAt || p.condition === 'Pre-owned')
  const brandsShown = ['Sony PlayStation', 'Nintendo', 'Xbox', 'Meta', 'JBL', 'Logitech', 'HyperX', 'Anker', 'Xiaomi']

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="grid-bg absolute inset-0" />
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-lime/20 blur-3xl" />
        <div className="container-x relative grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
          <div className="fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-lime/40 bg-lime/10 px-3 py-1 text-xs font-semibold text-lime">
              <MapPin className="h-3.5 w-3.5" /> {shop.city}’s home of gaming
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] md:text-6xl">
              {shop.tagline.split(' ').slice(0, -1).join(' ')} <span className="text-lime">{shop.tagline.split(' ').slice(-1)}</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-white/75 md:text-lg">
              PlayStation, Nintendo and Xbox consoles, pro controllers, headsets and smart gadgets — genuine, under warranty and delivered island-wide.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn btn-lime px-6">Shop now <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/shop/consoles" className="btn border border-white/20 px-6 text-white hover:bg-white/10">Browse consoles</Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-center">
              {[['20+', 'Products'], ['1 yr', 'Warranty'], ['24/7', 'Online orders']].map(([a, b]) => (
                <div key={b} className="rounded-xl border border-white/10 bg-white/5 py-3">
                  <dt className="font-display text-xl font-bold text-lime">{a}</dt>
                  <dd className="text-xs text-white/60">{b}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative fade-up" style={{ animationDelay: '.1s' }}>
            <Link to={`/product/${hero.id}`} className="float block">
              <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/40">
                <ProductArt product={hero} size="lg" />
              </div>
              <div className="absolute -bottom-4 left-4 right-4 mx-auto max-w-sm rounded-2xl border border-white/10 bg-white p-4 text-navy shadow-2xl md:left-auto md:right-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Featured</p>
                <p className="font-semibold">{hero.name}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-xl font-bold">{formatLKR(hero.price)}</span>
                  {hero.compareAt && <span className="text-sm text-slate-400 line-through">{formatLKR(hero.compareAt)}</span>}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="container-x -mt-px py-10">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-slate-200/80 bg-white p-4 md:p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-lime"><Icon className="h-5 w-5" /></div>
              <h3 className="text-sm font-bold text-navy md:text-base">{title}</h3>
              <p className="mt-1 text-xs text-slate-500 md:text-sm">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-x py-8">
        <SectionTitle title="Shop by category" link="/shop" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c, i) => {
            const Icon = artIcons[c.icon]
            const n = products.filter(p => p.category === c.id).length
            return (
              <Link
                key={c.id}
                to={`/shop/${c.id}`}
                className={`group relative overflow-hidden rounded-2xl p-5 transition hover:-translate-y-1 ${i === 0 ? 'bg-lime text-navy' : 'bg-navy text-white'}`}
              >
                <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl ${i === 0 ? 'bg-white/50' : 'bg-lime/20'}`} />
                <Icon className="relative h-10 w-10 transition group-hover:scale-110" strokeWidth={1.5} />
                <h3 className="relative mt-6 font-bold">{c.name}</h3>
                <p className={`relative text-xs ${i === 0 ? 'text-navy/70' : 'text-white/60'}`}>{c.blurb}</p>
                <p className={`relative mt-3 text-xs font-semibold ${i === 0 ? 'text-navy' : 'text-lime'}`}>{n} products →</p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="container-x py-8">
        <SectionTitle title="Trending now" subtitle="The most-wanted gear this month" link="/shop" />
        <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {featured.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Promo banner */}
      <section className="container-x py-8">
        <div className="relative overflow-hidden rounded-3xl bg-navy p-8 text-white md:p-12">
          <div className="grid-bg absolute inset-0" />
          <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-lime/25 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-lime">Pre-owned, fully tested</span>
              <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Game more. Spend less.</h2>
              <p className="mt-3 max-w-lg text-white/70">
                Every pre-owned console is cleaned, tested and reset by our technicians — and still comes with a shop warranty.
              </p>
              <Link to="/shop?condition=Pre-owned" className="btn btn-lime mt-6">Shop pre-owned <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {deals.slice(0, 2).map(p => (
                <Link key={p.id} to={`/product/${p.id}`} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <div className="aspect-square"><ProductArt product={p} /></div>
                  <div className="p-3">
                    <p className="line-clamp-1 text-sm font-semibold">{p.name}</p>
                    <p className="text-sm font-bold text-lime">{formatLKR(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* More products */}
      <section className="container-x py-8">
        <SectionTitle title="Accessories & gadgets" subtitle="Complete your setup" link="/shop/accessories" />
        <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {products.filter(p => ['accessories', 'gadgets', 'audio'].includes(p.category) && !p.featured).slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Brands */}
      <section className="container-x py-8">
        <div className="rounded-3xl border border-slate-200/80 bg-white px-6 py-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Brands we carry</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {brandsShown.map(b => <span key={b} className="font-display text-lg font-bold text-slate-300 transition hover:text-navy">{b}</span>)}
          </div>
        </div>
      </section>

      {/* Visit / help */}
      <section className="container-x py-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-lime p-8 text-navy">
            <MapPin className="h-8 w-8" />
            <h3 className="mt-4 text-2xl font-extrabold">Visit our {shop.city} store</h3>
            <p className="mt-2 text-navy/75">Try before you buy, collect online orders for free, or bring your console for a warranty check.</p>
            <a href={shop.mapsUrl} target="_blank" rel="noreferrer" className="btn btn-navy mt-6">Get directions <ArrowRight className="h-4 w-4" /></a>
          </div>
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8">
            <Support className="h-8 w-8 text-navy" />
            <h3 className="mt-4 text-2xl font-extrabold text-navy">Not sure what to buy?</h3>
            <p className="mt-2 text-slate-600">Message us on WhatsApp — we’ll help you pick the right console, games setup or accessories for your budget.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={waLink(`Hi ${shop.name}, I need some help choosing a product.`)} target="_blank" rel="noreferrer" className="btn btn-wa">Chat on WhatsApp</a>
              <Link to="/faq" className="btn btn-ghost"><CircleHelp className="h-4 w-4" /> Read our FAQ</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function SectionTitle({ title, subtitle, link }: { title: string; subtitle?: string; link?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-extrabold text-navy md:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {link && <Link to={link} className="flex shrink-0 items-center gap-1 text-sm font-semibold text-navy hover:underline">View all <ArrowRight className="h-4 w-4" /></Link>}
    </div>
  )
}
